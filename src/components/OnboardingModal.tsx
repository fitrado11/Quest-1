import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Compass, 
  Search, 
  FileCheck2, 
  Lock, 
  Share2, 
  X 
} from 'lucide-react';
import { audio } from '../utils/audio';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(0);

  if (!isOpen) return null;

  const slides = [
    {
      badge: 'SELAMAT DATANG',
      title: 'Selamat datang di Tabayyun Quest!',
      desc: 'Hai teman kelas V! Aplikasi ini adalah multimedia pendukung pembelajaran model Q.U.E.S.T.–Digital Adab. Bersama kita belajar cerdas dan berakhlak mulia di era kecerdasan buatan (AI).',
      icon: '🧭',
      accent: 'from-emerald-500 to-teal-600',
    },
    {
      badge: 'TUJUAN BELAJAR',
      title: 'Lebih dari Sekadar Mencari Jawaban',
      desc: 'Di sini kamu tidak hanya mencari jawaban instan dari AI. Kamu akan belajar menguji apakah informasi itu benar, aman, dan dapat dipercaya sebelum kamu gunakan atau bagikan.',
      icon: '💡',
      accent: 'from-sky-500 to-blue-600',
    },
    {
      badge: 'ALUR PETUALANGAN',
      title: 'Alur Petualangan 5 Langkah Q.U.E.S.T.',
      desc: 'Kamu akan berlatih 5 tahap resmi: \n1. Q — Query (Menentukan tujuan & pertanyaan jelas)\n2. U — Uncover (Menemukan klaim ragu & halusinasi AI)\n3. E — Examine (Memeriksa bukti & sumber resmi)\n4. S — Safeguard (Menjaga orang, data, & ide)\n5. T — Transform (Membuat karya baru pemahaman sendiri).',
      icon: '⚡',
      accent: 'from-purple-500 to-indigo-600',
    },
    {
      badge: 'SIAP MEMULAI',
      title: 'Zaki dan Aisyah Siap Membantu!',
      desc: 'Zaki & Aisyah serta para mentor siap memberikan contoh (I DO), petunjuk (WE DO), hingga kamu mahir menuntaskannya secara mandiri. Siap menjadi Penjaga Digital?',
      icon: '🎒',
      accent: 'from-amber-500 to-rose-500',
    },
  ];

  const current = slides[step];

  const handleNext = () => {
    audio.playClick();
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('quest_onboarding_seen', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    audio.playClick();
    localStorage.setItem('quest_onboarding_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
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
      <div className="bg-slate-900/92 backdrop-blur-md border-2 border-emerald-500/70 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-slate-100 relative z-10 overflow-hidden animate-in fade-in duration-200">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 cursor-pointer"
        >
          Lewati
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${current.accent} flex items-center justify-center text-3xl shadow-lg border border-white/20 shrink-0`}>
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/50 font-bold">
                {current.badge} • {step + 1} / {slides.length}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {current.title}
              </h2>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed font-medium whitespace-pre-line">
            {current.desc}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    step === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            >
              <span>{step === slides.length - 1 ? 'Mulai Quest Sekarang ➔' : 'Lanjut ➔'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
