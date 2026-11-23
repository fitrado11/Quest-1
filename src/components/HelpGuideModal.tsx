import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Lock, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  X, 
  UserCheck, 
  FileCheck, 
  Lightbulb,
  Compass,
  Gamepad2,
  GraduationCap
} from 'lucide-react';
import { audio } from '../utils/audio';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'quest' | 'safeguard' | 'rpg' | 'tips'>('quest');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-cyan-500/80 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 my-auto text-slate-100 relative">
        <button
          onClick={() => { audio.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          aria-label="Tutup Panduan"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-2xl font-black">
            🧭
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              PANDUAN SISWA KELAS V SD
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Bantuan & Panduan Tabayyun Quest
            </h2>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => { audio.playClick(); setActiveTab('quest'); }}
            className={`px-3 py-2 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'quest'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Alur Q.U.E.S.T.</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setActiveTab('safeguard'); }}
            className={`px-3 py-2 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safeguard'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safeguard & Log</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setActiveTab('rpg'); }}
            className={`px-3 py-2 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rpg'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Game RPG & Karakter</span>
          </button>

          <button
            onClick={() => { audio.playClick(); setActiveTab('tips'); }}
            className={`px-3 py-2 rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tips'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tombol & Audio</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs sm:text-sm text-slate-200">
          
          {/* TAB 1: ALUR Q.U.E.S.T. */}
          {activeTab === 'quest' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 text-cyan-300">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  Sintaks Resmi 5 Tahap Q.U.E.S.T.
                </h3>
                <p className="text-slate-300 leading-relaxed text-xs">
                  Model utamanya adalah <strong>Q.U.E.S.T.</strong>, didampingi oleh nilai <strong>Digital Adab</strong> (Niyyah, Wara', Tabayyun, Qoul, Muraqabah, Khidmah):
                </p>

                <div className="space-y-2 pt-1 font-medium text-slate-200">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-400">Q — QUERY (Niyyah, Qoul, Muraqabah):</strong>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Menentukan apa yang ingin diketahui, tujuan pencarian, dan membuat pertanyaan/prompt yang terarah.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-teal-400">U — UNCOVER (Wara', Muraqabah):</strong>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Mengenali klaim, kesalahan, kemungkinan halusinasi AI, fakta vs opini, dan informasi meragukan.
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-sky-400">E — EXAMINE (Tabayyun, Wara'):</strong>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Memeriksa bukti, sumber, penulis, tanggal, dan membandingkan informasi dengan sumber terpercaya (WHO – EVIDENCE – WHEN – WHY – ELSEWHERE).
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-400">S — SAFEGUARD (Wara', Qoul, Muraqabah):</strong>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Memastikan informasi aman dan bertanggung jawab: <strong>People</strong> (tidak merugikan orang), <strong>Data</strong> (menjaga privasi), dan <strong>Ideas</strong> (kejujuran sumber & AI).
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-amber-400">T — TRANSFORM (Khidmah, Qoul, Muraqabah):</strong>
                    <div className="text-slate-300 text-[11px] mt-0.5">
                      Mengolah informasi terverifikasi menjadi karya baru pemahaman sendiri dengan prinsip: <strong>READ → CLOSE → THINK → CREATE</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SAFEGUARD & LOG */}
          {activeTab === 'safeguard' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 text-purple-300">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  Safeguard: People – Data – Ideas
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900 border border-rose-900/40 space-y-1">
                    <div className="font-black text-rose-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>1. PEOPLE</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Apakah merugikan, mempermalukan, atau tidak menghargai orang lain? Jauhi cyberbullying.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-sky-900/40 space-y-1">
                    <div className="font-black text-sky-400 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span>2. DATA</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Apakah ada data pribadi sensitif? Jangan unggah alamat rumah, nomor HP, foto kartu pelajar, atau password.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-amber-900/40 space-y-1">
                    <div className="font-black text-amber-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>3. IDEAS</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Apakah sumber dicantumkan? Ungkapkan pemakaian AI dengan jujur dan jangan sekadar copy-paste.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h4 className="font-bold text-sky-300 text-xs flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Mnemonic Pemeriksaan Sumber (WHO - EVIDENCE - WHEN - WHY - ELSEWHERE):</span>
                  </h4>
                  <div className="text-[11px] text-slate-300 space-y-1 mt-1 pl-2">
                    <div>• <strong>WHO:</strong> Siapa yang membuat informasi ini? Apakah lembaga berwenang?</div>
                    <div>• <strong>EVIDENCE:</strong> Apa bukti atau data ilmiah yang mendukung klaim?</div>
                    <div>• <strong>WHEN:</strong> Kapan informasi dibuat atau diperbarui?</div>
                    <div>• <strong>WHY:</strong> Apa tujuan informasi ini? Edukasi, berita, atau iklan komersial?</div>
                    <div>• <strong>ELSEWHERE:</strong> Apakah sumber kredibel lain mengatakan hal yang sama?</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GAME RPG & SPRITES */}
          {activeTab === 'rpg' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 text-amber-300">
                  <Gamepad2 className="w-4 h-4 text-amber-400" />
                  Kontrol Game Platformer 2D
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-emerald-300">Gerak Kiri / Kanan:</strong>
                    <div className="text-slate-300 text-[11px]">Tombol ← / → atau A / D (atau D-pad di layar)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-teal-300">Lompat Sekali / Dua Kali:</strong>
                    <div className="text-slate-300 text-[11px]">Tombol ↑ atau SPASI / W (atau tombol lompat hijau)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-cyan-300">Tembak Berkas Peluru:</strong>
                    <div className="text-slate-300 text-[11px]">Tombol X / J / SPASI (atau tombol tembak biru)</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <strong className="text-purple-300">Buka Teka-Teki Monolit:</strong>
                    <div className="text-slate-300 text-[11px]">Berdiri dekat monolit lalu tekan tombol E atau ENTER</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h4 className="font-bold text-amber-300 text-xs mb-2">Aset Sprite Resmi Game:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                      <img src="/sprites/mc_right.png" alt="MC Right" className="h-10 object-contain" />
                      <span className="font-bold text-emerald-400 mt-1">Karakter Utama</span>
                      <span className="text-[10px] text-slate-400">MC Kanan & Kiri</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                      <div className="flex items-center gap-1 h-10">
                        <img src="/sprites/jump.png" alt="Jump" className="h-9 object-contain" />
                        <img src="/sprites/jump_twice.png" alt="Jump Twice" className="h-10 object-contain" />
                      </div>
                      <span className="font-bold text-teal-400 mt-1">Lompat & Double</span>
                      <span className="text-[10px] text-slate-400">Aksi Udara</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                      <div className="flex items-center gap-1 h-10">
                        <img src="/sprites/enemy_left.png" alt="Enemy" className="h-9 object-contain" />
                        <img src="/sprites/enemy_right.png" alt="Enemy" className="h-9 object-contain" />
                      </div>
                      <span className="font-bold text-rose-400 mt-1">Pasukan Glitch</span>
                      <span className="text-[10px] text-slate-400">Musuh Patroli</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
                      <img src="/sprites/final_boss.png" alt="Final Boss" className="h-10 object-contain" />
                      <span className="font-bold text-purple-400 mt-1">Final Boss</span>
                      <span className="text-[10px] text-slate-400">HP & Senjata Kuat</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TIPS & AUDIO */}
          {activeTab === 'tips' && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2 text-emerald-300">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  Panduan Tombol, Pilihan, & Audio
                </h3>
                <ul className="space-y-2 pl-4 list-disc text-slate-300 leading-relaxed text-xs">
                  <li>
                    <strong>Memilih Jawaban:</strong> Klik kartu pilihan A–D. Kartu pilihanmu akan memiliki garis bingkai terang dan centang. Di bawahnya akan muncul umpan balik (feedback) yang menerangkan mengapa pilihanmu benar atau perlu diperbaiki.
                  </li>
                  <li>
                    <strong>Tombol "Sumber Informasi" / "Lihat Rujukan":</strong> Kamu bisa melihat referensi asli lembaga negara seperti BPS, ANRI, Kemenkes, atau Kominfo tanpa membuka situs luar.
                  </li>
                  <li>
                    <strong>Tombol Audio / Musik:</strong> Tombol di kanan atas layar berlabel <em>Musik Aktif</em> atau <em>Mute</em> untuk mengatur suara agar belajarmu tetap fokus dan nyaman.
                  </li>
                  <li>
                    <strong>Sertifikat & Catatan:</strong> Setiap menuntaskan misi, kamu bisa melihat atau mengunduh sertifikat kelulusan berisi namamu dan catatan capaian QUEST.
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Model Pembelajaran Q.U.E.S.T.–Digital Adab
          </span>
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Mengerti & Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
