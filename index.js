const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let frames = 0;

const clickButtonSound = new Audio();
clickButtonSound.src = 'assets/sounds/button_click.mp3'

const matchedSound = new Audio();
matchedSound.src = 'assets/sounds/matched.mp3';

const flipCard = new Audio();
flipCard.src = 'assets/sounds/flip_card.mp3';

const sounds = {
    clickButtonSound,
    matchedSound,
    flipCard
};


const game = new Game(ctx, sounds);

function getPosXY(e) {
    const offset = canvas.getBoundingClientRect();
    const x = e.clientX - offset.left;
    const y = e.clientY - offset.top;

    return {x, y};
}

function onClick(e) {
    const pos = getPosXY(e);

    game.handleClickScene(pos.x, pos.y);
}

function clear() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    clear();
    game.drawScene();
}

function update() {
    game.updateCards(frames);
};

function loop() {
    update();
    draw();

    frames++;

    requestAnimationFrame(loop);
}

canvas.addEventListener('click', onClick);
window.addEventListener('resize', () => game.resize());

document.body.appendChild(clickButtonSound);
document.body.appendChild(matchedSound);

window.onload = () => {
    game.resize();
    loop();
};
