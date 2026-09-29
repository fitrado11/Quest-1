import React from 'react';
import { Award, CheckCircle, Lock, Trophy, X } from 'lucide-react';
import { BadgeItem } from '../types';
import { audio } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeItem[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, badges }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="font-extrabold text-base sm:text-lg text-white">
              Lencana & Prestasi Digital Adab
            </h2>
          </div>
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-5 overflow-y-auto space-y-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition flex items-center gap-4 ${
                badge.unlocked
                  ? 'bg-slate-800/80 border-amber-500/40 text-slate-100 shadow-md'
                  : 'bg-slate-950/50 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-3xl shrink-0 p-2 rounded-2xl bg-slate-900 border border-slate-700/60 flex items-center justify-center">
                {badge.icon}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className={`font-black text-sm ${badge.unlocked ? 'text-amber-300' : 'text-slate-400'}`}>
                    {badge.name}
                  </h3>
                  {badge.unlocked ? (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Terkunci
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {badge.description}
                </p>
                {badge.unlockedAt && (
                  <div className="text-[10px] text-slate-500">
                    Diraih pada: {new Date(badge.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-right">
          <button
            onClick={() => { audio.playClick(); onClose(); }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
