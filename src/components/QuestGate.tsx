import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  BarChart2, 
  Bot, 
  Camera, 
  Check, 
  CheckCircle, 
  FileText, 
  Gamepad2, 
  Globe, 
  HelpCircle, 
  Lightbulb, 
  RotateCcw, 
  Shield, 
  Smartphone, 
  Swords, 
  X, 
  XCircle, 
  Zap 
} from 'lucide-react';
import { MissionDefinition, QUESTScores, WeaponLoadout } from '../types';
import { audio } from '../utils/audio';
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

  // Safeguard toggles
  const [safeguardToggles, setSafeguardToggles] = useState<Record<string, boolean>>({
    [mission.questData.safeguard.items[0]?.id || 'sg1']: false,
    [mission.questData.safeguard.items[1]?.id || 'sg2']: false,
    [mission.questData.safeguard.items[2]?.id || 'sg3']: false,
  });
  const [safeguardEvaluated, setSafeguardEvaluated] = useState<boolean>(false);

  const [selectedTransformAction, setSelectedTransformAction] = useState<string | null>(null);
  const [transformFeedback, setTransformFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

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
      setQueryFeedback({ isCorrect: true, text: `Hebat! (+${awarded} Poin) ${option.explanation}` });
    } else {
      audio.playWrong();
      setQueryFeedback({ isCorrect: false, text: `Kurang tepat. (-10 Poin) ${option.explanation}` });
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
      setUncoverFeedback({ isCorrect: true, text: `Tepat sekali! (+${awarded} Poin) ${card.explanation}` });
    } else {
      audio.playWrong();
      setUncoverFeedback({ isCorrect: false, text: `Belum tepat. ${card.explanation} Coba analisis lagi!` });
    }
  };

  // PHASE 3: Examine submit
  const handleSelectExamineSource = (sourceId: string) => {
    if (examineFeedback?.isCorrect) return;

    setSelectedExamineSource(sourceId);
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
      setExamineFeedback({ isCorrect: true, text: `Pilihan Otoritatif! (+${awarded} Poin) ${source.explanation}` });
    } else {
      audio.playWrong();
      setExamineFeedback({ isCorrect: false, text: `Kurang tepat. ${source.explanation}` });
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
    else if (correctCount === 2) awarded = 10;
    else if (correctCount === 1) awarded = 5;

    if (awarded >= 10) {
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
      setTransformFeedback({ isCorrect: true, text: `Keputusan Terbaik! (+${awarded} Poin) ${action.explanation}` });
    } else {
      audio.playWrong();
      setTransformFeedback({ isCorrect: false, text: `Peringatan Etika! ${action.explanation}` });
    }
  };

  // Hint activation
  const handleUseHint = (phase: string) => {
    audio.playClick();
    setHintUsed(prev => ({ ...prev, [phase]: true }));

    if (phase === 'uncover') {
      // eliminate one non-suspicious card
      const normalCard = mission.questData.uncover.cards.find(c => !c.isSuspicious);
      if (normalCard) setUncoverEliminatedId(normalCard.id);
    } else if (phase === 'examine') {
      // eliminate one unreliable source
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
  };

  return (
    <div id="quest-decision-gate" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Gate Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 py-3 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { audio.playClick(); onCancelToHub(); }}
              className="px-3 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              ← Batal ke Hub
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gerbang QUEST
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

          {/* Real-time score indicator */}
          <div className="flex items-center gap-3">
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
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 overflow-x-auto">
          {[
            { key: 'query', label: '1. QUERY (Niat)', pts: '25p' },
            { key: 'uncover', label: '2. UNCOVER (Deteksi)', pts: '25p' },
            { key: 'examine', label: '3. EXAMINE (Sumber)', pts: '30p' },
            { key: 'safeguard', label: '4. SAFEGUARD (Etika)', pts: '20p' },
            { key: 'transform', label: '5. TRANSFORM (Aksi)', pts: '20p' },
          ].map((phase, idx) => {
            const isCurrent = currentPhase === phase.key;
            const phaseScore = scores[phase.key as keyof QUESTScores] || 0;
            const isCompleted = phaseScore > 0;

            return (
              <div
                key={phase.key}
                className={`flex-1 min-w-[120px] px-2.5 py-1.5 rounded-lg border text-center transition ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500/80 shadow-md ring-1 ring-emerald-400/40 text-emerald-200'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[11px] font-bold flex items-center justify-center gap-1">
                  {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />}
                  <span>{phase.label}</span>
                </div>
                <div className="text-[10px] text-slate-400">
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                  Fase 1: QUERY (Uji Niat & Kesadaran Awal)
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Mengapa Kita Harus Memeriksa Luaran AI Ini?
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 25 Poin
                </span>
              </div>
            </div>

            {/* NPC Briefing Bubble */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-2xl shrink-0 border border-emerald-400/50">
                🧭
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  {mission.questData.query.npcSpeaker} Berbicara:
                </div>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  "{mission.questData.query.scenario}"
                </p>
              </div>
            </div>

            {/* Question & Options */}
            <div className="space-y-3">
              <p className="font-bold text-sm sm:text-base text-white">
                ❓ {mission.questData.query.question}
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {mission.questData.query.options.map((opt, i) => {
                  const isSelected = selectedQueryOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectQueryOption(opt.id)}
                      disabled={queryFeedback?.isCorrect}
                      className={`text-left p-4 rounded-xl border text-sm transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400/40'
                            : 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-400/40'
                          : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 text-slate-200'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full bg-slate-700/80 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 font-medium">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback & Hint Row */}
            <div className="space-y-3 pt-2">
              {queryFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                    queryFeedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-600/60 text-rose-200'
                  }`}
                >
                  {queryFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{queryFeedback.text}</span>
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
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
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
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <span>Lanjut ke Fase 2: UNCOVER</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 2: UNCOVER */}
        {currentPhase === 'uncover' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-teal-400">
                  Fase 2: UNCOVER (Deteksi Eror & Halusinasi)
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Temukan Klaim AI yang Paling Mencurigakan
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 25 Poin
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              {mission.questData.uncover.prompt}
            </p>

            {/* 3 Floating AI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {mission.questData.uncover.cards.map((card, idx) => {
                const isSelected = selectedUncoverCard === card.id;
                const isEliminated = uncoverEliminatedId === card.id;

                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectUncoverCard(card.id)}
                    disabled={uncoverFeedback?.isCorrect || isEliminated}
                    className={`text-left p-4 rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                      isEliminated
                        ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed line-through'
                        : isSelected
                        ? card.isSuspicious
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-lg ring-2 ring-emerald-400/40 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-teal-500/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                          {card.title}
                        </span>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                          #{idx + 1}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">
                        "{card.text}"
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{isSelected ? (card.isSuspicious ? '✅ Mencurigakan' : '❌ Fakta Benar') : 'Klik untuk Uji'}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Hint Row */}
            <div className="space-y-3 pt-2">
              {uncoverFeedback && (
                <div
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                    uncoverFeedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-600/60 text-rose-200'
                  }`}
                >
                  {uncoverFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{uncoverFeedback.text}</span>
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
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
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
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <span>Lanjut ke Fase 3: EXAMINE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 3: EXAMINE (Highest Weight 30 pts) */}
        {currentPhase === 'examine' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-sky-400">
                  Fase 3: EXAMINE (Verifikasi Sumber Otoritatif)
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Tentukan Sumber Mana yang Paling Dapat Dipercaya
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded bg-sky-950 text-sky-300 border border-sky-700/50 font-bold">
                  Bobot Tertinggi: 30 Poin
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              {mission.questData.examine.prompt}
            </p>

            {/* 4 Sources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {mission.questData.examine.sources.map(source => {
                const isSelected = selectedExamineSource === source.id;
                const isEliminated = examineEliminatedId === source.id;

                return (
                  <button
                    key={source.id}
                    onClick={() => handleSelectExamineSource(source.id)}
                    disabled={examineFeedback?.isCorrect || isEliminated}
                    className={`text-left p-4 rounded-2xl border transition flex items-start gap-3.5 cursor-pointer ${
                      isEliminated
                        ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed line-through'
                        : isSelected
                        ? source.isMostReliable
                          ? 'bg-emerald-950/80 border-emerald-500 shadow-lg ring-2 ring-emerald-400/40 text-emerald-200'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-sky-500/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/60 shrink-0">
                      {renderSourceIcon(source.icon)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white">{source.title}</h4>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-700/70 text-sky-300">
                        {source.type}
                      </span>
                      <p className="text-xs text-slate-400 leading-snug mt-1">
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
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                    examineFeedback.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                      : 'bg-rose-950/60 border-rose-600/60 text-rose-200'
                  }`}
                >
                  {examineFeedback.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{examineFeedback.text}</span>
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
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
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
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <span>Lanjut ke Fase 4: SAFEGUARD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* PHASE 4: SAFEGUARD */}
        {currentPhase === 'safeguard' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-purple-400">
                  Fase 4: SAFEGUARD (Etika Privasi & Integritas Wara')
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Daftar Periksa Etika Digital
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 20 Poin
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              {mission.questData.safeguard.prompt}
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
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 cursor-pointer ${
                      isEvaluated
                        ? isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200'
                          : 'bg-rose-950/60 border-rose-500/80 text-rose-200'
                        : isEnabled
                        ? 'bg-purple-950/50 border-purple-500/70 text-purple-100 shadow-md'
                        : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <p className="font-semibold text-sm leading-snug">
                        {item.statement}
                      </p>
                      {isEvaluated && (
                        <p className={`text-xs mt-1 font-normal ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                          {item.explanation}
                        </p>
                      )}
                    </div>

                    {/* Toggle switch visual */}
                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${
                          isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                        }`}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                      </div>
                      <span className="block text-[10px] text-center mt-1 font-bold">
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
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Shield className="w-4 h-4" />
                  <span>Kunci Pilihan Etika Saya</span>
                </button>
              ) : (
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="text-xs text-slate-300">
                    Skor Safeguard: <strong className="text-emerald-400 font-bold">{scores.safeguard} Pts</strong>
                  </div>
                  <button
                    onClick={() => handleNextPhase('transform')}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
                  >
                    <span>Lanjut ke Fase 5: TRANSFORM</span>
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
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  Fase 5: TRANSFORM (Keputusan Aksi Nyata)
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Tindakan Nyata untuk Menetralkan Disinformasi
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-bold">
                  Maks: 20 Poin
                </span>
              </div>
            </div>

            {/* QUEST Recap pill */}
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 text-xs space-y-1.5">
              <span className="font-bold text-amber-300 uppercase tracking-wide">
                Rangkuman Temuan QUEST:
              </span>
              <ul className="text-slate-300 space-y-1 pl-4 list-disc">
                <li>Kamu memahami niat menjaga integritas tanpa gegabah.</li>
                <li>Kamu berhasil mengungkap klaim data yang tidak masuk akal.</li>
                <li>Kamu telah menemukan rujukan lembaga resmi otoritatif.</li>
                <li>Kamu memegang prinsip adab perlindungan data dan privasi.</li>
              </ul>
            </div>

            <p className="text-sm font-bold text-white">
              {mission.questData.transform.prompt}
            </p>

            {/* 3 Action Buttons */}
            <div className="grid grid-cols-1 gap-3">
              {mission.questData.transform.actions.map(act => {
                const isSelected = selectedTransformAction === act.id;

                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelectTransformAction(act.id)}
                    disabled={transformFeedback?.isCorrect}
                    className={`text-left p-4 rounded-2xl border text-sm font-bold transition flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? act.isCorrect
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400/40 shadow-lg'
                          : 'bg-rose-950/70 border-rose-500 text-rose-200'
                        : 'bg-slate-800/80 border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <span>{act.label}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      {isSelected ? (act.isCorrect ? '✅ Tepat' : '❌ Salah') : 'Pilih'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {transformFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-start gap-2.5 ${
                  transformFeedback.isCorrect
                    ? 'bg-emerald-950/60 border-emerald-600/60 text-emerald-200'
                    : 'bg-rose-950/60 border-rose-600/60 text-rose-200'
                }`}
              >
                {transformFeedback.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{transformFeedback.text}</span>
              </div>
            )}

            {/* Proceed to Summary */}
            {transformFeedback?.isCorrect && (
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleNextPhase('summary')}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <span>Lihat Hasil & Perlengkapan Senjata</span>
                  <ArrowRight className="w-4 h-4" />
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
                Pemeriksaan QUEST Selesai
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Hasil Gerbang Keputusan Digital
              </h2>
            </div>

            {/* Score & Accuracy Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Total Skor</div>
                <div className="text-2xl font-black text-emerald-400">
                  {scores.total} <span className="text-xs text-slate-400 font-normal">/ 120</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Akurasi Nalar</div>
                <div className="text-2xl font-black text-teal-300">
                  {accuracyPercent}%
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Syarat Misi</div>
                <div className={`text-2xl font-black ${isUnlockedToMission ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUnlockedToMission ? 'LOLOS' : 'BELUM'}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">Tier Senjata</div>
                <div className="text-xl font-black text-amber-400 uppercase">
                  {weaponLoadout.tier}
                </div>
              </div>
            </div>

            {/* Breakdown of 5 Phases */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wide">
                Rincian Skor Per Fase:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Query</div>
                  <div className="font-black text-emerald-400">{scores.query} / 25</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Uncover</div>
                  <div className="font-black text-emerald-400">{scores.uncover} / 25</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Examine</div>
                  <div className="font-black text-sky-400">{scores.examine} / 30</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Safeguard</div>
                  <div className="font-black text-purple-400">{scores.safeguard} / 20</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-slate-400">Transform</div>
                  <div className="font-black text-amber-400">{scores.transform} / 20</div>
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
                    className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
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
    </div>
  );
};
