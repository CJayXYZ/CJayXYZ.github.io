class Wall {
    constructor(column, row, side) {
        this.column = column;
        this.row = row;
        this.side = side;
        this.x = column*pix;
        this.y = row*pix;
        this.width = 2*grid.wallWidth;
        this.length = pix;
        this.startTime = new Time();
        this.fill = new Colors();
        this.opacityHover = .5;
        ctx.fillStyle = this.fill.color;
        this.pillar = new Pillar();
    }
    get loc() {
        return [this.column, this.row, this.side]
    }

    update() {
        let width = grid.wallWidth;
        let length = pix - grid.wallWidth;
        if ((this.side === 'R')|(this.side ==='L') ){
            this.x = grid.originX + pix*this.column + grid.wallWidth/2;
            this.y = grid.originY + pix*this.row - grid.wallWidth/2;
            this.width = length;
            this.length = width;
        }
        else{
            this.x = grid.originX + pix*this.column - grid.wallWidth/2;
            this.y = grid.originY + pix*this.row + grid.wallWidth/2;;
            this.width = width;
            this.length = length;
        }
        // this.fill.color = '#00ff00';
    }
    draw() {
        this.update();
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(this.x, this.y, this.width, this.length)
        this.drawPillar();
    }
    over() {
        this.update();
        ctx.globalAlpha = this.opacityHover;
        ctx.fillStyle = this.fill.color;
        ctx.fillRect(this.x, this.y, this.width, this.length)
        this.drawPillar();
        ctx.globalAlpha = 1;
    }
    drawPillar(){
        this.pillar.originX = pix*this.column + grid.originX;
        this.pillar.originY = pix*this.row + grid.originY;
        this.pillar.triangleType(this.side);
    }
}