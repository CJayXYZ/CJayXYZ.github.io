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
        this.start = new Cube(-11, -5);
        this.end = new Cube(11, 5);
        // this.start.cubeType = 'start';
        // this.end.cubeType = 'end';
        this.registerCube(this.start, this.masterCubeKeys, 'start');
        this.registerCube(this.end, this.masterCubeKeys, 'end');
        // console.log(startX,startY, endX, endY)
        // this.start.loc = [-4,2]
        // this.allCubes.push(this.start);
        // this.allCubes.push(this.end);
        this.lockedCube = this.start;
    }

    get noOfColumnsAndRows() {
        return [grid.maxColumns, grid.maxRows];
    }

    get firstColAndRow() {
        return [int(-grid.maxColumns / 2 + 1), int(-grid.maxRows / 2 + 1)]
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
            this.updateCubeMethodOld(this.start, this.masterCubeKeys);
        }
        if (this.end.locChanged) {
            this.updateCubeMethodOld(this.end, this.masterCubeKeys);
        }
    }

    draw() {
        this.shadow();
        this.updateMasterCubes();
        // let all = [];
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
            this.hoverList[i].fill.pattern = 0;
            this.hoverList[i].cubeType = 'hover';
            this.hoverList[i].hover();

            // all.push(this.hoverList[i].loc);
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
            this.mouseaway2(x, y);
        }
        else if (objectsAreSame([column, row], this.end.loc)) {
            this.objectUnderMouse = this.end;
            this.mouseaway2(x, y);
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

    mouseaway2(x, y) {
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

    registerCube(cube, keys, type = null) {
        let key = cube.name()
        cube.cubeType = type;
        if (objectsAreSame(cube.loc, this.start.loc)) { }
        else if (objectsAreSame(cube.loc, this.end.loc)) { }
        if (key in this.allCubes) {
            let oldType = this.allCubes[key].cubeType
            // console.log('register', key, type, this.allCubes[key].cubeType);
            this.updateCube(key, keys, type, oldType);
        }
        else {
            // if (key !== this.start.name() )
            keys.add(key);
            this.allCubes[key] = cube;

            // console.log(this.allCubes);
            // console.log(this.masterCubeKeys, this.searchCubeKeys)
        }
    }

    updateCube(key, newKeys, newType, oldType) {
        let keys = null;
        // console.log(oldType);
        switch (oldType) {
            case "path":
                keys = this.pathCubeKeys;
                break;
            case "searching":
                keys = this.searchCubeKeys;
                break;
            case "wall":
                keys = this.selectedWallKeys;
                break;
        }
        if (keys) {
            keys.delete(key);
            newKeys.add(key);
            this.allCubes[key].cubeType = newType;
            // this.deregisterCube(key, keys);
            // this.registerCube()
        }
    }

    deregisterCube(key, keys) {
        keys.delete(key);
        // console.log('deregister', key, "type", this.allCubes[key].type);
        delete this.allCubes[key];
        // console.log('deregister', key)
    }

    updateCubeMethodOld(cube, keys = null) {
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
        let cube = new Cube(column, row);
        let key = listToString([column, row]);
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
            // cube.fill.speed = 3;
            // cube.fill.color = '#000';
            // cube.cubeType = 'amazing';
            cube.cubeType = 'wall';
            this.registerCube(cube, this.selectedWallKeys, 'wall');
        }
        else {
            this.deregisterCube(key, this.selectedWallKeys);
        }
        // print(this.selectedList)
        // console.log(classNames(this.selectedList).indexOf([column, row]));
    }

    addWalls(col, row) {
        let cube = new Cube(col, row);
        cube.cubeType = 'wall';
        cube.fill.speed = 2;
        this.registerCube(cube, this.selectedWallKeys, 'wall');
    }

    deleteWalls(col, row) {
        // let cube = new Cube(col, row);
        let key = listToString([col, row]);
        // cube.cubeType = 'wall';
        this.deregisterCube(key, this.selectedWallKeys);
    }

    deleteAllWalls() {
        for (let key of this.selectedWallKeys) {
            delete this.allCubes[key];
        }
        this.selectedWallKeys.clear();
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

    isWall2(col, row, side) {
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

    isWall(col, row) {
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

class CreateWalls {
    constructor(parent) {
        this.parent = parent;
        this.updateDefaults();
    }

    updateDefaults() {
        this.startLoc = this.parent.start.loc;
        this.endLoc = this.parent.end.loc;
        [this.cols, this.rows] = this.parent.noOfColumnsAndRows;
        [this.firstCol, this.firstRow] = this.parent.firstColAndRow;
        [this.lastCol, this.lastRow] = [this.firstCol + this.cols, this.firstRow + this.rows];
        // console.log(this.cols, this.rows)
    }

    createBox() {
        let masterList = [];
        let list1 = this.topRowLocs();
        let list2 = this.rightColLocs();
        let list3 = this.bottomRowLocs();
        let list4 = this.leftColLocs();
        list1.pop();
        list2.pop();
        list3.pop();
        list4.pop();
        masterList = list1.concat(list2, list3, list4);
        let ret = new IterList(masterList);
        return ret;

    }

    topRowLocs() {
        this.updateDefaults();
        let [x, y] = [this.firstCol, this.firstRow];
        let list = [];
        while (x <= this.lastCol) {
            list.push([x, y]);
            x = x + 1;
        }
        return list;
    }

    bottomRowLocs() {
        this.updateDefaults();
        let [x, y] = [this.lastCol, this.lastRow];
        let list = [];
        while (x >= this.firstCol) {
            list.push([x, y]);
            x = x - 1;
        }
        return list;
    }

    rightColLocs() {
        this.updateDefaults();
        let [x, y] = [this.lastCol, this.firstRow];
        let list = [];
        while (y <= this.lastRow) {
            list.push([x, y]);
            y = y + 1;
        }
        return list;
    }

    leftColLocs() {
        this.updateDefaults();
        let [x, y] = [this.firstCol, this.lastRow];
        let list = [];
        while (y >= this.firstRow) {
            list.push([x, y]);
            y = y - 1;
        }
        return list;
    }
}

class Maze {
    constructor(parent) {
        this.parent = parent;
        this.updateDefaults();
        this.possibleMoves = ['R', 'D', 'L', 'U', false];
        this.wallList = new UniqueIterList();
        this.createWalls = new CreateWalls(this.parent);
        this.fixedWallLocList = [];
        [this.wallOriginX, this.wallOriginY] = [0, 0];
        this.createFixedWallList();
    }

    updateDefaults() {
        this.startLoc = this.parent.start.loc;
        this.endLoc = this.parent.end.loc;
        [this.cols, this.rows] = this.parent.noOfColumnsAndRows;
        [this.firstCol, this.firstRow] = this.parent.firstColAndRow;
        [this.lastCol, this.lastRow] = [this.firstCol + this.cols, this.firstRow + this.rows];
        // console.log(this.cols, this.rows)
    }

    createFixedWallList() {
        if (this.firstCol % 2 !== 0) {
            this.firstCol = this.firstCol + 1;
        }
        if (this.firstRow % 2 !== 0) {
            this.firstRow = this.firstRow + 1;
        }
        let cols = vector(this.firstCol, this.lastCol + 1, 2);
        let rows = vector(this.firstRow, this.lastRow + 1, 2);
        let combine = new Combination();

        this.fixedWallLocList = combine.combine(cols, rows);
        return this.fixedWallLocList;
    }

    isStart(col, row) {
        this.updateDefaults();
        return objectsAreSame(this.startLoc, [col, row])
    }

    isEnd(col, row) {
        this.updateDefaults();
        return objectsAreSame(this.endLoc, [col, row]);
    }

    isValid(col, row) {
        return !(this.isEnd(col, row) || this.isStart(col, row) || this.wallList.has([col, row]));
    }

    getRandomLoc() {
        let col, row;
        col = random(this.firstCol, this.lastCol);
        row = random(this.firstRow, this.lastRow);
        if (this.isValid(col, row)) {
            return [col, row];
        }
        else {
            console.log("recursion");
            return this.getRandomLoc();
        }
    }

    getRandomSide() {
        let index = random(0, this.possibleMoves.length);
        return this.possibleMoves[index]
    }

    getNextSide(loc = null, prevSide = null) {
        let side = this.getRandomSide();
        if (loc) {
            if (prevSide) {
                if (!this.isFixedWallLoc(...loc)) {
                    side = prevSide;
                }
            }
        }
        return side;
    }

    isFixedWallLoc(col, row) {
        let bool = true;
        let diffX = col - this.wallOriginX;
        let diffY = row - this.wallOriginY;
        if (diffX % 2 !== 0) {
            bool = false;
        }
        if (diffY % 2 !== 0) {
            bool = false;
        }
        return bool;
    }

    createMaze() {
        this.clear();
        this.createBox();
        let list = this.fixedWallLocList;
        // let [col, row] = this.getRandomLoc();
        // [col, row] = [0, 0];
        // this.wallList = this.createWalls.createBox();
        // this.wallList.push([col, row])
        for (let i = 0; i < list.length; i++) {
            let [col, row] = list[i];
            (this.expandWalls(col, row));
        }
        return this.wallList
    }

    createBox() {
        let boxWallList = this.createWalls.createBox();
        for (let i of boxWallList.list) {
            this.wallList.push(i);
        }
    }

    expandWalls(col = -4, row = -2) {
        // this.clear();
        let wallList = new UniqueIterList();
        // let side = this.getRandomSide();
        // let bool = true;
        // // wallList.push([col, row]);
        // bool = this.addWalls(col, row, wallList);
        // while (bool && side) {
        //     [col, row] = this.newLoc(col, row, side);
        //     if (this.isValid(col, row)) {
        //         bool = this.addWalls(col, row, wallList);
        //     }
        //     else {
        //         break;
        //     }
        //     side = this.getRandomSide();
        // }
        // return wallList.list;
        return this.recursiveWall(col, row, wallList);
    }

    recursiveWall(col, row, wallList, prevSide = null) {
        let bool = this.addWalls(col, row, wallList);
        let side = this.getNextSide([col, row], prevSide);
        if (bool && side) {
            [col, row] = this.newLoc(col, row, side);
            if (this.isValid(col, row)) {
                // bool = this.addWalls(col, row, wallList);
                this.recursiveWall(col, row, wallList, side);
            }
        }
        return wallList.list;
    }

    addWalls(col, row, wallList) {
        let bool = wallList.push([col, row]);
        this.wallList.push([col, row]);
        // this.parent.addWalls(col, row);
        return bool;
    }

    clear() {
        this.parent.deleteAllWalls();
        this.wallList.clear();
    }

    newLoc(col, row, side) {
        switch (side) {
            case 'R':
                col = col + 1;
                break;
            case 'L':
                col = col - 1;
                break;
            case 'D':
                row = row + 1;
                break;
            case 'U':
                row = row - 1;
                break;
        }
        return [col, row];
    }

    finalLoc(col, row, path) {
        if (path) {
            for (let move of path) {
                [col, row] = this.newLoc(col, row, move);
            }
        }
        return [col, row];
    }

}