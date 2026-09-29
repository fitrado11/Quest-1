import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  HelpCircle, 
  Key, 
  Lock, 
  Play, 
  RotateCcw, 
  Settings, 
  Shield, 
  Sparkles, 
  Star, 
  Trophy, 
  Volume2, 
  VolumeX, 
  X, 
  Zap 
} from 'lucide-react';
import { LeaderboardEntry, MissionDefinition, PlayerStats } from '../types';
import { audio } from '../utils/audio';
import { getUnlockedPuzzleIds } from '../utils/storage';
import { UnlockPuzzleModal } from './UnlockPuzzleModal';

interface HubScreenProps {
  playerStats: PlayerStats;
  leaderboard: LeaderboardEntry[];
  missions: MissionDefinition[];
  unlockedMissionIds: string[];
  isMuted: boolean;
  gameSpeed: number;
  onToggleMute: () => void;
  onSelectMission: (mission: MissionDefinition) => void;
  onOpenLogsModal: () => void;
  onOpenAchievementsModal: () => void;
  onOpenHelpModal: () => void;
  onOpenStoryModal: () => void;
  onChangeGameSpeed: (speed: number) => void;
  onResetData: () => void;
}

type HubFlowStep = 'mentors' | 'missions';
type NpcKey = 'tabayyun' | 'wara' | 'qoul' | 'muraqabah' | 'sahabat';

interface NpcInfo {
  key: NpcKey;
  name: string;
  role: string;
  avatarBg: string;
  emoji: string;
  colorBorder: string;
  adabConcept: string;
  quotes: string[];
  takeaway: string;
}

const NPCS: NpcInfo[] = [
  {
    key: 'tabayyun',
    name: 'Mentor Tabayyun',
    role: 'Penuntun Berpikir Kritis & Niat (Niyyah)',
    avatarBg: 'from-emerald-500 to-teal-600',
    colorBorder: 'border-emerald-500/50',
    emoji: '🧭',
    adabConcept: 'Tabayyun & Niyyah (Klarifikasi Niat & Konteks)',
    quotes: [
      "Assalamu'alaikum Penjaga Digital! Langkah pertama sebelum percaya pada keluaran AI adalah bertanya: Apa niat dan tujuan pembuat informasi ini?",
      "AI sering kali memproduksi 'halusinasi data'—informasi yang terdengar sangat meyakinkan namun sepenuhnya fiktif. Selalu periksa fakta ke sumber resmi!",
      "Gunakan rumus Q.U.E.S.T: Kueri Niat (Q), Ungkap Galat (U), Evaluasi Sumber (E), Lindungi Privasi (S), dan Ubah Menjadi Aksi (T)!"
    ],
    takeaway: "Tabayyun mengajarkan kita untuk tidak tergesa-gesa membenarkan informasi tanpa bukti kredibel."
  },
  {
    key: 'wara',
    name: 'Guardian Wara\'',
    role: 'Penjaga Integritas & Kerahasiaan Data',
    avatarBg: 'from-sky-500 to-blue-600',
    colorBorder: 'border-sky-500/50',
    emoji: '🛡️',
    adabConcept: 'Wara\' (Kehati-hatian & Kejujuran Akademik)',
    quotes: [
      "Wara' bermakna menjauhi hal yang meragukan. Di era digital, jangan pernah memasukkan data pribadimu—seperti nama lengkap, NIK, atau alamat—ke dalam sistem AI publik!",
      "Kejujuran seorang muslim diuji saat mengerjakan tugas. Jadikan AI sebagai teman berdiskusi dan mencari ide, bukan untuk disalin secara plagiat tanpa belajar.",
      "Jaga kehormatan dirimu dan teman-temanmu dengan tidak menyebarkan foto atau rahasia pribadi siapa pun di internet."
    ],
    takeaway: "Wara' menjaga privasimu tetap aman dan memastikan karyamu murni hasil kerja kerasmu sendiri."
  },
  {
    key: 'qoul',
    name: 'Master Qoul',
    role: 'Penjaga Etika Komunikasi Digital',
    avatarBg: 'from-purple-500 to-indigo-600',
    colorBorder: 'border-purple-500/50',
    emoji: '📜',
    adabConcept: 'Qoul Sadida (Tutur Kata Benar & Santun)',
    quotes: [
      "Setiap kalimat yang kita ketik di internet akan dimintai pertanggungjawaban. Sebelum membagikan kabar di grup kelas, pastikan informasinya sudah pasti benar!",
      "Menyebarkan kabar burung atau disinformasi dapat memicu kepanikan dan perselisihan di antara teman.",
      "Jika menemukan informasi yang keliru, luruskan dengan santun dan bawakan data dari sumber rujukan terpercaya (seperti BPS atau lembaga berwenang)."
    ],
    takeaway: "Qoul Sadida membimbing kita berbicara berdasarkan kebenaran dengan tutur kata yang menyejukkan."
  },
  {
    key: 'muraqabah',
    name: 'Elder Muraqabah',
    role: 'Pengawas Kendali Diri & Akhlak Digital',
    avatarBg: 'from-amber-500 to-orange-600',
    colorBorder: 'border-amber-500/50',
    emoji: '⚖️',
    adabConcept: 'Muraqabah (Kesadaran Diri di Hadapan Allah)',
    quotes: [
      "Muraqabah adalah keyakinan teguh bahwa Allah SWT senantiasa melihat apa pun yang kita buka dan ketik di balik layar gawai, bahkan saat kita sendirian.",
      "Jari-jemarimu di atas keyboard adalah saksi akhlakmu. Kendalikan rasa ingin tahu agar tetap tertuju pada hal yang bermanfaat bagi masa depanmu.",
      "Khidmah: Jadikan teknologi kecerdasan buatan sebagai sarana menolong sesama, bukan untuk merendahkan atau mempermainkan orang lain."
    ],
    takeaway: "Muraqabah membentuk benteng kendali diri sehingga kita senantiasa berbuat adil dan bijak."
  },
  {
    key: 'sahabat',
    name: 'Zaki & Aisyah',
    role: 'Sahabat Guardian (Siswa Kelas 5 SD Lazuardi)',
    avatarBg: 'from-rose-500 to-pink-600',
    colorBorder: 'border-rose-500/50',
    emoji: '🎒',
    adabConcept: 'Ukhuwah & Semangat Kolaborasi Pelajar',
    quotes: [
      "Hai teman seperjuangan! Kami murid Kelas 5 di SD Lazuardi siap berpetualang bersamamu menaklukkan robot-robot AI yang terkena eror hoaks!",
      "Di setiap misi, kamu akan melewati Gerbang QUEST terlebih dahulu. Jawablah dengan teliti agar senjatamu mendapat banyak peluru dan damage kuat!",
      "Jangan khawatir jika salah—kamu selalu bisa mengulang kuis dari awal untuk memperkuat senjatamu. Ayo kita bersihkan dunia digital bersama!"
    ],
    takeaway: "Belajar literasi AI terasa menyenangkan jika dilakukan bersama sahabat dengan semangat tolong-menolong."
  }
];

export const HubScreen: React.FC<HubScreenProps> = ({
  playerStats,
  leaderboard,
  missions,
  unlockedMissionIds,
  isMuted,
  gameSpeed,
  onToggleMute,
  onSelectMission,
  onOpenLogsModal,
  onOpenAchievementsModal,
  onOpenHelpModal,
  onOpenStoryModal,
  onChangeGameSpeed,
  onResetData,
}) => {
  // Flow Step: MENTORS IS MANDATORY FIRST, THEN MISSIONS
  const [currentStep, setCurrentStep] = useState<HubFlowStep>('mentors');

  // Selected NPC mentor
  const [selectedNpcKey, setSelectedNpcKey] = useState<NpcKey>('tabayyun');
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  // Selected mission in Step 2
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [unlockedPuzzleIds, setUnlockedPuzzleIds] = useState<string[]>(() => getUnlockedPuzzleIds());
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);

  // Modals & Popups
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const activeMission = missions[selectedMissionIndex] || missions[0];
  const isMissionUnlocked = unlockedMissionIds.includes(activeMission.id);
  const activeNpc = NPCS.find(n => n.key === selectedNpcKey) || NPCS[0];

  const handleNextMission = () => {
    audio.playClick();
    setSelectedMissionIndex((prev) => (prev + 1) % missions.length);
  };

  const handlePrevMission = () => {
    audio.playClick();
    setSelectedMissionIndex((prev) => (prev - 1 + missions.length) % missions.length);
  };

  const handleNpcChange = (key: NpcKey) => {
    audio.playClick();
    setSelectedNpcKey(key);
    setDialogueIdx(0);
  };

  const handleNextQuote = () => {
    audio.playClick();
    setDialogueIdx((prev) => (prev + 1) % activeNpc.quotes.length);
  };

  const handleProceedToMissions = () => {
    audio.playClick();
    setCurrentStep('missions');
  };

  return (
    <div id="hub-main-screen" className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Sleek Minimalist Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Student Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center text-lg font-black text-cyan-300">
                Q
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cyrillic text-sm sm:text-base font-black tracking-wider text-white uppercase">
                  QUEST ACADEMY
                </h1>
                <span className="text-[10px] font-bold font-tech px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                  SD LAZUARDI GCS
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 font-medium">
                <span className="text-slate-300">{playerStats.name}</span>
                <span className="text-slate-700">•</span>
                <span className="text-amber-400 font-mono font-bold">{playerStats.total_xp} XP</span>
              </div>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { audio.playClick(); setIsLeaderboardOpen(true); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Buka Papan Juara Siswa"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline font-cyrillic text-[11px]">Papan Juara</span>
            </button>

            <button
              onClick={() => { audio.playClick(); onOpenAchievementsModal(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Lencana Prestasi Siswa"
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-cyrillic text-[11px]">Lencana</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono text-cyan-300">
                {playerStats.badges.length}
              </span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
              title={isMuted ? 'Nyalakan Musik & Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Settings dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
                title="Pengaturan Game"
              >
                <Settings className="w-4 h-4" />
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 p-3 shadow-2xl z-50 text-xs space-y-3">
                  <div className="font-cyrillic font-bold text-slate-200 border-b border-slate-800 pb-1.5 flex items-center justify-between">
                    <span>PENGATURAN</span>
                    <span className="text-[10px] font-mono text-slate-400">v2.4</span>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 mb-1 flex justify-between font-medium">
                      <span>Kecepatan Karakter:</span>
                      <strong className="text-cyan-400 font-mono">{gameSpeed}x</strong>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[0.8, 1.0, 1.3].map(speed => (
                        <button
                          key={speed}
                          onClick={() => { audio.playClick(); onChangeGameSpeed(speed); }}
                          className={`py-1 rounded-lg font-bold border transition font-mono ${
                            gameSpeed === speed
                              ? 'bg-cyan-600 text-white border-cyan-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1.5">
                    <button
                      onClick={() => { setShowSettings(false); onOpenLogsModal(); }}
                      className="w-full text-left py-1 text-teal-300 hover:text-teal-200 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Data Peneliti Thesis S2 (CSV/JSON)</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowSettings(false);
                        onResetData();
                      }}
                      className="w-full text-left py-1 text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                    >
                      Reset Data Sesi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
        {/* PROGRESSIVE STEP TRAIL (MANDATORY ORIENTATION FIRST -> THEN MISSIONS) */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => { audio.playClick(); setCurrentStep('mentors'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer border ${
              currentStep === 'mentors'
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="w-5 h-5 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-mono font-black text-[11px] border border-cyan-500/40">
              01
            </span>
            <span className="font-cyrillic text-[11px] tracking-wide">ARAHAN MENTOR & TEMAN</span>
            {currentStep === 'missions' && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-0.5" />}
          </button>

          <span className="text-slate-600 font-mono text-sm">➔</span>

          <button
            onClick={() => { audio.playClick(); setCurrentStep('missions'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer border ${
              currentStep === 'missions'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                : 'bg-slate-900/90 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <span className="w-5 h-5 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-black text-[11px]">
              02
            </span>
            <span className="font-cyrillic text-[11px] tracking-wide">MISI PETUALANGAN</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: ARAHAN MENTOR & SAHABAT GUARDIAN (WAJIB TAMPIL PERTAMA) */}
        {/* ======================================================== */}
        {currentStep === 'mentors' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Clean Section Header */}
            <div className="text-center space-y-1.5 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                LANGKAH 01 • ORIENTASI ADAB DIGITAL
              </span>
              <h2 className="font-cyrillic text-2xl sm:text-3xl font-black text-white tracking-tight">
                PENGARAHAN MENTOR & SAHABAT
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                Pahami arahan etika digital adab dari para pembimbing sebelum memulai misi verifikasi AI.
              </p>
            </div>

            {/* Character Selector Pills (Clean, uncluttered, Cyrillic style) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-w-3xl mx-auto">
              {NPCS.map(npc => {
                const isSelected = selectedNpcKey === npc.key;
                return (
                  <button
                    key={npc.key}
                    onClick={() => handleNpcChange(npc.key)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? `bg-slate-900 border-2 ${npc.colorBorder} shadow-lg ring-1 ring-cyan-400/30 text-white`
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <span className="text-2xl">{npc.emoji}</span>
                    <span className="font-cyrillic text-[11px] font-black tracking-tight leading-tight">
                      {npc.name.replace(/^(Mentor |Guardian |Master |Elder )/, '')}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {npc.adabConcept.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Character Spotlight Guidance Card (Sophisticated & Spacious) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-3xl mx-auto relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${activeNpc.avatarBg} flex items-center justify-center text-4xl sm:text-5xl shadow-xl shrink-0 border border-white/20`}>
                  {activeNpc.emoji}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-mono uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                      {activeNpc.adabConcept}
                    </span>
                  </div>

                  <h3 className="font-cyrillic text-xl sm:text-2xl font-black text-white">
                    {activeNpc.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {activeNpc.role}
                  </p>
                </div>
              </div>

              {/* Big Speech Quote Area (Clean, spacious, zero crowding) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800/90 shadow-inner relative">
                <span className="text-3xl text-cyan-400/30 font-serif absolute top-2 left-3">“</span>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium pl-4 sm:pl-5">
                  {activeNpc.quotes[dialogueIdx]}
                </p>
              </div>

              {/* Takeaway Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-start gap-2.5 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-white font-cyrillic">Inti Hikmah: </strong>
                  {activeNpc.takeaway}
                </span>
              </div>

              {/* Quote Pagination & Next Tip */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500 font-mono text-[11px]">
                  Nasihat {dialogueIdx + 1} dari {activeNpc.quotes.length}
                </span>

                <button
                  onClick={handleNextQuote}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
                >
                  <span>Nasihat Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MANDATORY PROCEED CTA BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleProceedToMissions}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-cyrillic font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-950/60 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-cyan-400/40"
                >
                  <span>SAYA TELAH MEMAHAMI ARAHAN • LANJUT KE MISI PETUALANGAN</span>
                  <ChevronRight className="w-5 h-5 text-cyan-200" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: PILIH MISI PETUALANGAN (TERBUKA SETELAH MENTOR) */}
        {/* ======================================================== */}
        {currentStep === 'missions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Clean Section Header with Back-to-Mentor link */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-3xl mx-auto">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  LANGKAH 02 • MISI PETUALANGAN AKTIF
                </span>
                <h2 className="font-cyrillic text-2xl sm:text-3xl font-black text-white tracking-tight">
                  PILIH TAHAP MISI
                </h2>
              </div>

              <button
                onClick={() => { audio.playClick(); setCurrentStep('mentors'); }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 self-start sm:self-center transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Baca Ulang Arahan Mentor</span>
              </button>
            </div>

            {/* Level Stepper Buttons (Clean 5-box track) */}
            <div className="grid grid-cols-5 gap-2 max-w-3xl mx-auto">
              {missions.map((m, idx) => {
                const isUnlocked = unlockedMissionIds.includes(m.id);
                const isSelected = selectedMissionIndex === idx;
                const isDone = (playerStats.best_scores[m.id] || 0) > 0;
                const hasPuzzleUnlocked = unlockedPuzzleIds.includes(m.id);

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      audio.playClick();
                      setSelectedMissionIndex(idx);
                    }}
                    className={`py-3 px-2 rounded-2xl border text-center transition flex flex-col items-center justify-between gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/80 border-2 border-emerald-400 ring-1 ring-emerald-400/40 text-emerald-100 shadow-lg'
                        : isUnlocked
                        ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full px-1">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isUnlocked ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <span className="font-cyrillic text-xs font-black truncate w-full text-center">
                      Lv.{idx + 1}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 truncate w-full text-center">
                      {hasPuzzleUnlocked ? 'Kunci ✓' : 'Kunci 🔑'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FOCUSED MISSION SPOTLIGHT CARD (Minimalist, Sophisticated, High-Breathing Room) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-0.5 shadow-xl flex items-center justify-center shrink-0 border border-emerald-400/30">
                    <span className="text-3xl sm:text-4xl">
                      {['🦁', '⌛', '📰', '🎭', '💎'][selectedMissionIndex] || '🤖'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                        TAHAP {selectedMissionIndex + 1}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-teal-300 border border-slate-700">
                        {activeMission.bloomLevel}
                      </span>
                      <div className="flex items-center gap-0.5 text-amber-400 ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < activeMission.difficulty ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h3 className="font-cyrillic text-xl sm:text-2xl font-black text-white">
                      {activeMission.title}
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold font-mono">
                      {activeMission.subtitle}
                    </p>
                  </div>
                </div>

                {/* Best score pill */}
                <div className="bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-center shrink-0 self-start sm:self-auto">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Skor Terbaik</div>
                  <div className="text-base sm:text-lg font-black font-mono text-emerald-400">
                    {playerStats.best_scores[activeMission.id] 
                      ? `${playerStats.best_scores[activeMission.id]}%` 
                      : 'Belum Ada'}
                  </div>
                </div>
              </div>

              {/* Educational Objective description */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Tujuan Pembelajaran:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {activeMission.learningObjective}
                </p>
              </div>

              {/* Unlock Puzzle Gateway / Concept Key Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    unlockedPuzzleIds.includes(activeMission.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                  }`}>
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      Pilar Konsep Adab: {activeMission.unlockPuzzle.islamicConcept}
                    </div>
                    <div className="text-xs sm:text-sm font-black font-cyrillic text-white">
                      {activeMission.unlockPuzzle.conceptName}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audio.playClick();
                    setIsUnlockModalOpen(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold font-cyrillic border transition flex items-center gap-1.5 self-start sm:self-center cursor-pointer ${
                    unlockedPuzzleIds.includes(activeMission.id)
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                      : 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-950/50'
                  }`}
                >
                  <span>{unlockedPuzzleIds.includes(activeMission.id) ? 'Uji Ulang Konsep ✓' : 'Buka Kunci Konsep 🔑'}</span>
                </button>
              </div>

              {/* Primary Action Button: Enter QUEST Gate */}
              <div className="pt-2">
                {isMissionUnlocked ? (
                  <button
                    onClick={() => {
                      audio.playClick();
                      onSelectMission(activeMission);
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-cyrillic font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/70 transition transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer border border-emerald-400/40"
                  >
                    <Play className="w-5 h-5 fill-white" />
                    <span>MASUK KE GERBANG QUEST SEKARANG ➔</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center space-y-1">
                    <div className="text-amber-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 font-cyrillic">
                      <Lock className="w-4 h-4" />
                      <span>TAHAP INI MASIH TERKUNCI</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Selesaikan misi sebelumnya terlebih dahulu untuk membuka level ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Quick prev / next mission navigators */}
              <div className="flex items-center justify-between pt-2 text-xs font-mono font-bold text-slate-400 border-t border-slate-800/80">
                <button
                  onClick={handlePrevMission}
                  className="hover:text-white flex items-center gap-1 p-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Level Sebelumnya</span>
                </button>
                <span>Tahap {selectedMissionIndex + 1} / {missions.length}</span>
                <button
                  onClick={handleNextMission}
                  className="hover:text-white flex items-center gap-1 p-1 cursor-pointer"
                >
                  <span>Level Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* LEADERBOARD MODAL (Clean Popup, no main screen clutter) */}
      {isLeaderboardOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-cyrillic text-base sm:text-lg font-black text-white">
                  PAPAN JUARA SISWA
                </h3>
              </div>
              <button
                onClick={() => setIsLeaderboardOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Podium */}
            <div className="grid grid-cols-3 gap-2 text-center items-end pt-1">
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                <div className="text-2xl">🥈</div>
                <div className="font-bold text-xs text-slate-300 truncate">
                  {leaderboard[1]?.name || 'Siti Fatimah'}
                </div>
                <div className="text-xs font-mono font-black text-amber-400">
                  {leaderboard[1]?.xp || 3050} XP
                </div>
              </div>

              <div className="bg-gradient-to-b from-amber-950/60 to-slate-950 border border-amber-500/60 p-3.5 rounded-2xl space-y-1 -mt-2 shadow-lg">
                <div className="text-3xl">🥇</div>
                <div className="font-black text-xs text-amber-200 truncate">
                  {leaderboard[0]?.name || 'Ali Muhammad'}
                </div>
                <div className="text-xs font-mono font-black text-emerald-400">
                  {leaderboard[0]?.xp || 3200} XP
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl space-y-1">
                <div className="text-2xl">🥉</div>
                <div className="font-bold text-xs text-slate-300 truncate">
                  {leaderboard[2]?.name || 'You (Player)'}
                </div>
                <div className="text-xs font-mono font-black text-amber-400">
                  {leaderboard[2]?.xp || 2500} XP
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    entry.is_player
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-center font-mono font-bold text-slate-500">
                      #{idx + 1}
                    </span>
                    <span className="font-semibold">{entry.name}</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">{entry.xp} XP</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsLeaderboardOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold font-cyrillic transition cursor-pointer"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}

      {/* UNLOCK PUZZLE MODAL */}
      <UnlockPuzzleModal
        mission={activeMission}
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        onUnlockSuccess={(missionId) => {
          setUnlockedPuzzleIds(prev => prev.includes(missionId) ? prev : [...prev, missionId]);
        }}
      />
    </div>
  );
};
