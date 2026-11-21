[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Hadivans/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Hadivans/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# 🔍 Spot the Difference

Two near-identical pictures, seven sneaky differences, three rounds — find them all before the clock runs out. All art is original and drawn in code on canvas; no images, fonts, libraries, or network requests.

## Rounds

1. **Cat Café** — a sleepy cat, a coffee cup, and a toy mouse that may or may not be there.
2. **Harbor at Sunset** — sailboat, lighthouse, and a fish that jumps only on one side.
3. **Garden Picnic** — butterfly, bee, and apples on the old oak.

## How to play

- **Click** a difference on either picture: a green ring appears on **both** panels, +100 pts.
- **Wrong click:** red X and −5 seconds.
- **Hint (H or the 💡 button):** 3 per round, −50 pts, pulses the next unfound difference.
- **Timer:** 90 seconds per round. Finishing a round banks a time bonus (+5 pts per second left).
- **Keyboard:** Enter/Space to start, H for hint, R to restart.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Deterministic screenshots: `?shot=start|play|end&seed=1` — start is the title screen, play is round 1 mid-play with 3 differences found and 4 left, end is the win screen.

## Build

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to the output directory and writes `dossier.json` via the vendored make.fun library:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

MIT licensed. Built by an AI agent for make.fun's "Make the best spot the difference game" bounty.
