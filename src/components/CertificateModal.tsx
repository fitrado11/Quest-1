import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, ShieldCheck, Sparkles, X } from 'lucide-react';
import { CombatData, MissionDefinition, QUESTScores, XPEarned } from '../types';
import { audio } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentGrade: string;
  mission: MissionDefinition;
  combatData?: CombatData;
  questScores?: QUESTScores;
  xpEarned?: XPEarned;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentGrade,
  mission,
  combatData,
  questScores,
  xpEarned,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const displayName = studentName?.trim() || 'Digital Guardian Siswa';
  const displayGrade = studentGrade?.trim() || 'Kelas 5';
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Calculate Honors Predicate
  const totalScore = questScores?.total || 100;
  const accuracy = combatData?.accuracy_percent || 90;
  let honorsPredicate = 'Sangat Memuaskan (Cum Laude)';
  if (totalScore >= 110 && accuracy >= 85) {
    honorsPredicate = 'Pujian Tertinggi (Summa Cum Laude)';
  } else if (totalScore >= 95) {
    honorsPredicate = 'Sangat Baik (Magna Cum Laude)';
  }

  // Generate and Download Canvas PNG
  const handleDownloadCertificate = () => {
    audio.playClick();
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Parchment
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle paper pattern
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#060913');
    gradient.addColorStop(0.5, '#0b1329');
    gradient.addColorStop(1, '#050811');
    ctx.fillStyle = gradient;
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 2. Ornamental Borders (Gold & Emerald)
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    ctx.strokeStyle = 'rgba(234, 179, 8, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(65, 65, canvas.width - 130, canvas.height - 130);

    // Corner Ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 40);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(15, 15, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    drawCorner(80, 80, 0);
    drawCorner(canvas.width - 80, 80, Math.PI / 2);
    drawCorner(canvas.width - 80, canvas.height - 80, Math.PI);
    drawCorner(80, canvas.height - 80, (Math.PI * 3) / 2);

    // 3. Institution Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('SD LAZUARDI GLOBAL COMPASSIONATE SCHOOL', canvas.width / 2, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('PROGRAM PENDIDIKAN DIGITAL ADAB & LITERASI KECERDASAN BUATAN', canvas.width / 2, 160);

    // Horizontal divider
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 185);
    ctx.lineTo(canvas.width / 2 + 250, 185);
    ctx.stroke();

    // 4. Certificate Main Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 46px sans-serif';
    ctx.fillText('SERTIFIKAT KELULUSAN MISI', canvas.width / 2, 250);

    ctx.fillStyle = '#fde047';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Certificate of Mission Completion & Digital Verification Mastery', canvas.width / 2, 290);

    // 5. Awarded to Statement
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px sans-serif';
    ctx.fillText('Dengan bangga dianugerahkan kepada siswa berprestasi:', canvas.width / 2, 350);

    // Student Name (Highlight)
    ctx.fillStyle = '#38bdf8';
    ctx.font = '900 56px sans-serif';
    ctx.fillText(displayName.toUpperCase(), canvas.width / 2, 430);

    // Class Name
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`Kelas: ${displayGrade}`, canvas.width / 2, 480);

    // 6. Mission Achievement Details
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '500 22px sans-serif';
    ctx.fillText('Telah berhasil menuntaskan seluruh tantangan dan verifikasi logika pada tahap:', canvas.width / 2, 540);

    ctx.fillStyle = '#10b981';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(`“${mission.title} - ${mission.subtitle}”`, canvas.width / 2, 595);

    // Competency Badges summary box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
    ctx.lineWidth = 2;
    const boxX = canvas.width / 2 - 450;
    const boxY = 640;
    const boxW = 900;
    const boxH = 95;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Predikat: ${honorsPredicate}`, canvas.width / 2, 680);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 17px sans-serif';
    ctx.fillText(`Skor Evaluasi QUEST: ${totalScore}/120  •  Akurasi Pertarungan AI: ${accuracy}%  •  XP: +${xpEarned?.total || 180} Poin`, canvas.width / 2, 712);

    // 7. Date & Location
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px sans-serif';
    ctx.fillText(`Diterbitkan di Kampus SD Lazuardi GCS pada tanggal ${currentDate}`, canvas.width / 2, 785);

    // 8. Seal and Signatures
    // Left Signature
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 950);
    ctx.lineTo(470, 950);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Tim Guru Literasi Digital', 360, 980);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('SD Lazuardi GCS', 360, 1005);

    // Center Gold Seal Stamp
    const sealX = canvas.width / 2;
    const sealY = 940;
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 52, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#713f12';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#422006';
    ctx.font = '900 12px sans-serif';
    ctx.fillText('LAZUARDI GCS', sealX, sealY - 14);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('★ ★ ★', sealX, sealY + 6);
    ctx.font = '900 11px sans-serif';
    ctx.fillText('VERIFIED 2026', sealX, sealY + 24);

    // Right Signature
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 470, 950);
    ctx.lineTo(canvas.width - 250, 950);
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Koordinator Kurikulum AI', canvas.width - 360, 980);
    ctx.fillStyle = '#64748b';
    ctx.font = '14px sans-serif';
    ctx.fillText('QUEST Academy Research', canvas.width - 360, 1005);

    // Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    const safeName = displayName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeMission = mission.title.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Sertifikat_${safeName}_${safeMission}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handlePrint = () => {
    audio.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl p-5 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 my-auto text-slate-100 relative">
        
        {/* Close Button */}
        <button
          onClick={() => { audio.playClick(); onClose(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-0.5 shadow-xl flex items-center justify-center text-slate-950 font-black">
            <Award className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                SERTIFIKAT KELULUSAN RESMI
              </span>
              <span className="text-xs text-slate-400 font-mono">SD Lazuardi GCS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-cyrillic">
              Sertifikat Kompetensi Digital Adab
            </h2>
          </div>
        </div>

        {/* Visual Certificate Card Preview (Interactive) */}
        <div className="bg-gradient-to-br from-[#070b16] via-[#0d162d] to-[#080d1a] border-4 border-amber-500/70 rounded-2xl p-6 sm:p-8 relative shadow-2xl text-center space-y-4 overflow-hidden print:border-black print:text-black">
          {/* Subtle Corner Rings */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400" />

          {/* School Identity */}
          <div className="space-y-1">
            <p className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-black">
              SD LAZUARDI GLOBAL COMPASSIONATE SCHOOL
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              QUEST Academy • Literasi Kecerdasan Buatan & Nilai Etika Digital
            </p>
          </div>

          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent my-1" />

          {/* Main Title */}
          <div className="space-y-0.5">
            <h3 className="font-cyrillic text-2xl sm:text-3xl font-black text-white tracking-wide uppercase">
              SERTIFIKAT PENGHARGAAN
            </h3>
            <p className="text-xs text-amber-300 italic font-serif">
              Certificate of Excellence & Digital Ethics Mastery
            </p>
          </div>

          {/* Student Recipient Info */}
          <div className="py-2 space-y-1">
            <span className="text-xs text-slate-400">Diberikan kepada:</span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-300 font-cyrillic uppercase tracking-wider">
              {displayName}
            </div>
            <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300 font-bold">
              {displayGrade} • Siswa Berprestasi
            </div>
          </div>

          {/* Mission Details */}
          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
            Telah berhasil menyelesaikan seluruh evaluasi berpikir kritis, verifikasi kebenaran sumber, dan aksi lapangan pada materi:
          </p>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/40 text-emerald-300 font-black text-sm sm:text-base font-cyrillic">
            ★ {mission.title}: {mission.subtitle} ★
          </div>

          {/* Metrics & Predicate */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Akurasi Verifikasi</span>
              <strong className="text-cyan-300">{accuracy}%</strong>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Skor QUEST</span>
              <strong className="text-emerald-300">{totalScore} / 120</strong>
            </div>
            <div className="col-span-2 sm:col-span-1 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Predikat</span>
              <strong className="text-amber-300 truncate block">{honorsPredicate.split(' ')[0]}</strong>
            </div>
          </div>

          {/* Date and Signatures */}
          <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
            <div className="text-left">
              <p className="font-semibold text-slate-300">Tim Pengajar Literasi</p>
              <p className="text-[10px]">SD Lazuardi GCS</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 font-bold text-[9px] text-center shadow-lg">
              SEAL GCS
            </div>

            <div className="text-right">
              <p className="font-semibold text-slate-300">Bogor, {currentDate}</p>
              <p className="text-[10px]">QUEST Academy</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sertifikat resmi siap disimpan sebagai bukti portofolio belajar siswa.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-300" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleDownloadCertificate}
              className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Sertifikat (PNG)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
