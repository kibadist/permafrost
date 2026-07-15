# Permafrost *(working title)*

An arctic-ambient survivors-like with deep loot: **Vampire Survivors** moment-to-moment gameplay meets **Path of Exile** itemization, wrapped in a cold, quiet, glacial atmosphere.

## Vision

You are alone on the ice. Waves of things emerge from the whiteout. Your weapons fire on their own — your job is positioning, build-crafting, and deciding which frozen relics to socket into your kit. Runs are short (15–25 min); the depth lives in the affix system, item interactions, and meta progression between runs.

**Pillars**

1. *The horde is weather.* Enemies read as blizzard, not as army. Density over individuality.
2. *Loot worth reading.* PoE-style affixes, tiers, and synergies — the pause screen is a crafting bench.
3. *Arctic ambient, not arctic action.* Muted palette, slow pads and wind in the audio, restraint in the VFX. Tension from silence.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Language | TypeScript (strict) | Team skillset; great data-modeling for affix/item systems |
| Game framework | [Phaser 3](https://phaser.io/) | Batteries-included 2D (render, arcade physics, input, audio); shipped Vampire Survivors 1.0 |
| Build/dev | Vite | Sub-second HMR — fastest possible iteration loop |
| Tests | Vitest | Loot/damage math stays engine-free and unit-tested |
| Desktop / Steam | Electron + [steamworks.js](https://github.com/ceifa/steamworks.js) *(later)* | Proven Phaser→Steam path; deferred until the game is fun in a browser |

Design rule: **game systems (items, affixes, damage, progression) are pure TypeScript modules under `src/systems/` with no Phaser imports.** Phaser code lives in `src/scenes/`. This keeps the PoE-half of the game testable, and keeps the door open to swapping renderers if we ever need to.

## Getting started

```bash
npm install
npm run dev        # open http://localhost:5173
npm test           # unit tests for game systems
npm run build      # typecheck + production build
```

The current build is a minimal prototype: WASD/arrows to move, auto-firing frost bolt, enemies spawn from the edges. Press **R** after death to restart.

## Roadmap

- [x] Playable movement + auto-attack + spawner prototype
- [ ] Enemy variety, HP, and wave scaling
- [ ] XP gems + level-up choice screen (the VS loop)
- [ ] Item drops using the affix system (`src/systems/affixes.ts`)
- [ ] Inventory / socket UI between waves
- [ ] Arctic ambient audio pass (wind bed, sparse pads, muffled hits)
- [ ] Visual identity pass (palette, whiteout fog, snow shader)
- [ ] Meta progression between runs
- [ ] Electron wrapper + Steamworks integration
- [ ] Steam page + demo build

## License

MIT — see [LICENSE](LICENSE).
