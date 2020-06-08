class WallsManager {
    constructor() {
        this.selectedList = [];
        this.hoverList = [];
        this.overWall = null;
        this.lastHover = null;
        this.onWall = false;
        this.allWalls = {};
        this.selectedWallKeys = new Set();
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

        for (let key of this.selectedWallKeys) {
            // console.log(key, this.allWalls);
            // wall = this.allWalls[toString(key)];
            let wall = this.allWalls[key];
            // console.log(wall, this.allWalls);
            // wall.fill.speed = 0.03;
            wall.draw();
        }

        if (this.overWall) {
            // this.overWall.fill.pattern = 'randomFix';
            // this.overWall.fill.pattern = 0;
            this.overWall.over();
        }
        this.defaults();
    }

    drag(x,y) {
        let [column, row, type, side] = this.classifier(x, y);
        this.clicked(x,y);
    }

    // delete(x,y) {
    //     let [column, row, type, side] = this.classifier(x, y);
    //     if 
    // }

    add(wall) {
        // console.log(wall.loc)
        if (! this.allWalls.has(listToString(wall.loc))){
            this.allWalls.add(listToString(wall.loc))
        }
        console.log(this.allWalls)
    }

    registerWall(wall, keys) {
        keys.add(wall.name());
        this.allWalls[wall.name()] = wall;
        console.log(keys, this.allWalls)
    }

    deregisterWall(wall, keys) {
        keys.delete(wall.name());
        // this.allWalls[wall.name()] = wall;
        delete this.allWalls[wall.name()]
    }

    clicked(x, y) {
        let [column, row, type, side] = this.classifier(x, y);
        let wall = this.makeWall(column, row, type, side);
        // console.log(wall);
        if (wall){
            if (! this.selectedWallKeys.has(wall.name())){
                wall.wallType = 'wall';
                this.registerWall(wall, this.selectedWallKeys);
            }
        }
        else {
        }
        // console.log([column, row, type, side], this.selectedList)
    }

    over(x, y) {
        if (! this.overWall){
            this.mouseon(x, y)
        }
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

    isWall(col, row, side) {
        [col, row, side] = this.exactWall(col, row, side);
        let name = listToString([col, row, side]);
        // console.log(wallsManager.allWalls)
        if (name in this.allWalls) {
            if (this.allWalls[name].wallType === 'wall') {
                return true;
            }
        }
        return false;
    }

    exactWall(column, row, side){
        switch (side){
            case 'L':
                side = 'D';
                break;
            case 'U':
                side = 'R';
                break;
            case 'R':
                column = column + 1;
                side = 'D';
                break;
            case 'D':
                row = row + 1;
                side = 'R'
                break;
        }
        // console.log(column,row, side)
        return [column, row, side];
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
        let width = grid.wallWidth/2;
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

    __str__() {
        return 'wallsManager'
    }
}