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
        this.opacityHover = .3;
        this.cubeLength = 100;
        this._fadeSpeed = fadeSpeed;
        this._cubeType = null;
        this.R = null;
        this.D = null;
        this.L = null;
        this.U = null;
        this.isReached = false;
        this._locChanged = true;
        this._lastLoc = null;
        this.text = null;
    }

    get cubeType() {
        return this._cubeType
    }

    set cubeType(type) {
        this._cubeType = type;
        this.fill.pattern = type;
    }

    get loc() {
        return [this.column, this.row];
    }

    set loc(x) {
        this.lastLoc = listToString([this.column, this.row]);
        if (!objectsAreSame(x, [this.column, this.row])) {
            [this.column, this.row] = x;
            this.locChanged = true;
        } else {
            this.locChanged = false;
        }
        // console.log(x)
    }

    get fadeSpeed() {
        return this._fadeSpeed;
    }

    set fadeSpeed(num) {
        this._fadeSpeed = num;
    }

    get lastLoc() {
        return this._lastLoc;
    }

    set lastLoc(e) {
        this._lastLoc = e;
    }

    get locChanged() {
        return this._locChanged;
    }

    set locChanged(bool) {
        this._locChanged = bool;
    }

    update() {
        this.x = this.column * pix + grid.originX + grid.wallWidth / 2
        this.y = this.row * pix + grid.originY + grid.wallWidth / 2
        this.cubeLength = pix - grid.wallWidth
        // console.log(this.x, this.y, )
    }

    setText(text = null) {
        this.text = text;
    }

    showCoordinates() {
        this.text = '(' + this.column + ',' + this.row + ')'
        if (this.text) {
            let x = this.x + this.cubeLength / 2;
            let y = this.y + this.cubeLength / 2;
            let height = this.cubeLength / 4.5;
            ctx.font = height + "px Consolas";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = '#000';
            ctx.fillText(this.text, x, y);
            ctx.lineWidth = height / 30;
            ctx.strokeText(this.text, x, y);
            ctx.fillStyle = this.fill.color;
        }
    }

    draw() {
        if (this.cubeType) {
            this.update()
            // this.fill.pattern = 1
            ctx.fillStyle = this.fill.color;
            // console.log(this.fill.color)
            ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength);
            if (debugMode) {
                this.showCoordinates();
            }
        }
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
        let timeElapsed = this.startTime.elapsedTime() / 10;
        this.x = this.x + rate * timeElapsed;
        this.y = this.y + rate * timeElapsed;
        let x = this.x;
        let y = this.y;
        ctx.fillRect(x, y, pix, pix);
    }
    hover() {
        this.update();
        let timeElapsed = this.startTime.elapsedTime() / 10;
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
        // ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength); // enable this
        ctx.globalAlpha = 1;
    }

    over() {
        this.update();
        // this.x = this.column * pix + grid.originX;
        // this.y = this.row * pix + grid.originY;
        // this.cubeLength = pix;
        ctx.globalAlpha = this.opacityHover;
        ctx.fillStyle = this.fill.color;
        // ctx.fillRect(this.x, this.y, this.cubeLength, this.cubeLength); // enable this
        // ctx.fillRect(x, y, width, width);
        ctx.globalAlpha = 1;
        // console.log('over', this.column, this.row)
    }

    drag(x, y) {
        let [column, row] = this.classifier(x, y);
        this.loc = [column, row]
    }

    delete(x, y) { }

    classifier(x, y) {
        let originX = grid.originX;
        let originY = grid.originY;
        let column = int((x - originX) / pix);
        let row = int((y - originY) / pix);
        return [column, row]
    }

    name() {
        return listToString(this.loc);
    }

    __str__() {
        return 'cube'
    }
}