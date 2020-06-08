class IO {
    constructor() {

    }

    addSearchCube(loc) {
        let cube = new Cube(...loc);
        cube.cubeType = 'searching';
        loc = listToString(loc);
        // console.log(cubesManager.end.loc, loc)
        if (!(loc in cubesManager.allCubes)) {
            cubesManager.registerCube(cube, cubesManager.searchCubeKeys);
        }
    }

    addPathCube(loc) {
        let cube = new Cube(...loc);
        cube.cubeType = 'path';
        loc = listToString(loc);
        if (!(loc in cubesManager.allCubes)) {
            cubesManager.registerCube(cube, cubesManager.pathCubeKeys);
        }
        else if ((loc in cubesManager.allCubes)) {
            cubesManager.allCubes[loc].cubeType = 'path';
        }
    }

    deleteSearchCube() {
        let endLoc = listToString(this.getEndLoc());
        let startLoc = listToString(this.getStartLoc());
        for (let key of cubesManager.searchCubeKeys) {
            if (!([endLoc, startLoc].includes(key))) {
                delete cubesManager.allCubes[key];
            }
        }
        cubesManager.searchCubeKeys.clear();
    }

    drawPath(path) {
        let [col, row] = this.getStartLoc();
        for (let move of path) {
            [col, row] = this.newLoc(col, row, move);
            this.addPathCube([col, row])
        }

    }

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
        return cubesManager.isWall(col, row, side)
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
        return false;
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
    constructor() {
        this.bfs = new BreadthFirstSearch(io);

    }
    next() {
        let [col, row] = this.bfs.getNextLoc();
        console.log([col, row]);
        io.addSearchCube([col, row]);
    }
    whole() {
        let lst = this.bfs.getLevelLoc();
        // console.log(lst);
        for (let loc of lst) {
            // console.log(loc);
            io.addSearchCube(loc);
        }
    }
}

class BreadthFirstSearch {
    constructor(parent) {
        this.parent = parent;
        this.checkSeq = ['R', 'D', 'L', 'U'];
        this.checkSeqIndex = 0;
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
    }

    getNextLoc() {
        let [col, row] = this.getNextMove();
        // if (this.parent.isValidMove(...this.currLoc, move)) {
        //     this.searchedPaths.push(moves);
        // }
        if (this.parent.isEnd(col, row)) {
            this.parent.stop();
            return;
        }
        return [col, row];
    }

    getPrevLoc() {
        let [col, row] = this.getPrevMove();
        // if (this.parent.isValidMove(...this.currLoc, move)) {
        //     this.searchedPaths.push(moves);
        // }
        if (this.parent.isStart(col, row)) {
            this.parent.stop();
            return;
        }
        return [col, row];

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
            console.log('recursion')
            return this.getNextMove();
        }
        return [col, row];
    }

    setCurrLoc(path) {
        this.currLoc = this.finalLoc(...this.startLoc, path);
        console.log(path);
        return this.currLoc;
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