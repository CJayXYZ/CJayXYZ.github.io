class WallsManager {
    constructor() {
        this.selectedList = [];
        this.hoverList = [];
        this.overWall = null;
        this.lastHover = null;
        this.onWall = false;
    }

    shadow() {
        // ctx.shadowOffsetX = ctx.lineWidth / 5
        // ctx.shadowOffsetY = ctx.lineWidth / 5
        ctx.shadowBlur = ctx.lineWidth / 4
        ctx.shadowColor = 'grey'
    }
    
    defaults() {
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
    }

    draw() {
        this.shadow();
        let all = [];
        for (let i = 0; i < this.selectedList.length; i++) {
            this.selectedList[i].fill.speed = .03;
            // this.selectedList[i].fill.pattern = 'randomPan'
            // this.selectedList[i].fill.pattern = 0;
            this.selectedList[i].draw();
            all.push(this.selectedList[i].loc);
        }
        if (this.overWall) {
            // this.overWall.fill.pattern = 'randomFix';
            // this.overWall.fill.pattern = 0;
            this.overWall.over();
        }
        this.defaults();
    }

    clicked(x, y) {
        let [column, row, type, side] = this.classifier(x, y);
        let wall = this.makeWall(column, row, type, side);
        if (!(ifin(this.selectedList, wall.loc))) {
            this.selectedList.push(wall);
        }
        // this.selectedList.push(wall);
        // console.log([column, row, type, side], this.selectedList)
    }

    over(x, y) {
        let [column, row, type, side] = this.classifier(x, y);
        // console.log(column, row, type, side)
        let wall = this.makeWall(column, row, type, side)
        if (wall) {
            this.lastHover = wall.loc;
            if (! objectsAreSame(this.overWall.loc, wall.loc)){
                this.overWall = wall;
                // console.log(column, row, type, side)
                // this.lastHover = this.overWall.loc;
            }
        }
        else {
            // this.overWall = this.makeWall(column, row, side);
            // console.log('not same', this.overWall.loc)
            // this.lastHover = this.overWall.loc;
        }
        this.onWall = true;
    }

    makeWall(column, row, type, side){
        let wall;
        switch (type) {
                case 'pillar':
                    switch (side){
                        case 'R':
                            wall = new Wall (column, row, side)
                            break;
                        case 'D':
                            wall = new Wall (column, row, side)
                            break;
                        case 'L':
                            wall = new Wall (column-1, row, 'R')
                            break;
                        case 'U':
                            wall = new Wall (column, row-1, 'D')
                            break;
                    }
                    break;
                case 'wall':
                    switch (side){
                        case 'R':
                            wall = new Wall (column, row, side)
                            break;
                        case 'D':
                            wall = new Wall (column, row, side)
                            break;
                    }
                    break;
                    
            }
        return wall;
    }

    mouseaway(x, y) {
        let [column, row, type, side] = this.classifier(x, y);
        if (this.onWall === true) {
            this.hoverList.push(new Wall(...this.lastHover));
            this.overWall = null;
        }
        this.onWall = false;
        // console.log(341)
    }

    mouseon(x, y) {
        let [column, row, type, side] = this.classifier(x, y);
        if (! this.overWall) {
            this.overWall = new Wall(column, row, side);
        }
        // console.log(12345)
    }

    classifier(x, y) {
        let width = grid.wallWidth/2 +1;
        let originX = grid.originX;
        let originY = grid.originY;
        let type = 'wall';
        let side = null;
        let remX = (x - originX) % pix;
        let remY = (y - originY) % pix;
        if (remX < 0) { remX = remX + pix }
        if (remY < 0) { remY = remY + pix }
        let column = int((x - originX) / pix);
        let row = int((y - originY) / pix);
        
        if ((width < remX) & (remX <= (pix-width))) {
            if ((pix - width) <= remY) {
                row = row + 1;
                side = 'R';
                // console.log(222)
            }
            else {
                side = 'R';
                // console.log(333)

            }
        }
        else if ((width < remY) & (remY <= (pix-width))) {
            if ((pix - width) <= remX) {
                column = column + 1;
                side = 'D';
                // console.log(999)
            }
            else {
                side = 'D';                
                // console.log(444)
            }
        }
        else {
            type = 'pillar';
            [column, row, side] = this.classifyPillar(remX, remY, column, row);
        }

        // console.log(width, remX, remY, column, row, type, side);
        return [column, row, type, side]
    }

    classifyPillar(remX, remY, column, row) {
        let side;
        let width = grid.wallWidth/2+1;
        if (remX > pix / 2) { remX = remX - pix; }
        if (remY > pix / 2) { remY = remY - pix; }
        if (pointOnTriangle(0, 0, width, -width, width, width, remX, remY)) {
            if (remY < 0) { row = row + 1 };
            side = 'R';
        }
        else if (pointOnTriangle(0, 0, -width, width, width, width, remX, remY)) {
            if (remX < 0) { column = column + 1 };
            side = 'D';
        }
        else if (pointOnTriangle(0, 0, -width, width, -width, -width, remX, remY)) {
            if (remY < 0) { row = row + 1 };
            if (remX < 0) { column = column + 1 };
            side = 'L';
        }
        else if (pointOnTriangle(0, 0, width, -width, -width, -width, remX, remY)) {
            if (remX < 0) { column = column + 1 };
            if (remY < 0) { row = row + 1 };
            side = 'U';
        }
        else {
            side = null;
        }
        // console.log(remX, remY);
        return [column, row, side]
    }
}