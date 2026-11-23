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
import { shuffleArray } from '../utils/shuffle';
import { getGameSprites, GameSprites } from '../utils/gameSprites';

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

interface HitEffect {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  angle: number;
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
  isChasing?: boolean;
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
    id: 'homing',
    name: 'Kristal Homing Data (Auto-Seeker)',
    badge: 'HOMING MISSILE',
    icon: '🌟',
    description: 'Peluru pintar otomatis berbelok mengejar posisi musuh / boss terdekat sampai tepat sasaran!',
    ammoBonus: 45,
    hpRestore: 30,
    damageMultiplier: 1.25,
    bulletColor: '#10b981',
    bulletLabel: 'SEEKER',
  },
  {
    id: 'spread',
    name: 'Meriam Tabayyun Sebar (Tri-Spread Burst)',
    badge: '3 MISSILE SEBAR',
    icon: '💥',
    description: 'Menembakkan 3 peluru sekaligus menyebar luas. Jika digabung dengan Homing, ketiganya akan melacak target!',
    ammoBonus: 50,
    hpRestore: 25,
    damageMultiplier: 1.15,
    bulletColor: '#c084fc',
    bulletLabel: 'SEBAR-3',
  },
  {
    id: 'rapid',
    name: 'Laser Verifikasi Kilat (Rapid Precision Beam)',
    badge: 'TEMBAKAN KILAT',
    icon: '⚡',
    description: 'Tembakan super cepat beruntun tanpa jeda (cooldown berkurang jadi 110ms) dan kecepatan peluru meningkat pesat!',
    ammoBonus: 55,
    hpRestore: 25,
    damageMultiplier: 1.3,
    bulletColor: '#06b6d4',
    bulletLabel: 'KILAT',
  },
  {
    id: 'heavy',
    name: 'Buster Integritas Raksasa (Heavy Buster)',
    badge: 'BUSTER PENEMBUS',
    icon: '🛡️',
    description: 'Peluru plasma raksasa berdaya hancur tinggi yang menembus banyak musuh sekaligus (piercing)!',
    ammoBonus: 40,
    hpRestore: 45,
    damageMultiplier: 1.8,
    bulletColor: '#f59e0b',
    bulletLabel: 'BUSTER',
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
  // Final boss HP dibuat 5x lipat lebih panjang dari sebelumnya (minimal 3.900 HP, hingga 7.280 HP)
  const calculatedBossMaxHp = Math.max(3900, Math.round(mission.boss.maxHp * 13));
  const [playerHp, setPlayerHp] = useState<number>(initialMaxHp);
  const [bossHp, setBossHp] = useState<number>(calculatedBossMaxHp);
  const [ammo, setAmmo] = useState<number>(weaponLoadout.maxAmmo);
  const [solvedPuzzleIds, setSolvedPuzzleIds] = useState<string[]>([]);
  const [activePuzzle, setActivePuzzle] = useState<InGamePuzzle | null>(null);

  // In-Game Weapon Upgrades: FITUR DIKOMBINASIKAN (tidak menggantikan yang lama)
  const [equippedUpgrades, setEquippedUpgrades] = useState<InGameWeaponUpgrade[]>([]);
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
    state.player.jumpCount = 0;
    state.ammo = weaponLoadout.maxAmmo;
    state.checkpointX = 80;
    state.cameraX = 0;
    state.projectiles = [];
    state.particles = [];
    state.hitEffects = [];
    state.boss.hp = calculatedBossMaxHp;
    state.boss.maxHp = calculatedBossMaxHp;
    state.boss.phase = 1;
    state.boss.spawnTimer = 0;
    state.boss.x = 6600;
    state.boss.y = 260;
    state.startTime = Date.now();
    state.hitsLanded = 0;
    state.projectilesFired = 0;
    state.projectilesDodged = 0;

    // Reset 10 patrol enemies (and clear chasing status)
    state.enemies.forEach((enemy, idx) => {
      enemy.isAlive = true;
      enemy.hp = enemy.maxHp;
      enemy.x = enemy.minX + 30;
      enemy.facing = 'left';
      enemy.shootCooldown = idx * 25;
      enemy.isChasing = false;
    });

    // Reset puzzles
    state.puzzles.forEach(p => {
      p.solved = false;
    });
    state.bridgeRaised = false;

    setPlayerHp(initialMaxHp);
    setBossHp(calculatedBossMaxHp);
    setAmmo(weaponLoadout.maxAmmo);
    setSolvedPuzzleIds([]);
    setGameOverReason(null);
    setEquippedUpgrades([]);
    state.equippedUpgradesRef = [];
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
      width: 30,
      height: 44,
      isGrounded: false,
      jumpsRemaining: weaponLoadout.hasDoubleJump ? 2 : 1,
      jumpCount: 0, // 0 = ground, 1 = single jump, 2 = double jump
      health: initialMaxHp,
      maxHealth: initialMaxHp,
      facing: 'right' as 'right' | 'left',
      invulnerableFrames: 0,
      lastShootTime: 0,
    },
    ammo: weaponLoadout.maxAmmo,
    maxAmmo: weaponLoadout.maxAmmo,
    cameraX: 0,
    boss: {
      x: 6600,
      y: 260,
      vx: 0,
      vy: 1.5,
      width: 88,
      height: 88,
      hp: calculatedBossMaxHp,
      maxHp: calculatedBossMaxHp,
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
    hitEffects: [] as HitEffect[],
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
    equippedUpgradesRef: [] as InGameWeaponUpgrade[],
  });

  // Keep ref synchronized
  useEffect(() => {
    gameStateRef.current.equippedUpgradesRef = equippedUpgrades;
  }, [equippedUpgrades]);

  // Touch controls state
  const touchStateRef = useRef({
    left: false,
    right: false,
  });

  // Open active puzzle handler (with shuffled options)
  const handleOpenPuzzle = (puzzle: InGamePuzzle) => {
    audio.playClick();
    setActivePuzzle({
      ...puzzle,
      options: shuffleArray(puzzle.options || []),
    });
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

  // Weapon Upgrade Selection Handler (FITUR DIKOMBINASIKAN)
  const handleSelectWeaponUpgrade = (upgrade: InGameWeaponUpgrade) => {
    audio.playPowerUp();

    const state = gameStateRef.current;
    const exists = state.equippedUpgradesRef.some(u => u.id === upgrade.id);
    let nextUpgrades = [...state.equippedUpgradesRef];
    if (!exists) {
      nextUpgrades.push(upgrade);
    }
    state.equippedUpgradesRef = nextUpgrades;
    setEquippedUpgrades(nextUpgrades);

    // Refill ammo & add bonus (mendukung pertarungan boss 5x HP)
    state.ammo = Math.min(weaponLoadout.maxAmmo + 180, state.ammo + upgrade.ammoBonus);
    setAmmo(state.ammo);

    // Restore player HP
    state.player.health = Math.min(initialMaxHp, state.player.health + upgrade.hpRestore);
    setPlayerHp(state.player.health);

    setWeaponRewardModal(false);

    const comboBadges = nextUpgrades.map(u => u.badge).join(' + ');
    if (nextUpgrades.length > 1) {
      setRewardNotice(`🔥 KOMBINASI SENJATA TERBENTUK: [${comboBadges}] (+${upgrade.ammoBonus} Peluru & +${upgrade.hpRestore} HP)`);
    } else {
      setRewardNotice(`⚡ FITUR AKTIF: [${upgrade.name}] (+${upgrade.ammoBonus} Peluru & +${upgrade.hpRestore} HP)`);
    }

    setTimeout(() => {
      setRewardNotice(null);
    }, 4500);
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
      state.player.jumpCount = state.player.jumpCount === 0 ? 1 : 2;

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

    const upgrades = state.equippedUpgradesRef || [];
    const hasRapid = upgrades.some(u => u.id === 'rapid');
    const hasSpread = upgrades.some(u => u.id === 'spread');
    const hasHeavy = upgrades.some(u => u.id === 'heavy');
    const hasHoming = upgrades.some(u => u.id === 'homing');

    const attackCooldown = hasRapid ? 110 : 220;

    const now = Date.now();
    if (now - state.lastAttackTime < attackCooldown) return;
    state.lastAttackTime = now;
    state.player.lastShootTime = now;

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
    let baseFinalDamage = Math.round((weaponLoadout.baseDamage * weaponLoadout.damageMultiplier) + accuracyBonus);

    // Multipliers combine
    let combinedMultiplier = 1;
    upgrades.forEach(u => {
      combinedMultiplier *= u.damageMultiplier;
    });
    let finalDamage = Math.round(baseFinalDamage * Math.min(3.5, combinedMultiplier));

    const startX = state.player.x + (dir === 1 ? state.player.width + 4 : -12);
    const startY = state.player.y + 14;

    const baseSpeed = (hasRapid ? 13.5 : 9.5) * gameSpeed;
    const radius = hasHeavy ? 12 : hasRapid ? 8 : 7;
    const piercing = hasHeavy;
    const homing = hasHoming;

    // Combined color & badge label
    let bulletColor = '#38bdf8';
    let bulletLabel = 'VERIF';
    if (hasHoming && hasSpread && hasHeavy) {
      bulletColor = '#c084fc';
      bulletLabel = 'HOMING-3-BUSTER';
    } else if (hasHoming && hasSpread) {
      bulletColor = '#2dd4bf';
      bulletLabel = 'HOMING-3';
    } else if (hasHoming) {
      bulletColor = '#10b981';
      bulletLabel = 'SEEKER';
    } else if (hasSpread) {
      bulletColor = '#c084fc';
      bulletLabel = 'SEBAR-3';
    } else if (hasHeavy) {
      bulletColor = '#f59e0b';
      bulletLabel = 'BUSTER';
    } else if (hasRapid) {
      bulletColor = '#06b6d4';
      bulletLabel = 'KILAT';
    }

    // If Spread is active (or combined with Homing / Buster / Rapid)
    if (hasSpread) {
      // Center Projectile
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * baseSpeed,
        vy: 0,
        radius: radius,
        color: bulletColor,
        isPlayer: true,
        damage: Math.round(finalDamage * 0.95),
        piercing: piercing,
        homing: homing,
        text: bulletLabel,
      });
      // Angled Up Projectile
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * (baseSpeed * 0.95),
        vy: -2.8,
        radius: Math.max(5, radius - 1),
        color: hasHoming ? '#10b981' : '#e879f9',
        isPlayer: true,
        damage: Math.round(finalDamage * 0.8),
        piercing: piercing,
        homing: homing,
      });
      // Angled Down Projectile
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * (baseSpeed * 0.95),
        vy: 2.8,
        radius: Math.max(5, radius - 1),
        color: hasHoming ? '#10b981' : '#e879f9',
        isPlayer: true,
        damage: Math.round(finalDamage * 0.8),
        piercing: piercing,
        homing: homing,
      });
    } else {
      // Single Projectile with all accumulated features
      state.projectiles.push({
        x: startX,
        y: startY,
        vx: dir * baseSpeed,
        vy: 0,
        radius: radius,
        color: bulletColor,
        isPlayer: true,
        damage: finalDamage,
        piercing: piercing,
        homing: homing,
        text: bulletLabel,
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
          player.jumpCount = 0;
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

      // UPDATE PATROL MINIONS (Moving, Chasing & Directional Shooting Enemies)
      state.enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        // Musuh yang di-skip (pemain melewatinya / melompatinya) akan mengejar karakter utama
        if (player.x > enemy.x + 35 || enemy.isChasing) {
          enemy.isChasing = true;
        }

        if (enemy.isChasing) {
          // Mode Pengejaran Terus-Menerus sampai kena tembak & kalah!
          const chaseDir = player.x > enemy.x ? 1 : -1;
          enemy.facing = chaseDir === 1 ? 'right' : 'left';
          enemy.x += chaseDir * 2.6 * gameSpeed;
        } else {
          // Patroli bolak-balik normal
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
        }

        // Shooting behavior towards player
        const distToPlayer = Math.abs(player.x - enemy.x);
        if (distToPlayer < 480 && Math.abs(player.y - enemy.y) < 200) {
          enemy.facing = player.x > enemy.x ? 'right' : 'left';
          enemy.shootCooldown += 1;
          if (enemy.shootCooldown >= enemy.shootInterval) {
            enemy.shootCooldown = 0;
            const shootDir = enemy.facing === 'right' ? 1 : -1;
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
      // GERBANG INTEGRITAS (x = 5950): SEMUA LAWAN HARUS DIKALAHKAN
      // Pemain tidak bisa masuk ke Arena Final Boss jika masih ada musuh lintasan yang hidup!
      // ========================================================
      const aliveRoadMinions = state.enemies.slice(0, 8).filter(e => e.isAlive).length;
      if (aliveRoadMinions > 0 && player.x > 5950) {
        player.x = 5950;
        player.vx = 0;
      }

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

          // PHASE 1: DIRECT TARGETED AIM IN ANY DIRECTION (3x lipat damage pasukan kecil: 30-36 dmg)
          state.projectiles.push({
            x: bossCenterX,
            y: bossCenterY,
            vx: Math.cos(targetAngle) * pSpeed,
            vy: Math.sin(targetAngle) * pSpeed,
            radius: 8,
            color: '#f43f5e',
            isPlayer: false,
            damage: boss.phase === 3 ? 36 : 30,
            text: 'HALUSINASI 3X',
          });

          // PHASE 2: TRI-SPREAD CONE TOWARDS PLAYER (3x lipat damage: 30 dmg)
          if (boss.phase >= 2) {
            state.projectiles.push({
              x: bossCenterX,
              y: bossCenterY,
              vx: Math.cos(targetAngle - 0.28) * pSpeed,
              vy: Math.sin(targetAngle - 0.28) * pSpeed,
              radius: 7,
              color: '#a855f7',
              isPlayer: false,
              damage: 30,
              text: 'DATA PALSU',
            });
            state.projectiles.push({
              x: bossCenterX,
              y: bossCenterY,
              vx: Math.cos(targetAngle + 0.28) * pSpeed,
              vy: Math.sin(targetAngle + 0.28) * pSpeed,
              radius: 7,
              color: '#a855f7',
              isPlayer: false,
              damage: 30,
              text: 'DATA PALSU',
            });
          }

          // PHASE 2 & 3: 360-DEGREE RADIAL NOVA BURST (3x lipat damage: 30-32 dmg)
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
                radius: 7,
                color: '#ec4899',
                isPlayer: false,
                damage: boss.phase === 3 ? 32 : 30,
                text: 'BURST 3X',
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

            // Spawn hitting object impact graphic
            state.hitEffects.push({
              x: proj.x,
              y: proj.y,
              life: 0,
              maxLife: 15,
              size: 46,
              angle: Math.random() * Math.PI * 2,
            });

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
            if (boss.hp <= 0) {
              boss.hp = 0;
              const allEnemiesDefeated = state.enemies.every(e => !e.isAlive);

              if (allEnemiesDefeated && !state.isVictory) {
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
              } else if (!allEnemiesDefeated) {
                // Boss is down but remaining pursuit enemies must still be neutralized!
                const remainingCount = state.enemies.filter(e => e.isAlive).length;
                setRewardNotice(`⚠️ Final Boss lumpuh! Kalahkan ${remainingCount} musuh pengejar yang tersisa untuk menang!`);
              }
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

              // Spawn hitting object impact graphic
              state.hitEffects.push({
                x: proj.x,
                y: proj.y,
                life: 0,
                maxLife: 14,
                size: 38,
                angle: Math.random() * Math.PI * 2,
              });

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
                // Bonus +6 peluru saat berhasil mengalahkan musuh agar cukup melawan Boss 5x HP
                state.ammo = Math.min(weaponLoadout.maxAmmo + 180, state.ammo + 6);
                setAmmo(state.ammo);
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

                // If boss is already defeated and this was the last enemy, trigger victory!
                const allEnemiesNowDefeated = state.enemies.every(e => !e.isAlive);
                if (allEnemiesNowDefeated && boss.hp <= 0 && !state.isVictory) {
                  state.isVictory = true;
                  audio.playBossDefeat();

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

      // UPDATE HIT EFFECTS (hitting object from sheet)
      for (let i = state.hitEffects.length - 1; i >= 0; i--) {
        const hit = state.hitEffects[i];
        hit.life += 1;
        if (hit.life >= hit.maxLife) {
          state.hitEffects.splice(i, 1);
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

      const sprites = getGameSprites();

      // Render Platforms (Ground with 'land' sprite texture from sheet)
      platforms.forEach(plat => {
        if (plat.type === 'ground') {
          if (sprites.land && sprites.land.complete && sprites.land.naturalWidth > 0) {
            const tileW = 110;
            for (let lx = plat.x; lx < plat.x + plat.width; lx += tileW) {
              const curW = Math.min(tileW, plat.x + plat.width - lx);
              const srcW = (curW / tileW) * sprites.land.naturalWidth;
              ctx.drawImage(
                sprites.land,
                0,
                0,
                srcW,
                sprites.land.naturalHeight,
                lx,
                plat.y,
                curW,
                plat.height
              );
            }
            // Crisp top cyber trim for collision precision
            ctx.fillStyle = '#10b981';
            ctx.fillRect(plat.x, plat.y, plat.width, 3);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(plat.x, plat.y, plat.width, 4);
          }
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
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 9px sans-serif';
          ctx.fillText('↕ Platform Bergerak', plat.x + 6, plat.y + 12);
        } else {
          // Floating platform
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(plat.x, plat.y, plat.width, 3);
          if (plat.label) {
            ctx.fillStyle = '#6ee7b7';
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

      // Render 10 Patrol Minions (enemy left & enemy right sprites from sheet)
      state.enemies.forEach(enemy => {
        if (!enemy.isAlive) return;

        const enemySprite = enemy.facing === 'left' ? sprites.enemy_left : sprites.enemy_right;
        const eDrawW = 38;
        const eDrawH = 44;
        const eDrawX = enemy.x - 3;
        const eDrawY = enemy.y - 6;

        if (enemySprite && enemySprite.complete && enemySprite.naturalWidth > 0) {
          ctx.drawImage(enemySprite, eDrawX, eDrawY, eDrawW, eDrawH);
        } else {
          // Fallback enemy body
          ctx.fillStyle = enemy.color;
          ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
          ctx.font = '16px sans-serif';
          ctx.fillText(enemy.emoji, enemy.x + 4, enemy.y + 24);
        }

        // HP bar above minion
        const hpBarW = 34;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(enemy.x - 1, enemy.y - 12, hpBarW, 4);
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x - 1, enemy.y - 12, hpBarW * (enemy.hp / enemy.maxHp), 4);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 8px sans-serif';
        ctx.fillText(enemy.name, enemy.x - 8, enemy.y - 16);

        // Chasing indicator if skipped
        if (enemy.isChasing) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('⚠️ MENGEJAR!', enemy.x - 8, enemy.y - 26);
        }
      });

      // Render Gerbang Integritas (Cyber Gate at x = 5950)
      if (5950 > state.cameraX - 120 && 5950 < state.cameraX + canvas.width + 120) {
        const aliveMinionsCount = state.enemies.slice(0, 8).filter(e => e.isAlive).length;
        if (aliveMinionsCount > 0) {
          // Locked Barrier Forcefield
          ctx.save();
          ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
          ctx.fillRect(5940, 120, 20, 300);

          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(5950, 120);
          ctx.lineTo(5950, 420);
          ctx.stroke();

          ctx.shadowBlur = 0;
          ctx.fillStyle = '#fee2e2';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`🔒 GERBANG TERKUNCI!`, 5865, 230);
          ctx.fillStyle = '#fca5a5';
          ctx.font = 'bold 8px sans-serif';
          ctx.fillText(`Kalahkan ${aliveMinionsCount} lawan di jalan dahulu!`, 5835, 245);
          ctx.restore();
        } else {
          // Open Gate
          ctx.save();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.moveTo(5950, 120);
          ctx.lineTo(5950, 420);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('🔓 GERBANG TERBUKA! HADAPI FINAL BOSS!', 5835, 240);
          ctx.restore();
        }
      }

      // Render Final Boss (Sector 5 - final boss sprite from sheet)
      if (boss.hp > 0 && boss.x > state.cameraX - 180 && boss.x < state.cameraX + canvas.width + 180) {
        const bossAuraColor = boss.phase === 3 ? '#ec4899' : boss.phase === 2 ? '#a855f7' : mission.boss.color;

        if (sprites.final_boss && sprites.final_boss.complete && sprites.final_boss.naturalWidth > 0) {
          ctx.save();
          ctx.shadowColor = bossAuraColor;
          ctx.shadowBlur = boss.phase === 3 ? 20 : 12;
          ctx.drawImage(sprites.final_boss, boss.x, boss.y, boss.width, boss.height);
          ctx.restore();
        } else {
          // Fallback Boss outer aura & body
          ctx.strokeStyle = bossAuraColor;
          ctx.lineWidth = boss.phase === 3 ? 3 : 2;
          ctx.strokeRect(boss.x - 4, boss.y - 4, boss.width + 8, boss.height + 8);

          ctx.fillStyle = mission.boss.color;
          ctx.fillRect(boss.x, boss.y, boss.width, boss.height);

          ctx.fillStyle = boss.phase === 3 ? '#ef4444' : '#fbbf24';
          const bossFacingLeft = player.x < boss.x;
          const eyeOffset = bossFacingLeft ? 8 : boss.width - 24;
          ctx.fillRect(boss.x + eyeOffset, boss.y + 14, 16, 12);
        }

        // Boss Name & Phase Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`👾 ${mission.boss.name}`, boss.x - 10, boss.y - 20);

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = boss.phase === 3 ? '#f43f5e' : boss.phase === 2 ? '#c084fc' : '#38bdf8';
        ctx.fillText(
          `Fase ${boss.phase}: ${boss.phase === 3 ? 'OVERDRIVE 360°' : boss.phase === 2 ? 'SEBARAN TRI-CONE' : 'TARGETED AIM'}`,
          boss.x - 10,
          boss.y - 8
        );

        // Boss HP Bar
        const barWidth = 140;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(boss.x - (barWidth - boss.width) / 2, boss.y + boss.height + 8, barWidth, 8);
        ctx.fillStyle = bossAuraColor;
        ctx.fillRect(
          boss.x - (barWidth - boss.width) / 2,
          boss.y + boss.height + 8,
          barWidth * (boss.hp / boss.maxHp),
          8
        );
      }

      // Render Player Character (mc right, mc left, jump, jump twice from sheet)
      if (player.invulnerableFrames <= 0 || Math.floor(player.invulnerableFrames / 4) % 2 === 0) {
        let playerSprite: HTMLImageElement | null = null;
        let flipHorizontal = false;

        if (!player.isGrounded) {
          // In air jumping states:
          // jump twice: main character double jump
          // jump: main character single jump
          if (player.jumpCount >= 2) {
            playerSprite = sprites.jump_twice;
          } else {
            playerSprite = sprites.jump;
          }
          // Follow player horizontal facing
          if (player.facing === 'left') {
            flipHorizontal = true;
          }
        } else {
          // On ground:
          // mc right: main character facing right and moving right
          // mc left: main character facing left and moving left
          if (player.facing === 'left') {
            playerSprite = sprites.mc_left;
          } else {
            playerSprite = sprites.mc_right;
          }
        }

        const pDrawW = 34;
        const pDrawH = 46;
        const pDrawX = player.x - 2;
        const pDrawY = player.y - 2;

        if (playerSprite && playerSprite.complete && playerSprite.naturalWidth > 0) {
          ctx.save();
          if (flipHorizontal) {
            ctx.translate(pDrawX + pDrawW, pDrawY);
            ctx.scale(-1, 1);
            ctx.drawImage(playerSprite, 0, 0, pDrawW, pDrawH);
          } else {
            ctx.drawImage(playerSprite, pDrawX, pDrawY, pDrawW, pDrawH);
          }
          ctx.restore();

          // Weapon upgrade indicator ring if active (combined)
          if (equippedUpgrades.length > 0) {
            ctx.save();
            const topUpgrade = equippedUpgrades[equippedUpgrades.length - 1];
            ctx.strokeStyle = topUpgrade.bulletColor;
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(pDrawX - 3, pDrawY - 3, pDrawW + 6, pDrawH + 6);
            ctx.setLineDash([]);
            ctx.restore();
          }
        } else {
          // Fallback vector drawing
          const topUpgrade = equippedUpgrades[equippedUpgrades.length - 1];
          ctx.fillStyle = topUpgrade
            ? topUpgrade.bulletColor
            : weaponLoadout.tier === 'master'
            ? '#38bdf8'
            : weaponLoadout.tier === 'enhanced'
            ? '#34d399'
            : '#10b981';
          ctx.fillRect(player.x, player.y, player.width, player.height);

          ctx.fillStyle = '#ffffff';
          const eyeOffset = player.facing === 'right' ? 18 : 4;
          ctx.fillRect(player.x + eyeOffset, player.y + 8, 7, 5);

          ctx.fillStyle = '#065f46';
          const capeOffset = player.facing === 'right' ? 2 : player.width - 6;
          ctx.fillRect(player.x + capeOffset, player.y + 12, 4, 22);
        }
      }

      // Render Projectiles (bullet & enemy blast sprites from sheet)
      state.projectiles.forEach(proj => {
        if (proj.isPlayer) {
          // MC bullet sprite
          if (sprites.bullet && sprites.bullet.complete && sprites.bullet.naturalWidth > 0) {
            ctx.save();
            ctx.translate(proj.x, proj.y);
            const angle = Math.atan2(proj.vy, proj.vx);
            ctx.rotate(angle);
            const bw = 24;
            const bh = 11;
            ctx.drawImage(sprites.bullet, -bw / 2, -bh / 2, bw, bh);
            ctx.restore();
          } else {
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();
          }

          if (proj.text) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 7px monospace';
            ctx.fillText(proj.text, proj.x - 10, proj.y - 8);
          }
        } else {
          // Enemy and boss projectile: enemy blast sprite
          if (sprites.enemy_blast && sprites.enemy_blast.complete && sprites.enemy_blast.naturalWidth > 0) {
            ctx.save();
            ctx.translate(proj.x, proj.y);
            const angle = Math.atan2(proj.vy, proj.vx);
            ctx.rotate(angle);
            const isBossProj = proj.radius > 6;
            const ew = isBossProj ? 38 : 28;
            const eh = (ew * 213) / 635;
            ctx.drawImage(sprites.enemy_blast, -ew / 2, -eh / 2, ew, eh);
            ctx.restore();
          } else {
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
            ctx.fill();
          }

          if (proj.text) {
            ctx.fillStyle = '#fecdd3';
            ctx.font = 'bold 7px monospace';
            ctx.fillText(proj.text, proj.x - 10, proj.y - 8);
          }
        }
      });

      // Render Hit Effects (hitting object sprite when bullet impacts enemy)
      state.hitEffects.forEach(hit => {
        if (sprites.hitting_object && sprites.hitting_object.complete && sprites.hitting_object.naturalWidth > 0) {
          ctx.save();
          ctx.translate(hit.x, hit.y);
          ctx.rotate(hit.angle);
          const progress = hit.life / hit.maxLife;
          const scale = 0.8 + progress * 0.45;
          ctx.globalAlpha = Math.max(0, 1 - progress);
          const s = hit.size * scale;
          ctx.drawImage(sprites.hitting_object, -s / 2, -s / 2, s, s);
          ctx.restore();
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

      // =============================================================
      // IN-GAME SCREEN HUD (Drawn directly on canvas, static to screen)
      // Bar Nyawa (Health Bar), Jumlah Peluru (Ammo Gauge), Weapon & Boss HP
      // =============================================================
      ctx.save();
      const hudX = 14;
      const hudY = 12;

      // 1. TOP-LEFT: BAR NYAWA & JUMLAH PELURU CARD
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.95)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX - 4, hudY - 4, 230, 84, 10);
      ctx.fill();
      ctx.stroke();

      // Label & Bar: BAR NYAWA
      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('❤️ BAR NYAWA', hudX + 2, hudY + 12);

      const hpBarW = 126;
      const hpBarH = 12;
      const hpBarX = hudX + 90;
      const hpBarY = hudY + 2;

      // Bar Nyawa background
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(hpBarX, hpBarY, hpBarW, hpBarH, 4);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Bar Nyawa fill
      const hpRatio = Math.max(0, Math.min(1, player.health / player.maxHealth));
      if (hpRatio > 0) {
        const hpFillW = Math.max(4, hpBarW * hpRatio);
        ctx.fillStyle = hpRatio > 0.5 ? '#10b981' : hpRatio > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.beginPath();
        ctx.roundRect(hpBarX, hpBarY, hpFillW, hpBarH, 4);
        ctx.fill();
      }

      // Bar Nyawa text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${player.health} / ${player.maxHealth} HP`, hpBarX + hpBarW / 2 - 24, hpBarY + 9);

      // Label & Bar: JUMLAH PELURU
      const ammoY = hudY + 22;
      const isAmmoLow = state.ammo <= 5;
      ctx.fillStyle = isAmmoLow ? '#f43f5e' : '#fbbf24';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('⚡ PELURU', hudX + 2, ammoY + 12);

      const ammoBarW = 126;
      const ammoBarH = 12;
      const ammoBarX = hudX + 90;
      const ammoBarY = ammoY + 2;

      // Peluru background
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.roundRect(ammoBarX, ammoBarY, ammoBarW, ammoBarH, 4);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Peluru fill
      const ammoRatio = Math.max(0, Math.min(1, state.ammo / weaponLoadout.maxAmmo));
      if (ammoRatio > 0) {
        const ammoFillW = Math.max(4, ammoBarW * ammoRatio);
        ctx.fillStyle = isAmmoLow ? '#f43f5e' : state.ammo <= 12 ? '#f59e0b' : '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(ammoBarX, ammoBarY, ammoFillW, ammoBarH, 4);
        ctx.fill();
      }

      // Peluru text
      ctx.fillStyle = isAmmoLow ? '#fecdd3' : '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${state.ammo} / ${weaponLoadout.maxAmmo}${isAmmoLow ? ' [KRITIS!]' : ''}`, ammoBarX + 8, ammoBarY + 9);

      // Weapon Upgrade indicator badge (Kombinasi fitur)
      const wpnY = hudY + 44;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('🔫 SENJATA:', hudX + 2, wpnY + 9);
      ctx.fillStyle = equippedUpgrades.length > 0 ? '#67e8f9' : '#34d399';
      ctx.font = 'bold 9px sans-serif';
      const wpnLabel = equippedUpgrades.length > 0
        ? `KOMBO: ${equippedUpgrades.map(u => u.badge).join(' + ')}`
        : weaponLoadout.name;
      ctx.fillText(wpnLabel.length > 24 ? wpnLabel.substring(0, 23) + '…' : wpnLabel, hudX + 68, wpnY + 9);

      // Defeated Enemies counter row (Semua lawan harus dikalahkan)
      const emyY = hudY + 60;
      const totalEnemies = state.enemies.length;
      const defeatedEnemies = state.enemies.filter(e => !e.isAlive).length;
      const allDefeated = defeatedEnemies === totalEnemies;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px sans-serif';
      ctx.fillText('👾 LAWAN:', hudX + 2, emyY + 9);
      ctx.fillStyle = allDefeated ? '#34d399' : '#fb923c';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${defeatedEnemies}/${totalEnemies} KALAH ${allDefeated ? '✓ (BERSIH)' : '(WAJIB SEMUA)'}`, hudX + 68, emyY + 9);

      // 2. TOP-CENTER: EPIC FINAL BOSS HEALTH BAR (When in Sector 5 or boss is engaged)
      const isBossEncounter = player.x > 5600 || boss.hp < calculatedBossMaxHp;
      if (isBossEncounter && boss.hp > 0) {
        const bossBarW = 320;
        const bossBarH = 14;
        const bossBarX = (canvas.width - bossBarW) / 2;
        const bossBarY = 12;

        ctx.fillStyle = 'rgba(24, 10, 24, 0.92)';
        ctx.strokeStyle = boss.phase === 3 ? '#f43f5e' : '#c084fc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(bossBarX - 8, bossBarY - 4, bossBarW + 16, 42, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbcfe8';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`👾 FINAL BOSS: ${mission.boss.name}`, bossBarX, bossBarY + 10);

        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = boss.phase === 3 ? '#fda4af' : '#e9d5ff';
        const phaseName = boss.phase === 3 ? 'OVERDRIVE 360°' : boss.phase === 2 ? 'TRI-SPREAD CONE' : 'TARGETED AIM';
        ctx.fillText(`FASE ${boss.phase} (${phaseName})`, bossBarX + bossBarW - 130, bossBarY + 10);

        // Long Boss HP Bar
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.roundRect(bossBarX, bossBarY + 16, bossBarW, bossBarH, 4);
        ctx.fill();
        ctx.strokeStyle = '#6b21a8';
        ctx.stroke();

        const bRatio = Math.max(0, Math.min(1, boss.hp / calculatedBossMaxHp));
        if (bRatio > 0) {
          ctx.fillStyle = boss.phase === 3 ? '#ef4444' : boss.phase === 2 ? '#ec4899' : '#f43f5e';
          ctx.beginPath();
          ctx.roundRect(bossBarX, bossBarY + 16, Math.max(4, bossBarW * bRatio), bossBarH, 4);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(`${boss.hp} / ${calculatedBossMaxHp} HP`, bossBarX + bossBarW / 2 - 42, bossBarY + 27);
      }

      // 3. TOP-RIGHT: MINI PROGRESS
      const rightX = canvas.width - 145;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.9)';
      ctx.beginPath();
      ctx.roundRect(rightX, hudY - 4, 134, 40, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText(`🚩 Sektor ${currentSector}/5 (${Math.round((player.x / 7200) * 100)}%)`, rightX + 6, hudY + 11);

      ctx.fillStyle = '#34d399';
      ctx.fillText(`🧩 Teka-teki: ${state.puzzles.filter(p => p.solved).length}/${mission.inGamePuzzles.length}`, rightX + 6, hudY + 27);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [weaponLoadout, mission, gameSpeed, solvedPuzzleIds, calculatedBossMaxHp]);

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
              <strong className={equippedUpgrades.length > 0 ? 'text-amber-300 flex items-center gap-0.5' : 'text-teal-400'}>
                {equippedUpgrades.length > 0
                  ? `🔥 [${equippedUpgrades.map(u => u.badge).join(' + ')}]`
                  : weaponLoadout.name}
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

        {/* Ammo, Enemies & Health Gauges with bold labels */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ENEMY DEFEATED COUNTER (Semua lawan wajib dikalahkan) */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-purple-500/30 shadow-md">
            <span className="text-sm">👾</span>
            <div className="text-left">
              <div className="text-[9px] text-purple-300/80 uppercase font-bold tracking-wider">Lawan Kalah</div>
              <div className="text-xs font-black font-mono text-purple-300">
                {gameStateRef.current.enemies.filter(e => !e.isAlive).length} / {gameStateRef.current.enemies.length}
              </div>
            </div>
          </div>

          {/* AMMO COUNTER GAUGE */}
          <div className="flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-amber-500/30 shadow-md">
            <Zap className={`w-4 h-4 ${ammo <= 5 ? 'text-rose-400 animate-pulse fill-rose-400' : 'text-amber-400 fill-amber-400'}`} />
            <div className="text-left">
              <div className="text-[9px] text-amber-300/80 uppercase font-bold tracking-wider">Jumlah Peluru</div>
              <div className={`text-xs font-black font-mono ${ammo <= 5 ? 'text-rose-400 animate-pulse' : ammo <= 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {ammo} / {weaponLoadout.maxAmmo}
              </div>
            </div>
          </div>

          {/* Player HP */}
          <div className="flex items-center gap-2 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-rose-500/30 shadow-md">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
            <div>
              <div className="text-[9px] text-rose-300/80 uppercase font-bold tracking-wider">Bar Nyawa</div>
              <div className="flex items-center gap-1.5">
                <div className="w-14 sm:w-20 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
                  <div
                    className={`h-full transition-all duration-200 ${
                      playerHp > initialMaxHp * 0.5
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : playerHp > initialMaxHp * 0.25
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                    }`}
                    style={{ width: `${Math.max(0, (playerHp / initialMaxHp) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-black text-slate-100 font-mono">
                  {playerHp}
                </span>
              </div>
            </div>
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

          {/* High-Visibility In-Game HUD Overlay right on top of canvas */}
          <div className="absolute top-2.5 left-2.5 right-2.5 pointer-events-none flex flex-wrap items-start justify-between gap-2 z-20">
            {/* Left: Bar Nyawa & Jumlah Peluru Card */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-col gap-1.5 min-w-[200px] sm:min-w-[230px]">
              {/* Bar Nyawa */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-rose-400">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                  <span>BAR NYAWA:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 sm:w-28 bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div
                      className={`h-full transition-all duration-200 ${
                        playerHp > initialMaxHp * 0.5
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : playerHp > initialMaxHp * 0.25
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-600 to-red-500 animate-pulse'
                      }`}
                      style={{ width: `${Math.max(0, (playerHp / initialMaxHp) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-white font-mono min-w-[46px] text-right">
                    {playerHp}/{initialMaxHp}
                  </span>
                </div>
              </div>

              {/* Jumlah Peluru */}
              <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-400">
                  <Zap className={`w-3.5 h-3.5 ${ammo <= 5 ? 'text-rose-400 animate-pulse fill-rose-400' : 'text-amber-400 fill-amber-400'}`} />
                  <span>JUMLAH PELURU:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-black font-mono px-2 py-0.5 rounded-lg border ${
                      ammo <= 5
                        ? 'bg-rose-950/90 text-rose-300 border-rose-500 animate-pulse'
                        : ammo <= 12
                        ? 'bg-amber-950/90 text-amber-300 border-amber-500'
                        : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                    }`}
                  >
                    {ammo} / {weaponLoadout.maxAmmo}
                  </span>
                  {ammo <= 5 && (
                    <span className="text-[9px] text-rose-400 font-extrabold animate-pulse hidden sm:inline">
                      KRITIS!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Center: Boss HP Bar in Sector 5 / Boss encounter */}
            {(gameStateRef.current.player.x > 5600 || bossHp < calculatedBossMaxHp) && bossHp > 0 && (
              <div className="bg-slate-950/95 backdrop-blur-md border-2 border-rose-500/80 rounded-2xl px-3 py-1.5 shadow-2xl flex flex-col items-center gap-1 min-w-[210px] sm:min-w-[260px]">
                <div className="flex items-center justify-between w-full text-[10px] font-black text-rose-300">
                  <span className="flex items-center gap-1">👾 FINAL BOSS: {mission.boss.name}</span>
                  <span className="text-amber-400 font-mono">{bossHp} / {calculatedBossMaxHp} HP</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-rose-950">
                  <div
                    className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 h-full transition-all duration-150"
                    style={{ width: `${Math.max(0, (bossHp / calculatedBossMaxHp) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Right: Teka-teki & Sektor status badge */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-xl flex items-center gap-2.5 text-xs">
              <div className="text-right">
                <div className="text-[9px] text-slate-400">Teka-teki</div>
                <div className="font-black text-emerald-400 text-xs">
                  {solvedPuzzleIds.length} / {mission.inGamePuzzles.length}
                </div>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-right">
                <div className="text-[9px] text-cyan-400">Sektor</div>
                <div className="font-black text-cyan-300 text-xs">
                  {currentSector}/5
                </div>
              </div>
            </div>
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
            <span>Tembak ({equippedUpgrades.length > 0 ? equippedUpgrades.map(u => u.badge).join(' + ') : 'Verifikasi'})</span>
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
                    Teka-teki Berhasil! Kombinasikan Fitur Senjata
                  </h3>
                  <p className="text-xs text-teal-300 font-semibold">
                    Fitur digabungkan! (Misal: Homing + 3 Missile = 3 peluru pelacak)
                  </p>
                </div>
              </div>
            </div>

            {/* Currently Active Combinations */}
            {equippedUpgrades.length > 0 && (
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-teal-500/30 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Kombinasi Aktif:</span>
                {equippedUpgrades.map(u => (
                  <span
                    key={u.id}
                    className="px-2.5 py-1 rounded-xl bg-teal-950 border border-teal-400/50 text-teal-300 font-black flex items-center gap-1 text-[11px]"
                  >
                    <span>{u.icon}</span>
                    <span>{u.badge}</span>
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs sm:text-sm text-slate-300">
              Pilih salah satu fitur di bawah untuk <strong>digabungkan</strong> ke senjatamu saat ini. Setiap peningkatan akan menambah amunisi & memulihkan HP!
            </p>

            {/* Weapon Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {WEAPON_UPGRADES.map(upgrade => {
                const isAlreadyOwned = equippedUpgrades.some(u => u.id === upgrade.id);
                return (
                  <button
                    key={upgrade.id}
                    onClick={() => handleSelectWeaponUpgrade(upgrade)}
                    className={`p-3.5 rounded-2xl transition-all text-left flex flex-col justify-between group cursor-pointer shadow-lg ${
                      isAlreadyOwned
                        ? 'bg-teal-950/40 border-2 border-teal-400/80 hover:border-teal-300'
                        : 'bg-slate-800 hover:bg-slate-750 border-2 border-slate-700 hover:border-teal-400 hover:shadow-teal-950/50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{upgrade.icon}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/40 uppercase">
                          {upgrade.badge}
                        </span>
                      </div>
                      <div className="font-black text-sm text-white group-hover:text-teal-300 transition flex items-center gap-1.5">
                        <span>{upgrade.name}</span>
                        {isAlreadyOwned && <span className="text-emerald-400 text-xs">✓</span>}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">
                        {upgrade.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-amber-400">⚡ +{upgrade.ammoBonus} Peluru</span>
                      <span className="text-rose-400">❤️ +{upgrade.hpRestore} HP</span>
                    </div>

                    <div className="mt-2 text-[10px] text-center font-bold py-1 rounded-lg bg-slate-900/90 text-cyan-300">
                      {isAlreadyOwned ? '✓ SUDAH TERGABUNG (Pilih untuk +Peluru & HP)' : '+ GABUNGKAN FITUR INI'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center text-xs text-slate-400">
              Pilihan fitur langsung digabung secara akumulatif ke senjatamu di lintasan.
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
