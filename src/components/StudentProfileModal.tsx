import React, { useState } from 'react';
import { Award, CheckCircle2, School, Sparkles, User, X } from 'lucide-react';
import { PlayerStats } from '../types';
import { audio } from '../utils/audio';
import { savePlayerStats } from '../utils/storage';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose?: () => void;
  playerStats: PlayerStats;
  onSaveProfile: (updated: PlayerStats) => void;
  isInitialRegistration?: boolean;
}

const CLASS_OPTIONS = [
  'Kelas 5 Al-Kindi',
  'Kelas 5 Al-Biruni',
  'Kelas 5 Ibnu Sina',
  'Kelas 5 Al-Khawarizmi',
  'Kelas 5 Ar-Razi',
  'Lainnya (Ketik Manual)',
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  playerStats,
  onSaveProfile,
  isInitialRegistration = false,
}) => {
  const [name, setName] = useState<string>(() => {
    return playerStats.name && !playerStats.name.startsWith('Digital Guardian #')
      ? playerStats.name
      : '';
  });

  const [selectedClassOption, setSelectedClassOption] = useState<string>(() => {
    const existing = playerStats.grade || '';
    if (CLASS_OPTIONS.includes(existing)) return existing;
    return existing ? 'Lainnya (Ketik Manual)' : 'Kelas 5 Al-Kindi';
  });

  const [customClass, setCustomClass] = useState<string>(() => {
    const existing = playerStats.grade || '';
    return CLASS_OPTIONS.includes(existing) ? '' : existing;
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    const finalClass = selectedClassOption === 'Lainnya (Ketik Manual)' 
      ? customClass.trim() 
      : selectedClassOption;

    if (!finalName) {
      setErrorMsg('Nama lengkap siswa wajib diisi!');
      return;
    }
    if (!finalClass) {
      setErrorMsg('Kelas siswa wajib diisi atau dipilih!');
      return;
    }

    audio.playPowerUp();
    const updated: PlayerStats = {
      ...playerStats,
      name: finalName,
      grade: finalClass,
      school: 'SD Lazuardi GCS',
    };

    savePlayerStats(updated);
    localStorage.setItem('quest_student_registered', 'true');
    onSaveProfile(updated);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <img
        src="/assets/aistudio/Gemini_Generated_Image_vwvfldvwvfldvwvf_5d4ca8c9.jpg"
        alt="Latar Arena Tabayyun Quest"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/50 to-slate-950/80 backdrop-blur-[2px] pointer-events-none"
      />
      <div className="relative z-10 bg-slate-900/92 backdrop-blur-md border-2 border-cyan-500/80 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-auto text-slate-100">
        
        {/* Optional Close button if not initial mandatory registration */}
        {!isInitialRegistration && onClose && (
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 mx-auto shadow-lg shadow-cyan-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center text-2xl font-black text-cyan-300">
              <User className="w-7 h-7 text-cyan-400" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 inline-block">
              IDENTITAS BELAJAR SISWA KELAS V
            </span>
            <h2 className="font-cyrillic text-2xl sm:text-3xl font-black text-white">
              {isInitialRegistration ? 'Selamat Datang, Penjaga Digital!' : 'Ubah Profil Siswa'}
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto leading-relaxed">
              Nama ini akan dicetak pada <strong>Sertifikat Kelulusan Resmi</strong> setiap kali kamu menuntaskan misi.
            </p>
          </div>
        </div>

        {/* Privacy Reassurance Note (Privacy by Design) */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 flex items-start gap-2.5 text-xs text-cyan-200">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="text-cyan-300">Privasi Kamu Dijamin Aman:</strong>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Kamu boleh menggunakan <strong>nama panggilan</strong> atau <strong>kode siswa</strong> (contoh: <em>Rayyan</em> atau <em>Guardian-5A</em>). Tabayyun Quest tidak pernah meminta nomor telepon, alamat rumah, kata sandi, maupun foto pribadi.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Input Nama Lengkap / Panggilan */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nama Panggilan / Nama Lengkap Siswa:</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-normal">Boleh Nama Panggilan</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); setErrorMsg(null); }}
              placeholder="Contoh: Muhammad Rayyan atau Rayyan-5B"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-sm outline-none transition font-medium"
              autoFocus={isInitialRegistration}
            />
          </div>

          {/* Pilihan Kelas */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kelas Siswa:</span>
            </label>
            <select
              value={selectedClassOption}
              onChange={(e) => { setSelectedClassOption(e.target.value); setErrorMsg(null); }}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white text-sm outline-none transition font-medium cursor-pointer"
            >
              {CLASS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900 text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Input Manual jika memilih Lainnya */}
          {selectedClassOption === 'Lainnya (Ketik Manual)' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-xs font-semibold text-slate-400">
                Ketik Nama Kelas:
              </label>
              <input
                type="text"
                required
                value={customClass}
                onChange={(e) => { setCustomClass(e.target.value); setErrorMsg(null); }}
                placeholder="Contoh: Kelas 5 Al-Farabi"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 text-white text-sm outline-none transition font-medium"
              />
            </div>
          )}

          {/* School Badge Note */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Sekolah: <strong>SD Lazuardi Global Compassionate School</strong></span>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-cyrillic font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/70 border-2 border-cyan-400/50 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-200" />
            <span>{isInitialRegistration ? 'SIMPAN & MASUK KE MARKAS QUEST' : 'SIMPAN PERUBAHAN IDENTITAS'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
