// const song = new Audio("../Alan_Walker_-_Faded.mp3");
const player = document.querySelector("#player");
const scoreElement = document.querySelector("#score");
const startBtn = document.querySelector("#start");
const startBtnCont = document.querySelector("#startDiv");
const gameOver = document.querySelector("#gameOver");
const gameOverText = document.querySelector("#gameOverText");
const tryAgainBtn = document.querySelector("#tryAgain");
const sideBar = document.querySelector(".sideBar");
let score = 0;
let level = 0;
let speed = 1;
sideBarLayer = 1;

const updateScore = () => {
  score++;
  scoreElement.innerHTML = score;
};
const sideBarHandler = (time) => {
  const sideBar = document.createElement("div");
  sideBar.classList.add("sideBar");
  document.body.appendChild(sideBar);
  sideBar.style.transition = `height ${time}s ease-in-out`;
  sideBar.style.zIndex = -100000000 + sideBarLayer;
  sideBar.style.backgroundColor =
    sideBarLayer % 2 === 0
      ? "var(--color-primary)"
      : "var(--color-primary-dark)";
  setTimeout(() => {
    sideBar.style.height = "100%";
    sideBarLayer++;
  }, 100);
};
const levelUp = () => {
  level++;
  speed += (speed / 100) * 25;
  const levelUp = document.createElement("div");
  levelUp.classList.add("levelUp");
  levelUp.innerHTML = `Level ${level} .. Speed up!`;
  document.body.appendChild(levelUp);
  setTimeout(() => {
    levelUp.remove();
  }, 1500);
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
      player.classList.add("dead");
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
const removeObstacles = (e) => {
  e.target.remove();
  updateScore();
};
let n = 0;
const game = {
  gameLoop: null,
  start: () => {
    game.gameLoop = setInterval(
      () => {
        const obstacle = document.createElement("div");
        obstacle.style.left = `${Math.random() * window.innerWidth}px`;
        obstacle.style.animation = `rain ${(1 / speed) * 5}s ease-in-out`;
        obstacle.classList.add("obstacle");
        document.body.appendChild(obstacle);
        obstacle.addEventListener("animationend", removeObstacles);
        level < 3
          ? obstacle.classList.add("level12")
          : level < 5
          ? obstacle.classList.add("level34")
          : level < 7
          ? obstacle.classList.add("level56")
          : level < 9
          ? obstacle.classList.add("level78")
          : level < 11
          ? obstacle.classList.add("level910")
          : null;
        n++;
        if (n >= level * 10) {
          levelUp();
          levelTime = (level < 3 ? 7 : level < 7 ? 6 : 5) - 0.2;
          setTimeout(() => {
            sideBarHandler(levelTime);
          }, 200);
        }
      },
      level < 3 ? 700 : level < 7 ? 600 : 500
    );
  },
  end: () => {
    clearInterval(game.gameLoop);
    saveHighScore();
    gameOver.style.display = "flex";
    gameOverText.innerHTML = `Game Over!<br>Score: ${score} <br>Level: ${level}
    <br>
    <br>
    <div id="highScore">
    highscore
    <br>
    Score: ${JSON.parse(localStorage.getItem("score")).score}
    <br>
    Level: ${JSON.parse(localStorage.getItem("score")).level}
    </div>`;

    document.removeEventListener("click", playerHandler);
    document.removeEventListener("pointermove", playerHandler);
    (() => {
      const obstacles = document.querySelectorAll(".obstacle");
      obstacles.forEach((obs) => {
        obs.removeEventListener("animationend", removeObstacles);
        obs.style.opacity = "0";
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
    player.classList.remove("dead");
    game.start();
    playerReady();
    levelUp();
  }, 1000);
});
const saveHighScore = () => {
  const scoreData = {
    score: score,
    level: level,
  };
  let currentScore;
  localStorage.getItem("score")
    ? (currentScore = JSON.parse(localStorage.getItem("score")))
    : (currentScore = { score: 0, level: 0 });
  if (scoreData.score > currentScore.score)
    localStorage.setItem("score", JSON.stringify(scoreData));
};
