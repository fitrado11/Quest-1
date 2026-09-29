import { 
  BadgeItem, 
  CombatData, 
  DigitalAdabScores, 
  LeaderboardEntry, 
  MissionLog, 
  PlayerStats, 
  QUESTScores, 
  WeaponLoadout, 
  XPEarned 
} from '../types';

const STORAGE_KEYS = {
  PLAYER_STATS: 'quest_player_stats_v1',
  MISSION_LOGS: 'quest_mission_logs_v1',
  LEADERBOARD: 'quest_leaderboard_v1',
  UNLOCKED_MISSIONS: 'quest_unlocked_missions_v1',
  UNLOCKED_PUZZLES: 'quest_unlocked_puzzles_v1',
  SETTINGS: 'quest_settings_v1',
};

export const BADGES_CATALOG: BadgeItem[] = [
  {
    id: 'first_glitch_neutralized',
    name: 'Penakluk Glitch Pertama',
    description: 'Berhasil menyelesaikan misi platformer pertama dan menonaktifkan halusinasi AI.',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '2026-03-01',
  },
  {
    id: 'wara_integrity',
    name: 'Penjaga Integritas (Wara\')',
    description: 'Menjaga kerahasiaan data pribadi sekolah dan menolak menyebarkan klaim meragukan.',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: '2026-03-02',
  },
  {
    id: 'qoul_master',
    name: 'Duta Tabayyun (Qoul Sadida)',
    description: 'Meraih skor Qoul di atas 90 dengan memeriksa sumber resmi sebelum berbicara di dunia maya.',
    icon: '📜',
    unlocked: false,
  },
  {
    id: 'muraqabah_master',
    name: 'Ksatria Muraqabah',
    description: 'Meraih skor Muraqabah di atas 90 dengan kendali diri dan akurasi tinggi saat krisis AI.',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'critical_thinker',
    name: 'Pakar Berpikir Kritis QUEST',
    description: 'Meraih skor gerbang QUEST di atas 110 poin pada skenario tingkat tinggi.',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'master_loadout',
    name: 'Pemilik Master Verification Blade',
    description: 'Membuka persenjataan tier Master tertinggi dengan akurasi nalar sempurna.',
    icon: '⚔️',
    unlocked: false,
  },
];

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  id: 'student_05',
  name: 'Digital Guardian #05',
  grade: 'Kelas 5',
  school: 'SD Lazuardi GCS Bogor',
  total_xp: 2500,
  accuracy_percent: 87,
  missions_completed: 1,
  rank: 3,
  best_scores: {
    'mission-1-1': 88,
  },
  badges: ['first_glitch_neutralized', 'wara_integrity'],
  digitalAdab: {
    wara: 88,
    qoul: 82,
    muraqabah: 85,
  },
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Ali Muhammad', xp: 3200, accuracy: 94 },
  { rank: 2, name: 'Siti Fatimah', xp: 3050, accuracy: 89 },
  { rank: 3, name: 'You (Player)', xp: 2500, accuracy: 87, is_player: true },
  { rank: 4, name: 'Budi Santoso', xp: 2400, accuracy: 85 },
  { rank: 5, name: 'Rina Kusuma', xp: 2200, accuracy: 82 },
];

export function getPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYER_STATS);
    if (!raw) {
      savePlayerStats(DEFAULT_PLAYER_STATS);
      return DEFAULT_PLAYER_STATS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PLAYER_STATS;
  }
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYER_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save player stats', e);
  }
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (!raw) {
      saveLeaderboard(INITIAL_LEADERBOARD);
      return INITIAL_LEADERBOARD;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboard(leaderboard: LeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export function getMissionLogs(): MissionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSION_LOGS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveMissionLog(log: MissionLog) {
  try {
    const current = getMissionLogs();
    const updated = [log, ...current];
    localStorage.setItem(STORAGE_KEYS.MISSION_LOGS, JSON.stringify(updated));

    // Also update player stats & leaderboard
    const stats = getPlayerStats();
    stats.total_xp += log.xp_earned.total;
    stats.missions_completed = Math.max(stats.missions_completed, current.length + 1);

    // Update best score
    const currentBest = stats.best_scores[log.mission_id] || 0;
    const thisAccuracy = Math.round((log.quest_scores.total / 120) * 100);
    if (thisAccuracy > currentBest) {
      stats.best_scores[log.mission_id] = thisAccuracy;
    }

    // Update overall accuracy average
    const allAccuracyValues = Object.values(stats.best_scores);
    if (allAccuracyValues.length > 0) {
      const sum = allAccuracyValues.reduce((a, b) => a + b, 0);
      stats.accuracy_percent = Math.round(sum / allAccuracyValues.length);
    }

    // Check badges
    if (log.digital_adab.wara >= 90 && !stats.badges.includes('wara_master')) {
      stats.badges.push('wara_master');
    }
    if (log.digital_adab.qoul >= 90 && !stats.badges.includes('qoul_master')) {
      stats.badges.push('qoul_master');
    }
    if (log.digital_adab.muraqabah >= 90 && !stats.badges.includes('muraqabah_master')) {
      stats.badges.push('muraqabah_master');
    }
    if (log.quest_scores.total >= 110 && !stats.badges.includes('critical_thinker')) {
      stats.badges.push('critical_thinker');
    }

    // Recalculate leaderboard
    const board = getLeaderboard().filter(entry => !entry.is_player);
    board.push({
      rank: 0,
      name: `${stats.name} (You)`,
      xp: stats.total_xp,
      accuracy: stats.accuracy_percent,
      is_player: true,
    });
    // Sort by XP descending, then accuracy
    board.sort((a, b) => b.xp - a.xp || b.accuracy - a.accuracy);
    const ranked = board.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    const playerEntry = ranked.find(r => r.is_player);
    if (playerEntry) {
      stats.rank = playerEntry.rank;
    }

    savePlayerStats(stats);
    saveLeaderboard(ranked);

    // Also mark next mission unlocked if passed
    if (log.status === 'PASS') {
      const unlocked = getUnlockedMissionIds();
      if (log.mission_id === 'mission-1-1' && !unlocked.includes('mission-1-2')) {
        unlocked.push('mission-1-2');
      } else if (log.mission_id === 'mission-1-2' && !unlocked.includes('mission-1-3')) {
        unlocked.push('mission-1-3');
      } else if (log.mission_id === 'mission-1-3' && !unlocked.includes('mission-1-4')) {
        unlocked.push('mission-1-4');
      } else if (log.mission_id === 'mission-1-4' && !unlocked.includes('mission-1-5')) {
        unlocked.push('mission-1-5');
      }
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_MISSIONS, JSON.stringify(unlocked));
    }
  } catch (e) {
    console.error('Failed to log mission', e);
  }
}

export function getUnlockedMissionIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_MISSIONS);
    if (!raw) {
      const initial = ['mission-1-1'];
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_MISSIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return ['mission-1-1'];
  }
}

export function getUnlockedPuzzleIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNLOCKED_PUZZLES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUnlockedPuzzleId(missionId: string): void {
  try {
    const current = getUnlockedPuzzleIds();
    if (!current.includes(missionId)) {
      current.push(missionId);
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_PUZZLES, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Failed to save unlocked puzzle id', e);
  }
}

export function getWeaponLoadout(questScore: number): WeaponLoadout {
  if (questScore >= 100) {
    return {
      tier: 'master',
      name: 'Master Verification Blade',
      description: 'Pedang Verifikasi Tertinggi: Kristal data kuat, 40 Peluru Verifikasi, +50 HP, kecepatan lari ekstra & lompatan ganda!',
      damageMultiplier: 2.0,
      baseDamage: 45,
      maxAmmo: 40,
      bonusHealth: 50,
      hasSpeedBoost: true,
      hasDoubleJump: true,
    };
  } else if (questScore >= 80) {
    return {
      tier: 'enhanced',
      name: 'Enhanced Tabayyun Saber',
      description: 'Pedang Tabayyun Unggul: Berkas cahaya tajam, 28 Peluru Verifikasi, HP normal (100 HP), kemampuan lompatan ganda.',
      damageMultiplier: 1.5,
      baseDamage: 30,
      maxAmmo: 28,
      bonusHealth: 0,
      hasSpeedBoost: false,
      hasDoubleJump: true,
    };
  } else if (questScore >= 60) {
    return {
      tier: 'standard',
      name: 'Standard Integrity Wand',
      description: 'Tongkat Integritas Standar: Berkas verifikasi dasar, 18 Peluru Verifikasi, HP 80/100, bidik musuh dengan hati-hati!',
      damageMultiplier: 1.0,
      baseDamage: 20,
      maxAmmo: 18,
      bonusHealth: -20,
      hasSpeedBoost: false,
      hasDoubleJump: false,
    };
  } else {
    return {
      tier: 'starter',
      name: 'Starter Training Rod',
      description: 'Tongkat Latihan Pemula: Hanya 8 Peluru, daya serap lemah, butuh mengulang QUEST Gate untuk poin senjata!',
      damageMultiplier: 0.6,
      baseDamage: 10,
      maxAmmo: 8,
      bonusHealth: -50,
      hasSpeedBoost: false,
      hasDoubleJump: false,
    };
  }
}

export function calculateDigitalAdab(questScores: QUESTScores, combatAccuracy: number): {
  wara: number;
  qoul: number;
  muraqabah: number;
} {
  // Wara' (Integrity & honesty in data + privacy): heavily driven by Query + Safeguard
  const wara = Math.min(100, Math.round(((questScores.query / 25) * 0.4 + (questScores.safeguard / 20) * 0.6) * 100));

  // Qoul (Thoughtful communication, verifying before sharing): driven by Uncover + Examine
  const qoul = Math.min(100, Math.round(((questScores.uncover / 25) * 0.4 + (questScores.examine / 30) * 0.6) * 100));

  // Muraqabah (Self-regulation, deliberate action): driven by Transform + Combat accuracy
  const muraqabah = Math.min(100, Math.round(((questScores.transform / 20) * 0.5 + (combatAccuracy / 100) * 0.5) * 100));

  return { wara, qoul, muraqabah };
}

export function exportLogsAsJSON(): string {
  const logs = getMissionLogs();
  return JSON.stringify(logs, null, 2);
}

export function exportLogsAsCSV(): string {
  const logs = getMissionLogs();
  if (logs.length === 0) return 'No logs found';

  const headers = [
    'Timestamp',
    'Player ID',
    'Mission ID',
    'Mission Name',
    'Query Score (0-25)',
    'Uncover Score (0-25)',
    'Examine Score (0-30)',
    'Safeguard Score (0-20)',
    'Transform Score (0-20)',
    'Total QUEST (0-120)',
    'Weapon Tier',
    'Combat Time (s)',
    'Hits Landed',
    'Projectiles Dodged',
    'Combat Accuracy %',
    'Total XP',
    'Wara Score',
    'Qoul Score',
    'Muraqabah Score',
    'Status',
  ];

  const rows = logs.map(l => [
    `"${l.timestamp}"`,
    `"${l.player_id}"`,
    `"${l.mission_id}"`,
    `"${l.mission_name}"`,
    l.quest_scores.query,
    l.quest_scores.uncover,
    l.quest_scores.examine,
    l.quest_scores.safeguard,
    l.quest_scores.transform,
    l.quest_scores.total,
    `"${l.weapon_tier}"`,
    l.combat_data.mission_time_seconds,
    l.combat_data.hits_landed,
    l.combat_data.projectiles_dodged,
    l.combat_data.accuracy_percent,
    l.xp_earned.total,
    l.digital_adab.wara,
    l.digital_adab.qoul,
    l.digital_adab.muraqabah,
    `"${l.status}"`,
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function getPlayerBadgeItems(playerBadges: string[]): BadgeItem[] {
  return BADGES_CATALOG.map(badge => ({
    ...badge,
    unlocked: playerBadges.includes(badge.id),
  }));
}

export function recordMissionRun(params: {
  missionId: string;
  missionName: string;
  questScores: QUESTScores;
  combatData: CombatData;
  puzzlesSolvedCount: number;
  totalPuzzles: number;
}): {
  xpEarned: XPEarned;
  digitalAdab: DigitalAdabScores;
  newRank: number;
  isNewBest: boolean;
} {
  const questBaseXP = params.questScores.total * 2;
  const combatBonusXP = Math.round(params.combatData.accuracy_percent * 0.8) + (params.combatData.player_health_final > 50 ? 50 : 20);
  const puzzleBonusXP = params.puzzlesSolvedCount * 40;
  const totalXP = questBaseXP + combatBonusXP + puzzleBonusXP;

  const xpEarned: XPEarned = {
    quest_base: questBaseXP,
    combat_bonus: combatBonusXP,
    puzzle_bonus: puzzleBonusXP,
    total: totalXP,
  };

  const digitalAdab = calculateDigitalAdab(params.questScores, params.combatData.accuracy_percent);
  const loadout = getWeaponLoadout(params.questScores.total);
  const isPassed = params.questScores.total >= 60 && params.combatData.player_health_final > 0;

  const stats = getPlayerStats();
  const currentBest = stats.best_scores[params.missionId] || 0;
  const currentAccuracy = Math.round((params.questScores.total / 120) * 100);
  const isNewBest = currentAccuracy > currentBest;

  const missionLog: MissionLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    mission_id: params.missionId,
    mission_name: params.missionName,
    player_id: stats.id,
    timestamp: new Date().toISOString(),
    quest_scores: params.questScores,
    combat_data: params.combatData,
    xp_earned: xpEarned,
    digital_adab: digitalAdab,
    weapon_tier: loadout.tier,
    status: isPassed ? 'PASS' : 'FAIL',
    is_best_score: isNewBest,
    leaderboard_rank: stats.rank,
  };

  // Update cumulative player digital adab
  stats.digitalAdab = {
    wara: Math.round((stats.digitalAdab.wara * 0.7) + (digitalAdab.wara * 0.3)),
    qoul: Math.round((stats.digitalAdab.qoul * 0.7) + (digitalAdab.qoul * 0.3)),
    muraqabah: Math.round((stats.digitalAdab.muraqabah * 0.7) + (digitalAdab.muraqabah * 0.3)),
  };
  savePlayerStats(stats);

  // Save log and update stats
  saveMissionLog(missionLog);

  const updatedStats = getPlayerStats();
  return {
    xpEarned,
    digitalAdab,
    newRank: updatedStats.rank,
    isNewBest,
  };
}

export function resetAllData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PLAYER_STATS);
    localStorage.removeItem(STORAGE_KEYS.MISSION_LOGS);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.UNLOCKED_MISSIONS);
  } catch (e) {
    console.error('Failed to reset data', e);
  }
}

