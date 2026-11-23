// Preloaded game sprites for the 2D RPG Platformer
// Assets configured from Google Sheet:
// 1. mc right: Main character facing right and moving right
// 2. mc left: Main character facing left and moving left
// 3. land: Ground / platform surface where main character and enemies move
// 4. hitting object: Bullet impact / explosion effect when bullet hits enemy
// 5. bullet: Bullet fired by main character
// 6. jump twice: Main character double jump state
// 7. jump: Main character single jump state
// 8. shoot: Main character shooting stance
// 9. enemy blast: Projectile fired by enemy / boss
// 10. final boss: Final boss sprite (Sector 5)
// 11. enemy left: Regular enemy facing / moving left
// 12. enemy right: Regular enemy facing / moving right

export interface GameSprites {
  mc_right: HTMLImageElement;
  mc_left: HTMLImageElement;
  land: HTMLImageElement;
  hitting_object: HTMLImageElement;
  bullet: HTMLImageElement;
  jump_twice: HTMLImageElement;
  jump: HTMLImageElement;
  shoot: HTMLImageElement;
  enemy_blast: HTMLImageElement;
  final_boss: HTMLImageElement;
  enemy_left: HTMLImageElement;
  enemy_right: HTMLImageElement;
}

const SPRITE_PATHS: Record<keyof GameSprites, string> = {
  mc_right: '/sprites/mc_right.png',
  mc_left: '/sprites/mc_left.png',
  land: '/sprites/land.png',
  hitting_object: '/sprites/hitting_object.png',
  bullet: '/sprites/bullet.png',
  jump_twice: '/sprites/jump_twice.png',
  jump: '/sprites/jump.png',
  shoot: '/sprites/shoot.png',
  enemy_blast: '/sprites/enemy_blast.png',
  final_boss: '/sprites/final_boss.png',
  enemy_left: '/sprites/enemy_left.png',
  enemy_right: '/sprites/enemy_right.png',
};

// Singleton sprite cache
let cachedSprites: GameSprites | null = null;
let isLoaded = false;
const loadListeners: Array<() => void> = [];

export function getGameSprites(): GameSprites {
  if (cachedSprites) {
    return cachedSprites;
  }

  const sprites: Partial<GameSprites> = {};
  let loadedCount = 0;
  const total = Object.keys(SPRITE_PATHS).length;

  for (const [key, path] of Object.entries(SPRITE_PATHS) as [keyof GameSprites, string][]) {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      loadedCount++;
      if (loadedCount >= total) {
        isLoaded = true;
        loadListeners.forEach((fn) => fn());
      }
    };
    img.onerror = (err) => {
      console.warn(`[GameSprites] Failed to load ${key} from ${path}`, err);
    };
    sprites[key] = img;
  }

  cachedSprites = sprites as GameSprites;
  return cachedSprites;
}

export function areSpritesLoaded(): boolean {
  return isLoaded;
}

export function onSpritesLoaded(callback: () => void): () => void {
  if (isLoaded) {
    callback();
    return () => {};
  }
  loadListeners.push(callback);
  return () => {
    const idx = loadListeners.indexOf(callback);
    if (idx !== -1) loadListeners.splice(idx, 1);
  };
}
