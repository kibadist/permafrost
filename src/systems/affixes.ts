/**
 * Seed of the PoE-style item/affix system.
 *
 * Kept engine-free on purpose: pure data + pure functions, so the whole
 * loot layer is unit-testable without booting Phaser.
 */

export type AffixId = 'frost_damage' | 'attack_speed' | 'move_speed' | 'projectile_count';

export interface AffixDef {
  id: AffixId;
  name: string;
  min: number;
  max: number;
}

export const AFFIX_POOL: AffixDef[] = [
  { id: 'frost_damage', name: 'of Rime', min: 3, max: 12 },
  { id: 'attack_speed', name: 'of Flurries', min: 5, max: 20 },
  { id: 'move_speed', name: 'of the Gale', min: 4, max: 15 },
  { id: 'projectile_count', name: 'of Splintering', min: 1, max: 2 },
];

export interface RolledAffix {
  id: AffixId;
  value: number;
}

/** rng: () => number in [0, 1). Injected so rolls are deterministic in tests. */
export function rollAffix(def: AffixDef, rng: () => number): RolledAffix {
  const value = def.min + Math.floor(rng() * (def.max - def.min + 1));
  return { id: def.id, value };
}

export function rollItem(count: number, rng: () => number): RolledAffix[] {
  const pool = [...AFFIX_POOL];
  const rolled: RolledAffix[] = [];
  for (let i = 0; i < Math.min(count, pool.length); i++) {
    const idx = Math.floor(rng() * pool.length);
    rolled.push(rollAffix(pool[idx], rng));
    pool.splice(idx, 1);
  }
  return rolled;
}
