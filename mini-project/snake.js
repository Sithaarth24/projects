const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls div");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let spfd = 10;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    if(spfd == 0)
    {
        playBoard.getElementsByClassName(".food").classlist.add('special_food');
        spfd=10;
    }
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    alert("Game Over!! Reload to Play again!");
    location.reload();
    clearInterval(setIntervalId);
    
}

const changeDirection = e => {

    if((e.key === "ArrowUp" || e.key=="w") && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if((e.key === "ArrowDown" || e.key=='s') && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if((e.key === "ArrowLeft" || e.key=='a') && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if((e.key === "ArrowRight" || e.key=='d') && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(button => button.addEventListener("click", 
() => changeDirection(
    { 
        key: button.dataset.key 
    }
    )
    ));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    if(snakeX === foodX && snakeY === foodY) {
        spfd--;
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    snakeX += velocityX;
    snakeY += velocityY;
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
