class Cube {
    constructor(column = 0, row = 0) {
        this.column = column;
        this.row = row;
        this.x = column * pix;
        this.y = row * pix;
        this.h = this.x;
        this.k = this.y;
        this.startTime = new Time();
        this.fill = new Colors();
        this.state = true;
        this.opacityHover = .5;
        this.cubeLength = 100;
        this._fadeSpeed = fadeSpeed;
    }

    get loc() {
        return [this.column, this.row]
    }

    get fadeSpeed() {
        return this._fadeSpeed;
    }

    set fadeSpeed(num) {
        this._fadeSpeed = num;
    }

    update() {
        this.x = this.column * pix + grid.originX + grid.wallWidth / 2
        this.y = this.row * pix + grid.originY + grid.wallWidth / 2
        this.cubeLength = pix - grid.wallWidth
        // console.log(this.x, this.y, )
    }
    draw() {
        this.update()
        // this.fill.pattern = 1
        ctx.fillStyle = this.fill.color;
        // console.log(this.fill.color)
        ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength);
    }
    move() {
        ctx.clearRect(this.x, this.y, pix, pix);
        this.shake();
        // this.translate();
    }
    shake() {
        let x = this.x + Math.floor(Math.random() * (Math.floor(Math.random() * shakeby)))
        let y = this.y + Math.floor(Math.random() * (Math.floor(Math.random() * shakeby)))
        ctx.fillRect(x, y, pix, pix);
    }
    translate() {
        let timeElapsed = this.startTime.elapsedTime();
        this.x = this.x + rate * timeElapsed;
        this.y = this.y + rate * timeElapsed;
        let x = this.x;
        let y = this.y;
        ctx.fillRect(x, y, pix, pix);
    }
    hover() {
        this.update();
        let timeElapsed = this.startTime.elapsedTime();
        let opacityDelta = timeElapsed * this.fadeSpeed;
        this.opacityHover = this.opacityHover - opacityDelta;
        if (this.opacityHover <= .01) {
            this.state = false;
            this.opacityHover = .01
        }
        // let opacityHover = int(this.opacityHover*1000);
        ctx.globalAlpha = this.opacityHover.toFixed(3);
        // console.log(ctx.globalAlpha);
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength);
        ctx.globalAlpha = 1;
    }
    over() {
        this.update();
        ctx.globalAlpha = this.opacityHover;
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength);
        ctx.globalAlpha = 1;
    }
}