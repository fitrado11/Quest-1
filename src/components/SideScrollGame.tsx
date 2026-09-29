import React, { useEffect, useRef, useState } from 'react';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Award,
  CheckCircle2,
  Compass,
  Heart, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles,
  Swords, 
  Volume2, 
  VolumeX, 
  X, 
  Zap 
} from 'lucide-react';
import { CombatData, InGamePuzzle, MissionDefinition, QUESTScores, WeaponLoadout } from '../types';
import { audio } from '../utils/audio';

interface SideScrollGameProps {
  mission: MissionDefinition;
  questScores: QUESTScores;
  weaponLoadout: WeaponLoadout;
  gameSpeed: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onMissionComplete: (combatData: CombatData, puzzlesSolvedCount: number) => void;
  onAbortMission: () => void;
  onRetryQuestGate?: () => void;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isPlayer: boolean;
  damage: number;
  text?: string;
  piercing?: boolean;
  homing?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'floating' | 'bridge' | 'moving';
  label?: string;
  minY?: number;
  maxY?: number;
  vy?: number;
}

interface PatrolEnemy {
  id: string;
  name: string;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  vx: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  facing: 'left' | 'right';
  shootCooldown: number;
  shootInterval: number;
  color: string;
  emoji: string;
  isAlive: boolean;
}

export type GameOverReason = 'fell' | 'hp_zero' | 'out_of_ammo';

export interface InGameWeaponUpgrade {
  id: 'rapid' | 'spread' | 'heavy' | 'homing';
  name: string;
  badge: string;
  icon: string;
  description: string;
  ammoBonus: number;
  hpRestore: number;
  damageMultiplier: number;
  bulletColor: string;
  bulletLabel: string;
}

export const WEAPON_UPGRADES: InGameWeaponUpgrade[] = [
  {
    id: 'rapid',
    name: 'Laser Verifikasi Kilat (Rapid Precision Beam)',
    badge: 'TEMBAKAN KILAT',
    icon: '⚡',
    description: 'Tembakan laser super cepat beruntun tanpa jeda, laju proyektil +50%, menembus pertahanan musuh seketika!',
    ammoBonus: 25,
    hpRestore: 25,
    damageMultiplier: 1.3,
    bulletColor: '#06b6d4',
    bulletLabel: 'KILAT',
  },
  {
    id: 'spread',
    name: 'Meriam Tabayyun Sebar (Tri-Spread Burst)',
    badge: '3 ARAH SEBAR',
    icon: '💥',
    description: 'Menembakkan 3 proyektil sekaligus menyebar luas, sangat efektif melumpuhkan kelompok hoaks & proyektil lawan!',
    ammoBonus: 22,
    hpRestore: 25,
    damageMultiplier: 1.0,
    bulletColor: '#c084fc',
    bulletLabel: 'SEBAR',
  },
  {
    id: 'heavy',
    name: 'Buster Integritas Raksasa (Heavy Buster)',
    badge: 'PENEMBUS AREA',
    icon: '🛡️',
    description: 'Meriam plasma raksasa berdaya hancur tinggi yang menembus banyak musuh sekaligus dan memulihkan HP!',
    ammoBonus: 18,
    hpRestore: 45,
    damageMultiplier: 2.2,
    bulletColor: '#f59e0b',
    bulletLabel: 'BUSTER',
  },
  {
    id: 'homing',
    name: 'Kristal Homing Data (Auto-Seeker)',
    badge: 'PELACAK OTOMATIS',
    icon: '🌟',
    description: 'Peluru pintar berteknologi pelacak yang otomatis membelok mengejar posisi musuh atau boss di mana pun berada!',
    ammoBonus: 20,
    hpRestore: 30,
    damageMultiplier: 1.25,
    bulletColor: '#10b981',
    bulletLabel: 'SEEKER',
  },
];

export const SideScrollGame: React.FC<SideScrollGameProps> = ({
  mission,
  questScores,
  weaponLoadout,
  gameSpeed,
  isMuted,
  onToggleMute,
  onMissionComplete,
  onAbortMission,
  onRetryQuestGate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial stats
  const initialMaxHp = 100 + weaponLoadout.bonusHealth;
  const [playerHp, setPlayerHp] = useState<number>(initialMaxHp);
  const [bossHp, setBossHp] = useState<number>(mission.boss.maxHp);
  const [ammo, setAmmo] = useState<number>(weaponLoadout.maxAmmo);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState<string[]>([]);
  const [activePuzzle, setActivePuzzle] = useState<InGamePuzzle | null>(null);

  // In-Game Weapon Upgrades picked during play
  const [equippedUpgrade, setEquippedUpgrade] = useState<InGameWeaponUpgrade | null>(null);
  const [weaponRewardModal, setWeaponRewardModal] = useState<boolean>(false);
  const [rewardNotice, setRewardNotice] = useState<string | null>(null);

  // Failure modal state
  const [gameOverReason, setGameOverReason] = useState<GameOverReason | null>(null);

  // Handlers for retry & retake
  const handleRetakeQuiz = () => {
    audio.playClick();
    setGameOverReason(null);
    if (onRetryQuestGate) {
      onRetryQuestGate();
    } else {
      onAbortMission();
    }
  };

  const handleRestartStage = () => {
    audio.playClick();
    const state = gameStateRef.current;
    state.isGameOver = false;
    state.isVictory = false;
    state.player.x = 80;
    state.player.y = 350;
    state.player.vx = 0;
    state.player.vy = 0;
    state.player.health = initialMaxHp;
    state.player.isGrounded = false;
    state.player.invulnerableFrames = 0;
    state.player.jumpsRemaining = weaponLoadout.hasDoubleJump ? 2 : 1;
    state.ammo = weaponLoadout.maxAmmo;
    state.checkpointX = 80;
    state.cameraX = 0;
    state.projectiles = [];
    state.particles = [];
    state.boss.hp = mission.boss.maxHp;
    state.boss.phase = 1;
    state.boss.spawnTimer = 0;
    state.boss.x = 6600;
    state.boss.y = 260;
    state.startTime = Date.now();
    state.hitsLanded = 0;
    state.projectilesFired = 0;
    state.projectilesDodged = 0;

    // Reset 10 patrol enemies
    state.enemies.forEach((enemy, idx) => {
      enemy.isAlive = true;
      enemy.hp = enemy.maxHp;
      enemy.x = enemy.minX + 30;
      enemy.facing = 'left';
      enemy.shootCooldown = idx * 25;
    });

    // Reset puzzles
    state.puzzles.forEach(p => {
      p.solved = false;
    });
    state.bridgeRaised = false;

    setPlayerHp(initialMaxHp);
    setBossHp(mission.boss.maxHp);
    setAmmo(weaponLoadout.maxAmmo);
    setSolvedPuzzleIds([]);
    setGameOverReason(null);
    setEquippedUpgrade(null);
  };

  // Re-space in-game puzzles across the 7200px stage
  const distributedPuzzles: InGamePuzzle[] = mission.inGamePuzzles.map((p, idx) => {
    let xPos = 1150;
    if (idx === 1) xPos = 2650;
    if (idx === 2) xPos = 4400;
    if (idx >= 3) xPos = 5500;
    return {
      ...p,
      xPosition: xPos,
    };
  });

  // Keep ref for state accessed inside animation frame
  const gameStateRef = useRef({
    player: {
      x: 80,
      y: 350,
      vx: 0,
      vy: 0,
      width: 28,
      height: 42,
      isGrounded: false,
      jumpsRemaining: weaponLoadout.hasDoubleJump ? 2 : 1,
      health: initialMaxHp,
      maxHealth: initialMaxHp,
      facing: 'right' as 'right' | 'left',
      invulnerableFrames: 0,
    },
    ammo: weaponLoadout.maxAmmo,
    maxAmmo: weaponLoadout.maxAmmo,
    cameraX: 0,
    boss: {
      x: 6600,
      y: 260,
      vx: 0,
      vy: 1.5,
      width: 72,
      height: 72,
      hp: mission.boss.maxHp,
      maxHp: mission.boss.maxHp,
      phase: 1,
      spawnTimer: 0,
      glitchOffset: 0,
    },
    // 10 Moving & shooting patrol minions along the 7200px 3x stage
    enemies: [
      // Sector 1: Cyber Hub & Gateway (0 - 1500m)
      {
        id: 'drone-1',
        name: 'Drone Halusinasi AI',
        x: 420,
        y: 382,
        minX: 250,
        maxX: 600,
        vx: 1.1,
        width: 32,
        height: 32,
        hp: 30,
        maxHp: 30,
        facing: 'right' as const,
        shootCooldown: 0,
        shootInterval: 140,
        color: '#ec4899',
        emoji: '🛸',
        isAlive: true,
      },
      {
        id: 'spambot-1b',
        name: 'Bot Hoaks Viral',
        x: 1000,
        y: 382,
        minX: 850,
        maxX: 1150,
        vx: 1.2,
        width: 30,
        height: 36,
        hp: 35,
        maxHp: 35,
        facing: 'left' as const,
        shootCooldown: 50,
        shootInterval: 150,
        color: '#a855f7',
        emoji: '🤖',
        isAlive: true,
      },
      // Sector 2: Laser Canyon & Chasm (1500 - 3000m)
      {
        id: 'glitchbug-2',
        name: 'Bug Distorsi Data',
        x: 1850,
        y: 382,
        minX: 1720,
        maxX: 2100,
        vx: 1.3,
        width: 32,
        height: 32,
        hp: 40,
        maxHp: 40,
        facing: 'right' as const,
        shootCooldown: 30,
        shootInterval: 130,
        color: '#f43f5e',
        emoji: '👾',
        isAlive: true,
      },
      {
        id: 'drone-2b',
        name: 'Drone Pengabur Konteks',
        x: 2500,
        y: 382,
        minX: 2350,
        maxX: 2600,
        vx: 1.4,
        width: 34,
        height: 34,
        hp: 45,
        maxHp: 45,
        facing: 'left' as const,
        shootCooldown: 20,
        shootInterval: 120,
        color: '#e11d48',
        emoji: '🛰️',
        isAlive: true,
      },
      // Sector 3: Floating Island Archives (3000 - 4500m)
      {
        id: 'sentinel-3',
        name: 'Sentinel Clickbait',
        x: 3350,
        y: 382,
        minX: 3200,
        maxX: 3600,
        vx: 1.5,
        width: 34,
        height: 34,
        hp: 48,
        maxHp: 48,
        facing: 'right' as const,
        shootCooldown: 40,
        shootInterval: 120,
        color: '#fb923c',
        emoji: '🛸',
        isAlive: true,
      },
      {
        id: 'spambot-3b',
        name: 'Bot Disinformasi Terkoordinasi',
        x: 4100,
        y: 382,
        minX: 3950,
        maxX: 4350,
        vx: 1.3,
        width: 32,
        height: 36,
        hp: 50,
        maxHp: 50,
        facing: 'left' as const,
        shootCooldown: 60,
        shootInterval: 110,
        color: '#c084fc',
        emoji: '🤖',
        isAlive: true,
      },
      // Sector 4: Firewall Corridor & Overdrive (4500 - 6000m)
      {
        id: 'glitchtitan-4',
        name: 'Elite Distorsi Algoritma',
        x: 4850,
        y: 382,
        minX: 4700,
        maxX: 5150,
        vx: 1.6,
        width: 38,
        height: 38,
        hp: 60,
        maxHp: 60,
        facing: 'right' as const,
        shootCooldown: 10,
        shootInterval: 100,
        color: '#e11d48',
        emoji: '👾',
        isAlive: true,
      },
      {
        id: 'sentinel-4b',
        name: 'Pengawal Firewall Palsu',
        x: 5650,
        y: 382,
        minX: 5500,
        maxX: 5900,
        vx: 1.5,
        width: 36,
        height: 36,
        hp: 65,
        maxHp: 65,
        facing: 'left' as const,
        shootCooldown: 30,
        shootInterval: 95,
        color: '#f43f5e',
        emoji: '🛰️',
        isAlive: true,
      },
      // Sector 5: Mega Boss Arena Minions (6000 - 7200m)
      {
        id: 'guard-5a',
        name: 'Minion Penjaga Inti A',
        x: 6180,
        y: 382,
        minX: 6100,
        maxX: 6350,
        vx: 1.4,
        width: 32,
        height: 32,
        hp: 45,
        maxHp: 45,
        facing: 'right' as const,
        shootCooldown: 25,
        shootInterval: 90,
        color: '#ec4899',
        emoji: '🛸',
        isAlive: true,
      },
      {
        id: 'guard-5b',
        name: 'Minion Penjaga Inti B',
        x: 6850,
        y: 382,
        minX: 6700,
        maxX: 7050,
        vx: 1.4,
        width: 32,
        height: 32,
        hp: 45,
        maxHp: 45,
        facing: 'left' as const,
        shootCooldown: 40,
        shootInterval: 90,
        color: '#a855f7',
        emoji: '🤖',
        isAlive: true,
      },
    ] as PatrolEnemy[],
    projectiles: [] as Projectile[],
    particles: [] as Particle[],
    keys: {
      left: false,
      right: false,
      jump: false,
      attack: false,
      interact: false,
    },
    lastAttackTime: 0,
    checkpointX: 80,
    puzzles: distributedPuzzles,
    isGameOver: false,
    isVictory: false,
    levelLength: 7200, // 3x EXPANDED STAGE LENGTH
    hitsLanded: 0,
    projectilesFired: 0,
    projectilesDodged: 0,
    startTime: Date.now(),
    bridgeRaised: false,
    laserFlickerTimer: 0,
    equippedUpgradeRef: null as InGameWeaponUpgrade | null,
  });

  // Keep ref synchronized
  useEffect(() => {
    gameStateRef.current.equippedUpgradeRef = equippedUpgrade;
  }, [equippedUpgrade]);

  // Touch controls state
  const touchStateRef = useRef({
    left: false,
    right: false,
  });

  // Open active puzzle handler
  const handleOpenPuzzle = (puzzle: InGamePuzzle) => {
    audio.playClick();
    setActivePuzzle(puzzle);
  };

  // Solve puzzle from modal
  const handleSelectPuzzleOption = (optionId: string) => {
    if (!activePuzzle) return;
    const option = activePuzzle.options?.find(o => o.id === optionId);
    if (!option) return;

    if (option.isCorrect) {
      audio.playCorrect();
      const updated = [...solvedPuzzleIds, activePuzzle.id];
      setSolvedPuzzleIds(updated);

      if (activePuzzle.type === 'source_bridge') {
        gameStateRef.current.bridgeRaised = true;
      }

      const pIndex = gameStateRef.current.puzzles.findIndex(p => p.id === activePuzzle.id);
      if (pIndex !== -1) {
        gameStateRef.current.puzzles[pIndex].solved = true;
      }

      // Close puzzle modal and open Weapon Reward Choice Modal!
      setTimeout(() => {
        setActivePuzzle(null);
        setWeaponRewardModal(true);
      }, 500);
    } else {
      audio.playWrong();
      gameStateRef.current.player.health = Math.max(10, gameStateRef.current.player.health - 15);
      setPlayerHp(gameStateRef.current.player.health);
    }
  };

  // Weapon Upgrade Selection Handler
  const handleSelectWeaponUpgrade = (upgrade: InGameWeaponUpgrade) => {
    audio.playPowerUp();
    setEquippedUpgrade(upgrade);

    const state = gameStateRef.current;
    state.equippedUpgradeRef = upgrade;

    // Refill ammo & add bonus
    state.ammo = Math.min(weaponLoadout.maxAmmo + 40, state.ammo + upgrade.ammoBonus);
    setAmmo(state.ammo);

    // Restore player HP
    state.player.health = Math.min(initialMaxHp, state.player.health + upgrade.hpRestore);
    setPlayerHp(state.player.health);

    setWeaponRewardModal(false);
    setRewardNotice(`⚡ Senjata Ditingkatkan: ${upgrade.name}! (+${upgrade.ammoBonus} Peluru & +${upgrade.hpRestore} HP)`);

    setTimeout(() => {
      setRewardNotice(null);
    }, 4000);
  };

  // Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePuzzle || weaponRewardModal || gameOverReason !== null) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        triggerJump();
      }
      if (e.key === 'j' || e.key === 'J' || e.key === 'x' || e.key === 'X') {
        triggerAttack();
      }
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        triggerInteract();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.keys.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activePuzzle, weaponRewardModal, gameOverReason]);

  const triggerJump = () => {
    const state = gameStateRef.current;
    if (state.isGameOver || state.isVictory) return;

    if (state.player.jumpsRemaining > 0) {
      audio.playJump();
      state.player.vy = -10.5;
      state.player.isGrounded = false;
      state.player.jumpsRemaining -= 1;

      // Dust particles
      for (let i = 0; i < 5; i++) {
        state.particles.push({
          x: state.player.x + state.player.width / 2,
          y: state.player.y + state.player.height,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * -1.5,
          life: 0,
          maxLife: 15,
          color: '#6ee7b7',
          size: 3,
        });
      }
    }
  };

  const triggerAttack = () => {
    const state = gameStateRef.current;
    if (state.isGameOver || state.isVictory) return;

    const currentUpgrade = state.equippedUpgradeRef;
    const attackCooldown = currentUpgrade?.id === 'rapid' ? 120 : 220;

    const now = Date.now();
    if (now - state.lastAttackTime < attackCooldown) return;
    state.lastAttackTime = now;

    // Check Ammo Limit
    if (state.ammo <= 0) {
      audio.playWrong();
      const playerProjectilesRemaining = state.projectiles.filter(p => p.isPlayer).length;
      const hasRemainingTargets = state.boss.hp > 0 || state.enemies.some(e => e.isAlive);
      if (playerProjectilesRemaining === 0 && hasRemainingTargets && !state.isGameOver && !state.isVictory) {
        state.isGameOver = true;
        audio.playGameOver();
        setGameOverReason('out_of_ammo');
      }
      return;
    }

    // Deduct 1 ammo
    state.ammo -= 1;
    setAmmo(state.ammo);

    audio.playLaser();
    state.projectilesFired += 1;

    const dir = state.player.facing === 'right' ? 1 : -1;
    const accuracyBonus = Math.round((questScores.total / 120) * 12);
    let finalDamage = Math.round((weaponLoadout.baseDamage * weaponLoadout.damageMultiplier) + accuracyBonus);

    if (currentUpgrade) {
      finalDamage = Math.round(finalDamage * currentUpgrade.damageMultiplier);
    }

    const startX = state.player.x + (dir === 1 ? state.player.width + 4 : -12);
    const startY = state.player.y + 14;

    // 1. SPREAD WEAPON UPGRADE (Fires 3 projectiles simultaneously in spread cone)
    if (currentUpgrade?.id === 'spread') {
      // Center
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 10 * gameSpeed,
        vy: 0,
        radius: 7,
        color: '#c084fc',
        isPlayer: true,
        damage: Math.round(finalDamage * 0.9),
        text: 'SEBAR',
      });
      // Angled Up
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 9.5 * gameSpeed,
        vy: -2.8,
        radius: 6,
        color: '#e879f9',
        isPlayer: true,
        damage: Math.round(finalDamage * 0.75),
      });
      // Angled Down
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 9.5 * gameSpeed,
        vy: 2.8,
        radius: 6,
        color: '#e879f9',
        isPlayer: true,
        damage: Math.round(finalDamage * 0.75),
      });
    }
    // 2. RAPID WEAPON UPGRADE (Fast straight high-speed laser beam)
    else if (currentUpgrade?.id === 'rapid') {
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 14 * gameSpeed,
        vy: 0,
        radius: 8,
        color: '#06b6d4',
        isPlayer: true,
        damage: finalDamage,
        text: 'KILAT',
      });
    }
    // 3. HEAVY BUSTER WEAPON UPGRADE (Massive piercing plasma blast)
    else if (currentUpgrade?.id === 'heavy') {
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 8 * gameSpeed,
        vy: 0,
        radius: 14,
        color: '#f59e0b',
        isPlayer: true,
        damage: finalDamage,
        piercing: true,
        text: 'BUSTER',
      });
    }
    // 4. HOMING WEAPON UPGRADE (Smart seeking projectile)
    else if (currentUpgrade?.id === 'homing') {
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 8 * gameSpeed,
        vy: 0,
        radius: 7,
        color: '#10b981',
        isPlayer: true,
        damage: finalDamage,
        homing: true,
        text: 'SEEKER',
      });
    }
    // STANDARD / DEFAULT
    else {
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * 9.5 * gameSpeed,
        vy: 0,
        radius: weaponLoadout.tier === 'master' ? 8 : 6,
        color: weaponLoadout.tier === 'master' ? '#38bdf8' : weaponLoadout.tier === 'enhanced' ? '#34d399' : '#fbbf24',
        isPlayer: true,
        damage: finalDamage,
      });
    }
  };

  const triggerInteract = () => {
    const state = gameStateRef.current;
    if (state.isGameOver || state.isVictory) return;

    state.puzzles.forEach(puzzle => {
      if (!puzzle.solved) {
        const dist = Math.abs(state.player.x - puzzle.xPosition);
        if (dist < 100) {
          handleOpenPuzzle(puzzle);
        }
      }
    });
  };

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    // Define Level Platforms for 3X STAGE LENGTH (7200px map) across 5 Sectors
    const platforms: Platform[] = [
      // ========================================================
      // SECTOR 1: CYBER GATEWAY & VERIFICATION (0 - 1500m)
      // ========================================================
      { x: 0, y: 420, width: 680, height: 80, type: 'ground' },
      { x: 500, y: 340, width: 130, height: 16, type: 'floating', label: 'Gerbang Verifikasi' },
      { x: 740, y: 420, width: 780, height: 80, type: 'ground' },
      { x: 920, y: 330, width: 90, height: 16, type: 'floating' },
      { x: 1100, y: 350, width: 140, height: 16, type: 'floating', label: 'Teka-teki 1' },
      { x: 1320, y: 320, width: 90, height: 16, type: 'floating' },

      // ========================================================
      // SECTOR 2: LASER CANYON & CHASM BRIDGE (1500 - 3000m)
      // ========================================================
      // Moving platform 1 over chasm
      { 
        x: 1540, 
        y: 330, 
        width: 100, 
        height: 16, 
        type: 'moving', 
        minY: 260, 
        maxY: 380, 
        vy: 1.3, 
        label: 'Platform Bergerak 1' 
      },
      { x: 1680, y: 420, width: 550, height: 80, type: 'ground' },
      { x: 1950, y: 330, width: 90, height: 16, type: 'floating' },
      { x: 2100, y: 280, width: 90, height: 16, type: 'floating' },

      // Moving platform 2
      { 
        x: 2260, 
        y: 340, 
        width: 100, 
        height: 16, 
        type: 'moving', 
        minY: 270, 
        maxY: 370, 
        vy: -1.2, 
        label: 'Platform Bergerak 2' 
      },
      { x: 2400, y: 420, width: 320, height: 80, type: 'ground' },
      { x: 2550, y: 340, width: 140, height: 16, type: 'floating', label: 'Teka-teki 2' },

      // Grand Bridge across chasm (Raised upon solving Teka-teki 2)
      { x: 2720, y: 410, width: 440, height: 20, type: 'bridge', label: 'Jembatan Otoritas BPS / Arsip' },

      // ========================================================
      // SECTOR 3: FLOATING ISLAND ARCHIVES (3000 - 4500m)
      // ========================================================
      { x: 3160, y: 420, width: 580, height: 80, type: 'ground' },
      { x: 3420, y: 330, width: 100, height: 16, type: 'floating' },
      { x: 3580, y: 270, width: 100, height: 16, type: 'floating' },
      { x: 3740, y: 330, width: 100, height: 16, type: 'floating' },

      // Moving platform 3
      { 
        x: 3880, 
        y: 320, 
        width: 100, 
        height: 16, 
        type: 'moving', 
        minY: 260, 
        maxY: 380, 
        vy: 1.4, 
        label: 'Platform Bergerak 3' 
      },
      { x: 4020, y: 420, width: 550, height: 80, type: 'ground' },
      { x: 4320, y: 340, width: 140, height: 16, type: 'floating', label: 'Teka-teki 3' },

      // ========================================================
      // SECTOR 4: FIREWALL CORRIDOR & OVERDRIVE (4500 - 6000m)
      // ========================================================
      { x: 4620, y: 420, width: 620, height: 80, type: 'ground' },
      { x: 4920, y: 330, width: 100, height: 16, type: 'floating' },
      { x: 5080, y: 270, width: 100, height: 16, type: 'floating' },

      // Moving platform 4
      { 
        x: 5240, 
        y: 330, 
        width: 100, 
        height: 16, 
        type: 'moving', 
        minY: 260, 
        maxY: 370, 
        vy: -1.3, 
        label: 'Platform Bergerak 4' 
      },
      { x: 5380, y: 420, width: 680, height: 80, type: 'ground' },
      { x: 5650, y: 330, width: 110, height: 16, type: 'floating' },
      { x: 5850, y: 290, width: 110, height: 16, type: 'floating' },

      // ========================================================
      // SECTOR 5: MEGA BOSS ARENA (6000 - 7200m)
      // ========================================================
      { x: 6060, y: 420, width: 1140, height: 80, type: 'ground' },
      // Tactical Boss Fighting Platforms
      { x: 6250, y: 310, width: 140, height: 16, type: 'floating', label: 'Platform Sniper Barat' },
      { x: 6500, y: 230, width: 180, height: 16, type: 'floating', label: 'Jembatan Observasi Utama' },
      { x: 6780, y: 310, width: 140, height: 16, type: 'floating', label: 'Platform Sniper Timur' },
    ];

    // Static & Dynamic Hazards across all 5 sectors
    const hazards = [
      { x: 680, y: 440, width: 60, height: 40, label: 'Spike Data 1' },
      { x: 1250, y: 400, width: 24, height: 20, label: 'Spike' },
      { x: 1480, y: 470, width: 200, height: 30, label: 'Jurang Hoaks 1' },
      { x: 2230, y: 440, width: 30, height: 30, label: 'Bocor NIK' },
      { x: 2720, y: 470, width: 440, height: 30, label: 'Jurang Data Rusak 2' },
      { x: 3740, y: 440, width: 140, height: 30, label: 'Jurang Hoaks 3' },
      { x: 4570, y: 440, width: 50, height: 30, label: 'Spike Manipulasi' },
      { x: 5240, y: 470, width: 140, height: 30, label: 'Jurang Firewall Rusak' },
    ];

    const gravity = 0.45;
    const moveSpeed = (weaponLoadout.hasSpeedBoost ? 4.8 : 3.8) * gameSpeed;

    const loop = () => {
      const state = gameStateRef.current;
      const { player, boss } = state;

      if (state.isGameOver || state.isVictory) {
        animId = requestAnimationFrame(loop);
        return;
      }

      state.laserFlickerTimer += 1;

      // UPDATE MOVING PLATFORMS
      platforms.forEach(plat => {
        if (plat.type === 'moving' && plat.minY !== undefined && plat.maxY !== undefined && plat.vy !== undefined) {
          plat.y += plat.vy * gameSpeed;
          if (plat.y > plat.maxY || plat.y < plat.minY) {
            plat.vy = -plat.vy;
          }
        }
      });

      // UPDATE PLAYER PHYSICS
      const isMovingLeft = state.keys.left || touchStateRef.current.left;
      const isMovingRight = state.keys.right || touchStateRef.current.right;

      if (isMovingLeft) {
        player.vx = -moveSpeed;
        player.facing = 'left';
      } else if (isMovingRight) {
        player.vx = moveSpeed;
        player.facing = 'right';
      } else {
        player.vx *= 0.7;
      }

      player.vy += gravity * gameSpeed;
      player.x += player.vx;
      player.y += player.vy;

      // Platform Collisions
      player.isGrounded = false;
      platforms.forEach(plat => {
        if (plat.type === 'bridge' && !state.bridgeRaised) {
          return;
        }

        if (
          player.x + player.width > plat.x &&
          player.x < plat.x + plat.width &&
          player.y + player.height >= plat.y &&
          player.y + player.height <= plat.y + 18 &&
          player.vy >= 0
        ) {
          player.y = plat.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.jumpsRemaining = weaponLoadout.hasDoubleJump ? 2 : 1;
        }
      });

      // Update Checkpoints across 7200px map
      if (player.x > 600 && state.checkpointX < 600) state.checkpointX = 750;
      if (player.x > 1650 && state.checkpointX < 1650) state.checkpointX = 1700;
      if (player.x > 3150 && state.checkpointX < 3150) state.checkpointX = 3200;
      if (player.x > 4600 && state.checkpointX < 4600) state.checkpointX = 4650;
      if (player.x > 6050 && state.checkpointX < 6050) state.checkpointX = 6100;

      // 1. Check Falling Down into Void / Chasm (Karakter Terjatuh ke Bawah)
      if (player.y > 450 && !state.isGameOver && !state.isVictory) {
        state.isGameOver = true;
        audio.playGameOver();
        setGameOverReason('fell');
      }

      // Hazard Collisions
      hazards.forEach(hz => {
        if (
          player.x + player.width > hz.x &&
          player.x < hz.x + hz.width &&
          player.y + player.height > hz.y &&
          player.y < hz.y + hz.height
        ) {
          if (hz.label.includes('Jurang') || hz.y >= 440) {
            if (!state.isGameOver && !state.isVictory) {
              state.isGameOver = true;
              audio.playGameOver();
              setGameOverReason('fell');
            }
            return;
          }

          if (player.invulnerableFrames <= 0) {
            audio.playHit();
            player.health = Math.max(0, player.health - 25);
            setPlayerHp(player.health);
            player.invulnerableFrames = 40;
          }
        }
      });

      // Dynamic Laser Barriers (Sector 2 & Sector 4)
      const isLaserActive = (state.laserFlickerTimer % 180) < 100;
      if (isLaserActive) {
        const laserPositions = [1900, 4800, 5450];
        laserPositions.forEach(laserX => {
          if (
            player.x + player.width > laserX &&
            player.x < laserX + 16 &&
            player.y + player.height > 300 &&
            player.y < 420 &&
            player.invulnerableFrames <= 0
          ) {
            audio.playHit();
            player.health = Math.max(0, player.health - 20);
            setPlayerHp(player.health);
            player.invulnerableFrames = 40;
            player.vx = -5;
          }
        });
      }

      // 2. Check Player Death (Health Poin Habis)
      if (player.health <= 0 && !state.isGameOver && !state.isVictory) {
        player.health = 0;
        setPlayerHp(0);
        state.isGameOver = true;
        audio.playGameOver();
        setGameOverReason('hp_zero');
      }

      // UPDATE PATROL MINIONS (Moving & Directional Shooting Enemies)
      state.enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        // Patrol back and forth
        enemy.x += enemy.vx * gameSpeed;
        if (enemy.x > enemy.maxX) {
          enemy.x = enemy.maxX;
          enemy.vx = -Math.abs(enemy.vx);
          enemy.facing = 'left';
        } else if (enemy.x < enemy.minX) {
          enemy.x = enemy.minX;
          enemy.vx = Math.abs(enemy.vx);
          enemy.facing = 'right';
        }

        // Shooting behavior towards player
        const distToPlayer = Math.abs(player.x - enemy.x);
        if (distToPlayer < 420 && Math.abs(player.y - enemy.y) < 160) {
          enemy.shootCooldown += 1;
          if (enemy.shootCooldown >= enemy.shootInterval) {
            enemy.shootCooldown = 0;
            const shootDir = player.x > enemy.x ? 1 : -1;
            const angleToPlayer = Math.atan2((player.y + 16) - (enemy.y + 16), player.x - enemy.x);

            state.projectiles.push({
              x: enemy.x + (shootDir === 1 ? enemy.width + 4 : -8),
              y: enemy.y + 14,
              vx: Math.cos(angleToPlayer) * 3.8 * gameSpeed,
              vy: Math.sin(angleToPlayer) * 3.8 * gameSpeed,
              radius: 5,
              color: enemy.color,
              isPlayer: false,
              damage: 10,
              text: 'HOAKS',
            });
          }
        }
      });

      // ========================================================
      // UPDATE BOSS AI & OMNIDIRECTIONAL MULTI-ANGLE SHOOTING
      // (Musuh utama bisa menembak ke segala arah 360°)
      // ========================================================
      if (player.x > 5950 && boss.hp > 0) {
        // Smooth 2D Hovering & Movement
        boss.spawnTimer += 1;
        boss.y = 260 + Math.sin(boss.spawnTimer * 0.04) * 65;
        boss.x = 6600 + Math.cos(boss.spawnTimer * 0.02) * 110;

        // Determine Phase
        const hpPercent = boss.hp / boss.maxHp;
        if (hpPercent < 0.35) {
          boss.phase = 3;
        } else if (hpPercent < 0.70) {
          boss.phase = 2;
        } else {
          boss.phase = 1;
        }

        // Calculate direct 2D angle towards player center
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const bossCenterX = boss.x + boss.width / 2;
        const bossCenterY = boss.y + boss.height / 2;
        const targetAngle = Math.atan2(playerCenterY - bossCenterY, playerCenterX - bossCenterX);

        const fireInterval = boss.phase === 3 ? 36 : boss.phase === 2 ? 52 : 72;

        if (boss.spawnTimer % fireInterval === 0) {
          audio.playLaser();
          const pSpeed = (boss.phase === 3 ? 6.8 : boss.phase === 2 ? 5.8 : 4.8) * gameSpeed;

          // PHASE 1: DIRECT TARGETED AIM IN ANY DIRECTION
          state.projectiles.push({
            x: bossCenterX,
            y: bossCenterY,
            vx: Math.cos(targetAngle) * pSpeed,
            vy: Math.sin(targetAngle) * pSpeed,
            radius: 8,
            color: '#f43f5e',
            isPlayer: false,
            damage: boss.phase === 3 ? 20 : 14,
            text: 'HALUSINASI',
          });

          // PHASE 2: TRI-SPREAD CONE TOWARDS PLAYER
          if (boss.phase >= 2) {
            state.projectiles.push({
              x: bossCenterX,
              y: bossCenterY,
              vx: Math.cos(targetAngle - 0.28) * pSpeed,
              vy: Math.sin(targetAngle - 0.28) * pSpeed,
              radius: 6,
              color: '#a855f7',
              isPlayer: false,
              damage: 12,
              text: 'DATA PALSU',
            });
            state.projectiles.push({
              x: bossCenterX,
              y: bossCenterY,
              vx: Math.cos(targetAngle + 0.28) * pSpeed,
              vy: Math.sin(targetAngle + 0.28) * pSpeed,
              radius: 6,
              color: '#a855f7',
              isPlayer: false,
              damage: 12,
              text: 'DATA PALSU',
            });
          }

          // PHASE 2 & 3: 360-DEGREE RADIAL NOVA BURST (Menembak ke semua arah memutar)
          const radialCycle = boss.phase === 3 ? 100 : 160;
          if (boss.spawnTimer % radialCycle === 0) {
            audio.playBossHit();
            const numBullets = boss.phase === 3 ? 8 : 6;
            for (let b = 0; b < numBullets; b++) {
              const burstAngle = (b * 2 * Math.PI) / numBullets + (boss.spawnTimer * 0.05);
              state.projectiles.push({
                x: bossCenterX,
                y: bossCenterY,
                vx: Math.cos(burstAngle) * (pSpeed * 0.8),
                vy: Math.sin(burstAngle) * (pSpeed * 0.8),
                radius: 6,
                color: '#ec4899',
                isPlayer: false,
                damage: 10,
                text: 'BURST',
              });
            }
          }
        }
      }

      // UPDATE PROJECTILES (Player & Enemies)
      for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const proj = state.projectiles[i];

        // HOMING PROJECTILE LOGIC FOR PLAYER SEEKER WEAPON
        if (proj.isPlayer && proj.homing) {
          let nearestTarget: { x: number; y: number } | null = null;
          let minDist = 900;

          if (boss.hp > 0 && Math.abs(boss.x - proj.x) < 900) {
            nearestTarget = { x: boss.x + boss.width / 2, y: boss.y + boss.height / 2 };
            minDist = Math.hypot(nearestTarget.x - proj.x, nearestTarget.y - proj.y);
          }

          for (const enemy of state.enemies) {
            if (enemy.isAlive) {
              const d = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
              if (d < minDist) {
                minDist = d;
                nearestTarget = { x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2 };
              }
            }
          }

          if (nearestTarget) {
            const desiredAngle = Math.atan2(nearestTarget.y - proj.y, nearestTarget.x - proj.x);
            proj.vx = proj.vx * 0.82 + Math.cos(desiredAngle) * 8.5 * 0.18;
            proj.vy = proj.vy * 0.82 + Math.sin(desiredAngle) * 8.5 * 0.18;
          }
        }

        proj.x += proj.vx;
        proj.y += proj.vy;

        // Player Projectile Hits
        if (proj.isPlayer) {
          // Collision with Boss
          if (
            proj.x > boss.x &&
            proj.x < boss.x + boss.width &&
            proj.y > boss.y &&
            proj.y < boss.y + boss.height &&
            boss.hp > 0
          ) {
            audio.playBossHit();
            boss.hp = Math.max(0, boss.hp - proj.damage);
            setBossHp(boss.hp);
            state.hitsLanded += 1;

            for (let k = 0; k < 6; k++) {
              state.particles.push({
                x: proj.x,
                y: proj.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 0,
                maxLife: 20,
                color: proj.color,
                size: 3.5,
              });
            }

            if (!proj.piercing) {
              state.projectiles.splice(i, 1);
            }

            // Boss Defeat
            if (boss.hp <= 0 && !state.isVictory) {
              state.isVictory = true;
              audio.playBossDefeat();

              for (let k = 0; k < 55; k++) {
                state.particles.push({
                  x: boss.x + 35,
                  y: boss.y + 35,
                  vx: (Math.random() - 0.5) * 16,
                  vy: (Math.random() - 0.5) * 16,
                  life: 0,
                  maxLife: 55,
                  color: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#fbbf24'][Math.floor(Math.random() * 5)],
                  size: 5.5,
                });
              }

              setTimeout(() => {
                const totalSeconds = Math.round((Date.now() - state.startTime) / 1000);
                const accuracy = state.projectilesFired > 0 
                  ? Math.round((state.hitsLanded / state.projectilesFired) * 100) 
                  : 88;

                onMissionComplete(
                  {
                    mission_time_seconds: totalSeconds,
                    player_health_final: player.health,
                    boss_health_final: 0,
                    projectiles_dodged: state.projectilesDodged,
                    hits_landed: state.hitsLanded,
                    accuracy_percent: Math.min(100, Math.max(50, accuracy)),
                  },
                  state.puzzles.filter(p => p.solved).length
                );
              }, 1600);
            }
            continue;
          }

          // Collision with Patrol Minions
          let hitEnemy = false;
          for (const enemy of state.enemies) {
            if (
              enemy.isAlive &&
              proj.x > enemy.x &&
              proj.x < enemy.x + enemy.width &&
              proj.y > enemy.y &&
              proj.y < enemy.y + enemy.height
            ) {
              audio.playHit();
              enemy.hp -= proj.damage;
              state.hitsLanded += 1;
              hitEnemy = true;

              for (let k = 0; k < 6; k++) {
                state.particles.push({
                  x: proj.x,
                  y: proj.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  life: 0,
                  maxLife: 20,
                  color: proj.color,
                  size: 3,
                });
              }

              if (enemy.hp <= 0) {
                enemy.isAlive = false;
                audio.playBossHit();
                for (let k = 0; k < 20; k++) {
                  state.particles.push({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8,
                    life: 0,
                    maxLife: 30,
                    color: enemy.color,
                    size: 4,
                  });
                }
              }
              break;
            }
          }

          if (hitEnemy && !proj.piercing) {
            state.projectiles.splice(i, 1);
            continue;
          }
        } else {
          // Enemy/Boss projectile hitting Player
          if (
            proj.x > player.x &&
            proj.x < player.x + player.width &&
            proj.y > player.y &&
            proj.y < player.y + player.height &&
            player.invulnerableFrames <= 0
          ) {
            audio.playHit();
            player.health = Math.max(0, player.health - proj.damage);
            setPlayerHp(player.health);
            player.invulnerableFrames = 30;
            state.projectiles.splice(i, 1);
            continue;
          } else if (proj.x < player.x && Math.abs(proj.x - player.x) < 20) {
            state.projectilesDodged += 1;
          }
        }

        // Remove out-of-bounds projectiles
        if (proj.x < state.cameraX - 120 || proj.x > state.cameraX + 960) {
          state.projectiles.splice(i, 1);
        }
      }

      // 3. OUT OF AMMO CHECK:
      const playerProjectilesRemaining = state.projectiles.filter(p => p.isPlayer).length;
      const hasRemainingTargets = boss.hp > 0 || state.enemies.some(e => e.isAlive);
      if (state.ammo <= 0 && playerProjectilesRemaining === 0 && hasRemainingTargets && !state.isGameOver && !state.isVictory) {
        state.isGameOver = true;
        audio.playGameOver();
        setGameOverReason('out_of_ammo');
      }

      // UPDATE PARTICLES
      for (let i = state.particles.length - 1; i >= 0; i--) {
        const pt = state.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life += 1;
        if (pt.life >= pt.maxLife) {
          state.particles.splice(i, 1);
        }
      }

      if (player.invulnerableFrames > 0) {
        player.invulnerableFrames -= 1;
      }

      // CAMERA FOLLOW ACROSS 7200px
      const targetCamX = player.x - 220;
      state.cameraX += (targetCamX - state.cameraX) * 0.1;
      state.cameraX = Math.max(0, Math.min(state.levelLength - canvas.width, state.cameraX));

      // -------------------------------------------------------------
      // DRAWING PASS
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-state.cameraX, 0);

      // Background Cyber Grid
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const startX = Math.floor(state.cameraX / gridSize) * gridSize;
      for (let gx = startX; gx < state.cameraX + canvas.width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, canvas.height);
        ctx.stroke();
      }

      // Render Platforms
      platforms.forEach(plat => {
        if (plat.type === 'ground') {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(plat.x, plat.y, plat.width, 4);
        } else if (plat.type === 'bridge') {
          if (state.bridgeRaised) {
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(plat.x, plat.y, plat.width, 3);
            ctx.fillStyle = '#e0f2fe';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('⚡ JEMBATAN OTORITAS RESMI TERBUKA ⚡', plat.x + 24, plat.y + 14);
          } else {
            ctx.strokeStyle = '#ef4444';
            ctx.setLineDash([6, 6]);
            ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
            ctx.setLineDash([]);
            ctx.fillStyle = '#f87171';
            ctx.font = '10px monospace';
            ctx.fillText('⚠️ Jurang Data Rusak (Selesaikan Teka-teki 2)', plat.x + 12, plat.y + 14);
          }
        } else if (plat.type === 'moving') {
          ctx.fillStyle = '#475569';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '9px sans-serif';
          ctx.fillText('↕ Verifikasi Bergerak', plat.x + 4, plat.y + 11);
        } else {
          // Floating platform
          ctx.fillStyle = '#334155';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          if (plat.label) {
            ctx.fillStyle = '#cbd5e1';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(plat.label, plat.x + 6, plat.y + 12);
          }
        }
      });

      // Render Dynamic Laser Barriers
      const laserPositions = [1900, 4800, 5450];
      laserPositions.forEach(laserX => {
        if (laserX > state.cameraX - 100 && laserX < state.cameraX + canvas.width + 100) {
          if (isLaserActive) {
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.fillRect(laserX, 300, 16, 120);
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#fee2e2';
            ctx.font = 'bold 8px monospace';
            ctx.fillText('LASER HOAKS', laserX - 16, 292);
          } else {
            ctx.strokeStyle = '#64748b';
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(laserX, 300, 16, 120);
            ctx.setLineDash([]);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '8px monospace';
            ctx.fillText('[SIAP MENYALA]', laserX - 16, 292);
          }
        }
      });

      // Render In-Game Puzzles along the way
      state.puzzles.forEach((pz, idx) => {
        const isSolved = pz.solved;
        const pX = pz.xPosition;
        const pY = 320;

        ctx.fillStyle = isSolved ? '#059669' : '#d97706';
        ctx.fillRect(pX - 10, pY - 40, 24, 50);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(isSolved ? '✓' : '?', pX - 4, pY - 15);

        ctx.fillStyle = isSolved ? '#34d399' : '#fbbf24';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`[E] Teka-teki ${idx + 1}`, pX - 25, pY - 50);
      });

      // Render Static Hazards
      hazards.forEach(hz => {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(hz.x, hz.y + hz.height);
        ctx.lineTo(hz.x + hz.width / 2, hz.y);
        ctx.lineTo(hz.x + hz.width, hz.y + hz.height);
        ctx.fill();

        ctx.fillStyle = '#fda4af';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(hz.label, hz.x - 8, hz.y - 4);
      });

      // Render 10 Patrol Minions
      state.enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        // Enemy body
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Eyes / Visor
        ctx.fillStyle = '#ffffff';
        const eyeX = enemy.facing === 'right' ? enemy.x + 20 : enemy.x + 4;
        ctx.fillRect(eyeX, enemy.y + 6, 7, 5);

        // Emoji label inside
        ctx.font = '16px sans-serif';
        ctx.fillText(enemy.emoji, enemy.x + 4, enemy.y + 24);

        // HP bar above minion
        const hpBarW = 32;
        ctx.fillStyle = '#334155';
        ctx.fillRect(enemy.x, enemy.y - 10, hpBarW, 4);
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y - 10, hpBarW * (enemy.hp / enemy.maxHp), 4);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText(enemy.name, enemy.x - 10, enemy.y - 14);
      });

      // Render Player Character
      if (player.invulnerableFrames % 6 < 3) {
        ctx.fillStyle = equippedUpgrade 
          ? equippedUpgrade.bulletColor 
          : weaponLoadout.tier === 'master' ? '#38bdf8' : weaponLoadout.tier === 'enhanced' ? '#34d399' : '#10b981';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        ctx.fillStyle = '#ffffff';
        const eyeOffset = player.facing === 'right' ? 18 : 4;
        ctx.fillRect(player.x + eyeOffset, player.y + 8, 7, 5);

        ctx.fillStyle = '#065f46';
        const capeOffset = player.facing === 'right' ? 2 : player.width - 6;
        ctx.fillRect(player.x + capeOffset, player.y + 12, 4, 22);

        // Weapon graphic
        ctx.fillStyle = equippedUpgrade ? equippedUpgrade.bulletColor : '#38bdf8';
        const weaponX = player.facing === 'right' ? player.x + player.width : player.x - 8;
        ctx.fillRect(weaponX, player.y + 18, 8, 5);
      }

      // Render Boss Mega Mecha (Sector 5)
      if (boss.hp > 0 && boss.x > state.cameraX - 150 && boss.x < state.cameraX + canvas.width + 150) {
        // Boss Outer Aura
        const bossAuraColor = boss.phase === 3 ? '#ec4899' : boss.phase === 2 ? '#a855f7' : mission.boss.color;
        ctx.strokeStyle = bossAuraColor;
        ctx.lineWidth = boss.phase === 3 ? 3 : 2;
        ctx.strokeRect(boss.x - 4, boss.y - 4, boss.width + 8, boss.height + 8);

        // Boss Body
        ctx.fillStyle = mission.boss.color;
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

        // Boss Core Eye / Visor
        ctx.fillStyle = boss.phase === 3 ? '#ef4444' : '#fbbf24';
        const bossFacingLeft = player.x < boss.x;
        const eyeOffset = bossFacingLeft ? 8 : boss.width - 24;
        ctx.fillRect(boss.x + eyeOffset, boss.y + 14, 16, 12);

        // Boss Name & Phase Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`👾 ${mission.boss.name}`, boss.x - 10, boss.y - 18);

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = boss.phase === 3 ? '#f43f5e' : boss.phase === 2 ? '#c084fc' : '#38bdf8';
        ctx.fillText(`Fase ${boss.phase}: ${boss.phase === 3 ? 'OVERDRIVE 360°' : boss.phase === 2 ? 'SEBARAN TRI-CONE' : 'TARGETED AIM'}`, boss.x - 10, boss.y - 6);

        // Boss HP Bar
        const barWidth = 120;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(boss.x - 20, boss.y + boss.height + 8, barWidth, 7);
        ctx.fillStyle = bossAuraColor;
        ctx.fillRect(boss.x - 20, boss.y + boss.height + 8, barWidth * (boss.hp / boss.maxHp), 7);
      }

      // Render Projectiles
      state.projectiles.forEach(proj => {
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();

        if (proj.text) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 7px monospace';
          ctx.fillText(proj.text, proj.x - 10, proj.y - 8);
        }
      });

      // Render Particles
      state.particles.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, 1 - pt.life / pt.maxLife);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [weaponLoadout, mission, gameSpeed, solvedPuzzleIds]);

  // Sector calculation for HUD (7200px total length)
  const currentSector = Math.min(5, Math.max(1, Math.floor((gameStateRef.current.player.x / 1440) + 1)));
  const sectorNames = [
    'Cyber Hub & Pintu Gerbang',
    'Laser Canyon & Jurang Data',
    'Floating Island Archives',
    'Firewall Corridor & Overdrive',
    'Mega Boss Arena Pertarungan'
  ];

  return (
    <div id="side-scroller-mission-view" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top HUD with Ammo Counter, Sector progress & Weapon status */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-3 sm:px-4 py-2 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (window.confirm('Keluar dari misi dan kembali ke Hub?')) {
                onAbortMission();
              }
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Ulangi menjawab kuis dari awal di Gerbang QUEST untuk mendapatkan senjata lebih kuat dan amunisi penuh?')) {
                handleRetakeQuiz();
              }
            }}
            title="Ulangi Kuis Gerbang QUEST dari Awal"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ulang Kuis</span>
          </button>

          <div>
            <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
              <span>{mission.title}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>Senjata:</span>
              <strong className={equippedUpgrade ? 'text-amber-300 flex items-center gap-0.5' : 'text-teal-400'}>
                {equippedUpgrade ? `${equippedUpgrade.icon} ${equippedUpgrade.name}` : weaponLoadout.name}
              </strong>
            </div>
          </div>
        </div>

        {/* Sector Progress Ribbon */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800 text-xs">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Sektor {currentSector}/5:</span>
          <span className="font-bold text-cyan-300">{sectorNames[currentSector - 1]}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-mono font-bold">
            {Math.round((gameStateRef.current.player.x / 7200) * 100)}%
          </span>
        </div>

        {/* Ammo & Health Gauges */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* AMMO COUNTER GAUGE */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <Zap className={`w-4 h-4 ${ammo <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
            <div className="text-right">
              <div className="text-[9px] text-slate-400 uppercase font-bold">Peluru</div>
              <div className={`text-xs font-black ${ammo <= 5 ? 'text-rose-400' : ammo <= 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ammo} / {weaponLoadout.maxAmmo}
              </div>
            </div>
          </div>

          {/* Player HP */}
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            <div className="w-16 sm:w-24 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full transition-all duration-200"
                style={{ width: `${Math.max(0, (playerHp / initialMaxHp) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-200">
              {playerHp}
            </span>
          </div>

          {/* Sound toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Floating Notice when Weapon Upgraded */}
      {rewardNotice && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-extrabold px-4 py-2 rounded-2xl shadow-2xl border-2 border-cyan-300 text-xs sm:text-sm animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{rewardNotice}</span>
        </div>
      )}

      {/* Main Game Stage Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950">
        <div className="relative w-full max-w-5xl aspect-[16/9] max-h-[580px] bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl">
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="w-full h-full object-contain block"
          />

          {/* Mini In-Game Objectives Ribbon */}
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs flex items-center gap-3">
            <span className="text-slate-400">Teka-teki:</span>
            <span className="font-bold text-emerald-400">
              {solvedPuzzleIds.length} / {mission.inGamePuzzles.length} Selesai
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              👾 Boss: {mission.boss.name} ({bossHp} HP)
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-cyan-400 font-mono text-[11px]">
              Panjang Stage 3x (7200m)
            </span>
          </div>
        </div>

        {/* Keyboard & Touch Controls Bar for Mobile & Desktop */}
        <div className="w-full max-w-5xl mt-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
          {/* Desktop Keyboard Cheatsheet */}
          <div className="hidden md:flex items-center gap-2 text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono border border-slate-700">← / →</span>
            <span>Jalan</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono border border-slate-700">↑ / SPASI</span>
            <span>Lompat</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono border border-slate-700">J / X</span>
            <span>Tembak ({equippedUpgrade ? equippedUpgrade.badge : 'Verifikasi'})</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono border border-slate-700">E</span>
            <span>Cek Teka-teki</span>
          </div>

          {/* Touch Controls (Always visible on mobile/tablet) */}
          <div className="flex md:hidden w-full items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                onTouchStart={() => { touchStateRef.current.left = true; }}
                onTouchEnd={() => { touchStateRef.current.left = false; }}
                onMouseDown={() => { touchStateRef.current.left = true; }}
                onMouseUp={() => { touchStateRef.current.left = false; }}
                className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-xl font-bold text-white flex items-center justify-center shadow-lg cursor-pointer"
              >
                ◀
              </button>
              <button
                onTouchStart={() => { touchStateRef.current.right = true; }}
                onTouchEnd={() => { touchStateRef.current.right = false; }}
                onMouseDown={() => { touchStateRef.current.right = true; }}
                onMouseUp={() => { touchStateRef.current.right = false; }}
                className="w-14 h-14 rounded-2xl bg-slate-800 border-2 border-slate-600 active:bg-slate-700 text-xl font-bold text-white flex items-center justify-center shadow-lg cursor-pointer"
              >
                ▶
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerInteract}
                className="w-12 h-12 rounded-xl bg-amber-700/80 border border-amber-500 active:bg-amber-600 text-xs font-bold text-white flex items-center justify-center shadow-lg cursor-pointer"
              >
                [E] Cek
              </button>
              <button
                onClick={triggerAttack}
                className="w-14 h-14 rounded-2xl bg-teal-600 border-2 border-teal-400 active:bg-teal-500 text-xl font-bold text-white flex items-center justify-center shadow-lg cursor-pointer"
              >
                ⚡
              </button>
              <button
                onClick={triggerJump}
                className="w-14 h-14 rounded-2xl bg-emerald-600 border-2 border-emerald-400 active:bg-emerald-500 text-xl font-bold text-white flex items-center justify-center shadow-lg cursor-pointer"
              >
                ⬆
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* WEAPON REWARD SELECTION MODAL (Muncul saat berhasil jawab pertanyaan di tengah game) */}
      {weaponRewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-teal-500/80 rounded-3xl p-6 sm:p-7 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center text-xl">
                  🎁
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    Teka-teki Berhasil! Pilih Senjata Baru
                  </h3>
                  <p className="text-xs text-teal-300 font-semibold">
                    Amunisi bertambah & daya hancur senjata meningkat!
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              Hebat! Keberhasilan analisis verifikasimu membuka suplai senjata dari Digital Guardian Academy. Pilih salah satu peningkatan senjata di bawah:
            </p>

            {/* Weapon Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {WEAPON_UPGRADES.map(upgrade => (
                <button
                  key={upgrade.id}
                  onClick={() => handleSelectWeaponUpgrade(upgrade)}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 hover:border-teal-400 transition-all text-left flex flex-col justify-between group cursor-pointer shadow-lg hover:shadow-teal-950/50"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{upgrade.icon}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 uppercase">
                        {upgrade.badge}
                      </span>
                    </div>
                    <div className="font-black text-sm text-white group-hover:text-teal-300 transition">
                      {upgrade.name}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      {upgrade.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-400">⚡ +{upgrade.ammoBonus} Peluru</span>
                    <span className="text-rose-400">❤️ +{upgrade.hpRestore} HP</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Klik salah satu senjata di atas untuk langsung menggunakannya di lintasan.
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER MODAL (Karakter terjatuh ke bawah, HP habis, atau Peluru habis) */}
      {gameOverReason !== null && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`bg-slate-900 border-2 ${
            gameOverReason === 'fell'
              ? 'border-amber-500/80 shadow-amber-950/60'
              : gameOverReason === 'hp_zero'
              ? 'border-rose-500/80 shadow-rose-950/60'
              : 'border-orange-500/80 shadow-orange-950/60'
          } rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-center`}>
            {/* Dynamic Status Icon */}
            <div className={`w-20 h-20 rounded-3xl ${
              gameOverReason === 'fell'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : gameOverReason === 'hp_zero'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
            } mx-auto flex items-center justify-center text-4xl shadow-inner`}>
              {gameOverReason === 'fell' ? '🕳️' : gameOverReason === 'hp_zero' ? '💔' : '⚡'}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-950/80 text-rose-400 border border-rose-600/40">
                ⚠️ MISI GAGAL — GAME OVER
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {gameOverReason === 'fell' && 'Karakter Terjatuh ke Bawah!'}
                {gameOverReason === 'hp_zero' && 'Daya Integritas Habis! (HP = 0)'}
                {gameOverReason === 'out_of_ammo' && 'Amunisi Verifikasi Habis!'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {gameOverReason === 'fell' && 'Kamu terperosok ke jurang data tanpa pijakan platform. Perhatikan waktu lompatan dan perhitungkan jarak platform verifikasi!'}
                {gameOverReason === 'hp_zero' && 'Karaktermu terkena rentetan proyektil hoaks dan data glitch hingga daya HP habis. Bermanuverlah lebih gesit saat menghadapi musuh.'}
                {gameOverReason === 'out_of_ammo' && `Kamu telah menghabiskan seluruh ${weaponLoadout.maxAmmo} butir peluru verifikasi sebelum musuh dan monster boss dinetralisir.`}
              </p>
            </div>

            {/* Strategic Tip & Digital Adab Connection */}
            <div className="text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span>💡</span>
                <span>Strategi Poin Senjata & Adab Verifikasi:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Menjawab pertanyaan di <strong>Gerbang QUEST</strong> secara tepat akan membuka senjata tingkat tinggi (hingga <strong>40 butir peluru</strong>, <strong>damage 2x lipat</strong>, dan <strong>bonus HP tambahan</strong>)! Ditambah lagi, kamu bisa mengambil senjata baru setiap memecahkan teka-teki di lintasan!
              </p>
            </div>

            {/* Action Buttons: Retake Quiz, Retry Stage, or Hub */}
            <div className="space-y-2.5 pt-2">
              {/* PRIMARY ACTION: RETAKE QUIZ FROM THE BEGINNING */}
              <button
                onClick={handleRetakeQuiz}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/70 transition-all transform active:scale-98 cursor-pointer border border-emerald-400/40"
              >
                <RotateCcw className="w-5 h-5 text-emerald-200" />
                <div className="text-left">
                  <div className="text-sm font-black leading-tight">Ulangi Kuis dari Awal (Gerbang QUEST)</div>
                  <div className="text-[11px] font-normal text-emerald-100 opacity-90">Kumpulkan poin baru, tingkatkan damage & isi penuh amunisi!</div>
                </div>
              </button>

              {/* SECONDARY ACTION: RETRY CURRENT STAGE */}
              <button
                onClick={handleRestartStage}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>Coba Ulang Stage Misi Ini Langsung</span>
              </button>

              {/* TERTIARY ACTION: RETURN TO HUB */}
              <button
                onClick={() => {
                  audio.playClick();
                  setGameOverReason(null);
                  onAbortMission();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Kembali ke Markas (Hub)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IN-GAME PUZZLE INTERACTIVE MODAL */}
      {activePuzzle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧩</span>
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {activePuzzle.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePuzzle(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 font-medium">
              {activePuzzle.instruction}
            </p>

            {/* Puzzle Options */}
            <div className="space-y-2.5">
              {activePuzzle.options?.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectPuzzleOption(opt.id)}
                  className="w-full text-left p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500 text-sm font-semibold text-slate-200 transition flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  <span className="text-xs text-slate-400">Pilih →</span>
                </button>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActivePuzzle(null)}
                className="px-4 py-1.5 text-xs rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                Tutup Sementara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
