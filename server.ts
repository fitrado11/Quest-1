import "dotenv/config";
import express from "express";
import type { Request, Response } from "express";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const TTS_MODEL = "gemini-3.8-flash-tts";
const CACHE_DIR = path.join(os.tmpdir(), "tabayyun-quest-tts-cache");
const memoryAudioCache = new Map<string, string>();
const MAX_MEMORY_CACHE = 120;

try {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
} catch {
  // Ignore temp directory creation error; memory cache still works
}

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY belum diatur pada server.");
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: "v1beta",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function normalizeIndonesianSpeechText(rawText: string): string {
  return rawText
    .replace(/Q\.U\.E\.S\.T\./g, "QUEST")
    .replace(/\bQS\.\s*/g, "Qur'an Surah ")
    .replace(/\bHR\.\s*/g, "Hadis Riwayat ")
    .replace(/\bNo\.\s*/g, "Nomor ")
    .replace(/\bSWT\b/g, "Subhanahu wa ta'ala")
    .replace(/\bNIK\b/g, "N I K")
    .replace(/\bBPS\b/g, "B P S")
    .replace(/[•|]/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function selectPrebuiltVoice(speakerHint?: string): string {
  if (speakerHint === "zaki") {
    return "Puck";
  }
  return "Zephyr";
}

function buildChildVoiceStyle(speakerHint?: string): string {
  if (speakerHint === "zaki") {
    return (
      "10-year-old Indonesian elementary school boy (anak laki-laki Indonesia kelas 5 SD), " +
      "cheerful, enthusiastic, bright youthful child voice, warm and very clear natural Bahasa Indonesia."
    );
  }
  return (
    "10-year-old Indonesian elementary school child (anak Indonesia kelas 5 SD), " +
    "warm, cheerful, friendly youthful child voice, gentle educational tone and very clear natural Bahasa Indonesia."
  );
}

async function generateChildIndonesianSpeech(
  text: string,
  speakerHint?: string
): Promise<string> {
  const normalizedText = normalizeIndonesianSpeechText(text);
  const voiceName = selectPrebuiltVoice(speakerHint);
  const stylePrompt = buildChildVoiceStyle(speakerHint);
  const cacheKey = crypto
    .createHash("sha256")
    .update(`${TTS_MODEL}::${voiceName}::${stylePrompt}::${normalizedText}`)
    .digest("hex");

  const memHit = memoryAudioCache.get(cacheKey);
  if (memHit) {
    return memHit;
  }

  const diskPath = path.join(CACHE_DIR, `${cacheKey}.b64`);
  try {
    if (fs.existsSync(diskPath)) {
      const cached = fs.readFileSync(diskPath, "utf8");
      if (cached) {
        memoryAudioCache.set(cacheKey, cached);
        return cached;
      }
    }
  } catch {
    // Continue to API generation if disk cache read fails
  }

  const ai = getGeminiClient();
  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const interaction = await ai.interactions.create({
        model: TTS_MODEL,
        input: [
          {
            type: "text",
            text: normalizedText,
            annotations: [
              {
                type: "speech_metadata",
                style: stylePrompt,
              },
            ],
          },
        ],
        response_format: { type: "audio" },
        generation_config: {
          speech_config: [
            {
              language: "id-ID",
              voice: voiceName,
            },
          ],
        },
      });

      const base64Audio = interaction.output_audio?.data;

      if (!base64Audio) {
        throw new Error("Model TTS tidak mengembalikan data audio.");
      }

      if (memoryAudioCache.size >= MAX_MEMORY_CACHE) {
        const oldestKey = memoryAudioCache.keys().next().value;
        if (oldestKey) {
          memoryAudioCache.delete(oldestKey);
        }
      }
      memoryAudioCache.set(cacheKey, base64Audio);

      try {
        fs.writeFileSync(diskPath, base64Audio, "utf8");
      } catch {
        // Ignore disk cache write errors
      }

      return base64Audio;
    } catch (err) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      const isRetryable =
        errMsg.includes("429") ||
        errMsg.includes("503") ||
        errMsg.includes("500") ||
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        errMsg.includes("UNAVAILABLE");

      if (!isRetryable || attempt === maxAttempts) {
        break;
      }
      const delayMs = 600 * attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gagal menghasilkan suara penjelasan.");
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post("/api/tts", async (req: Request, res: Response) => {
    try {
      const body = req.body as { text?: unknown; speakerHint?: unknown } | undefined;
      const rawText = typeof body?.text === "string" ? body.text.trim() : "";
      const speakerHint =
        typeof body?.speakerHint === "string" ? body.speakerHint : undefined;

      if (!rawText) {
        res.status(400).json({ error: "Teks penjelasan tidak boleh kosong." });
        return;
      }

      if (rawText.length > 2000) {
        res.status(400).json({ error: "Teks penjelasan terlalu panjang." });
        return;
      }

      const audioBase64 = await generateChildIndonesianSpeech(rawText, speakerHint);
      res.json({
        audioBase64,
        mimeType: "audio/wav",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memproses suara penjelasan.";
      console.error("[/api/tts] Error:", message);
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
