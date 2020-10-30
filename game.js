const MENU = 'menu';
const GAME = 'game';
const END = 'end';

class Game {
    constructor(ctx, sounds) {
        this.ctx = ctx;
        this.sounds = sounds;
        this.scale = 1;
        this.config = {
            columns: 3,
            rows:    2,
            axisDistanceBetweenCards: 50,
        };
        this.levelButtons = {
            easy: null,
            medium: null,
            hard: null
        };
        this.attempts = 0;
        this.mistakes = 0;
        this.cards = [];
        this.state = MENU; // GAME
        this.score = 0;

        this.selectedCards = []
        this.currentCard = null;
    }

    // ON CLICK CANVAS
    handleClickScene(x, y) {
        const posX = x / this.scale;
        const posY = y / this.scale;

        if (this.state === GAME || this.state === END) {
            if (this.menuButton.isHover(posX, posY)) {
                this.menuButton.playSound();
                this.state = MENU;     
                this.resetGame();

                return;
            }
        }

        if (this.state === GAME) {
            this.cards.forEach(card => {
                if (card.isHover(posX, posY)) {
                    if (card.isMatched) return;
                    
                    card.playSound();
                    this.attempts++;
                    this.currentCard = card.id;
                    this.selectedCards.push({id: card.id, symbolId: card.symbolId});
                }
            });

            return;
        }

        if (this.state === MENU) {
            if (this.levelButtons.easy.isHover(posX, posY)) {
                this.levelButtons.easy.playSound();
                this.config.columns = 3;
                this.config.rows = 2;
            } else if (this.levelButtons.medium.isHover(posX, posY)) {
                this.levelButtons.medium.playSound();
                this.config.columns = 4;
                this.config.rows = 3;
            } else if (this.levelButtons.hard.isHover(posX, posY)) {
                this.levelButtons.hard.playSound();
                this.config.columns = 5;
                this.config.rows = 4;
            }

            this.state = GAME;
            return;
        }
    }

    // SET NEW GAME CONFIG
    setConfig({columns, rows} = {}) {
        this.config.columns = columns;
        this.config.rows = rows;
    }

    // DRAW BACKGROUND
    drawBackground() {
        this.ctx.fillStyle = '#EFBBFF';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    // DRAW MENU SCENE IF STATE === GAME
    drawGameScene() {
        if (!this.cards.length) {
            this.cards = this._initCards();
        }
        if (!this.menuButton) {
            this.menuButton = new Button({
                x: 30,
                y: 30,
                w: 200,
                h: 100,
                title: 'MENU',
                fill: '#BE29EC',
                sound: this.sounds.clickButtonSound
            })
        }

        this.menuButton.draw(this.ctx);
        this.cards.forEach(card => card.draw(this.ctx));
    }

    // DRAW MENU SCENE IF STATE === END
    drawEndScene() {
        const text = `GAME OVER! SCORE: ${this.getScore()}`;

        this.menuButton.draw(this.ctx);
        this.ctx.font = 'bold 80px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = '#D896FF';
        this.ctx.lineWidth = 8;
        this.ctx.strokeText(text, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText(text, this.ctx.canvas.width / 2, this.ctx.canvas.height / 2);
        
        // this.ctx.fill();
    }

    // DRAW MENU SCENE IF STATE === MENU
    drawMenuScene() {
        // CHOOSE LEVEL BUTTONS
        if (!this.levelButtons.easy || !this.levelButtons.medium || !this.levelButtons.hard) {
            const btnWidth = 200; // DEFAULT WIDTH;
            const btnHeight = 150; // DEFAULT HEIGHT
            const offsetY = 50;
            const posX = this.ctx.canvas.width / 2 - btnWidth;
            const posY = (this.ctx.canvas.height - (btnHeight + offsetY) * 3) / 2;

            this.levelButtons.easy = new Button({
                x: posX,
                y: posY,
                title: 'EASY 3x2',
                fill: '#BE29EC',
                sound: this.sounds.clickButtonSound
            });
            this.levelButtons.medium = new Button({
                x: posX,
                y: posY * 2,
                title: 'MEDIUM 4x3',
                fill: '#BE29EC',
                sound: this.sounds.clickButtonSound
            });
            this.levelButtons.hard = new Button({
                x: posX,
                y: posY * 3,
                title: 'HARD 5x4',
                fill: '#BE29EC',
                sound: this.sounds.clickButtonSound
            });
        }

        this.levelButtons.easy.draw(this.ctx);
        this.levelButtons.medium.draw(this.ctx);
        this.levelButtons.hard.draw(this.ctx);
    }

    // DRAW SCENE BY STATE
    drawScene() {
        this.drawBackground();

        switch (this.state) {
            case MENU:
                return this.drawMenuScene();
            case GAME:
                return this.drawGameScene();
            case END:
                return this.drawEndScene();
        }
    }

    // UPDATE CARDS LIST && GAME LOGIC
    updateCards(timestemp) {
        if (this.state === END) return;
        // if (timestemp % 2 !== 0) return;

        if (this.cards.length) {
            const gameOver = this.cards.every(card => card.isMatched === true);
            if (gameOver) {
                this.state = END;
                return;
            }
        }

        this.cards.forEach(card => {
            if (this.currentCard === card.id) {
                card.isMatched = true;
                card.openCard();
            }

            if (card.needToClose) {
                card.playSound();
                card.closeCard();
            };
        });

        if (this.selectedCards.length === 2) {
            if (this.selectedCards[0].symbolId === this.selectedCards[1].symbolId) {
                this.sounds.matchedSound.play();
            }
            if (this.selectedCards[0].symbolId !== this.selectedCards[1].symbolId) {
                this.mistakes++;
                this.cards.forEach(card => {
                    if (card.id === this.selectedCards[0].id || card.id === this.selectedCards[1].id) {
                        setTimeout(() => {
                            this.currentCard = null
                            card.needToClose = true;
                        }, 1000);
                    }
                });
            }
            this.selectedCards = [];
        }
    }

    // REMOVE ARRAY OF CARDS
    resetGame() {
        this.selectedCards = []
        this.currentCard = null;
        this.cards = [];
        this.mistakes = 0;
        this.attempts = 0;
    }
    
    // RESIZE SCREEN
    resize() {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;
        const scale = Math.min(maxWidth / 1900, maxHeight / 1080);
        const gameContainer = document.getElementById("gamecontainer");

        gameContainer.style.transform = "translate(-50%, -50%) " + "scale(" + scale + ")";
    
        const width = Math.max(1900, Math.min(3000, maxWidth / scale ));
        const height = Math.max(720, Math.min(1080, maxHeight / scale));

        gameContainer.style.width = width + 'px';
        gameContainer.style.height = height + 'px';

        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
        this.scale = scale;
    }

    getScore() {
        const score = parseInt(((this.attempts - this.mistakes) / this.attempts) * 100, 10);
        return score;
    }

    // GET AN ARRAY WITH PAIRED CARD'S SYMBOLS
    _getRandomArray(array = []) {
        const {columns, rows} = this.config;
        let valid = false
        let randomIndex = 0;

        while (!valid) {
          randomIndex = Math.floor(Math.random() * ((columns * rows) / 2)) + 1;
          let found = false;

          for (let i = 0; i < array.length; i++) {
            if(randomIndex == array[i]) {
                found = true;
                break;
            }
        }
        if (!found) {
            valid = true;
            array.push(randomIndex)
          }
        }

        return randomIndex;
    }

    // SHUFFLE AN ARRAY
    _shuffleArray(array = []) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // GET INITIAL LIST OF CARDS
    _initCards() {
        const cardsQuantity = this.config.columns * this.config.rows;
        const cardsData = [];
        const values = [];
        const cardSymbols = [];

        for (let i = 0; i < cardsQuantity / 2; i ++) {
            const value = this._getRandomArray(values);
            cardSymbols[2 * i] = value;
            cardSymbols[2 * i + 1] = value;
        }

        this._shuffleArray(cardSymbols);

        for (let i = 0; i < cardsQuantity; i++) {
            const card = new Card();

            const isHardLevel = this.config.columns === 5;

            card.isMatched = false;
            card.id = i;
            card.w = card.h = isHardLevel ? 200 : card.w;
            const offsetX = this.ctx.canvas.width - (this.config.columns * card.w + this.config.axisDistanceBetweenCards * (this.config.columns - 1));
            const offsetY = this.ctx.canvas.height - (this.config.rows * card.h + this.config.axisDistanceBetweenCards / 2 * (this.config.rows - 1));

            card.x = offsetX / 2 + i % this.config.columns * (card.w + this.config.axisDistanceBetweenCards);
            card.y = offsetY / 2 + i % this.config.rows * (card.h + this.config.axisDistanceBetweenCards / 2);
            card.symbolId = cardSymbols[i];
            card.sound = this.sounds.flipCard;
            card.img.src = `assets/img/symbol-${cardSymbols[i]}.jpg`;

            cardsData.push(card);
        }

        return cardsData;
    }
}
