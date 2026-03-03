const scoreDisplay = document.querySelector('.score');
const startScreen = document.querySelector('.start-screen');
const gameArea = document.querySelector('.game-area');
const scoreVal = document.getElementById('scoreVal');

let player = { speed: 6, score: 0 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

function keyDown(e) {
    if(keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
}

function keyUp(e) {
    if(keys.hasOwnProperty(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
    }
}

startScreen.addEventListener('click', start);
document.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && startScreen.classList.contains('hide') === false) {
        start();
    }
});

function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !((aRect.bottom < bRect.top) || 
             (aRect.top > bRect.bottom) || 
             (aRect.right < bRect.left) || 
             (aRect.left > bRect.right));
}

function moveLines() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item) {
        if(item.y >= document.documentElement.clientHeight) {
            item.y -= document.documentElement.clientHeight + 100;
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function endGame() {
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = `
        <h1>Game Over!</h1>
        <p>Final Score: ${player.score}</p>
        <p style="margin-top: 15px; color: #f1c40f;">Click here or Press Enter to restart.</p>
    `;
}

function moveEnemy(car) {
    let enemies = document.querySelectorAll('.enemy-car');
    enemies.forEach(function(item) {
        if(isCollide(car, item)) {
            endGame();
        }

        if(item.y >= document.documentElement.clientHeight) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            player.score += 10; // Extra points for dodging a car
        }
        item.y += player.speed;
        item.style.top = item.y + 'px';
    });
}

function gamePlay() {
    if(player.start) {
        moveLines();
        moveEnemy(player.carElement);

        let gameRect = gameArea.getBoundingClientRect();

        if(keys.ArrowUp && player.y > 0) { player.y -= player.speed; }
        if(keys.ArrowDown && player.y < (gameRect.height - 100)) { player.y += player.speed; }
        if(keys.ArrowLeft && player.x > 0) { player.x -= player.speed; }
        if(keys.ArrowRight && player.x < (gameRect.width - 50)) { player.x += player.speed; }

        player.carElement.style.top = player.y + 'px';
        player.carElement.style.left = player.x + 'px';

        window.requestAnimationFrame(gamePlay);
        player.score++;
        
        // Increase speed progressively
        if(player.score > 0 && player.score % 500 === 0) {
            player.speed += 0.5;
        }

        scoreVal.innerText = player.score;
    }
}

function start() {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    player.speed = 6;
    window.requestAnimationFrame(gamePlay);

    // Create road lines
    let gameHeight = document.documentElement.clientHeight;
    for(let x = 0; x < Math.floor(gameHeight / 150) + 2; x++) {
        let roadLine = document.createElement('div');
        roadLine.setAttribute('class', 'line');
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + 'px';
        gameArea.appendChild(roadLine);
    }

    // Create player car
    let car = document.createElement('div');
    car.setAttribute('class', 'car player-car');
    gameArea.appendChild(car);
    player.carElement = car;

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // Create enemy cars
    for(let x = 0; x < 3; x++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'car enemy-car');
        enemyCar.y = ((x + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + 'px';
        enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        
        const colors = ['#e67e22', '#e74c3c', '#9b59b6', '#f1c40f', '#2ecc71'];
        let randomColor = colors[Math.floor(Math.random() * colors.length)];
        enemyCar.style.backgroundColor = randomColor;
        
        gameArea.appendChild(enemyCar);
    }
}
