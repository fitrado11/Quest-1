export type GameView = 
  | 'hub' 
  | 'quest_gate' 
  | 'side_scroll' 
  | 'results' 
  | 'thesis_logs' 
  | 'achievements';

export type Language = 'id' | 'en';

export interface QUESTScores {
  query: number;       // 0-25
  uncover: number;     // 0-25
  examine: number;     // 0-30
  safeguard: number;   // 0-20
  transform: number;   // 0-20
  total: number;       // 0-120
}

export interface WeaponLoadout {
  tier: 'starter' | 'standard' | 'enhanced' | 'master';
  name: string;
  description: string;
  damageMultiplier: number;
  baseDamage: number;
  maxAmmo: number;
  bonusHealth: number;
  hasSpeedBoost: boolean;
  hasDoubleJump: boolean;
}

export interface CombatData {
  mission_time_seconds: number;
  player_health_final: number;
  boss_health_final: number;
  projectiles_dodged: number;
  hits_landed: number;
  accuracy_percent: number;
}

export interface XPEarned {
  quest_base: number;
  combat_bonus: number;
  puzzle_bonus: number;
  total: number;
}

export interface DigitalAdabScores {
  wara: number;       // Integrity (0-100)
  qoul: number;       // Thoughtful communication (0-100)
  muraqabah: number;  // Self-regulation & awareness (0-100)
}

export interface MissionLog {
  id: string;
  mission_id: string;
  mission_name: string;
  player_id: string;
  timestamp: string;
  quest_scores: QUESTScores;
  combat_data: CombatData;
  xp_earned: XPEarned;
  digital_adab: DigitalAdabScores;
  weapon_tier: string;
  status: 'PASS' | 'FAIL';
  is_best_score: boolean;
  leaderboard_rank: number;
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  grade: string;
  school: string;
  total_xp: number;
  accuracy_percent: number;
  missions_completed: number;
  rank: number;
  best_scores: Record<string, number>; // mission_id -> percentage
  badges: string[];
  digitalAdab: DigitalAdabScores;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  accuracy: number;
  is_player?: boolean;
}

// QUEST Gate Content Definitions
export interface QueryPhaseData {
  npcSpeaker: string;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}

export interface UncoverPhaseData {
  prompt: string;
  cards: {
    id: string;
    title: string;
    text: string;
    isSuspicious: boolean;
    explanation: string;
  }[];
  hint: string;
}

export interface ExaminePhaseData {
  prompt: string;
  sources: {
    id: string;
    title: string;
    type: string;
    icon: string;
    description: string;
    isMostReliable: boolean;
    explanation: string;
  }[];
  hint: string;
}

export interface SafeguardPhaseData {
  prompt: string;
  items: {
    id: string;
    statement: string;
    shouldBeEnabled: boolean;
    explanation: string;
  }[];
}

export interface TransformPhaseData {
  prompt: string;
  actions: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export interface InGamePuzzle {
  id: string;
  type: 'error_door' | 'source_bridge' | 'privacy_corridor';
  title: string;
  instruction: string;
  xPosition: number;
  solved: boolean;
  options?: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface BossConfig {
  name: string;
  title: string;
  maxHp: number;
  color: string;
  glitchLevel: number;
  phases: {
    phase: number;
    hpThreshold: number;
    projectileSpeed: number;
    spawnInterval: number; // in frames or ms
    textClues: string[];
  }[];
}

export interface UnlockPuzzleOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface UnlockPuzzle {
  phase: 'query' | 'uncover' | 'examine' | 'safeguard' | 'transform';
  title: string;
  conceptName: string;
  bloomLevel: string;
  islamicConcept: string;
  definition: string;
  scenario: string;
  question: string;
  options: UnlockPuzzleOption[];
  hint: string;
  successMessage: string;
}

export interface MissionDefinition {
  id: string;
  zoneId: number;
  zoneName: string;
  title: string;
  subtitle: string;
  difficulty: number; // 1-5
  bloomLevel: string;
  learningObjective: string;
  unlocked: boolean;
  unlockPuzzle: UnlockPuzzle;
  questData: {
    query: QueryPhaseData;
    uncover: UncoverPhaseData;
    examine: ExaminePhaseData;
    safeguard: SafeguardPhaseData;
    transform: TransformPhaseData;
  };
  inGamePuzzles: InGamePuzzle[];
  boss: BossConfig;
}
