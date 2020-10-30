class Button {
    constructor({x, y, w, h, radius, title, fill, sound} = {}) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 300;
        this.h = h || 150;
        this.radius = radius || 30;
        this.title = title || 'Example';
        this.fill = fill || '#CCCCCC';
        this.sound = sound
    }

    draw(ctx) {
        const {x, y, w, h, radius, title} = this;

        ctx.save();
        // ctx.translate(0, 0)
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
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = '#D896FF';
        ctx.lineWidth = 10;
        ctx.fill();
        ctx.stroke();
        ctx.clip();

        ctx.font = '40px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(title, x + w / 2, y + 20 + h / 2);
        ctx.restore();
    }

    // CHECK IS BUTTON HOVERED BY CURSOR
    isHover(x, y) {
        if (x >= this.x && x <= this.x + this.w
            && y >= this.y && y <= this.y + this.h) {
                return true;
        } else {
            return false;
        }
    }

    playSound() {
        if (!this.sound) return;

        this.sound.play();
    }
}