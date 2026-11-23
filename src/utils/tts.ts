export interface TtsState {
  loadingId: string | null;
  playingId: string | null;
  errorMsg: string | null;
}

type TtsListener = (state: TtsState) => void;

class ChildVoiceNarrator {
  private audioCache = new Map<string, string>();
  private currentAudio: HTMLAudioElement | null = null;
  private activeAbortController: AbortController | null = null;
  private listeners = new Set<TtsListener>();
  private state: TtsState = {
    loadingId: null,
    playingId: null,
    errorMsg: null,
  };

  public subscribe(listener: TtsListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setState(partial: Partial<TtsState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((listener) => listener(this.state));
  }

  public getState(): TtsState {
    return this.state;
  }

  public stop() {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      this.activeAbortController = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.setState({ loadingId: null, playingId: null });
  }

  public clearError() {
    if (this.state.errorMsg) {
      this.setState({ errorMsg: null });
    }
  }

  private base64WavToObjectUrl(base64: string, mimeType: string): string {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
    return URL.createObjectURL(blob);
  }

  public async toggleSpeak(
    id: string,
    text: string,
    speakerHint: "aisyah" | "zaki" = "aisyah"
  ): Promise<void> {
    // If the same item is currently playing or loading, stop it
    if (this.state.playingId === id || this.state.loadingId === id) {
      this.stop();
      return;
    }

    this.stop();
    this.setState({ loadingId: id, playingId: null, errorMsg: null });

    const cacheKey = `${speakerHint}::${text}`;
    let objectUrl = this.audioCache.get(cacheKey);

    if (!objectUrl) {
      const controller = new AbortController();
      this.activeAbortController = controller;

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, speakerHint }),
          signal: controller.signal,
        });

        const data = (await res.json().catch(() => ({}))) as {
          audioBase64?: string;
          mimeType?: string;
          error?: string;
        };

        if (!res.ok || !data.audioBase64) {
          throw new Error(
            data.error || "Suara penjelasan gagal dimuat. Coba klik lagi ya."
          );
        }

        objectUrl = this.base64WavToObjectUrl(
          data.audioBase64,
          data.mimeType || "audio/wav"
        );
        this.audioCache.set(cacheKey, objectUrl);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        const msg =
          err instanceof Error
            ? err.message
            : "Tidak dapat memutar suara penjelasan saat ini.";
        this.setState({ loadingId: null, playingId: null, errorMsg: msg });
        return;
      } finally {
        if (this.activeAbortController === controller) {
          this.activeAbortController = null;
        }
      }
    }

    // Play the audio clip
    const audioEl = new Audio(objectUrl);
    this.currentAudio = audioEl;

    audioEl.onended = () => {
      if (this.currentAudio === audioEl) {
        this.currentAudio = null;
      }
      this.setState({ loadingId: null, playingId: null });
    };

    audioEl.onerror = () => {
      if (this.currentAudio === audioEl) {
        this.currentAudio = null;
      }
      this.setState({
        loadingId: null,
        playingId: null,
        errorMsg: "Gagal memutar file suara di browser.",
      });
    };

    try {
      this.setState({ loadingId: null, playingId: id, errorMsg: null });
      await audioEl.play();
    } catch {
      this.setState({
        loadingId: null,
        playingId: null,
        errorMsg: "Browser memblokir pemutaran otomatis. Silakan klik ulang teksnya.",
      });
    }
  }
}

export const childNarrator = new ChildVoiceNarrator();
