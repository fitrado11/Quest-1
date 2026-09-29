import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Key, 
  RotateCcw, 
  Sparkles, 
  X 
} from 'lucide-react';
import { MissionDefinition } from '../types';
import { audio } from '../utils/audio';
import { saveUnlockedPuzzleId } from '../utils/storage';

interface UnlockPuzzleModalProps {
  mission: MissionDefinition;
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (missionId: string) => void;
}

export const UnlockPuzzleModal: React.FC<UnlockPuzzleModalProps> = ({
  mission,
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [attempts, setAttempts] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  if (!isOpen) return null;

  const puzzle = mission.unlockPuzzle;

  const handleSelectOption = (optionId: string) => {
    if (isUnlocked) return;

    setSelectedOptionId(optionId);
    const option = puzzle.options.find(o => o.id === optionId);
    if (!option) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (option.isCorrect) {
      audio.playCorrect();
      setIsUnlocked(true);
      setFeedback({
        isCorrect: true,
        text: option.explanation,
      });
      saveUnlockedPuzzleId(mission.id);
    } else {
      audio.playWrong();
      setFeedback({
        isCorrect: false,
        text: option.explanation,
      });
      if (newAttempts >= 1) {
        setShowHint(true);
      }
    }
  };

  const handleReset = () => {
    audio.playClick();
    setSelectedOptionId(null);
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl space-y-5 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-lg flex items-center justify-center text-white shrink-0">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Uji Buka Level: {mission.title.split(':')[0]}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {puzzle.bloomLevel}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {puzzle.conceptName}
              </h3>
            </div>
          </div>

          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Concept Card with Islamic Digital Adab Connection */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-400 font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Pilar Digital Adab: {puzzle.islamicConcept}
            </span>
            <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              Teori QUEST
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {puzzle.definition}
          </p>
        </div>

        {/* Scenario Box */}
        <div className="space-y-1.5">
          <div className="text-xs uppercase font-extrabold text-teal-400 tracking-wider">
            Skenario Nyata:
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
            {puzzle.scenario}
          </div>
        </div>

        {/* Question & Options */}
        <div className="space-y-2.5">
          <div className="text-xs sm:text-sm font-black text-white">
            {puzzle.question}
          </div>

          <div className="space-y-2">
            {puzzle.options.map(opt => {
              const isSelected = selectedOptionId === opt.id;
              let styleClass = 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-emerald-500/60 hover:bg-slate-800';

              if (isSelected) {
                if (opt.isCorrect) {
                  styleClass = 'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/40 shadow-lg';
                } else {
                  styleClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isUnlocked}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-3 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition flex items-start gap-2.5 cursor-pointer ${styleClass}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                    {opt.id.replace('opt_', '').toUpperCase()}
                  </span>
                  <span className="flex-1 leading-snug">{opt.text}</span>
                  {isSelected && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed flex items-start gap-2.5 ${
              feedback.isCorrect
                ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200'
                : 'bg-rose-950/90 border-rose-500/80 text-rose-200'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{feedback.text}</div>
          </div>
        )}

        {/* Educational Hint if failed once */}
        {!isUnlocked && showHint && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Petunjuk Nalar:</strong> {puzzle.hint}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {!isUnlocked ? (
            <>
              {feedback && !feedback.isCorrect ? (
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Coba Lagi</span>
                </button>
              ) : (
                <div className="text-[11px] text-slate-400">
                  Pilihlah jawaban paling berdasar untuk membuka level.
                </div>
              )}

              <button
                onClick={() => { audio.playClick(); onClose(); }}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold"
              >
                Batal
              </button>
            </>
          ) : (
            <button
              id="btn-proceed-after-unlock"
              onClick={() => {
                audio.playClick();
                onUnlockSuccess(mission.id);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/70 transition cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>LEVEL TERBUKA! MASUKI GERBANG QUEST →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
