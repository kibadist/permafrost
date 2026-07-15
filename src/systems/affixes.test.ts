import { describe, expect, it } from 'vitest';
import { AFFIX_POOL, rollAffix, rollItem } from './affixes';

describe('rollAffix', () => {
  it('rolls min value when rng returns 0', () => {
    const def = AFFIX_POOL[0];
    expect(rollAffix(def, () => 0).value).toBe(def.min);
  });

  it('rolls max value when rng returns just under 1', () => {
    const def = AFFIX_POOL[0];
    expect(rollAffix(def, () => 0.999999).value).toBe(def.max);
  });
});

describe('rollItem', () => {
  it('never rolls the same affix twice on one item', () => {
    let n = 0;
    const rng = () => ((n += 0.37) % 1);
    const item = rollItem(4, rng);
    const ids = item.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('caps affix count at pool size', () => {
    expect(rollItem(99, () => 0.5).length).toBeLessThanOrEqual(AFFIX_POOL.length);
  });
});
