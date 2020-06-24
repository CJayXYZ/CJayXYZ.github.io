class IO {
    constructor() {
        this.searching = false;
        this.algo = null;
        this.path = null;
        this.pathFound = false;
        this.createWalls = new CreateWalls(cubesManager);
        this.maze = new Maze(cubesManager);
        this.wallList = new IterList();
        // this.timeForMaze = new Time();
        this.timeForSearch = new Time(stepSize * 10);
        // this.timeForPath = new Time();
        // this.method = new Testing1();
        // this.createMazeList();
        this.firstRun = false;
    }

    clear() {
        this.searching = false;
        this.algo = null;
        this.path = null;
        this.pathFound = false;
        this.deleteAllPathCube();
        this.deleteAllSearchCube();
    }

    stop(pathList = null) {
        this.searching = false;
        if (pathList) {
            pathList.setTimer(stepSize * 4);
            pathList.pop();
        }
        this.path = pathList;
    }

    start() {
        // this.algo = new BreadthFirstSearch(io);
        this.clear();
        this.algo = new BreadthFirstSearch(this);
        this.searching = true;
        this.path = null;
    }

    run() {
        if (this.searching) {
            if (this.timeForSearch.allow()) {
                this.nextLevel();
            }
        }
        else if (this.path) {
            if (this.path.length > 0) {
                let loc = this.path.next();
                if (loc) {
                    this.addPathCube(loc);
                }
                else { }
            }
        }

        // if (this.wallList.list && ! this.searching) {
        if (this.wallList.list) {
            if (this.wallList.length > 0) {
                let loc = this.wallList.next();
                if (loc) {
                    cubesManager.addWalls(...loc);
                }
                else if (this.wallList.length === this.wallList.index) {
                    if (this.firstRun) {
                        this.firstRun = false;
                        this.start();
                    }
                }
            }
        }
        else {
            this.wallList.clear();
        }


    }

    createDefaultWalls() {
        this.createWallsList();
    }

    createMaze() {
        // this.clear();
        this.createMazeList();
        // console.log(1212)
    }

    clearMaze() {
        this.clear();
        this.maze.clear();
    }

    createWallsList() {
        this.wallList.clear();
        this.wallList = this.createWalls.createBox();
        return this.wallList;
    }

    createMazeList() {
        this.wallList.clear();
        this.wallList = this.maze.createMaze();
        this.wallList.setTimer(stepSize * 3);
        return this.wallList;
    }

    next() {
        let [col, row, dist] = this.algo.getNextLoc();
        // console.log([col, row], this.bfs.getLevel(), dist);
        if (dist) {
            this.addSearchCube([col, row]);
        }
        return dist;
    }

    prev() {
        let [col, row, dist] = this.algo.getPrevLoc();
        if (dist) {
            this.deleteSearchCube([col, row]);
        }
        return dist;
    }

    nextLevel() {
        let level = this.algo.getLevel();
        let dist = level;
        while (true) {
            if (dist !== level) {
                break;
            }
            if (!this.searching) { break; }
            dist = this.next();
        }
    }

    prevLevel() {
        let level = this.algo.getLevel();
        let dist = level;
        while (true) {
            if (dist !== level) {
                break;
            }
            dist = this.prev();
        }
    }



    // prev() {
    //     let [col, row] = this.bfs.getPrevLoc();
    // }


    draw() {
        if (this.searching) {

        }

    }

    addSearchCube(loc) {
        let cube = new Cube(...loc);
        cube.cubeType = 'searching';
        cube.fill.speed = 5;
        loc = listToString(loc);
        // console.log(cubesManager.end.loc, loc)
        if (!(loc in cubesManager.allCubes)) {
            cubesManager.registerCube(cube, cubesManager.searchCubeKeys, 'searching');
        }
    }

    deleteSearchCube(loc) {
        // let [col, row] = loc;
        let endLoc = listToString(this.getEndLoc());
        let startLoc = listToString(this.getStartLoc());
        let key = listToString(loc);
        console.log(343);
        if ((key in cubesManager.allCubes)) {
            if (!([endLoc, startLoc].includes(key))) {
                cubesManager.deregisterCube(key, cubesManager.searchCubeKeys)
            }
        }
        // for (let key of cubesManager.searchCubeKeys) {
        //     if (!([endLoc, startLoc].includes(key))) {
        //         delete cubesManager.allCubes[key];
        //     }
        // }
        // cubesManager.searchCubeKeys.clear();
    }

    addPathCube(loc) {
        let cube = new Cube(...loc);
        cube.cubeType = 'path';
        // cube.fill.speed = 500;
        loc = listToString(loc);
        // if (!(loc in cubesManager.allCubes)) {
        cubesManager.registerCube(cube, cubesManager.pathCubeKeys, 'path');
        // }
        // else if ((loc in cubesManager.allCubes)) {
        // cubesManager.allCubes[loc].cubeType = 'path';
        cubesManager.allCubes[loc].fill.speed = 10;
        // }
    }

    deleteAllSearchCube() {
        let endLoc = listToString(this.getEndLoc());
        let startLoc = listToString(this.getStartLoc());
        for (let key of cubesManager.searchCubeKeys) {
            if (!([endLoc, startLoc].includes(key))) {
                delete cubesManager.allCubes[key];
            }
        }
        cubesManager.searchCubeKeys.clear();
    }

    deleteAllPathCube() {
        let endLoc = listToString(this.getEndLoc());
        let startLoc = listToString(this.getStartLoc());
        for (let key of cubesManager.pathCubeKeys) {
            if (!([endLoc, startLoc].includes(key))) {
                delete cubesManager.allCubes[key];
            }
        }
        cubesManager.pathCubeKeys.clear();
    }

    // drawPath(path) {
    //     let [col, row] = this.getStartLoc();
    //     for (let move of path) {
    //         [col, row] = this.newLoc(col, row, move);
    //         this.addPathCube([col, row])
    //     }

    // }

    getStartLoc() {
        return cubesManager.start.loc;
    }

    getEndLoc() {
        return cubesManager.end.loc;
    }

    isInSet(item, set) {
        return set.has(item)
    }

    isItemInAllSets(item) {
        return (this.isInSet(item, cubesManager.masterCubeKeys) || this.isInSet(item, cubesManager.searchCubeKeys))
    }

    isWallOld(col, row, side) {
        // return wallsManager.isWall(col, row, side)
        return cubesManager.isWall2(col, row, side)
    }

    isCubeCoverd(col, row, side) {
        let newLoc = this.newLoc(col, row, side);
        let key = listToString(newLoc);
        return this.isItemInAllSets(key);
    }

    isValidMoveOld(col, row, side) {
        // console.log(this.newLoc(col, row, side), this.getEndLoc)
        return ((!this.isWallOld(col, row, side)) &&
            (!this.isCubeCoverd(col, row, side) ||
                (objectsAreSame(this.newLoc(col, row, side), this.getEndLoc()))))
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
        for (let move of path) {
            [col, row] = this.newLoc(col, row, move);
        }
        return [col, row];
    }

    isWall(col, row) {
        return cubesManager.isWall(col, row)
    }

    isEnd(col, row) {
        // console.log(col, row, this.getEndLoc(), objectsAreSame([col, row], this.getEndLoc()));
        return (objectsAreSame([col, row], this.getEndLoc()));
    }

    isStart(col, row) {
        // console.log(col, row, this.getEndLoc(), objectsAreSame([col, row], this.getEndLoc()));
        return (objectsAreSame([col, row], this.getStartLoc()));
    }

    isVisited(col, row) {
        let key = listToString([col, row]);
        return cubesManager.searchCubeKeys.has(key);
    }

    isValidMove(col, row) {
        return !(this.isStart(col, row) || this.isWall(col, row) || this.isVisited(col, row));
    }

    isValidMoves(startCol, startRow, moves) {
        let side = moves[moves.length - 1];
        let path = moves.substring(0, moves.length - 1);
        let [col, row] = this.finalLoc(startCol, startRow, path)
        return !(this.isEnd(col, row, side) || this.isWall(col, row, side) || this.isValidMove(col, row, side));
    }

    findPath() {
        bfs.findPath();
    }

}

class Testing1 {
    constructor(parent) {
        this.bfs = new BreadthFirstSearch(parent);
        // this.nextLevel(); this.nextLevel(); this.next(); this.next(); this.next(); this.next();
        // this.next();

    }
    next() {
        let [col, row, dist] = this.bfs.getNextLoc();
        // console.log([col, row], this.bfs.getLevel(), dist);
        io.addSearchCube([col, row]);
        return dist;
    }

    prev() {
        let [col, row, dist] = this.bfs.getPrevLoc();
        io.deleteSearchCube([col, row]);
        return dist;
    }

    nextLevel2() {
        let lst = this.bfs.getLevelLoc();
        // console.log(lst);
        for (let loc of lst) {
            // console.log(loc);
            io.addSearchCube(loc);
        }
    }

    nextLevel() {
        let level = this.bfs.getLevel();
        let dist = level;
        while (true) {
            if (dist !== level) {
                break;
            }
            dist = this.next();
        }
    }

    prevLevel() {
        let level = this.bfs.getLevel();
        let dist = level;
        while (true) {
            if (dist !== level) {
                break;
            }
            dist = this.prev();
        }
    }



    // prev() {
    //     let [col, row] = this.bfs.getPrevLoc();
    // }
}

class BreadthFirstSearch {
    constructor(parent) {
        this.parent = parent;
        this.checkSeq = ['R', 'D', 'L', 'U'];
        this.checkSeqIndex = 0;
        this.probeMode = false;
        this.flagLoc = null;
        this.memoryDict = {};
        this.reset();
    }

    reset() {
        this.startLoc = this.parent.getStartLoc();
        this.endLoc = this.parent.getEndLoc();
        this.currLoc = this.startLoc;
        this.gotFinalPath = false;
        this.nextStep = [];
        this.backStep = [];
        this.nextWholeStep = [];
        this.backWholeStep = [];
        // this.searchedPaths = new Queue();
        // this.searchedPaths.enqueue('');
        this.searchedPaths = ['']
        this.currIndexInPaths = 0;
        this.currProbeLevel = 0;
        this.prevLevelIndex = 0;
        this.levelLength = {};
    }

    getNextLoc() {
        let col, row, dist;
        if (this.probeMode) {
            this.prevLevelIndex = this.prevLevelIndex + 1;
            if (this.memoryDict[this.currProbeLevel].length > this.prevLevelIndex) {
                [col, row] = this.memoryDict[this.currProbeLevel][this.prevLevelIndex];
                dist = this.currProbeLevel;
                // if (!objectsAreSame(this.flagLoc, [...this.memoryDict[this.currProbeLevel][this.prevLevelIndex], this.currProbeLevel])) {
                if (objectsAreSame(this.flagLoc, [col, row, dist])) {
                    this.probeMode = false;
                }
            }
            else {
                this.prevLevelIndex = -1;
                this.currProbeLevel = this.currProbeLevel + 1;
                return this.getNextLoc();
            }
        }
        else {
            let value = this.getNextMove();
            if (value) {
                [col, row, dist] = value;
                // if (this.parent.isValidMove(...this.currLoc, move)) {
                //     this.searchedPaths.push(moves);
                // }
                // if (this.parent.isEnd(col, row)) {
                //     this.parent.stop();
                // return;
                // }
            }
        }
        return [col, row, dist];
    }

    getPrevLoc() {
        let [col, row, dist] = this.getPrevMove();
        if (this.parent.isStart(col, row)) {
            this.parent.start();
            // return;
        }
        return [col, row, dist];

    }

    getPrevMove() {
        let index = this.prevLevelIndex;
        if (!this.probeMode) {
            this.probeMode = true;
        }
        if (this.prevLevelIndex < 0) {
            this.currProbeLevel = this.currProbeLevel - 1;
            if (this.currProbeLevel > 0) {
                this.prevLevelIndex = this.memoryDict[this.currProbeLevel].length - 1;
                return this.getPrevMove();
            }
            else {
                this.currProbeLevel = 1;
                return this.startLoc;
            }
        }
        if (!(this.currProbeLevel < 1)) {
            this.prevLevelIndex = this.prevLevelIndex - 1;
            console.log(this.currProbeLevel, index, this.prevLevelIndex);
            return [...this.memoryDict[this.currProbeLevel][index], this.currProbeLevel];
        }
        console.log('Some error in previous command.')
    }

    getLevel() {
        // return this.searchedPaths[this.currIndexInPaths].length;
        return this.currProbeLevel;
    }

    getLevelLoc() {
        let locs = [];
        let level = this.searchedPaths[this.currIndexInPaths].length;
        // console.log(level)
        while (level === this.searchedPaths[this.currIndexInPaths].length) {
            locs.push(this.getNextLoc());
        }
        return locs;
    }


    getNextMove() {
        let path, move, moves, col, row;
        let oldPathIndex = this.currIndexInPaths;
        if (this.searchedPaths.length < this.currIndexInPaths) {
            this.parent.stop();
            return;
        }
        if (this.checkSeqIndex > 3) {
            this.checkSeqIndex = 0;
            this.currIndexInPaths = this.currIndexInPaths + 1;
        }
        path = this.searchedPaths[this.currIndexInPaths];

        if (oldPathIndex !== this.currIndexInPaths) {
            this.setCurrLoc(path);
        }
        move = this.checkSeq[this.checkSeqIndex];
        this.checkSeqIndex = this.checkSeqIndex + 1;
        moves = path + move;
        [col, row] = this.newLoc(...this.currLoc, move);
        if (this.parent.isValidMove(col, row)) {
            this.searchedPaths.push(moves);
        }
        else {
            // console.log('recursion')
            return this.getNextMove();
        }
        if (this.parent.isEnd(col, row)) {
            this.pathFound(moves);
        }
        // console.log(path, col, row, moves, moves.length);
        this.addLocToMemory(col, row, moves.length);
        return [col, row, moves.length];
    }

    addLocToMemory(col, row, dist) {
        if (dist in this.memoryDict) {
            this.memoryDict[dist].push([col, row])
        }
        else {
            this.memoryDict[dist] = [[col, row]]
        }
        this.flagLoc = [col, row, dist];
        this.currProbeLevel = dist;
        this.levelLength[dist] = this.memoryDict[dist].length;
        this.prevLevelIndex = this.memoryDict[dist].length - 1;
    }

    setCurrLoc(path) {
        this.currLoc = this.finalLoc(...this.startLoc, path);
        // console.log(path);
        return this.currLoc;
    }

    pathFound(path) {
        let pathList = this.pathToLocList(path);
        console.log("Path found: ", path);
        this.parent.stop(pathList);
        // this.reset();
    }

    pathToLocList(path) {
        let pathList = new IterList();
        let [col, row] = this.startLoc;
        for (let move of path) {
            [col, row] = this.newLoc(col, row, move);
            pathList.push([col, row]);
        }
        return pathList;
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




class BFS {
    constructor() {
        this.io = io;
        this.startLoc = this.io.getStartLoc();
        this.endLoc = this.io.getEndLoc();
        this.time = new Time();
        this.checkSeq = ['R', 'D', 'L', 'U'];
        this.possiblePaths = new Queue();
        this.possiblePaths.enqueue('');
        this.finalPath = '';
        this.searchingPathLength = 0;
    }

    updateLoc() {
        this.startLoc = this.io.getStartLoc();
        this.endLoc = this.io.getEndLoc();
    }

    findPath() {
        this.updateLoc()
        let loc = this.startLoc;
        let path, moves;
        let pathsForThisIteration = new Queue();
        let currLoc = loc;
        let newLoc;
        let count = new WhileBreak();
        while (true) {
            path = this.possiblePaths.dequeue();
            // console.log([path]);
            if (path !== 'Empty') {
                if (path.length === this.searchingPathLength) {
                    pathsForThisIteration.enqueue(path);
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        this.searchingPathLength = this.searchingPathLength + 1;
        // console.log('this', pathsForThisIteration.printQueue(), '\nnext', this.possiblePaths.printQueue())
        // console.log(this.searchingPathLength);
        while (true) {
            path = pathsForThisIteration.dequeue();
            currLoc = this.io.finalLoc(...loc, path);
            if (path === 'Empty') {
                break;
            }
            for (let move of this.checkSeq) {
                moves = path + move;
                newLoc = this.io.finalLoc(...loc, moves);
                if (this.io.isValidMoveOld(...currLoc, move)) {
                    if (objectsAreSame(newLoc, this.endLoc)) {
                        findPathBool = false;
                        this.finalPath = moves;
                        this.possiblePaths.clear();
                        this.possiblePaths.enqueue('');
                        this.searchingPathLength = 0;
                        this.io.drawPath(moves);
                        break;

                    }
                    else {
                        this.possiblePaths.enqueue(moves);
                        this.io.addSearchCube(this.io.newLoc(...currLoc, move))
                    }
                }
            }
            count.count();
            if (count.counter > 1000) {

                findPathBool = false;
                this.finalPath = moves;
                this.possiblePaths.clear();
                this.possiblePaths.enqueue('');
                this.searchingPathLength = 0;
                this.io.drawPath(moves);
                break;
            }
            if (findPathBool === false) {
                break;
            }
        }
        // console.log(pathsForThisIteration.printQueue(), this.possiblePaths.printQueue())

    }
}