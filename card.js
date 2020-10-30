class Card {
    constructor({id, x, y, w, h, size, radius, fill, sound} = {}) {
        this.id = id || null;
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 300;
        this.h = h || 300;
        this.radius = radius || 40; // RADIUS FOR CURVED CORNERS
        this.fill = fill || '#660066';
        this.size = size || 300;
        this.isMatched = false;
        this.scaleX = -1;
        this.scaleY = 1;
        this.needToClose = false;
        this.img = new Image();
        this.sound = sound;
        this.symbolId = null;
        this.cursor = 'pointer';
    }

    // DRAW RECTANGLE WITH CURVED CORNERS
    draw(ctx) {
        const {x, y, w, h, radius, isMatched, scaleX, scaleY, img} = this;
        const grd = ctx.createLinearGradient(x, y, x + w, y + h);

        ctx.save();
        ctx.translate(x + 0.5 * w, y + 0.5 * h); // TRANSLATE TO SHAPE CENTER
        ctx.scale(scaleX, scaleY);
        ctx.translate(-(x + 0.5 * w), -(y + 0.5 * h)); // TRANSLATE CENTER BACK TO 0, 0
        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + h - radius);
        ctx.quadraticCurveTo(x, y + h, x + radius, y + h);
        ctx.lineTo(x + w - radius, y + h);
        ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - radius);
        ctx.lineTo(x + w, y + radius);
        ctx.quadraticCurveTo(x + w, y, x + w - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
        grd.addColorStop(0, '#800080');
        grd.addColorStop(1, '#660066');
        ctx.fillStyle = grd;
        ctx.strokeStyle = '#D896FF';
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.fill();

        // DRAW IMAGE IF CARD IS MATCHED

        ctx.clip();
        if (isMatched && scaleX >= 0 ) {

            ctx.drawImage(img, 0, 0, w, h, x, y, w, h);
        }
        ctx.restore()
    }

    // ON MOUSE CLICK
    handleClick(cb) {
        if (!cb) return;

        cb();
    }

    //MOUSE HOVER
    handleHover(ctx, pos) {
        if (ctx.isPointInPath(pos.x, pos.y)) {
            ctx.canvas.style.cursor = 'pointer';
        } else {
            ctx.canvas.style.cursor = 'default';
        }
    }

    playSound() {
        if (!this.sound) return;

        this.sound.play();
    }

    openCard() {
        if (this.scaleX >= 1) return;
        this.scaleX += 0.15;
    }

    closeCard() {
        if (this.scaleX <= -1) {
            this.needToClose = false;
            this.isMatched = false;
            return;
        };
        this.scaleX -= 0.15;
    }

    // CHECK IS CARD HOVERED BY CURSOR
    isHover(x, y) {
        if (x >= this.x && x <= this.x + this.w
            && y >= this.y && y <= this.y + this.h) {
                return true;
        } else {
            return false;
        }
    }
}
