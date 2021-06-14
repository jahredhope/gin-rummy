import { trace } from "./log";
import { playGame } from "./game";

const GAMES_TO_PLAY = 10_000;

async function run() {
  let startTime = Date.now();
  let lastTime = startTime;
  let score = 0;

  for (let i = 1; i <= GAMES_TO_PLAY; i++) {
    if (i % Math.floor(GAMES_TO_PLAY / 20) === 0) {
      let now = Date.now();
      console.log(`${i}/${GAMES_TO_PLAY} Current Score`, score, `(${now - lastTime}ms)`);
      lastTime = now;
    }
    score += playGame();
  }
  console.log(
    `Current Score`,
    score,
    ` after ${GAMES_TO_PLAY} games. (${Date.now() - startTime}ms) (${((Date.now() - startTime) / GAMES_TO_PLAY).toFixed(
      3
    )}ms per game)`
  );

  trace("\n----- ----- -----\n");
}

run()
  .catch((e) => console.error("An error occurred", e))
  .finally(() => trace("Done"));
