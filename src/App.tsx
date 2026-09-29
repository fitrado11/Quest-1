/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CombatData, GameView, MissionDefinition, QUESTScores, WeaponLoadout, XPEarned } from './types';
import { ZONE_1_MISSIONS } from './data/missionsData';
import { audio } from './utils/audio';
import { 
  getLeaderboard,
  getPlayerBadgeItems,
  getPlayerStats, 
  getUnlockedMissionIds, 
  getWeaponLoadout, 
  recordMissionRun,
  resetAllData 
} from './utils/storage';

import { HubScreen } from './components/HubScreen';
import { QuestGate } from './components/QuestGate';
import { SideScrollGame } from './components/SideScrollGame';
import { ResultsScreen } from './components/ResultsScreen';
import { ThesisLogsModal } from './components/ThesisLogsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HelpStoryModal } from './components/HelpStoryModal';

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('hub');
  const [activeMission, setActiveMission] = useState<MissionDefinition>(ZONE_1_MISSIONS[0]);

  // Audio & Speed settings
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getIsMuted());
  const [gameSpeed, setGameSpeed] = useState<number>(1.0);

  // Player & Game State
  const [playerStats, setPlayerStats] = useState(() => getPlayerStats());
  const [leaderboard, setLeaderboard] = useState(() => getLeaderboard());
  const [unlockedMissionIds, setUnlockedMissionIds] = useState<string[]>(() => getUnlockedMissionIds());

  // Active Mission Session Data
  const [currentQuestScores, setCurrentQuestScores] = useState<QUESTScores>({
    query: 0,
    uncover: 0,
    examine: 0,
    safeguard: 0,
    transform: 0,
    total: 0,
  });

  const [currentWeaponLoadout, setCurrentWeaponLoadout] = useState<WeaponLoadout>(() => 
    getWeaponLoadout(0)
  );

  const [lastCombatData, setLastCombatData] = useState<CombatData>({
    mission_time_seconds: 60,
    player_health_final: 100,
    boss_health_final: 0,
    projectiles_dodged: 10,
    hits_landed: 15,
    accuracy_percent: 85,
  });

  const [lastXpEarned, setLastXpEarned] = useState<XPEarned>({
    quest_base: 100,
    combat_bonus: 50,
    puzzle_bonus: 30,
    total: 180,
  });

  const [lastPuzzlesCount, setLastPuzzlesCount] = useState<number>(3);
  const [lastLeaderboardRank, setLastLeaderboardRank] = useState<number>(3);
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Modals
  const [isThesisLogsOpen, setIsThesisLogsOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Toggle Mute
  const handleToggleMute = () => {
    const next = audio.toggleMute();
    setIsMuted(next);
  };

  // Change Speed
  const handleChangeGameSpeed = (speed: number) => {
    audio.playClick();
    setGameSpeed(speed);
  };

  // Reset Data handler
  const handleResetData = () => {
    if (window.confirm('Reset data penelitian dan mulai dari awal?')) {
      resetAllData();
      setPlayerStats(getPlayerStats());
      setLeaderboard(getLeaderboard());
      setUnlockedMissionIds(getUnlockedMissionIds());
      audio.playClick();
    }
  };

  // Start Mission -> Go to QUEST Gate first!
  const handleStartMission = (mission: MissionDefinition) => {
    audio.playClick();
    setActiveMission(mission);
    setCurrentView('quest_gate');
  };

  // QUEST Gate Completed
  const handleGateComplete = (scores: QUESTScores, loadout: WeaponLoadout) => {
    setCurrentQuestScores(scores);
    setCurrentWeaponLoadout(loadout);
    setCurrentView('side_scroll');
  };

  // Mission Platformer Action Completed
  const handleMissionComplete = (combatData: CombatData, puzzlesSolvedCount: number) => {
    setLastCombatData(combatData);
    setLastPuzzlesCount(puzzlesSolvedCount);

    // Record session to storage & calculate score
    const result = recordMissionRun({
      missionId: activeMission.id,
      missionName: activeMission.title,
      questScores: currentQuestScores,
      combatData,
      puzzlesSolvedCount,
      totalPuzzles: activeMission.inGamePuzzles.length,
    });

    setLastXpEarned(result.xpEarned);
    setLastLeaderboardRank(result.newRank);
    setIsNewBest(result.isNewBest);

    // Refresh player stats, leaderboard, and unlocked missions
    setPlayerStats(getPlayerStats());
    setLeaderboard(getLeaderboard());
    setUnlockedMissionIds(getUnlockedMissionIds());

    // Switch to results view
    setCurrentView('results');
  };

  // Navigate to Next Mission
  const handleNextMission = () => {
    const currentIndex = ZONE_1_MISSIONS.findIndex(m => m.id === activeMission.id);
    const nextMission = ZONE_1_MISSIONS[(currentIndex + 1) % ZONE_1_MISSIONS.length];
    handleStartMission(nextMission);
  };

  // Replay Current Mission
  const handleReplayMission = () => {
    handleStartMission(activeMission);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* VIEW: HUB SCREEN */}
      {currentView === 'hub' && (
        <HubScreen
          playerStats={playerStats}
          leaderboard={leaderboard}
          missions={ZONE_1_MISSIONS}
          unlockedMissionIds={unlockedMissionIds}
          isMuted={isMuted}
          gameSpeed={gameSpeed}
          onToggleMute={handleToggleMute}
          onSelectMission={handleStartMission}
          onOpenLogsModal={() => setIsThesisLogsOpen(true)}
          onOpenAchievementsModal={() => setIsAchievementsOpen(true)}
          onOpenHelpModal={() => setIsHelpOpen(true)}
          onOpenStoryModal={() => setIsHelpOpen(true)}
          onChangeGameSpeed={handleChangeGameSpeed}
          onResetData={handleResetData}
        />
      )}

      {/* VIEW: MANDATORY QUEST GATE */}
      {currentView === 'quest_gate' && (
        <QuestGate
          mission={activeMission}
          onGateComplete={handleGateComplete}
          onCancelToHub={() => setCurrentView('hub')}
        />
      )}

      {/* VIEW: SIDE-SCROLLING MISSION (PLATFORMER) */}
      {currentView === 'side_scroll' && (
        <SideScrollGame
          mission={activeMission}
          questScores={currentQuestScores}
          weaponLoadout={currentWeaponLoadout}
          gameSpeed={gameSpeed}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onMissionComplete={handleMissionComplete}
          onAbortMission={() => setCurrentView('hub')}
          onRetryQuestGate={() => setCurrentView('quest_gate')}
        />
      )}

      {/* VIEW: POST-MISSION RESULTS */}
      {currentView === 'results' && (
        <ResultsScreen
          mission={activeMission}
          questScores={currentQuestScores}
          weaponLoadout={currentWeaponLoadout}
          combatData={lastCombatData}
          xpEarned={lastXpEarned}
          digitalAdab={playerStats.digitalAdab}
          puzzlesSolvedCount={lastPuzzlesCount}
          leaderboardRank={lastLeaderboardRank}
          isNewBest={isNewBest}
          onNextMission={handleNextMission}
          onReplayMission={handleReplayMission}
          onReturnToHub={() => setCurrentView('hub')}
          onViewThesisLogs={() => setIsThesisLogsOpen(true)}
        />
      )}

      {/* MODALS */}
      <ThesisLogsModal
        isOpen={isThesisLogsOpen}
        onClose={() => setIsThesisLogsOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        badges={getPlayerBadgeItems(playerStats.badges)}
      />

      <HelpStoryModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
