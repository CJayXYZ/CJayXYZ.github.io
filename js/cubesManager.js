class CubesManager {
    constructor() {
        this.hoverList = [];
        this.selectedCubeKeys = new Set();
        this.masterCubeKeys = new Set();
        this.pathCubeKeys = new Set();
        this.searchCubeKeys = new Set();
        this.selectedWallKeys = new Set();
        this.selectedList = [];
        this.start = null;
        this.end = null;
        this.searchList = [];
        this.pathList = [];
        // this.allCubes = [this.hoverList, this.selectedList, this.traceList, this.pathList];
        this.allCubes = {};
        this.lastHover = null;
        this.overCube = null;
        this.lockedCube = null;
        this.all = []
        this.onCube = false;
        this.allLoc = [];
        this.initials();

    }

    initials() {
        let columns = grid.maxColumns;
        let rows = grid.maxRows;
        // console.log(columns, rows)
        let startX = -int(columns / 3)
        let startY = 0
        let endX = int(columns / 3)
        let endY = 0
        // this.start = new Cube(startX, startY);
        // this.end = new Cube(endX, endY);
        this.start = new Cube(-5, -3);
        this.end = new Cube(6, 8);
        this.start.cubeType = 'start';
        this.end.cubeType = 'end';
        this.registerCube(this.start, this.masterCubeKeys);
        this.registerCube(this.end, this.masterCubeKeys);
        // console.log(startX,startY, endX, endY)
        // this.start.loc = [-4,2]
        // this.allCubes.push(this.start);
        // this.allCubes.push(this.end);
        this.lockedCube = this.start;
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

    updateMasterCubes() {
        if (this.start.locChanged) {
            this.updateCube(this.start, this.masterCubeKeys);
        }
        if (this.end.locChanged) {
            this.updateCube(this.end, this.masterCubeKeys);
        }
    }

    draw() {
        this.shadow();
        this.updateMasterCubes();
        let all = [];
        // for (let i = 0; i < this.selectedList.length; i++) {
        //     this.selectedList[i].fill.pattern = 'amazing'
        //     // this.selectedList[i].fill.pattern = 'over'
        //     this.selectedList[i].draw();
        //     all.push(this.selectedList[i].loc);
        // }
        for (let i = 0; i < this.hoverList.length; i++) {
            // console.log(this.hoverList)
            // if (! this.hoverList[i]){//this.hoverList.splice(i, 1);break;
            // }
            this.hoverList[i].fadeSpeed = .003;
            // this.hoverList[i].fill.pattern = 'randomFix';
            // this.hoverList[i].fill.pattern = 0;
            this.hoverList[i].cubeType = 'hover';
            this.hoverList[i].hover();

            all.push(this.hoverList[i].loc);
            if (this.hoverList[i].state === false) {
                this.hoverList.splice(i, 1);
            }
            // else if (! this.hoverList[i]) {
            //     this.hoverList.splice(i, 1);
            // }
        }

        // if (this.searchList){
        //     for (let cube of this.searchList) {
        //         // console.log(cube);
        //         cube.draw();
        //     }
        // }

        // if (this.pathList){
        //     for (let cube of this.pathList) {
        //         // console.log(cube);
        //         cube.draw();
        //     }
        // }

        // if (this.start) {
        //     // this.start.fill.speed = .1
        //     // this.start.fill.pattern = 'start';
        //     this.start.draw();
        // }
        // if (this.end) {
        //     // this.end.fill.speed = .1
        //     this.end.draw();
        // }

        if (this.overCube) {
            // this.overCube.fill.pattern = 0;
            this.overCube.cubeType = 'hover';
            this.overCube.over();
        }
        // if (all.length !== this.all.length) {
        //     this.all = all;
        //     // console.log(...all);
        // }
        for (let x in this.allCubes) {
            this.end.cubeType = 'end';
            this.allCubes[x].draw()
        }
        // console.log(this.allCubes);
        this.defaults();
    }

    over(x, y) {
        let [column, row] = this.classifier(x, y);
        if (objectsAreSame([column, row], this.start.loc)) {
            this.objectUnderMouse = this.start;
            this.mouseaway2(x,y);
        }
        else if (objectsAreSame([column, row], this.end.loc)) {
            this.objectUnderMouse = this.end;
            this.mouseaway2(x,y);
        }
        else {
            if (!objectsAreSame(this.lastHover, [column, row])) {
                // console.log(column, row);
                this.overCube = new Cube(column, row);
                this.hoverList.push(new Cube(...this.lastHover));
            }
            else {
                // this.overCube = new Cube(column, row);
            }
            this.lastHover = [column, row];
        }
    }

    mouseaway2(x, y){
        if (this.overCube) {
            this.hoverList.push(new Cube(...this.lastHover));
            this.overCube = null;
        }
        this.lastHover = [x, y];
    }

    drag(x, y) {
        let [column, row] = this.classifier(x, y);
        this.clicked(x, y)
    }

    registerCube(cube, keys) {
        let key = cube.name()
        // if (key !== this.start.name() )
        keys.add(key);
        this.allCubes[key] = cube;
        // console.log(this.allCubes);
        // console.log(this.masterCubeKeys, this.searchCubeKeys)
    }

    deregisterCube(key, keys) {
        keys.delete(key);
        delete this.allCubes[key];
    }

    updateCube(cube, keys = null) {
        // console.log(this.allCubes);
        let oldKey = cube.lastLoc;
        let newKey = cube.name();
        if (keys) {
            keys.delete(oldKey);
            keys.add(newKey);
        }
        delete this.allCubes[oldKey];
        this.allCubes[newKey] = cube;
        cube.locChanged = false;
        // console.log(this.allCubes, keys);

    }

    clicked(x, y) {
        let [column, row] = this.classifier(x, y);
        let cube = new Cube(column, row)
        // if (!(ifin(this.selectedList, cube))) {
        //     // cube.fill.pattern = 0
        //     cube.fill.speed = 3
        //     cube.fill.pattern = 'amazing'
        //     this.selectedList.push(cube)
        //     // console.log(...cube.loc, 123)
        //     // this.selectedList.push(cube)
        // }
        // else {
        //     // if (ifin([this.start], cube)) {
        //     //     console.log(123)
        //     //     this.follow(this.start, cube)
        //     // }
        //     // else if (ifin([this.end], cube)) {
        //     //     console.log(567)
        //     //     this.follow(this.end, cube)
        //     // }
        //     // if (this.lockedCube) {
        //     //     this.follow(this.start, cube)
        //     // }
        // }
        if (!(this.selectedWallKeys.has(cube.name()))) {
            cube.fill.speed = 3;
            cube.fill.color = '#000';
            // cube.cubeType = 'amazing';
            cube.cubeType = 'wall';
            this.registerCube(cube, this.selectedWallKeys);
        }
        // print(this.selectedList)
        // console.log(classNames(this.selectedList).indexOf([column, row]));
    }

    delete(x, y) { }

    classifier(x, y) {
        let originX = grid.originX;
        let originY = grid.originY;
        let column = int((x - originX) / pix);
        let row = int((y - originY) / pix);
        return [column, row]
    }

    mouseaway(x, y) {
        if (this.onCube === true) {
            // console.log('cube out')
            this.hoverList.push(new Cube(...this.lastHover));
            this.overCube = null;
        }
        this.onCube = false;
    }

    follow(oldCube, newCube) {
        console.log(oldCube.loc, newCube.loc)
        oldCube.loc = newCube.loc
    }

    isWall(col, row, side) {
        [col, row] = this.exactCube(col, row, side);
        console.log(col, row, this.selectedWallKeys)
        let key = listToString([col, row]);
        if (this.selectedWallKeys.has(key)) {
            return true;
        }
        // if (key in this.allCubes) {
        //     if (this.allCubes[key].cubeType === 'wall') {
        //         return true;
        //     }

        // }
        return false;
    }

    exactCube(col, row, side) {
        switch (side) {
            case 'L':
                col = col - 1;
                break;
            case 'U':
                row = row - 1;
                break;
            case 'R':
                col = col + 1;
                break;
            case 'D':
                row = row + 1;
                break;
        }
        // console.log(column,row, side)
        return [col, row];
    }

    __str__() {
        return 'cubesManager'
    }
}