import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  BarChart2, 
  BookOpen, 
  Bot, 
  Camera, 
  Check, 
  CheckCircle, 
  CheckCircle2, 
  Compass, 
  ExternalLink, 
  FileCheck2, 
  FileText, 
  Gamepad2, 
  Globe, 
  HelpCircle, 
  Info, 
  Lightbulb, 
  Lock, 
  RotateCcw, 
  Shield, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  Swords, 
  User, 
  UserCheck, 
  Volume2, 
  X, 
  XCircle, 
  Zap 
} from 'lucide-react';
import { MissionDefinition, QUESTScores, VerifiedSource, WeaponLoadout } from '../types';
import { audio } from '../utils/audio';
import { shuffleArray } from '../utils/shuffle';
import { getWeaponLoadout } from '../utils/storage';

interface QuestGateProps {
  mission: MissionDefinition;
  onGateComplete: (scores: QUESTScores, loadout: WeaponLoadout) => void;
  onCancelToHub: () => void;
}

type GatePhase = 'query' | 'uncover' | 'examine' | 'safeguard' | 'transform' | 'summary';

export const QuestGate: React.FC<QuestGateProps> = ({
  mission,
  onGateComplete,
  onCancelToHub,
}) => {
  const [currentPhase, setCurrentPhase] = useState<GatePhase>('query');

  // Randomize / shuffle options per session so students cannot memorize positions
  const [shuffledQueryOptions] = useState(() => shuffleArray(mission.questData.query.options));
  const [shuffledUncoverCards] = useState(() => shuffleArray(mission.questData.uncover.cards));
  const [shuffledExamineSources] = useState(() => shuffleArray(mission.questData.examine.sources));
  const [shuffledTransformActions] = useState(() => shuffleArray(mission.questData.transform.actions));

  // Scores
  const [scores, setScores] = useState<QUESTScores>({
    query: 0,
    uncover: 0,
    examine: 0,
    safeguard: 0,
    transform: 0,
    total: 0,
  });

  // Attempt counters & hints
  const [phaseAttempts, setPhaseAttempts] = useState<Record<string, number>>({
    query: 0,
    uncover: 0,
    examine: 0,
    safeguard: 0,
    transform: 0,
  });
  const [hintUsed, setHintUsed] = useState<Record<string, boolean>>({
    query: false,
    uncover: false,
    examine: false,
    safeguard: false,
    transform: false,
  });

  // Phase-specific selection states
  const [selectedQueryOption, setSelectedQueryOption] = useState<string | null>(null);
  const [queryFeedback, setQueryFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const [selectedUncoverCard, setSelectedUncoverCard] = useState<string | null>(null);
  const [uncoverFeedback, setUncoverFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [uncoverEliminatedId, setUncoverEliminatedId] = useState<string | null>(null);

  const [selectedExamineSource, setSelectedExamineSource] = useState<string | null>(null);
  const [examineFeedback, setExamineFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [examineEliminatedId, setExamineEliminatedId] = useState<string | null>(null);

  // Source / Verification Log Modal & Drawer
  const [activeSourceModal, setActiveSourceModal] = useState<VerifiedSource | null>(null);
  const [isVerificationLogOpen, setIsVerificationLogOpen] = useState<boolean>(false);
  const [comparedSources, setComparedSources] = useState<string[]>([]);
  const [logNotes, setLogNotes] = useState<Record<string, { trust: string; reason: string }>>({});

  // Safeguard checklist state
  const [safeguardToggles, setSafeguardToggles] = useState<Record<string, boolean>>({
    [mission.questData.safeguard.items[0]?.id || 'sg1']: false,
    [mission.questData.safeguard.items[1]?.id || 'sg2']: false,
    [mission.questData.safeguard.items[2]?.id || 'sg3']: false,
  });
  const [safeguardEvaluated, setSafeguardEvaluated] = useState<boolean>(false);

  // Transform: READ -> CLOSE -> THINK -> CREATE state
  const [transformStep, setTransformStep] = useState<'read_close' | 'think' | 'choose_create'>('read_close');
  const [thinkThoughts, setThinkThoughts] = useState<[string, string, string]>(['', '', '']);
  const [selectedTransformAction, setSelectedTransformAction] = useState<string | null>(null);
  const [transformFeedback, setTransformFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // AI Disclosure Note State on Transform Summary
  const [aiUsageNote, setAiUsageNote] = useState<string>('ai_ideas');
  const [myOwnEffort, setMyOwnEffort] = useState<string>('Memeriksa silang data ke BPS dan menulis ulang dengan kata-kataku sendiri.');

  // Helper for icons in examine phase
  const renderSourceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6 text-sky-400" />;
      case 'BarChart2': return <BarChart2 className="w-6 h-6 text-emerald-400" />;
      case 'Smartphone': return <Smartphone className="w-6 h-6 text-purple-400" />;
      case 'Bot': return <Bot className="w-6 h-6 text-rose-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6 text-indigo-400" />;
      case 'Camera': return <Camera className="w-6 h-6 text-teal-400" />;
      default: return <HelpCircle className="w-6 h-6 text-slate-400" />;
    }
  };

  // PHASE 1: Query submit
  const handleSelectQueryOption = (optionId: string) => {
    if (queryFeedback?.isCorrect) return;

    setSelectedQueryOption(optionId);
    const option = mission.questData.query.options.find(o => o.id === optionId);
    if (!option) return;

    const attempts = (phaseAttempts.query || 0) + 1;
    setPhaseAttempts(prev => ({ ...prev, query: attempts }));

    if (option.isCorrect) {
      audio.playCorrect();
      let awarded = 25;
      if (hintUsed.query) awarded = 10;
      else if (attempts > 1) awarded = 15;

      setScores(prev => ({ ...prev, query: awarded, total: prev.total + awarded }));
      setQueryFeedback({ 
        isCorrect: true, 
        text: `Pilihanmu tepat! (+${awarded} Poin) ${option.explanation}` 
      });
    } else {
      audio.playWrong();
      setQueryFeedback({ 
        isCorrect: false, 
        text: `Pertanyaan ini belum tepat sasaran. ${option.explanation} Ingat prinsip Niyyah: cari tahu siapa pembuatnya dan apa tujuannya terlebih dahulu!` 
      });
    }
  };

  // PHASE 2: Uncover submit
  const handleSelectUncoverCard = (cardId: string) => {
    if (uncoverFeedback?.isCorrect) return;

    setSelectedUncoverCard(cardId);
    const card = mission.questData.uncover.cards.find(c => c.id === cardId);
    if (!card) return;

    const attempts = (phaseAttempts.uncover || 0) + 1;
    setPhaseAttempts(prev => ({ ...prev, uncover: attempts }));

    if (card.isSuspicious) {
      audio.playCorrect();
      let awarded = 25;
      if (hintUsed.uncover) awarded = 15;
      else if (attempts > 1) awarded = 10;

      setScores(prev => ({ ...prev, uncover: awarded, total: prev.total + awarded }));
      setUncoverFeedback({ 
        isCorrect: true, 
        text: `Kamu sangat teliti! (+${awarded} Poin) ${card.explanation}` 
      });
    } else {
      audio.playWrong();
      setUncoverFeedback({ 
        isCorrect: false, 
        text: `Pernyataan ini adalah fakta wajar. ${card.explanation} Ayo telusuri lagi angka atau klaim yang terlalu janggal untuk dipercaya!` 
      });
    }
  };

  // PHASE 3: Examine submit & source comparison
  const handleSelectExamineSource = (sourceId: string) => {
    if (examineFeedback?.isCorrect) return;

    setSelectedExamineSource(sourceId);
    if (!comparedSources.includes(sourceId)) {
      setComparedSources(prev => [...prev, sourceId]);
    }

    const source = mission.questData.examine.sources.find(s => s.id === sourceId);
    if (!source) return;

    const attempts = (phaseAttempts.examine || 0) + 1;
    setPhaseAttempts(prev => ({ ...prev, examine: attempts }));

    if (source.isMostReliable) {
      audio.playCorrect();
      let awarded = 30; // highest weight
      if (hintUsed.examine) awarded = 20;
      else if (attempts > 1) awarded = 15;

      setScores(prev => ({ ...prev, examine: awarded, total: prev.total + awarded }));
      setExamineFeedback({ 
        isCorrect: true, 
        text: `Sumber Otoritatif Sempurna! (+${awarded} Poin) ${source.explanation}` 
      });
    } else {
      audio.playWrong();
      setExamineFeedback({ 
        isCorrect: false, 
        text: `Sumber ini belum memenuhi kriteria otoritas primer. ${source.explanation} Gunakan rumus WHO-EVIDENCE: cari lembaga resmi negara yang akuntabel!` 
      });
    }
  };

  // PHASE 4: Safeguard evaluate
  const handleToggleSafeguard = (itemId: string) => {
    if (safeguardEvaluated) return;
    audio.playClick();
    setSafeguardToggles(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleEvaluateSafeguard = () => {
    audio.playClick();
    setSafeguardEvaluated(true);

    let correctCount = 0;
    mission.questData.safeguard.items.forEach(item => {
      const userValue = !!safeguardToggles[item.id];
      if (userValue === item.shouldBeEnabled) {
        correctCount += 1;
      }
    });

    let awarded = 0;
    if (correctCount === 3) awarded = 20;
    else if (correctCount === 2) awarded = 12;
    else if (correctCount === 1) awarded = 6;

    if (awarded >= 12) {
      audio.playCorrect();
    } else {
      audio.playWrong();
    }

    setScores(prev => ({ ...prev, safeguard: awarded, total: prev.total + awarded }));
  };

  // PHASE 5: Transform submit
  const handleSelectTransformAction = (actionId: string) => {
    if (transformFeedback?.isCorrect) return;

    setSelectedTransformAction(actionId);
    const action = mission.questData.transform.actions.find(a => a.id === actionId);
    if (!action) return;

    const attempts = (phaseAttempts.transform || 0) + 1;
    setPhaseAttempts(prev => ({ ...prev, transform: attempts }));

    if (action.isCorrect) {
      audio.playCorrect();
      let awarded = 20;
      if (attempts > 1) awarded = 10;

      setScores(prev => ({ ...prev, transform: awarded, total: prev.total + awarded }));
      setTransformFeedback({ 
        isCorrect: true, 
        text: `Keputusan Terbaik! (+${awarded} Poin) ${action.explanation}` 
      });
    } else {
      audio.playWrong();
      setTransformFeedback({ 
        isCorrect: false, 
        text: `Peringatan Etika Belajar! ${action.explanation} Ingat prinsip READ → CLOSE → THINK → CREATE untuk membuat karya dari pemahamanmu sendiri.` 
      });
    }
  };

  // Hint activation
  const handleUseHint = (phase: string) => {
    audio.playClick();
    setHintUsed(prev => ({ ...prev, [phase]: true }));

    if (phase === 'uncover') {
      const normalCard = mission.questData.uncover.cards.find(c => !c.isSuspicious);
      if (normalCard) setUncoverEliminatedId(normalCard.id);
    } else if (phase === 'examine') {
      const badSource = mission.questData.examine.sources.find(s => !s.isMostReliable);
      if (badSource) setExamineEliminatedId(badSource.id);
    }
  };

  const handleNextPhase = (next: GatePhase) => {
    audio.playClick();
    setCurrentPhase(next);
  };

  const weaponLoadout = getWeaponLoadout(scores.total);
  const accuracyPercent = Math.round((scores.total / 120) * 100);
  const isUnlockedToMission = scores.total >= 60;

  const handleResetGate = () => {
    audio.playClick();
    setCurrentPhase('query');
    setScores({ query: 0, uncover: 0, examine: 0, safeguard: 0, transform: 0, total: 0 });
    setPhaseAttempts({ query: 0, uncover: 0, examine: 0, safeguard: 0, transform: 0 });
    setHintUsed({ query: false, uncover: false, examine: false, safeguard: false, transform: false });
    setSelectedQueryOption(null);
    setQueryFeedback(null);
    setSelectedUncoverCard(null);
    setUncoverFeedback(null);
    setUncoverEliminatedId(null);
    setSelectedExamineSource(null);
    setExamineFeedback(null);
    setExamineEliminatedId(null);
    setSafeguardEvaluated(false);
    setSelectedTransformAction(null);
    setTransformFeedback(null);
    setTransformStep('read_close');
    setComparedSources([]);
  };

  return (
    <div id="quest-decision-gate" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Gate Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { audio.playClick(); onCancelToHub(); }}
              className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer font-semibold"
            >
              ← Batal ke Hub
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gerbang Q.U.E.S.T.
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {mission.bloomLevel}
                </span>
                <h1 className="font-extrabold text-sm sm:text-base text-white">
                  {mission.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Action: Verification Log & Real-time score */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <button
              onClick={() => { audio.playClick(); setIsVerificationLogOpen(true); }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Buka Catatan Verifikasi Sumber (Verification Log)"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Verification Log</span>
            </button>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Skor QUEST</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                {scores.total} <span className="text-xs text-slate-400 font-normal">/ 120</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 5-Step Phase Progress Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 overflow-x-auto">
          {[
            { key: 'query', label: '1. QUERY', sub: 'Tanya Tujuan', pts: '25p', adab: 'Niyyah' },
            { key: 'uncover', label: '2. UNCOVER', sub: 'Ungkap Eror', pts: '25p', adab: 'Wara\'' },
            { key: 'examine', label: '3. EXAMINE', sub: 'Uji Sumber', pts: '30p', adab: 'Tabayyun' },
            { key: 'safeguard', label: '4. SAFEGUARD', sub: 'Jaga Etika', pts: '20p', adab: 'Wara\'' },
            { key: 'transform', label: '5. TRANSFORM', sub: 'Karya Sendiri', pts: '20p', adab: 'Khidmah' },
          ].map((phase) => {
            const isCurrent = currentPhase === phase.key;
            const phaseScore = scores[phase.key as keyof QUESTScores] || 0;
            const isCompleted = phaseScore > 0;

            return (
              <div
                key={phase.key}
                className={`flex-1 min-w-[125px] px-2.5 py-1.5 rounded-xl border text-center transition ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-400/40 text-emerald-200'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[11px] font-extrabold flex items-center justify-center gap-1">
                  {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />}
                  <span>{phase.label}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-amber-300 font-bold">{phase.adab}</span>
                  <span>•</span>
                  {isCompleted ? <span className="text-emerald-400 font-semibold">{phaseScore} Pts</span> : phase.pts}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Phase Interactive Card */}
      <main className="max-w-5xl mx-auto w-full px-4 py-6 flex-1 flex flex-col justify-center">
        {/* PHASE 1: QUERY */}
        {currentPhase === 'query' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                    Fase 1: QUERY (Niat yang Lurus & Sadar Tujuan)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    Digital Adab: Niyyah
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Menentukan Niat & Tujuan Pertanyaan yang Jelas
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {mission.questData.query.verifiedSource && (
                  <button
                    onClick={() => setActiveSourceModal(mission.questData.query.verifiedSource!)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lihat Sumber Resmi</span>
                  </button>
                )}
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 25 Poin
                </span>
              </div>
            </div>

            {/* Learning Goal Banner */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-center gap-2.5 text-xs text-emerald-200 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Tujuan Tahap Ini:</strong> Siswa menentukan apa yang ingin diketahui, tujuan pencarian, dan membuat pertanyaan yang jelas sebelum mempercayai jawaban AI.
              </span>
            </div>

            {/* Scaffolding I DO / WE DO (Zaki & Aisyah Guide) */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/40 flex items-start gap-3.5 text-xs sm:text-sm">
              <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center text-xl shrink-0 border border-cyan-400/50 shadow-md">
                🎒
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-cyan-300 uppercase tracking-wide text-[11px]">
                  <span>PANDUAN BELAJAR ZAKI & AISYAH (I DO → WE DO):</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-medium">
                  {mission.questData.query.scaffolding?.modelExample || 'Contoh: Jangan langsung menyalin jawaban AI ke tugas. Bertanyalah: "Siapa pembuat sistem dan untuk apa informasi ini ditulis?"'}
                </p>
              </div>
            </div>

            {/* Scenario Box */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-2xl shrink-0 border border-emerald-400/50 shadow-md">
                🧭
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {mission.questData.query.npcSpeaker} Menyampaikan Kasus:
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                  "{mission.questData.query.scenario}"
                </p>
              </div>
            </div>

            {/* Question & Options */}
            <div className="space-y-3">
              <p className="font-bold text-sm sm:text-base text-white">
                ❓ {mission.questData.query.question}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {shuffledQueryOptions.map((opt, i) => {
                  const isSelected = selectedQueryOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQueryOption(opt.id)}
                      disabled={queryFeedback?.isCorrect}
                      className={`text-left p-4 rounded-2xl border-2 text-sm transition-all flex items-start gap-3.5 cursor-pointer outline-none focus:ring-2 focus:ring-cyan-400/40 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-lg ring-2 ring-emerald-400/50 scale-[1.01]'
                            : 'bg-rose-950/80 border-rose-400 text-rose-100 ring-2 ring-rose-400/50'
                          : 'bg-slate-800/80 border-slate-750 hover:bg-slate-800 hover:border-slate-500 text-slate-200 hover:shadow-md'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-xl font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs transition border ${
                        isSelected 
                          ? opt.isCorrect ? 'bg-emerald-500 text-slate-950 border-emerald-300' : 'bg-rose-500 text-white border-rose-300'
                          : 'bg-slate-700/80 text-slate-200 border-slate-600'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex-1 font-medium leading-relaxed">
                        {opt.text}
                      </div>
                      {isSelected && (
                        opt.isCorrect 
                          ? <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          : <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Hint Row */}
            <div className="space-y-3 pt-2">
              {queryFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                    queryFeedback.isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                      : 'bg-rose-950/70 border-rose-500 text-rose-100'
                  }`}
                >
                  {queryFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{queryFeedback.text}</span>
                </div>
              )}

              {hintUsed.query ? (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Petunjuk:</strong> {mission.questData.query.hint}</span>
                </div>
              ) : (
                !queryFeedback?.isCorrect && (
                  <button
                    onClick={() => handleUseHint('query')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Gunakan Petunjuk (-15 poin jika benar berikutnya)</span>
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            {queryFeedback?.isCorrect && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleNextPhase('uncover')}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Lanjut ke Tahap 2: UNCOVER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 2: UNCOVER */}
        {currentPhase === 'uncover' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400">
                    Fase 2: UNCOVER (Mengenali Eror & Halusinasi AI)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800/60">
                    Digital Adab: Wara' & Muraqabah
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Menemukan Bagian Informasi yang Perlu Diperiksa
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {mission.questData.uncover.verifiedSource && (
                  <button
                    onClick={() => setActiveSourceModal(mission.questData.uncover.verifiedSource!)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lihat Sumber Resmi</span>
                  </button>
                )}
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 25 Poin
                </span>
              </div>
            </div>

            {/* Learning Goal Banner */}
            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-700/50 flex items-center gap-2.5 text-xs text-teal-200 font-medium">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                <strong>Tujuan Tahap Ini:</strong> Siswa membaca keluaran AI secara teliti dan menandai klaim yang terdengar yakin tetapi sebenarnya meragukan atau tidak masuk akal.
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              {mission.questData.uncover.prompt}
            </p>

            {/* 3 Floating AI Cards with clear borders and selection states */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shuffledUncoverCards.map((card, idx) => {
                const isSelected = selectedUncoverCard === card.id;
                const isEliminated = uncoverEliminatedId === card.id;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectUncoverCard(card.id)}
                    disabled={uncoverFeedback?.isCorrect || isEliminated}
                    className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer outline-none focus:ring-2 focus:ring-teal-400/40 ${
                      isEliminated
                        ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed line-through'
                        : isSelected
                        ? card.isSuspicious
                          ? 'bg-emerald-950/90 border-emerald-400 shadow-xl ring-2 ring-emerald-400/50 text-emerald-100 scale-[1.02]'
                          : 'bg-rose-950/80 border-rose-400 text-rose-100'
                        : 'bg-slate-800/80 border-slate-700 hover:border-teal-400/70 hover:bg-slate-800 text-slate-200 hover:shadow-lg'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-extrabold text-teal-400 uppercase tracking-wider">
                          {card.title}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-700 text-slate-200">
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                        "{card.text}"
                      </p>
                    </div>

                    <div className="mt-4 pt-2.5 border-t border-slate-700/80 text-xs text-slate-300 flex items-center justify-between font-medium">
                      <span>{isSelected ? (card.isSuspicious ? '✅ Ditandai Meragukan' : '❌ Fakta Benar') : 'Klik untuk Menandai'}</span>
                      {isSelected && card.isSuspicious && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Hint Row */}
            <div className="space-y-3 pt-2">
              {uncoverFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                    uncoverFeedback.isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100'
                      : 'bg-rose-950/70 border-rose-500 text-rose-100'
                  }`}
                >
                  {uncoverFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{uncoverFeedback.text}</span>
                </div>
              )}

              {hintUsed.uncover ? (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Petunjuk:</strong> 1 jawaban keliru telah dieliminasi! {mission.questData.uncover.hint}</span>
                </div>
              ) : (
                !uncoverFeedback?.isCorrect && (
                  <button
                    onClick={() => handleUseHint('uncover')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Eliminasi 1 Jawaban Salah dengan Petunjuk (-10 Poin)</span>
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            {uncoverFeedback?.isCorrect && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleNextPhase('examine')}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Lanjut ke Tahap 3: EXAMINE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 3: EXAMINE */}
        {currentPhase === 'examine' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400">
                    Fase 3: EXAMINE (WHO – EVIDENCE – WHEN – WHY – ELSEWHERE)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60">
                    Digital Adab: Tabayyun & Wara'
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Memeriksa Bukti & Otoritas Sumber
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsVerificationLogOpen(true)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-600/50 flex items-center gap-1 font-bold transition cursor-pointer hover:bg-sky-900"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Buka Verification Log ({comparedSources.length} Ditelaah)</span>
                </button>
                <span className="text-xs px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-700/50 font-bold">
                  Bobot: 30 Poin
                </span>
              </div>
            </div>

            {/* Mnemonic Banner: WHO - EVIDENCE - WHEN - WHY - ELSEWHERE */}
            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-700/60 space-y-2 text-xs text-sky-200">
              <div className="font-extrabold text-sky-300 flex items-center gap-2 text-xs sm:text-sm">
                <Compass className="w-4 h-4 text-sky-400" />
                <span>RUMUS PEMERIKSAAN SUMBER: WHO – EVIDENCE – WHEN – WHY – ELSEWHERE</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-[11px] pt-1">
                <div className="p-2 rounded-lg bg-slate-900/80 border border-sky-800/50">
                  <strong className="text-sky-300 block">WHO</strong> Siapa pembuat informasi?
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-sky-800/50">
                  <strong className="text-emerald-300 block">EVIDENCE</strong> Apa buktinya?
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-sky-800/50">
                  <strong className="text-teal-300 block">WHEN</strong> Kapan dibuat/diperbarui?
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-sky-800/50">
                  <strong className="text-amber-300 block">WHY</strong> Apa tujuan informasi?
                </div>
                <div className="p-2 rounded-lg bg-slate-900/80 border border-sky-800/50">
                  <strong className="text-purple-300 block">ELSEWHERE</strong> Sumber lain sependapat?
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              {mission.questData.examine.prompt} Bandingkan minimal 2 sumber untuk melakukan verifikasi silang (cross-check).
            </p>

            {/* 4 Sources Grid with distinct border and hover */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shuffledExamineSources.map(source => {
                const isSelected = selectedExamineSource === source.id;
                const isEliminated = examineEliminatedId === source.id;
                const isCompared = comparedSources.includes(source.id);

                return (
                  <button
                    key={source.id}
                    onClick={() => handleSelectExamineSource(source.id)}
                    disabled={examineFeedback?.isCorrect || isEliminated}
                    className={`text-left p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer outline-none focus:ring-2 focus:ring-sky-400/40 ${
                      isEliminated
                        ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed line-through'
                        : isSelected
                        ? source.isMostReliable
                          ? 'bg-emerald-950/90 border-emerald-400 shadow-xl ring-2 ring-emerald-400/50 text-emerald-100 scale-[1.01]'
                          : 'bg-rose-950/80 border-rose-400 text-rose-100'
                        : 'bg-slate-800/80 border-slate-700 hover:border-sky-400/70 hover:bg-slate-800 text-slate-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 shrink-0">
                      {renderSourceIcon(source.icon)}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-white">{source.title}</h4>
                        {isCompared && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 shrink-0">
                            Dicek ✓
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-700/80 text-sky-300 inline-block">
                        {source.type}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">
                        {source.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Hint Row */}
            <div className="space-y-3 pt-2">
              {examineFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                    examineFeedback.isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                      : 'bg-rose-950/70 border-rose-500 text-rose-100'
                  }`}
                >
                  {examineFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{examineFeedback.text}</span>
                </div>
              )}

              {hintUsed.examine ? (
                <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-600/50 text-amber-200 text-xs flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Petunjuk Sumber:</strong> {mission.questData.examine.hint}</span>
                </div>
              ) : (
                !examineFeedback?.isCorrect && (
                  <button
                    onClick={() => handleUseHint('examine')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Gunakan Petunjuk Verifikasi Otoritas (-10 Poin)</span>
                  </button>
                )
              )}
            </div>

            {/* Next Button */}
            {examineFeedback?.isCorrect && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleNextPhase('safeguard')}
                  className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Lanjut ke Tahap 4: SAFEGUARD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: SAFEGUARD */}
        {currentPhase === 'safeguard' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400">
                    Fase 4: SAFEGUARD (Etika Perlindungan: People – Data – Ideas)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/60">
                    Digital Adab: Wara' & Muraqabah
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Menjaga Orang, Data Pribadi, dan Kejujuran Ide
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {mission.questData.safeguard.verifiedSource && (
                  <button
                    onClick={() => setActiveSourceModal(mission.questData.safeguard.verifiedSource!)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lihat Sumber Resmi</span>
                  </button>
                )}
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 20 Poin
                </span>
              </div>
            </div>

            {/* 3 Safeguard Pillars Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-rose-500/40 space-y-1">
                <div className="font-extrabold text-xs text-rose-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-rose-400" />
                  <span>🧑 PEOPLE</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Apakah informasi atau karyaku menghargai orang lain? Tidak mempermalukan atau merundung teman.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-sky-500/40 space-y-1">
                <div className="font-extrabold text-xs text-sky-400 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-sky-400" />
                  <span>🔐 DATA</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Apakah aku menjaga data pribadi? Tidak membagikan alamat, nomor telepon, password, atau foto pribadi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 space-y-1">
                <div className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>💡 IDEAS</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Apakah sumber dicantumkan? Jelaskan jujur jika AI membantu dan tulis ulang dengan pemahaman sendiri.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              {mission.questData.safeguard.prompt} Aktifkan tindakan yang <strong>BENAR & AMAN</strong>, dan matikan tindakan yang merugikan.
            </p>

            {/* Interactive Toggle List */}
            <div className="space-y-3">
              {mission.questData.safeguard.items.map(item => {
                const isEnabled = !!safeguardToggles[item.id];
                const isEvaluated = safeguardEvaluated;
                const isCorrect = isEnabled === item.shouldBeEnabled;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSafeguard(item.id)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-3.5 cursor-pointer select-none ${
                      isEvaluated
                        ? isCorrect
                          ? 'bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-md'
                          : 'bg-rose-950/80 border-rose-400 text-rose-100'
                        : isEnabled
                        ? 'bg-purple-950/70 border-purple-400 text-purple-100 shadow-md'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-purple-500/60'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-purple-300">
                          {item.category?.toUpperCase() || 'SAFEGUARD'}
                        </span>
                      </div>
                      <p className="font-semibold text-sm leading-relaxed text-white">
                        {item.statement}
                      </p>
                      {isEvaluated && (
                        <p className={`text-xs mt-1.5 font-medium ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {item.explanation}
                        </p>
                      )}
                    </div>

                    {/* Toggle switch visual */}
                    <div className="shrink-0 pt-0.5 flex flex-col items-center">
                      <div
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${
                          isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </div>
                      <span className="text-[10px] text-center mt-1 font-bold">
                        {isEnabled ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Row */}
            <div className="pt-2">
              {!safeguardEvaluated ? (
                <button
                  onClick={handleEvaluateSafeguard}
                  className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Kunci Pilihan Safeguard Saya</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800 gap-3">
                  <div className="text-xs sm:text-sm text-slate-300 font-medium">
                    Skor Safeguard: <strong className="text-emerald-400 font-black text-base">{scores.safeguard} Pts</strong>
                  </div>
                  <button
                    onClick={() => handleNextPhase('transform')}
                    className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <span>Lanjut ke Tahap 5: TRANSFORM</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PHASE 5: TRANSFORM */}
        {currentPhase === 'transform' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                    Fase 5: TRANSFORM (READ → CLOSE → THINK → CREATE)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                    Digital Adab: Khidmah & Qoul
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  Membuat Karya Baru dari Informasi yang Sudah Diverifikasi
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {mission.questData.transform.verifiedSource && (
                  <button
                    onClick={() => setActiveSourceModal(mission.questData.transform.verifiedSource!)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 flex items-center gap-1 font-bold transition cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Lihat Sumber Resmi</span>
                  </button>
                )}
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 20 Poin
                </span>
              </div>
            </div>

            {/* 4-Step READ -> CLOSE -> THINK -> CREATE Wizard Bar */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Prinsip Berkarya: READ → CLOSE → THINK → CREATE
                </span>
                <span className="text-[11px] text-slate-400">
                  Langkah {transformStep === 'read_close' ? '1-2' : transformStep === 'think' ? '3' : '4'} dari 4
                </span>
              </div>

              {/* Step 1 & 2: READ -> CLOSE */}
              {transformStep === 'read_close' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                    <div className="font-bold text-emerald-400">1. READ (Membaca Informasi):</div>
                    <p className="pl-3 border-l-2 border-emerald-500 text-slate-300">
                      {mission.questData.transform.readCloseThinkPrompts?.step1Read || 'Data resmi BPS membuktikan populasi DKI Jakarta sekitar 10,6 juta jiwa, bukan 500 juta jiwa seperti halusinasi chatbot AI.'}
                    </p>
                    <div className="font-bold text-cyan-400 pt-1">2. CLOSE (Menutup Sumber):</div>
                    <p className="text-slate-300">
                      "Sekarang tutup sumbermu sejenak. Jangan menyalin kata demi kata dari AI."
                    </p>
                  </div>

                  <button
                    onClick={() => { audio.playClick(); setTransformStep('think'); }}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Sudah Membaca & Siap Memikirkan Intinya (Lanjut ke THINK) ➔</span>
                  </button>
                </div>
              )}

              {/* Step 3: THINK */}
              {transformStep === 'think' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="font-bold text-cyan-300 text-xs sm:text-sm">
                      3. THINK (Apa 3 hal penting yang kamu pahami?):
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Ketik singkat atau pikirkan 3 poin pemahamanmu sendiri:
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      '1. AI bisa keliru dan terdengar yakin (halusinasi).',
                      '2. Sumber resmi (BPS) mencatat 10,6 juta jiwa.',
                      '3. Menulis ulang dengan kata sendiri lebih jujur & beradab.'
                    ].map((defaultPlaceholder, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={thinkThoughts[idx]}
                        onChange={(e) => {
                          const val = e.target.value;
                          setThinkThoughts(prev => {
                            const copy = [...prev] as [string, string, string];
                            copy[idx] = val;
                            return copy;
                          });
                        }}
                        placeholder={`Poin ${idx + 1}: ${defaultPlaceholder}`}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-xs text-white outline-none"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => { audio.playClick(); setTransformStep('choose_create'); }}
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Lanjut ke Langkah 4: CREATE (Pilih Bentuk Karya Terbaik) ➔</span>
                  </button>
                </div>
              )}

              {/* Step 4: CREATE & Action Selection */}
              {transformStep === 'choose_create' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="text-xs text-amber-300 font-bold">
                    4. CREATE: Pilih tindakan paling bertanggung jawab untuk membuat karyamu:
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {shuffledTransformActions.map(act => {
                      const isSelected = selectedTransformAction === act.id;

                      return (
                        <button
                          key={act.id}
                          onClick={() => handleSelectTransformAction(act.id)}
                          disabled={transformFeedback?.isCorrect}
                          className={`text-left p-4 rounded-2xl border-2 text-sm font-bold transition flex items-center justify-between gap-3 cursor-pointer outline-none focus:ring-2 focus:ring-amber-400/40 ${
                            isSelected
                              ? act.isCorrect
                                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/50 shadow-xl'
                                : 'bg-rose-950/80 border-rose-400 text-rose-100'
                              : 'bg-slate-800/80 border-slate-750 hover:border-amber-400 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="leading-relaxed">{act.label}</span>
                          <span className="text-xs text-slate-300 font-normal shrink-0">
                            {isSelected ? (act.isCorrect ? '✅ Tepat' : '❌ Salah') : 'Pilih'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* AI Disclosure Component */}
            {transformFeedback?.isCorrect && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/50 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5 uppercase">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    AI Use Note (Catatan Kejujuran Penggunaan AI)
                  </span>
                  <span className="text-[10px] text-slate-400">Integritas Belajar</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Bagaimana kamu menggunakan AI dalam membuat karya ini?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'no_ai', label: 'Saya tidak menggunakan AI sama sekali.' },
                      { id: 'ai_ideas', label: 'Saya menggunakan AI untuk mencari ide awal.' },
                      { id: 'ai_info', label: 'Saya menggunakan AI membantu mencari informasi.' },
                      { id: 'ai_grammar', label: 'Saya menggunakan AI membantu memperbaiki tulisan.' },
                    ].map(choice => (
                      <label
                        key={choice.id}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs ${
                          aiUsageNote === choice.id
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="ai_note"
                          value={choice.id}
                          checked={aiUsageNote === choice.id}
                          onChange={() => setAiUsageNote(choice.id)}
                          className="text-cyan-500"
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Apa bagian yang TETAP kamu kerjakan sendiri dengan pemikiranmu?
                  </label>
                  <input
                    type="text"
                    value={myOwnEffort}
                    onChange={(e) => setMyOwnEffort(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
                    placeholder="Contoh: Menulis ulang poster dengan kata-kataku dan mengecek data ke BPS."
                  />
                </div>
              </div>
            )}

            {/* Feedback */}
            {transformFeedback && (
              <div
                className={`p-4 rounded-2xl border-2 text-xs sm:text-sm font-semibold flex items-start gap-3 ${
                  transformFeedback.isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                    : 'bg-rose-950/70 border-rose-500 text-rose-100'
                }`}
              >
                {transformFeedback.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{transformFeedback.text}</span>
              </div>
            )}

            {/* Proceed to Summary */}
            {transformFeedback?.isCorrect && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleNextPhase('summary')}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Lihat Rangkuman QUEST & Perlengkapan Senjata ➔</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUMMARY & WEAPON SCALING SCREEN */}
        {currentPhase === 'summary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                Pemeriksaan Q.U.E.S.T. Selesai
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Hasil Gerbang Keputusan Digital Adab
              </h2>
            </div>

            {/* Score & Accuracy Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Total Skor QUEST</div>
                <div className="text-2xl font-black text-emerald-400">
                  {scores.total} <span className="text-xs text-slate-400 font-normal">/ 120</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Akurasi Berpikir Kritis</div>
                <div className="text-2xl font-black text-teal-300">
                  {accuracyPercent}%
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Syarat Misi Aksi</div>
                <div className={`text-2xl font-black ${isUnlockedToMission ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUnlockedToMission ? 'TERBUKA' : 'BELUM'}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Tier Senjata</div>
                <div className="text-xl font-black text-amber-400 uppercase">
                  {weaponLoadout.tier}
                </div>
              </div>
            </div>

            {/* Breakdown of 5 Phases */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wide">
                Rincian Skor 5 Tahap Q.U.E.S.T.:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">1. Query (Niat)</div>
                  <div className="font-black text-emerald-400 text-sm mt-0.5">{scores.query} / 25</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">2. Uncover (Eror)</div>
                  <div className="font-black text-emerald-400 text-sm mt-0.5">{scores.uncover} / 25</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">3. Examine (Sumber)</div>
                  <div className="font-black text-sky-400 text-sm mt-0.5">{scores.examine} / 30</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">4. Safeguard (Etika)</div>
                  <div className="font-black text-purple-400 text-sm mt-0.5">{scores.safeguard} / 20</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-slate-400 text-[11px]">5. Transform (Karya)</div>
                  <div className="font-black text-amber-400 text-sm mt-0.5">{scores.transform} / 20</div>
                </div>
              </div>
            </div>

            {/* Weapon Loadout Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                  <Swords className="w-4 h-4" />
                  Perlengkapan Senjata Misi Aksi
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {weaponLoadout.tier.toUpperCase()} TIER
                </span>
              </div>

              <h3 className="text-lg font-black text-white">
                {weaponLoadout.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {weaponLoadout.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-semibold">
                <span className="text-amber-300 bg-amber-950/70 px-3 py-1 rounded-xl border border-amber-500/40 flex items-center gap-1.5 font-bold">
                  ⚡ Amunisi: {weaponLoadout.maxAmmo} Butir Peluru
                </span>
                <span className="text-emerald-300 bg-emerald-950/70 px-3 py-1 rounded-xl border border-emerald-500/40 flex items-center gap-1.5 font-bold">
                  💥 Daya Hancur: {weaponLoadout.baseDamage * weaponLoadout.damageMultiplier} Damage
                </span>
                <span className="text-sky-300 bg-sky-950/70 px-2.5 py-1 rounded-xl border border-sky-500/40">
                  ❤️ HP: {100 + weaponLoadout.bonusHealth} HP
                </span>
                {weaponLoadout.hasDoubleJump && (
                  <span className="text-purple-300 bg-purple-950/70 px-2.5 py-1 rounded-xl border border-purple-500/40">
                    🦘 Lompat Ganda
                  </span>
                )}
                {weaponLoadout.hasSpeedBoost && (
                  <span className="text-teal-300 bg-teal-950/70 px-2.5 py-1 rounded-xl border border-teal-500/40">
                    💨 Gerak Cepat
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
                <span className="text-amber-400 font-bold text-base">⚠️</span>
                <span>
                  <strong>Aturan Peluru Terbatas:</strong> Senjatamu hanya memiliki <strong>{weaponLoadout.maxAmmo} peluru</strong>. Bidik musuh dan monster boss dengan tepat! Jika peluru habis, misi gagal dan kamu harus kembali menjawab QUEST Gate untuk mengumpulkan poin senjata baru.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {isUnlockedToMission ? (
                <button
                  id="btn-proceed-to-action-mission"
                  onClick={() => {
                    audio.playClick();
                    onGateComplete(scores, weaponLoadout);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition cursor-pointer"
                >
                  <Swords className="w-5 h-5" />
                  <span>MASUKI MISI AKSI PLATFORMER →</span>
                </button>
              ) : (
                <div className="w-full space-y-2">
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/60 text-rose-200 text-xs text-center font-semibold">
                    ⚠️ Skor QUEST di bawah 60 poin (Minimal 60 untuk membuka misi aksi). Silakan ulangi untuk memperbaiki pemahaman!
                  </div>
                  <button
                    onClick={handleResetGate}
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ulangi Gerbang QUEST (Maksimalkan Nilai)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* VERIFIED SOURCE EXPANDABLE MODAL */}
      {activeSourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-500/70 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl text-slate-100 relative space-y-4 animate-in fade-in duration-150">
            <button
              onClick={() => setActiveSourceModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
                🏛️
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  REFERENSI MATERI TERVERIFIKASI
                </span>
                <h3 className="font-black text-base sm:text-lg text-white">
                  {activeSourceModal.institution}
                </h3>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs sm:text-sm">
              <div>
                <span className="text-slate-400 text-xs block">Judul Halaman / Rujukan Resmi:</span>
                <strong className="text-white text-sm">{activeSourceModal.title}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Tahun/Tanggal Rilis:</span>
                <span className="text-cyan-300 font-mono font-bold">{activeSourceModal.yearOrDate}</span>
              </div>
              {activeSourceModal.note && (
                <div className="pt-2 border-t border-slate-800 text-slate-300 text-xs">
                  <span className="text-amber-400 font-bold">Catatan Verifikasi: </span>
                  {activeSourceModal.note}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              {activeSourceModal.url ? (
                <a
                  href={activeSourceModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 underline"
                >
                  <span>Buka Portal Resmi ({activeSourceModal.url})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-xs text-slate-500">TODO: INSERT VERIFIED SOURCE URL</span>
              )}

              <button
                onClick={() => setActiveSourceModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOURCE / VERIFICATION LOG DRAWER */}
      {isVerificationLogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-end p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-sky-500/70 rounded-3xl p-5 sm:p-6 max-w-xl w-full h-[90vh] shadow-2xl flex flex-col justify-between text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center justify-center text-lg font-bold">
                  📋
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white">
                    Source & Verification Log Siswa
                  </h3>
                  <p className="text-[11px] text-sky-300 font-medium">
                    Catatan penelaahan bukti sumber (WHO – EVIDENCE – WHEN – WHY – ELSEWHERE)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVerificationLogOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable list of examined sources */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs">
                💡 <strong>Petunjuk untuk Siswa:</strong> Setiap kamu mengecek sumber di tahap Examine, catat apakah sumber tersebut dapat dipercaya dan apa alasannya.
              </div>

              {mission.questData.examine.sources.map((src, sIdx) => {
                const currentNote = logNotes[src.id] || { trust: src.isMostReliable ? 'Ya' : 'Perlu Dicek', reason: '' };

                return (
                  <div key={src.id} className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">
                        SUMBER {sIdx + 1}: {src.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-semibold">
                        {src.type}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-0.5">
                      <div>• <strong>Siapa pembuatnya:</strong> {src.authorOrPublisher || 'Penerbit Terbuka'}</div>
                      <div>• <strong>Kapan rilis/update:</strong> {src.date || 'Berkala'}</div>
                      <div>• <strong>Apa buktinya:</strong> {src.evidenceSummary || 'Kutipan & Observasi'}</div>
                    </div>

                    {/* Trust choice buttons */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-bold">Apakah dapat dipercaya?</span>
                      {['Ya', 'Masih perlu dicek', 'Tidak'].map((choice) => (
                        <button
                          key={choice}
                          onClick={() => {
                            audio.playClick();
                            setLogNotes(prev => ({
                              ...prev,
                              [src.id]: { ...(prev[src.id] || { reason: '' }), trust: choice }
                            }));
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition ${
                            currentNote.trust === choice
                              ? choice === 'Ya' 
                                ? 'bg-emerald-600 text-white border-emerald-400' 
                                : choice === 'Tidak' 
                                ? 'bg-rose-600 text-white border-rose-400' 
                                : 'bg-amber-600 text-white border-amber-400'
                              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                          }`}
                        >
                          [ {choice} ]
                        </button>
                      ))}
                    </div>

                    {/* Reason input */}
                    <input
                      type="text"
                      value={currentNote.reason}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLogNotes(prev => ({
                          ...prev,
                          [src.id]: { ...(prev[src.id] || { trust: 'Perlu Dicek' }), reason: val }
                        }));
                      }}
                      placeholder="Mengapa? (Contoh: Lembaga resmi negara berlisensi sensus)"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:border-sky-400 outline-none"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">
                Tersimpan di sesi belajar aktif
              </span>
              <button
                onClick={() => { audio.playClick(); setIsVerificationLogOpen(false); }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
              >
                Simpan & Kembali ke Soal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
