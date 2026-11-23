import React, { useEffect, useState } from 'react';
import { 
  Award, 
  BookOpen,
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  HelpCircle, 
  Key, 
  Lightbulb,
  Loader2,
  Lock, 
  Play, 
  RotateCcw, 
  Settings, 
  Shield, 
  Sparkles, 
  Square,
  Star, 
  Trophy, 
  Volume2, 
  VolumeX, 
  X, 
  Zap 
} from 'lucide-react';
import { LeaderboardEntry, MissionDefinition, PlayerStats } from '../types';
import { audio } from '../utils/audio';
import { childNarrator, TtsState } from '../utils/tts';
import { getUnlockedPuzzleIds } from '../utils/storage';
import { UnlockPuzzleModal } from './UnlockPuzzleModal';
import { CertificateModal } from './CertificateModal';

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
  onOpenProfileModal?: () => void;
}

type HubFlowStep = 'mentors' | 'missions';
type NpcKey = 'tabayyun' | 'wara' | 'qoul' | 'muraqabah' | 'sahabat';

interface NpcQuote {
  title: string;
  body: string;
}

interface HikmahItem {
  valueName: string;
  motto: string;
  meaning: string;
  dalil: string;
}

interface NpcInfo {
  key: NpcKey;
  name: string;
  role: string;
  avatarBg: string;
  emoji: string;
  colorBorder: string;
  adabConcept: string;
  quotes: NpcQuote[];
  hikmahItems: HikmahItem[];
}

const NPCS: NpcInfo[] = [
  {
    key: 'tabayyun',
    name: 'Mentor Tabayyun',
    role: 'Penuntun Berpikir Kritis & Niat (Niyyah)',
    avatarBg: 'from-emerald-500 to-teal-600',
    colorBorder: 'border-emerald-500/50',
    emoji: '🧭',
    adabConcept: 'Niyyah & Tabayyun (Tujuan Jelas & Periksa Kebenaran)',
    quotes: [
      {
        title: 'Tanya Niat & Tujuan (Query)',
        body: "Assalamu'alaikum Penjaga Digital! Langkah pertama sebelum percaya pada keluaran AI adalah bertanya: Apa niat dan tujuan pembuat informasi ini?",
      },
      {
        title: 'Waspada Halusinasi Data AI',
        body: "AI sering kali memproduksi 'halusinasi data'—informasi yang terdengar sangat meyakinkan namun sepenuhnya fiktif. Selalu periksa fakta ke sumber resmi!",
      },
      {
        title: 'Gunakan 5 Langkah Q.U.E.S.T.',
        body: "Gunakan rumus resmi Q.U.E.S.T.: Query (tujuan & pertanyaan jelas), Uncover (temukan klaim ragu), Examine (cek bukti), Safeguard (jaga orang, data, & ide), dan Transform (buat karya sendiri)!",
      },
    ],
    hikmahItems: [
      {
        valueName: 'Niyyah',
        motto: 'Niyyah — saya tahu tujuan saya.',
        meaning: 'Niyyah dimaknai sebagai kesadaran terhadap tujuan sebelum melakukan suatu tindakan. Dalam konteks penggunaan AI, siswa diarahkan untuk tidak menggunakan teknologi secara spontan tanpa tujuan, tetapi terlebih dahulu menentukan apa yang ingin dicari, dipelajari, atau dihasilkan. Dalil ini menjadi dasar bahwa setiap tindakan perlu diawali dengan tujuan yang jelas dan bertanggung jawab.',
        dalil: 'Hadis: “Sesungguhnya amal itu tergantung pada niatnya” (HR. Bukhari No. 1 dan Muslim No. 1907).'
      },
      {
        valueName: 'Tabayyun',
        motto: 'Tabayyun — saya memeriksa kebenarannya.',
        meaning: 'Tabayyun adalah proses memeriksa dan memastikan kebenaran suatu informasi sebelum menerima, menggunakan, atau menyebarkannya. Dalam konteks AI, tabayyun diwujudkan melalui pemeriksaan sumber, bukti, penulis atau lembaga, tanggal informasi, serta perbandingan dengan sumber lain. Dengan demikian, tabayyun menjadi dasar proses verifikasi informasi dalam penggunaan AI.',
        dalil: 'QS. Al-Hujurat ayat 6 — Memerintahkan orang beriman untuk memeriksa dengan teliti berita yang diterima agar tidak menimbulkan kerugian karena bertindak berdasarkan informasi yang keliru.'
      }
    ]
  },
  {
    key: 'wara',
    name: "Guardian Wara'",
    role: 'Penjaga Integritas & Kerahasiaan Data',
    avatarBg: 'from-sky-500 to-blue-600',
    colorBorder: 'border-sky-500/50',
    emoji: '🛡️',
    adabConcept: "Wara’ (Berhati-hati terhadap Informasi Meragukan)",
    quotes: [
      {
        title: 'Lindungi Data Pribadi',
        body: "Wara' bermakna menjauhi hal yang meragukan. Di era digital, jangan pernah memasukkan data pribadimu—seperti nama lengkap, NIK, atau alamat—ke dalam sistem AI publik!",
      },
      {
        title: 'Jujur Saat Berkarya',
        body: "Kejujuran seorang muslim diuji saat mengerjakan tugas. Jadikan AI sebagai teman berdiskusi dan mencari ide, bukan untuk disalin secara plagiat tanpa belajar.",
      },
      {
        title: 'Jaga Kehormatan Sesama',
        body: "Jaga kehormatan dirimu dan teman-temanmu dengan tidak menyebarkan foto atau rahasia pribadi siapa pun di internet.",
      },
    ],
    hikmahItems: [
      {
        valueName: 'Wara’',
        motto: 'Wara’ — saya berhati-hati terhadap informasi yang meragukan.',
        meaning: 'Wara’ dimaknai sebagai sikap berhati-hati terhadap sesuatu yang belum jelas kebenaran atau keamanannya. Dalam penggunaan AI, siswa dibiasakan untuk tidak langsung menerima informasi hanya karena jawabannya tampak meyakinkan. Siswa perlu berhenti ketika menemukan klaim yang meragukan, sumber yang tidak jelas, atau informasi yang berpotensi salah. Wara’ dengan demikian menjadi sikap awal agar siswa tidak impulsif dalam menerima dan menggunakan informasi digital.',
        dalil: 'Hadis: “Tinggalkanlah apa yang meragukanmu kepada apa yang tidak meragukanmu” (HR. Tirmidzi No. 2518).'
      }
    ]
  },
  {
    key: 'qoul',
    name: 'Master Qoul',
    role: 'Penjaga Etika Komunikasi Digital',
    avatarBg: 'from-purple-500 to-indigo-600',
    colorBorder: 'border-purple-500/50',
    emoji: '📜',
    adabConcept: 'Qoul (Komunikasi Benar & Menghargai Orang Lain)',
    quotes: [
      {
        title: 'Cek Sebelum Membagikan',
        body: "Setiap kalimat yang kita ketik di internet akan dimintai pertanggungjawaban. Sebelum membagikan kabar di grup kelas, pastikan informasinya sudah pasti benar!",
      },
      {
        title: 'Cegah Kepanikan & Disinformasi',
        body: "Menyebarkan kabar burung atau disinformasi dapat memicu kepanikan dan perselisihan di antara teman.",
      },
      {
        title: 'Luruskan dengan Santun & Bukti',
        body: "Jika menemukan informasi yang keliru, luruskan dengan santun dan bawakan data dari sumber rujukan terpercaya (seperti BPS atau lembaga berwenang).",
      },
    ],
    hikmahItems: [
      {
        valueName: 'Qoul',
        motto: 'Qoul — saya berkomunikasi dengan benar dan menghargai orang lain.',
        meaning: 'Qoul dalam konteks Digital Adab berkaitan dengan penggunaan bahasa yang benar, santun, bertanggung jawab, dan menghargai martabat orang lain. Dalam penggunaan AI dan media digital, siswa diarahkan untuk tidak membuat atau menyebarkan konten yang merendahkan, mempermalukan, menyesatkan, atau menyakiti pihak lain.',
        dalil: 'QS. Al-Ahzab ayat 70: “Bertakwalah kepada Allah dan ucapkanlah perkataan yang benar.” Prinsip qawlan sadidan tersebut menegaskan pentingnya kebenaran dan tanggung jawab dalam komunikasi digital.'
      }
    ]
  },
  {
    key: 'muraqabah',
    name: 'Elder Muraqabah',
    role: 'Pengawas Kendali Diri & Akhlak Digital',
    avatarBg: 'from-amber-500 to-orange-600',
    colorBorder: 'border-amber-500/50',
    emoji: '⚖️',
    adabConcept: 'Muraqabah & Muhasabah (Pengawasan & Evaluasi Diri)',
    quotes: [
      {
        title: 'Sadar Diawasi Allah SWT',
        body: "Muraqabah adalah keyakinan teguh bahwa Allah SWT senantiasa melihat apa pun yang kita buka dan ketik di balik layar gawai, bahkan saat kita sendirian.",
      },
      {
        title: 'Kendalikan Jari & Rasa Ingin Tahu',
        body: "Jari-jemarimu di atas keyboard adalah saksi akhlakmu. Kendalikan rasa ingin tahu agar tetap tertuju pada hal yang bermanfaat bagi masa depanmu.",
      },
      {
        title: 'Muhasabah & Gunakan AI untuk Kebaikan',
        body: "Selalu evaluasi kembali karya dan tindakan kita (Muhasabah), dan jadikan teknologi AI sebagai sarana menolong sesama, bukan untuk mencontek atau merugikan orang lain.",
      },
    ],
    hikmahItems: [
      {
        valueName: 'Muraqabah',
        motto: 'Muraqabah — saya mengawasi diri saya selama menggunakan teknologi.',
        meaning: 'Muraqabah dimaknai sebagai kesadaran bahwa setiap tindakan berada dalam pengawasan Allah sehingga seseorang tetap menjaga kejujuran, adab, dan tanggung jawab meskipun tidak dilihat oleh guru atau orang tua. Dalam penggunaan AI, muraqabah melatih siswa untuk tetap jujur, tidak menyalahgunakan AI untuk mencontek, dan berhati-hati di ruang digital.',
        dalil: 'HR. Muslim No. 8 (tentang Ihsan: beribadah dan berbuat baik seakan-akan melihat Allah karena Dia selalu melihatmu) dan QS. An-Nisa ayat 1: “Sesungguhnya Allah selalu menjaga dan mengawasimu.”'
      },
      {
        valueName: 'Muhasabah',
        motto: 'Muhasabah — saya mengevaluasi kembali apa yang sudah saya lakukan.',
        meaning: 'Muhasabah adalah kesediaan untuk memeriksa, menilai, dan mengevaluasi kembali pikiran, sikap, serta hasil tindakan yang telah dilakukan. Dalam pembelajaran AI, siswa diajak meninjau ulang hasil pencarian, mengecek apakah pemahaman dan karya yang dibuat sudah jujur, akurat, mencantumkan sumber, dan bebas dari kesalahan.',
        dalil: 'QS. Al-Hashr ayat 18 — Memerintahkan orang beriman untuk bertakwa dan memperhatikan apa yang telah diperbuatnya untuk hari esok.'
      }
    ]
  },
  {
    key: 'sahabat',
    name: 'Zaki & Aisyah',
    role: 'Sahabat Guardian (Siswa Kelas 5 SD Lazuardi)',
    avatarBg: 'from-rose-500 to-pink-600',
    colorBorder: 'border-rose-500/50',
    emoji: '🎒',
    adabConcept: 'Riyadhah & Khidmah (Berlatih Konsisten & Karya Bermanfaat)',
    quotes: [
      {
        title: 'Berlatih 5 Langkah Resmi Q.U.E.S.T.',
        body: "Hai teman-teman! Kami Zaki & Aisyah, sahabat belajar kelas V SD Lazuardi. Bersama kita akan berlatih 5 langkah resmi Q.U.E.S.T.: Query, Uncover, Examine, Safeguard, dan Transform!",
      },
      {
        title: 'Riyadhah & Semangat Khidmah',
        body: "Dengan terus berlatih menggunakan AI secara benar (Riyadhah), kita membangun kebiasaan baik agar ilmu dan teknologi membawa manfaat nyata bagi sesama (Khidmah).",
      },
      {
        title: 'Siap Menjadi Penjaga Digital!',
        body: "Jika ada petunjuk yang terlewat, klik tombol 'Bantuan' di kanan atas kapan saja. Semangat berlatih!",
      },
    ],
    hikmahItems: [
      {
        valueName: 'Riyadhah',
        motto: 'Riyadhah — saya berlatih menggunakan AI dengan benar.',
        meaning: 'Riyadhah dimaknai sebagai latihan dan pembiasaan yang dilakukan secara berulang untuk membentuk kemampuan dan perilaku yang baik. Dalam konteks pembelajaran AI, siswa tidak cukup hanya mengetahui cara menggunakan AI secara benar, tetapi perlu terus berlatih memeriksa informasi, menggunakan sumber, menjaga privasi, dan menghasilkan karya secara bertanggung jawab. Prinsip ini mendukung pembiasaan penggunaan AI yang kritis dan beradab melalui latihan yang konsisten.',
        dalil: 'Hadis: Amal yang paling dicintai Allah adalah amal yang dilakukan secara terus-menerus meskipun sedikit (HR. Bukhari No. 6464 dan Muslim No. 783).'
      },
      {
        valueName: 'Khidmah',
        motto: 'Khidmah — saya menggunakan hasilnya untuk menghasilkan sesuatu yang bermanfaat.',
        meaning: 'Khidmah dimaknai sebagai semangat pengabdian dan kesediaan memanfaatkan ilmu, kemampuan, dan teknologi untuk menebarkan manfaat bagi sesama. Dalam penggunaan AI, siswa tidak hanya berhenti pada menerima informasi, tetapi mengolah hasil belajarnya menjadi karya baru yang jujur, santun, dan bermanfaat bagi banyak orang.',
        dalil: 'QS. Al-Ma’idah ayat 2 (tolong-menolong dalam kebaikan dan takwa) dan HR. Muslim No. 2699 (Allah menolong seorang hamba selama hamba itu menolong saudaranya).'
      }
    ]
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
  onOpenProfileModal,
}) => {
  // Flow Step: MENTORS IS MANDATORY FIRST, THEN MISSIONS
  const [currentStep, setCurrentStep] = useState<HubFlowStep>('mentors');

  // 5 Mandatory Sequential Stages of Orientation (Tabayyun, Wara', Qoul, Muraqabah, Sahabat)
  const [hasCompletedAllStages, setHasCompletedAllStages] = useState<boolean>(() => {
    return localStorage.getItem('quest_orientation_completed_all') === 'true';
  });

  const [maxUnlockedStage, setMaxUnlockedStage] = useState<number>(() => {
    if (localStorage.getItem('quest_orientation_completed_all') === 'true') {
      return 4;
    }
    const savedMax = localStorage.getItem('quest_orientation_max_stage');
    const savedCurrent = localStorage.getItem('quest_orientation_stage_idx');
    const val = savedMax !== null ? parseInt(savedMax, 10) : (savedCurrent !== null ? parseInt(savedCurrent, 10) : 0);
    return Math.min(Math.max(val || 0, 0), 4);
  });

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(() => {
    const saved = localStorage.getItem('quest_orientation_stage_idx');
    return saved !== null ? Math.min(Math.max(parseInt(saved, 10) || 0, 0), 4) : 0;
  });
  const [dialogueIdx, setDialogueIdx] = useState<number>(0);

  // Track highest point revealed per stage so previous points remain visible while advancing
  const [maxPointByStage, setMaxPointByStage] = useState<number[]>(() => {
    const completedAll = localStorage.getItem('quest_orientation_completed_all') === 'true';
    if (completedAll) return [2, 2, 2, 2, 2];
    const savedMax = localStorage.getItem('quest_orientation_max_stage');
    const maxStageVal = savedMax !== null ? parseInt(savedMax, 10) : 0;
    return NPCS.map((_, idx) => (idx < maxStageVal ? 2 : 0));
  });

  // Selected mission in Step 2
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [unlockedPuzzleIds, setUnlockedPuzzleIds] = useState<string[]>(() => getUnlockedPuzzleIds());
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);

  // Modals & Popups
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [ttsState, setTtsState] = useState<TtsState>(() => childNarrator.getState());

  useEffect(() => {
    const unsubscribe = childNarrator.subscribe(setTtsState);
    return () => {
      unsubscribe();
      childNarrator.stop();
    };
  }, []);

  useEffect(() => {
    if (currentStep !== 'mentors') {
      childNarrator.stop();
    }
  }, [currentStep]);

  useEffect(() => {
    if (isMuted) {
      childNarrator.stop();
    }
  }, [isMuted]);

  const activeMission = missions[selectedMissionIndex] || missions[0];
  const isMissionUnlocked = unlockedMissionIds.includes(activeMission.id);
  const activeNpc = NPCS[currentStageIndex] || NPCS[0];
  const currentMaxPointForStage = hasCompletedAllStages ? activeNpc.quotes.length - 1 : (maxPointByStage[currentStageIndex] ?? 0);

  const speakChildText = (
    id: string,
    text: string,
    speakerHint: 'aisyah' | 'zaki' = 'aisyah'
  ) => {
    childNarrator.toggleSpeak(id, text, speakerHint);
  };

  const renderAudioBadge = (
    id: string,
    idleLabel = 'Dengar Suara',
    tone: 'cyan' | 'amber' = 'cyan'
  ) => {
    const isLoading = ttsState.loadingId === id;
    const isPlaying = ttsState.playingId === id;

    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shrink-0">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Memuat suara...</span>
        </span>
      );
    }

    if (isPlaying) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-black shrink-0 animate-pulse ${
            tone === 'amber'
              ? 'bg-amber-400 text-slate-950 border border-amber-200 shadow'
              : 'bg-cyan-400 text-slate-950 border border-cyan-200 shadow'
          }`}
        >
          <Square className="w-2.5 h-2.5 fill-current" />
          <span>Membacakan • Stop</span>
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 transition ${
          tone === 'amber'
            ? 'bg-amber-400/15 text-amber-200 border border-amber-400/45 hover:bg-amber-400/25'
            : 'bg-slate-900/90 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-950'
        }`}
      >
        <Volume2 className="w-3 h-3" />
        <span>{idleLabel}</span>
      </span>
    );
  };

  const handleNextMission = () => {
    audio.playClick();
    setSelectedMissionIndex((prev) => (prev + 1) % missions.length);
  };

  const handlePrevMission = () => {
    audio.playClick();
    setSelectedMissionIndex((prev) => (prev - 1 + missions.length) % missions.length);
  };

  const handleSelectStage = (idx: number) => {
    audio.playClick();
    setCurrentStageIndex(idx);
    setDialogueIdx(0);
    localStorage.setItem('quest_orientation_stage_idx', String(idx));
  };

  const handleNextInformation = () => {
    if (dialogueIdx < activeNpc.quotes.length - 1) {
      audio.playClick();
      const nextPt = dialogueIdx + 1;
      setDialogueIdx(nextPt);
      setMaxPointByStage(prev => {
        const next = [...prev];
        next[currentStageIndex] = Math.max(next[currentStageIndex] ?? 0, nextPt);
        return next;
      });
    } else {
      // Completed all information in the current stage
      if (currentStageIndex < NPCS.length - 1) {
        audio.playCorrect();
        const nextStage = currentStageIndex + 1;
        setMaxPointByStage(prev => {
          const next = [...prev];
          next[currentStageIndex] = activeNpc.quotes.length - 1;
          return next;
        });
        setCurrentStageIndex(nextStage);
        setDialogueIdx(0);
        localStorage.setItem('quest_orientation_stage_idx', String(nextStage));
        setMaxUnlockedStage((prev) => {
          const updated = Math.max(prev, nextStage);
          localStorage.setItem('quest_orientation_max_stage', String(updated));
          return updated;
        });
      } else {
        // Successfully passed all 5 stages!
        audio.playPowerUp();
        setHasCompletedAllStages(true);
        setMaxUnlockedStage(4);
        setMaxPointByStage([2, 2, 2, 2, 2]);
        localStorage.setItem('quest_orientation_completed_all', 'true');
        localStorage.setItem('quest_orientation_max_stage', '4');
      }
    }
  };

  const handlePrevInformation = () => {
    audio.playClick();
    if (dialogueIdx > 0) {
      setDialogueIdx((prev) => prev - 1);
    } else if (currentStageIndex > 0) {
      const prevStage = currentStageIndex - 1;
      setCurrentStageIndex(prevStage);
      setDialogueIdx(NPCS[prevStage].quotes.length - 1);
      localStorage.setItem('quest_orientation_stage_idx', String(prevStage));
    }
  };

  const handleRestartOrientation = () => {
    audio.playClick();
    setCurrentStageIndex(0);
    setDialogueIdx(0);
    localStorage.setItem('quest_orientation_stage_idx', '0');
  };

  const getNextButtonLabel = () => {
    if (dialogueIdx < activeNpc.quotes.length - 1) {
      return `Lanjut ke Poin ${dialogueIdx + 2} dari ${activeNpc.quotes.length}`;
    }
    if (currentStageIndex < NPCS.length - 1) {
      const nextNpc = NPCS[currentStageIndex + 1];
      return `Lanjut ke Tahap ${currentStageIndex + 2}: ${nextNpc.name}`;
    }
    return hasCompletedAllStages
      ? 'Baca Ulang dari Tahap 1'
      : 'Tuntaskan 5 Tahapan Wajib ✓';
  };

  const handleProceedToMissions = () => {
    audio.playClick();
    setCurrentStep('missions');
  };

  return (
    <div id="hub-main-screen" className="relative min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans select-none antialiased overflow-x-hidden">
      {/* Landing Page Background Image */}
      <img
        src="/assets/aistudio/Gemini_Generated_Image_vwvfldvwvfldvwvf_5d4ca8c9.jpg"
        alt=""
        aria-hidden="true"
        className="fixed inset-0 z-0 w-full h-full object-cover object-center pointer-events-none select-none"
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-slate-950/70 via-slate-950/55 to-[#030712]/85"
      />

      {/* Sleek Minimalist Navbar */}
      <header className="bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3 sticky top-0 z-40">
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
              <div 
                onClick={() => {
                  if (onOpenProfileModal) {
                    audio.playClick();
                    onOpenProfileModal();
                  }
                }}
                className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium cursor-pointer hover:text-cyan-300 transition"
                title="Klik untuk ubah Nama atau Kelas Siswa"
              >
                <span className="text-slate-200 font-bold hover:underline">{playerStats.name}</span>
                <span className="text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-800/60 font-bold">
                  {playerStats.grade || 'Kelas 5'}
                </span>
                <span className="text-slate-700">•</span>
                <span className="text-amber-400 font-mono font-bold">{playerStats.total_xp} XP</span>
                <span className="text-[10px] text-slate-500 hover:text-cyan-300">✏️</span>
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

            {/* Bantuan / Cara Bermain Button */}
            <button
              onClick={() => { audio.playClick(); onOpenHelpModal(); }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/40 hover:border-teal-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Panduan Belajar Q.U.E.S.T., Etika Safeguard, dan Cara Bermain"
            >
              <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-cyrillic text-[11px]">Bantuan</span>
            </button>

            {/* Audio Button with explicit Musik label & accessible state */}
            <button
              onClick={onToggleMute}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              aria-label={isMuted ? 'Nyalakan Musik & Efek Suara' : 'Matikan Suara (Mute)'}
              title={isMuted ? 'Nyalakan Musik & Efek Suara' : 'Matikan Suara (Mute)'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="text-[10px] text-rose-400 font-bold hidden sm:inline">Mute</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-emerald-300 font-bold hidden sm:inline">Musik</span>
                </>
              )}
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
      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center">
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
            {hasCompletedAllStages && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-0.5" />}
          </button>

          <span className="text-slate-600 font-mono text-sm">➔</span>

          <button
            disabled={!hasCompletedAllStages}
            onClick={() => {
              if (hasCompletedAllStages) {
                audio.playClick();
                setCurrentStep('missions');
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition border ${
              !hasCompletedAllStages
                ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-60'
                : currentStep === 'missions'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40 cursor-pointer'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 cursor-pointer'
            }`}
            title={!hasCompletedAllStages ? 'Selesaikan 5 tahapan orientasi terlebih dahulu' : 'Buka Misi Petualangan'}
          >
            <span className="w-5 h-5 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-mono font-black text-[11px]">
              02
            </span>
            <span className="font-cyrillic text-[11px] tracking-wide">MISI PETUALANGAN</span>
            {!hasCompletedAllStages && <Lock className="w-3.5 h-3.5 text-slate-600 ml-0.5" />}
          </button>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: ARAHAN MENTOR & SAHABAT GUARDIAN (WAJIB TAMPIL PERTAMA) */}
        {/* ======================================================== */}
        {currentStep === 'mentors' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Clean Section Header (Clickable Audio Explanation) */}
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                speakChildText(
                  'mentors-header',
                  'Hai teman-teman kelas lima! Ini adalah Langkah Satu, Materi Inti Adab Digital, Pengarahan Mentor dan Sahabat. Baca atau klik setiap teks di lima tahapan wajib secara berurutan ya, agar kamu siap menghadapi misi petualangan QUEST!'
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  speakChildText(
                    'mentors-header',
                    'Hai teman-teman kelas lima! Ini adalah Langkah Satu, Materi Inti Adab Digital, Pengarahan Mentor dan Sahabat. Baca atau klik setiap teks di lima tahapan wajib secara berurutan ya, agar kamu siap menghadapi misi petualangan QUEST!'
                  );
                }
              }}
              className={`text-center space-y-2.5 max-w-2xl mx-auto bg-slate-950/80 backdrop-blur-md px-5 py-4 rounded-3xl border shadow-lg cursor-pointer transition hover:border-cyan-400/70 ${
                ttsState.playingId === 'mentors-header'
                  ? 'border-cyan-400 ring-2 ring-cyan-400/35'
                  : 'border-slate-800/90'
              }`}
              title="Klik untuk mendengar penjelasan suara anak Indonesia"
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-bold">
                  LANGKAH 01 • MATERI INTI ADAB DIGITAL
                </span>
                {renderAudioBadge('mentors-header', 'Dengar Pengantar')}
              </div>
              <h2 className="font-cyrillic text-2xl sm:text-3xl font-black text-white tracking-tight">
                PENGARAHAN MENTOR &amp; SAHABAT
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Baca 5 materi inti dari para mentor dan sahabat secara berurutan agar kamu siap menghadapi misi petualangan Q.U.E.S.T.!
              </p>
              <p className="text-[11px] text-cyan-300 font-semibold inline-flex items-center justify-center gap-1.5 bg-cyan-950/70 px-3 py-1 rounded-full border border-cyan-500/30">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>Multimedia Suara: Klik teks mana saja di 5 Tahapan Wajib untuk mendengar penjelasan suara anak Indonesia</span>
              </p>
            </div>

            {/* Audio Error Toast if any */}
            {ttsState.errorMsg && (
              <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-100 text-xs font-medium shadow-lg">
                <span>{ttsState.errorMsg}</span>
                <button
                  type="button"
                  onClick={() => childNarrator.clearError()}
                  className="text-rose-200 hover:text-white font-bold px-2 py-0.5 rounded bg-rose-900/80 cursor-pointer shrink-0"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Main Content Layout: Vertical 5 Stages (Left) & Active Spotlight Card (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: VERTICAL 5 STAGES (HIGH CONTRAST, READABLE, CLICKABLE) */}
              <div className="lg:col-span-5 bg-slate-950/92 backdrop-blur-md border-2 border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="space-y-2.5 pb-3 border-b border-slate-800">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      speakChildText(
                        'sidebar-title',
                        'Ini adalah daftar lima tahapan wajib bersama para mentor dan sahabat. Yuk pelajari satu per satu mulai dari Mentor Tabayyun sampai Zaki dan Aisyah!'
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        speakChildText(
                          'sidebar-title',
                          'Ini adalah daftar lima tahapan wajib bersama para mentor dan sahabat. Yuk pelajari satu per satu mulai dari Mentor Tabayyun sampai Zaki dan Aisyah!'
                        );
                      }
                    }}
                    className="flex items-center justify-between gap-2 cursor-pointer rounded-xl p-1 -m-1 hover:bg-slate-900/80 transition"
                    title="Klik untuk mendengar penjelasan daftar 5 Tahapan Wajib"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-400" />
                      <span className="font-cyrillic text-sm font-black tracking-wide text-white">
                        5 TAHAPAN WAJIB
                      </span>
                      <Volume2 className={`w-3.5 h-3.5 ${ttsState.playingId === 'sidebar-title' ? 'text-cyan-300 animate-pulse' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                      {hasCompletedAllStages ? '5 / 5 Selesai ✓' : `Tahap ${currentStageIndex + 1} / 5`}
                    </span>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
                      style={{
                        width: `${hasCompletedAllStages ? 100 : Math.round(((maxUnlockedStage + (dialogueIdx + 1) / activeNpc.quotes.length) / NPCS.length) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Vertical Informational Cards - High Legibility, No Cramped Truncation */}
                <div className="space-y-3">
                  {NPCS.map((npc, idx) => {
                    const isCurrent = idx === currentStageIndex;
                    const isPassed = hasCompletedAllStages || idx < maxUnlockedStage;
                    const isVisited = hasCompletedAllStages || idx <= maxUnlockedStage;
                    const isLocked = !hasCompletedAllStages && idx > maxUnlockedStage;
                    const isClickable = !isLocked;

                    return (
                      <button
                        key={npc.key}
                        type="button"
                        disabled={!isClickable}
                        onClick={() => {
                          if (isClickable) {
                            handleSelectStage(idx);
                          }
                        }}
                        className={`w-full text-left rounded-2xl p-4 border-2 transition-all duration-200 select-none ${
                          isCurrent
                            ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-950/60 ring-2 ring-cyan-400/30'
                            : isClickable
                            ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-700/80 hover:border-cyan-400/60 text-slate-100 cursor-pointer active:scale-[0.99]'
                            : 'bg-slate-950/85 border-slate-800/80 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Step Number or Checkmark */}
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border-2 transition-all ${
                              isCurrent
                                ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-md shadow-cyan-500/40'
                                : isVisited
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            {isPassed && !isCurrent ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4 text-slate-400" />
                            ) : (
                              `0${idx + 1}`
                            )}
                          </div>

                          {/* Stage Identity (Clear & Uncropped) */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center justify-between gap-1.5">
                              <span className={`font-cyrillic text-sm sm:text-[15px] font-black leading-snug ${
                                isCurrent ? 'text-cyan-300' : isVisited ? 'text-white' : 'text-slate-300'
                              }`}>
                                {npc.emoji} {npc.name}
                              </span>
                              
                              {/* High-Contrast Status Badge */}
                              {isCurrent ? (
                                <span className="text-[10px] font-mono text-slate-950 font-black bg-cyan-300 px-2.5 py-0.5 rounded-full shrink-0">
                                  SEDANG DIBACA
                                </span>
                              ) : isPassed ? (
                                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/50 shrink-0">
                                  {hasCompletedAllStages ? 'BACA ULANG ↺' : 'SELESAI ✓'}
                                </span>
                              ) : isVisited ? (
                                <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/50 shrink-0">
                                  LANJUTKAN ➔
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-300 font-semibold bg-slate-900 px-2 py-0.5 rounded-full border border-slate-700 shrink-0">
                                  TAHAP {idx + 1}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs leading-snug font-medium ${
                                isCurrent ? 'text-slate-200' : isVisited ? 'text-slate-300' : 'text-slate-400'
                              }`}>
                                {npc.adabConcept}
                              </p>
                              {isClickable && (
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectStage(idx);
                                    speakChildText(
                                      `stage-card-${npc.key}`,
                                      `Tahap ${idx + 1}: ${npc.name}, ${npc.role}. Materi Adab Digital: ${npc.adabConcept}.`,
                                      npc.key === 'sahabat' ? 'zaki' : 'aisyah'
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSelectStage(idx);
                                      speakChildText(
                                        `stage-card-${npc.key}`,
                                        `Tahap ${idx + 1}: ${npc.name}, ${npc.role}. Materi Adab Digital: ${npc.adabConcept}.`,
                                        npc.key === 'sahabat' ? 'zaki' : 'aisyah'
                                      );
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 transition ${
                                    ttsState.playingId === `stage-card-${npc.key}`
                                      ? 'bg-cyan-400 text-slate-950 border-cyan-200 animate-pulse'
                                      : 'bg-slate-800/90 hover:bg-cyan-950 text-cyan-300 border-cyan-500/40'
                                  }`}
                                  title={`Dengar penjelasan ${npc.name}`}
                                >
                                  {ttsState.loadingId === `stage-card-${npc.key}` ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : ttsState.playingId === `stage-card-${npc.key}` ? (
                                    <Square className="w-2.5 h-2.5 fill-current" />
                                  ) : (
                                    <Volume2 className="w-3 h-3" />
                                  )}
                                  <span>{ttsState.playingId === `stage-card-${npc.key}` ? 'Stop' : 'Suara'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    speakChildText(
                      'sidebar-footer-tip',
                      hasCompletedAllStages
                        ? 'Semua lima tahapan sudah terbuka! Kamu bisa klik kartu mana saja untuk membaca atau mendengarkan ulang penjelasannya.'
                        : 'Bacalah berurutan dari Tahap satu hingga Tahap lima. Tahap yang sudah dibuka bisa diklik ulang kapan saja.'
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      speakChildText(
                        'sidebar-footer-tip',
                        hasCompletedAllStages
                          ? 'Semua lima tahapan sudah terbuka! Kamu bisa klik kartu mana saja untuk membaca atau mendengarkan ulang penjelasannya.'
                          : 'Bacalah berurutan dari Tahap satu hingga Tahap lima. Tahap yang sudah dibuka bisa diklik ulang kapan saja.'
                      );
                    }
                  }}
                  className="pt-2.5 border-t border-slate-800 text-xs text-slate-300 hover:text-cyan-200 text-center font-medium flex items-center justify-center gap-1.5 cursor-pointer transition"
                  title="Klik untuk mendengar petunjuk"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {hasCompletedAllStages
                      ? 'Semua 5 tahapan terbuka! Klik kartu mana saja untuk membaca ulang.'
                      : 'Baca berurutan dari Tahap 1 hingga 5. Tahap yang sudah dibuka bisa diklik ulang kapan saja.'}
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE GUIDANCE SPOTLIGHT CARD (PROGRESSIVE FLOW) */}
              <div className="lg:col-span-7 bg-slate-900/95 backdrop-blur-md border-2 border-slate-700/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 relative overflow-hidden">
                {/* Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header Profile (Clickable to Hear Mentor Intro) */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    speakChildText(
                      `npc-intro-${activeNpc.key}`,
                      `Tahap ${currentStageIndex + 1} dari 5. ${activeNpc.name}, ${activeNpc.role}. Konsep Adab Digital pada tahap ini adalah ${activeNpc.adabConcept}.`,
                      activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah'
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      speakChildText(
                        `npc-intro-${activeNpc.key}`,
                        `Tahap ${currentStageIndex + 1} dari 5. ${activeNpc.name}, ${activeNpc.role}. Konsep Adab Digital pada tahap ini adalah ${activeNpc.adabConcept}.`,
                        activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah'
                      );
                    }
                  }}
                  className={`flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-4 border-b border-slate-800 rounded-2xl p-2 -m-2 cursor-pointer transition hover:bg-slate-800/40 ${
                    ttsState.playingId === `npc-intro-${activeNpc.key}` ? 'bg-cyan-950/40 ring-1 ring-cyan-400/50' : ''
                  }`}
                  title="Klik teks profil mentor untuk mendengar suara penjelasan"
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${activeNpc.avatarBg} flex items-center justify-center text-3xl sm:text-4xl shadow-xl shrink-0 border-2 border-white/25`}>
                    {activeNpc.emoji}
                  </div>

                  <div className="flex-1 space-y-1.5 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[11px] font-mono uppercase font-black px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 inline-flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>MATERI INTI • TAHAP {currentStageIndex + 1} DARI 5</span>
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600/50">
                        {activeNpc.adabConcept}
                      </span>
                      {renderAudioBadge(`npc-intro-${activeNpc.key}`, 'Dengar Profil')}
                    </div>

                    <h3 className="font-cyrillic text-xl sm:text-2xl font-black text-white">
                      {activeNpc.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium">
                      {activeNpc.role}
                    </p>
                  </div>
                </div>

                {/* Clear Point Stepper Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {activeNpc.quotes.map((q, qIdx) => {
                    const isPointActive = dialogueIdx === qIdx;
                    const isPointUnlocked = qIdx <= currentMaxPointForStage;

                    return (
                      <button
                        key={qIdx}
                        type="button"
                        disabled={!isPointUnlocked}
                        onClick={() => {
                          if (isPointUnlocked) {
                            audio.playClick();
                            setDialogueIdx(qIdx);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl border text-left transition flex items-center gap-2 ${
                          isPointActive
                            ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md cursor-pointer'
                            : isPointUnlocked
                            ? 'bg-slate-950/80 hover:bg-slate-800 border-emerald-500/40 text-slate-200 cursor-pointer'
                            : 'bg-slate-950/50 border-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-black shrink-0 ${
                          isPointActive
                            ? 'bg-cyan-400 text-slate-950'
                            : isPointUnlocked
                            ? 'bg-emerald-500/25 text-emerald-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {isPointUnlocked && !isPointActive ? '✓' : qIdx + 1}
                        </span>
                        <span className="text-[11px] font-bold leading-tight line-clamp-2">
                          {q.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Progressive Reading Cards: Revealed Points Stay Readable & Every Text Is Clickable for Audio */}
                <div className="space-y-3">
                  {activeNpc.quotes.map((quote, qIdx) => {
                    const isPointUnlocked = qIdx <= currentMaxPointForStage;
                    const isPointActive = dialogueIdx === qIdx;
                    const quoteAudioId = `quote-${activeNpc.key}-${qIdx}`;
                    const speakerHint = activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah';

                    if (!isPointUnlocked) {
                      const lockedAudioId = `locked-${activeNpc.key}-${qIdx}`;
                      return (
                        <div
                          key={qIdx}
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            speakChildText(
                              lockedAudioId,
                              `Poin ${qIdx + 1} tentang ${quote.title} masih terkunci. Klik tombol lanjut di bawah untuk membuka materi ini ya!`,
                              speakerHint
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              speakChildText(
                                lockedAudioId,
                                `Poin ${qIdx + 1} tentang ${quote.title} masih terkunci. Klik tombol lanjut di bawah untuk membuka materi ini ya!`,
                                speakerHint
                              );
                            }
                          }}
                          className="px-4 py-3 rounded-2xl bg-slate-950/50 hover:bg-slate-900/70 border border-dashed border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 cursor-pointer transition"
                          title="Klik untuk mendengar petunjuk membuka materi"
                        >
                          <div className="flex items-center gap-2.5">
                            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span>
                              <strong className="text-slate-300">Poin {qIdx + 1}: {quote.title}</strong> — Klik tombol lanjut di bawah untuk membuka materi ini.
                            </span>
                          </div>
                          {renderAudioBadge(lockedAudioId, 'Info')}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={qIdx}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          if (!isPointActive) {
                            audio.playClick();
                            setDialogueIdx(qIdx);
                          }
                          speakChildText(
                            quoteAudioId,
                            `Poin ${qIdx + 1}, ${quote.title}. ${quote.body}`,
                            speakerHint
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            if (!isPointActive) {
                              audio.playClick();
                              setDialogueIdx(qIdx);
                            }
                            speakChildText(
                              quoteAudioId,
                              `Poin ${qIdx + 1}, ${quote.title}. ${quote.body}`,
                              speakerHint
                            );
                          }
                        }}
                        className={`rounded-2xl transition-all duration-200 cursor-pointer ${
                          ttsState.playingId === quoteAudioId
                            ? 'p-5 sm:p-6 bg-slate-950 border-2 border-cyan-300 shadow-xl shadow-cyan-900/60 ring-2 ring-cyan-400/35'
                            : isPointActive
                            ? 'p-5 sm:p-6 bg-slate-950 border-2 border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-400/20 hover:border-cyan-300'
                            : 'p-4 bg-slate-950/75 hover:bg-slate-950 border border-emerald-500/35 hover:border-cyan-400/60'
                        }`}
                        title="Klik teks ini untuk mendengar suara penjelasan anak Indonesia"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className={`text-[11px] font-mono uppercase font-black px-2.5 py-0.5 rounded-md ${
                            isPointActive
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                              : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            Poin {qIdx + 1} • {quote.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {isPointActive ? (
                              <span className="text-[10px] font-mono font-bold text-cyan-300">
                                ● Fokus Bacaan
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold text-emerald-400">
                                ✓ Sudah Dibaca
                              </span>
                            )}
                            {renderAudioBadge(quoteAudioId, 'Dengar Penjelasan')}
                          </div>
                        </div>

                        <p className={`leading-relaxed font-medium ${
                          isPointActive
                            ? 'text-base sm:text-lg text-white'
                            : 'text-sm text-slate-200'
                        }`}>
                          {quote.body}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* EMPHASIZED, ENLARGED INTI HIKMAH CALLOUT (EVERY TEXT CLICKABLE FOR CHILD VOICE) */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-950/80 to-orange-950/80 border-2 border-amber-400/85 shadow-2xl shadow-amber-950/50 space-y-4">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      speakChildText(
                        `hikmah-header-${activeNpc.key}`,
                        `Bagian ini adalah Inti Hikmah Utama yang wajib kita ingat bersama ${activeNpc.name}. Klik teks di bawah untuk mendengar penjelasan dan dalilnya ya!`,
                        activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah'
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        speakChildText(
                          `hikmah-header-${activeNpc.key}`,
                          `Bagian ini adalah Inti Hikmah Utama yang wajib kita ingat bersama ${activeNpc.name}. Klik teks di bawah untuk mendengar penjelasan dan dalilnya ya!`,
                          activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah'
                        );
                      }
                    }}
                    className="flex flex-wrap items-center justify-between gap-2 cursor-pointer rounded-xl p-1 -m-1 hover:bg-amber-400/10 transition"
                    title="Klik untuk mendengar pengantar Inti Hikmah Utama"
                  >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow">
                      <Lightbulb className="w-4 h-4 fill-slate-950" />
                      <span>INTI HIKMAH UTAMA • WAJIB DIINGAT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderAudioBadge(`hikmah-header-${activeNpc.key}`, 'Dengar Judul', 'amber')}
                      <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeNpc.hikmahItems.map((item, hIdx) => {
                      const hikmahAudioId = `hikmah-${activeNpc.key}-${item.valueName}`;
                      const dalilAudioId = `dalil-${activeNpc.key}-${item.valueName}`;
                      const speakerHint = activeNpc.key === 'sahabat' ? 'zaki' : 'aisyah';

                      return (
                        <div
                          key={item.valueName}
                          className={`space-y-2.5 ${
                            hIdx > 0 ? 'pt-4 border-t border-amber-400/30' : ''
                          }`}
                        >
                          {/* Clickable Motto + Meaning */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              speakChildText(
                                hikmahAudioId,
                                `${item.motto} ${item.meaning}`,
                                speakerHint
                              )
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                speakChildText(
                                  hikmahAudioId,
                                  `${item.motto} ${item.meaning}`,
                                  speakerHint
                                );
                              }
                            }}
                            className={`rounded-xl p-3 -mx-1 cursor-pointer transition space-y-2 border ${
                              ttsState.playingId === hikmahAudioId
                                ? 'bg-amber-400/15 border-amber-300 ring-2 ring-amber-300/35'
                                : 'border-transparent hover:bg-amber-400/10 hover:border-amber-400/40'
                            }`}
                            title={`Klik untuk mendengar penjelasan ${item.valueName}`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/25 border border-amber-400/50 text-[11px] font-mono font-black uppercase text-amber-200">
                                  {item.valueName}
                                </span>
                                <h4 className="text-lg sm:text-xl font-black text-amber-100 leading-snug tracking-tight">
                                  {item.motto}
                                </h4>
                              </div>
                              {renderAudioBadge(hikmahAudioId, 'Dengar Hikmah', 'amber')}
                            </div>

                            <p className="text-sm sm:text-[15px] text-amber-50/95 leading-relaxed font-medium">
                              {item.meaning}
                            </p>
                          </div>

                          {/* Clickable Landasan Dalil */}
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              speakChildText(
                                dalilAudioId,
                                `Landasan Dalil untuk nilai ${item.valueName}. ${item.dalil}`,
                                speakerHint
                              );
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                speakChildText(
                                  dalilAudioId,
                                  `Landasan Dalil untuk nilai ${item.valueName}. ${item.dalil}`,
                                  speakerHint
                                );
                              }
                            }}
                            className={`bg-slate-950/80 hover:bg-slate-950 border rounded-xl px-3.5 py-2.5 flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5 cursor-pointer transition ${
                              ttsState.playingId === dalilAudioId
                                ? 'border-amber-300 ring-2 ring-amber-300/35'
                                : 'border-amber-400/45 hover:border-amber-300/80'
                            }`}
                            title={`Klik untuk mendengar Landasan Dalil ${item.valueName}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <BookOpen className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                              <p className="text-xs sm:text-sm text-amber-200 leading-relaxed font-semibold">
                                <span className="text-amber-400 font-black uppercase tracking-wide mr-1.5">
                                  Landasan Dalil:
                                </span>
                                {item.dalil}
                              </p>
                            </div>
                            {renderAudioBadge(dalilAudioId, 'Dengar Dalil', 'amber')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* UNIFIED, USER-FRIENDLY NAVIGATION FLOW */}
                <div className="pt-3 border-t border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Back Button */}
                    <button
                      type="button"
                      disabled={currentStageIndex === 0 && dialogueIdx === 0}
                      onClick={handlePrevInformation}
                      className={`px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition ${
                        currentStageIndex === 0 && dialogueIdx === 0
                          ? 'bg-slate-950/50 text-slate-600 border-slate-800/70 cursor-not-allowed'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-600 cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>

                    {/* Primary Next / Advance Button */}
                    {(!hasCompletedAllStages || currentStageIndex < NPCS.length - 1 || dialogueIdx < activeNpc.quotes.length - 1) ? (
                      <button
                        type="button"
                        onClick={handleNextInformation}
                        className="flex-1 py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-cyrillic font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-950/80 border-2 border-cyan-300/60 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <span>{getNextButtonLabel()}</span>
                        <ChevronRight className="w-5 h-5 text-cyan-100 shrink-0" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRestartOrientation}
                        className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-cyan-500/40 transition cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Baca Ulang dari Tahap 1</span>
                      </button>
                    )}
                  </div>

                  {/* Helper caption OR Completion Mission CTA */}
                  {!hasCompletedAllStages ? (
                    <p className="text-xs text-slate-300 text-center font-medium">
                      💡 Baca setiap poin hingga Tahap 5 untuk membuka tombol <strong>Misi Petualangan</strong>.
                    </p>
                  ) : (
                    <div className="pt-2 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-300 space-y-3">
                      <div className="px-4 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>5 TAHAP MATERI INTI TELAH DILALUI SECARA LENGKAP</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleProceedToMissions}
                        className="w-full py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-cyrillic font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-2xl shadow-emerald-950/80 border-2 border-emerald-400/70 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer ring-4 ring-emerald-500/25"
                      >
                        <span>SAYA TELAH MEMAHAMI ARAHAN • LANJUT KE MISI PETUALANGAN</span>
                        <ChevronRight className="w-6 h-6 text-emerald-100 shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
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
              <div className="pt-2 space-y-2">
                {isMissionUnlocked ? (
                  <>
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

                    {(playerStats.best_scores[activeMission.id] || 0) > 0 && (
                      <button
                        onClick={() => {
                          audio.playClick();
                          setIsCertificateModalOpen(true);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/60 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-950/30"
                      >
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>🎓 Unduh Sertifikat Kelulusan Level Ini (PNG/PDF)</span>
                      </button>
                    )}
                  </>
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

      {/* CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        studentName={playerStats.name}
        studentGrade={playerStats.grade}
        mission={activeMission}
      />
    </div>
  );
};
