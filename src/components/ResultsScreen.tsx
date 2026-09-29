import React from 'react';
import { 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Heart, 
  Home, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  Swords, 
  Trophy, 
  Zap 
} from 'lucide-react';
import { CombatData, DigitalAdabScores, MissionDefinition, QUESTScores, WeaponLoadout, XPEarned } from '../types';
import { audio } from '../utils/audio';

interface ResultsScreenProps {
  mission: MissionDefinition;
  questScores: QUESTScores;
  weaponLoadout: WeaponLoadout;
  combatData: CombatData;
  xpEarned: XPEarned;
  digitalAdab: DigitalAdabScores;
  puzzlesSolvedCount: number;
  leaderboardRank: number;
  isNewBest: boolean;
  onNextMission?: () => void;
  onReplayMission: () => void;
  onReturnToHub: () => void;
  onViewThesisLogs: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  mission,
  questScores,
  weaponLoadout,
  combatData,
  xpEarned,
  digitalAdab,
  puzzlesSolvedCount,
  leaderboardRank,
  isNewBest,
  onNextMission,
  onReplayMission,
  onReturnToHub,
  onViewThesisLogs,
}) => {
  return (
    <div id="post-mission-results-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none py-8 px-4">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Banner Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            MISI BERHASIL DISELESAIKAN!
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Laporan Kemenangan Penjaga Digital
          </h1>
          <p className="text-sm text-slate-400">
            {mission.title}: {mission.subtitle} • Data Glitch AI Berhasil Dinonaktifkan
          </p>
        </div>

        {/* Highlight Stats 4-Card Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 font-medium">Total XP Diperoleh</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              +{xpEarned.total} <span className="text-xs text-slate-400 font-normal">XP</span>
            </div>
            <div className="text-[11px] text-emerald-300/80 mt-1">QUEST + Pertarungan</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 font-medium">Waktu Misi</div>
            <div className="text-2xl sm:text-3xl font-black text-teal-300 flex items-center justify-center gap-1">
              <Clock className="w-5 h-5 text-teal-400" />
              <span>{combatData.mission_time_seconds}s</span>
            </div>
            <div className="text-[11px] text-teal-300/80 mt-1">Aksi Cepat</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 font-medium">Teka-teki Selesai</div>
            <div className="text-2xl sm:text-3xl font-black text-sky-400">
              {puzzlesSolvedCount} <span className="text-xs text-slate-400 font-normal">/ 3</span>
            </div>
            <div className="text-[11px] text-sky-300/80 mt-1">Verifikasi Penuh</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 font-medium">Peringkat Sekolah</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              #{leaderboardRank}
            </div>
            <div className="text-[11px] text-amber-300/80 mt-1">
              {isNewBest ? '⭐ Rekor Terbaik!' : 'Top Penjaga'}
            </div>
          </div>
        </div>

        {/* ROW: Digital Adab Pillars Scores */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Skor Penilaian Digital Adab
              </h3>
            </div>
            <span className="text-xs text-slate-400">Prinsip Etika Islam dalam AI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Wara' */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-sky-300 flex items-center gap-1.5">
                  🛡️ Wara' (Integritas)
                </span>
                <span className="text-lg font-black text-sky-400">{digitalAdab.wara} / 100</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kehati-hatian menguji kebenaran klaim dan menjaga kerahasiaan data pribadi dari AI.
              </p>
            </div>

            {/* Qoul */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
                  📜 Qoul (Komunikasi)
                </span>
                <span className="text-lg font-black text-indigo-400">{digitalAdab.qoul} / 100</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tabayyun dan tidak menyebarkan berita keliru ke teman secara sembrono.
              </p>
            </div>

            {/* Muraqabah */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  ⚖️ Muraqabah (Regulasi Diri)
                </span>
                <span className="text-lg font-black text-amber-400">{digitalAdab.muraqabah} / 100</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kesadaran diri bertindak demi kemaslahatan bersama dan mengendalikan respon digital.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Accordion Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
            Rincian Poin & Metrik Thesis EDR
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Quest Gate Points */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-200">Gerbang Keputusan QUEST (Skor: {questScores.total}/120)</div>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between"><span>• Query (Niat):</span> <strong className="text-slate-200">{questScores.query} / 25</strong></div>
                <div className="flex justify-between"><span>• Uncover (Deteksi):</span> <strong className="text-slate-200">{questScores.uncover} / 25</strong></div>
                <div className="flex justify-between"><span>• Examine (Otoritas Sumber):</span> <strong className="text-slate-200">{questScores.examine} / 30</strong></div>
                <div className="flex justify-between"><span>• Safeguard (Privasi):</span> <strong className="text-slate-200">{questScores.safeguard} / 20</strong></div>
                <div className="flex justify-between"><span>• Transform (Aksi Nyata):</span> <strong className="text-slate-200">{questScores.transform} / 20</strong></div>
              </div>
            </div>

            {/* Combat Telemetry */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="font-bold text-slate-200">Telemetri Aksi Lapangan</div>
              <div className="space-y-1 text-slate-400">
                <div className="flex justify-between"><span>• Senjata Digunakan:</span> <strong className="text-teal-300">{weaponLoadout.name}</strong></div>
                <div className="flex justify-between"><span>• HP Akhir Pemain:</span> <strong className="text-emerald-400">{combatData.player_health_final} HP</strong></div>
                <div className="flex justify-between"><span>• Tembakan Berhasil Kena:</span> <strong className="text-slate-200">{combatData.hits_landed}</strong></div>
                <div className="flex justify-between"><span>• Proyektil Terhindar:</span> <strong className="text-slate-200">{combatData.projectiles_dodged}</strong></div>
                <div className="flex justify-between"><span>• Akurasi Pertarungan:</span> <strong className="text-slate-200">{combatData.accuracy_percent}%</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => { audio.playClick(); onViewThesisLogs(); }}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold inline-flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Lihat Log Data Mentah Siswa (Penelitian S2)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => { audio.playClick(); onReturnToHub(); }}
              className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <Home className="w-4 h-4" />
              <span>Kembali ke Hub</span>
            </button>

            <button
              onClick={() => { audio.playClick(); onReplayMission(); }}
              className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Ulang</span>
            </button>
          </div>

          {onNextMission && (
            <button
              onClick={() => { audio.playClick(); onNextMission(); }}
              className="w-full sm:w-auto py-3 px-7 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition"
            >
              <span>Lanjut ke Misi Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
