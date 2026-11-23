import React from 'react';
import { BookOpen, Gamepad2, GraduationCap, Shield, Sparkles, X } from 'lucide-react';
import { audio } from '../utils/audio';

interface HelpStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpStoryModal: React.FC<HelpStoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="font-extrabold text-base sm:text-lg text-white">
              Panduan QUEST Academy & Digital Adab
            </h2>
          </div>
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {/* Backstory */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Latar Cerita: Dunia Siber QUEST Academy
            </div>
            <p>
              Tahun 2026, kecerdasan buatan (AI) membantu kehidupan sehari-hari siswa. Namun, virus <strong>Data Glitch</strong> menyebabkan model AI sering mengalami halusinasi parah dan menyebarkan hoaks.
            </p>
            <p>
              Sebagai siswa Kelas 5 SD Lazuardi GCS Bogor, kamu terpilih menjadi <strong>Digital Guardian</strong>. Tugasmu adalah menguji keluaran AI dengan akal kritis dan nilai-nilai <strong>Digital Adab</strong> sebelum melumpuhkan monster glitch di arena aksi!
            </p>
          </div>

          {/* 5 QUEST Steps */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              Alur 5 Langkah QUEST
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-emerald-300">1. Query (Niat):</strong> Periksa tujuan dan niat awal sebelum memakai AI.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-teal-300">2. Uncover (Deteksi):</strong> Cari kejanggalan fakta / klaim palsu AI.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-sky-300">3. Examine (Sumber):</strong> Cek silang data ke lembaga resmi terpercaya.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <strong className="text-purple-300">4. Safeguard (Privasi):</strong> Jaga data diri dan patuhi adab digital.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 col-span-1 sm:col-span-2">
                <strong className="text-amber-300">5. Transform (Aksi):</strong> Ambil tindakan nyata meluruskan kebenaran.
              </div>
            </div>
          </div>

          {/* Game Controls Guide */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              Kontrol Permainan (Keyboard & Layar Sentuh)
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs text-slate-300">
              <div>• <strong>Arah Kiri / Kanan:</strong> Tombol Panah ← / → atau A / D (atau D-Pad layar sentuh).</div>
              <div>• <strong>Lompat / Lompat Ganda:</strong> Panah Atas ↑ atau SPASI / W (atau tombol lompat hijau).</div>
              <div>• <strong>Tembak Berkas Verifikasi:</strong> X / J / SPASI (atau tombol pedang biru).</div>
              <div>• <strong>Buka Teka-teki Monolit:</strong> Tombol E atau ENTER saat berdiri dekat monolit.</div>
            </div>
          </div>

          {/* Sprite Character Gallery */}
          <div className="space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Daftar Karakter & Entitas RPG 2D
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center gap-1.5">
                <img src="/sprites/mc_right.png" alt="Karakter Utama" className="h-12 object-contain" />
                <span className="font-bold text-emerald-300">Guardian Siswa</span>
                <span className="text-[10px] text-slate-400">MC Kanan & Kiri</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-2 h-12">
                  <img src="/sprites/jump.png" alt="Lompat" className="h-10 object-contain" />
                  <img src="/sprites/jump_twice.png" alt="Lompat 2x" className="h-12 object-contain" />
                </div>
                <span className="font-bold text-teal-300">Lompatan Adab</span>
                <span className="text-[10px] text-slate-400">Single & Double Jump</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-1.5 h-12">
                  <img src="/sprites/enemy_left.png" alt="Musuh Glitch" className="h-11 object-contain" />
                  <img src="/sprites/enemy_right.png" alt="Musuh Glitch" className="h-11 object-contain" />
                </div>
                <span className="font-bold text-rose-300">Drone & Bot Hoaks</span>
                <span className="text-[10px] text-slate-400">Patroli Kiri & Kanan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col items-center gap-1.5">
                <img src="/sprites/final_boss.png" alt="Final Boss" className="h-12 object-contain" />
                <span className="font-bold text-purple-300">Final Mega Boss</span>
                <span className="text-[10px] text-slate-400">Distorsi Konteks AI</span>
              </div>
            </div>
          </div>

          {/* S2 Thesis Note */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-200 text-xs flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Aplikasi ini dikembangkan untuk instrumen penelitian S2 Educational Design Research (EDR) tentang peningkatan literasi kritis AI dan Digital Adab pada anak sekolah dasar.
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Mengerti & Siap Bertualang
          </button>
        </div>
      </div>
    </div>
  );
};
