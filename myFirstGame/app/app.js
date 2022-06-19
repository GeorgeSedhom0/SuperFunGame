const song = new Audio("../Alan_Walker_-_Faded.mp3");
const player = document.querySelector("#player");
const scoreElement = document.querySelector("#score");
const startBtn = document.querySelector("#start");
const startBtnCont = document.querySelector("#startDiv");
const gameOver = document.querySelector("#gameOver");
const tryAgainBtn = document.querySelector("#tryAgain");
let score = 0;
let level = 1;
let speed = 1;

const updateScore = () => {
  score++;
  scoreElement.innerHTML = score;
};

const playerHandler = (e) => {
  player.style.top = e.clientY + "px";
  player.style.left = e.clientX + "px";
};
const playerReady = () => {
  document.addEventListener("click", playerHandler);
  document.addEventListener("pointermove", playerHandler);
};

const obstacleCrossCheck = () => {
  const playerR = player.getBoundingClientRect().right;
  const playerL = player.getBoundingClientRect().left;
  const playerT = player.getBoundingClientRect().top;
  const playerB = player.getBoundingClientRect().bottom;
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => {
    const obstacleR = obstacle.getBoundingClientRect().right;
    const obstacleL = obstacle.getBoundingClientRect().left;
    const obstacleT = obstacle.getBoundingClientRect().top;
    const obstacleB = obstacle.getBoundingClientRect().bottom;
    if (
      playerR > obstacleL &&
      playerL < obstacleR &&
      playerT < obstacleB &&
      playerB > obstacleT
    ) {
      player.style.backgroundColor = "red";
      game.end();
    }
  });
};
setInterval(() => {
  const playerT = player.getBoundingClientRect().top;
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach((obstacle) => {
    const obstacleB = obstacle.getBoundingClientRect().bottom;
    if (playerT <= obstacleB) {
      obstacleCrossCheck();
    }
  });
}, 100);

const levelUp = () => {
  level++;
  speed += (speed / 100) * 15;
  const levelUp = document.createElement("div");
  levelUp.classList.add("levelUp");
  levelUp.innerHTML = `Level ${level}`;
  document.body.appendChild(levelUp);
  setTimeout(() => {
    levelUp.remove();
  }, 1000);
};

let n = 0;
const game = {
  gameLoop: null,
  start: () => {
    game.gameLoop = setInterval(() => {
      const obstacle = document.createElement("div");
      obstacle.style.left = `${Math.random() * window.innerWidth}px`;
      obstacle.style.animation = `rain ${(1 / speed) * 5}s ease-in-out`;
      obstacle.classList.add("obstacle");
      document.body.appendChild(obstacle);
      obstacle.addEventListener("animationend", () => {
        obstacle.remove();
        updateScore();
      });
      n++;
      if (n % (10 * level) == 0) {
        levelUp();
      }
    }, 1500);
  },
  end: () => {
    clearInterval(game.gameLoop);
    gameOver.style.display = "flex";
    document.removeEventListener("click", playerHandler);
    document.removeEventListener("pointermove", playerHandler);
    (() => {
      const obstacles = document.querySelectorAll(".obstacle");
      obstacles.forEach((obs) => {
        obs.remove();
      });
    })();
    n = 0;
  },
};
startBtn.addEventListener("click", () => {
  startBtnCont.style.animation = "fadeOut 1s ease-in-out";
  startBtnCont.addEventListener("animationend", () => {
    startBtnCont.remove();
    game.start();
    playerReady();
    song.play();
  });
});
tryAgainBtn.addEventListener("click", () => {
  gameOver.style.animation = "fadeOut 1s ease-in-out";
  score = 0;
  level = 0;
  speed = 1;
  updateScore();
  setTimeout(() => {
    gameOver.style.display = "none";
    gameOver.style.animation = "fadeUp 1s ease-in-out";
    player.style.backgroundColor = "var(--color-primary)";
    game.start();
    playerReady();
    levelUp();
  }, 1000);
});
