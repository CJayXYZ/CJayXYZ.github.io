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
        else if ((loc in cubesManager.allCubes)){
            cubesManager.allCubes[loc].cubeType= 'path';
        }
    }

    deleteSearchCube() {
        let endLoc = listToString( this.getEndLoc());
        let startLoc = listToString(this.getStartLoc());
        for (let key of cubesManager.searchCubeKeys) {
            if (!([endLoc, startLoc].includes(key))) {
                delete cubesManager.allCubes[key];
            }
        }
        cubesManager.searchCubeKeys.clear();
    }

    drawPath(path){
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

    isWall(col, row, side) {
        [col, row, side] = wallsManager.exactWall(col, row, side);
        let name = listToString([col, row, side]);
        // console.log(wallsManager.allWalls)
        if (name in wallsManager.allWalls) {
            if (wallsManager.allWalls[name].wallType === 'wall') {
                return true;
            }
        }
        return false;
    }

    isCubeCoverd(col, row, side) {
        let newLoc = this.newLoc(col, row, side);
        let key = listToString(newLoc);
        return this.isItemInAllSets(key);
    }

    isValidMove(col, row, side) {
        // console.log(this.newLoc(col, row, side), this.getEndLoc)
        return ((!this.isWall(col, row, side)) &&
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
        // this.io.deleteSearchCube();
        // console.log(this.startLoc, this.endLoc)
        let loc = this.startLoc;
        let path, moves;
        let pathsForThisIteration = new Queue();
        let currLoc = loc;
        let newLoc;
        let count = new WhileBreak();

        // console.log(currLoc, this.endLoc, path, this.possiblePaths);
        // console.log(){
        // count.counter = 0;
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
                // findPath = false;
                break;
            }
            // count.count();
            // if (count.counter > 200) {
            //     break;
            // }
        }
        this.searchingPathLength = this.searchingPathLength + 1;
        // console.log('this', pathsForThisIteration.printQueue(), '\nnext', this.possiblePaths.printQueue())
        // console.log(this.searchingPathLength);
        while (true) {
            path = pathsForThisIteration.dequeue();
            currLoc = this.io.finalLoc(...loc, path);
            if (path === 'Empty') {

                // findPath = false;
                break;
            }
            for (let move of this.checkSeq) {
                moves = path + move;
                newLoc = this.io.finalLoc(...loc, moves);
                if (this.io.isValidMove(...currLoc, move)) {
                    if (objectsAreSame(newLoc, this.endLoc)) {
                        findPath = false;
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
            if (count.counter > 2000) {
                
                findPath = false;
                this.finalPath = moves;
                this.possiblePaths.clear();
                this.possiblePaths.enqueue('');
                this.searchingPathLength = 0;
                this.io.drawPath(moves);
                break;
            }
            if (findPath === false) {
                break;
            }
        }
        // console.log(pathsForThisIteration.printQueue(), this.possiblePaths.printQueue())

    }

    // findPath1() {
    //     this.updateLoc()
    //     this.io.deleteSearchCube();
    //     console.log(this.startLoc, this.endLoc)
    //     let loc = this.startLoc;
    //     let count = new WhileBreak();
    //     let path, moves;
    //     let currLoc = loc;
    //     // while (! objectsAreSame(loc, this.endLoc)){
    //     //     let cube = new Cube(...loc);
    //     //     this.addStep(cube);

    //     //     count.count();
    //     //     if (count.counter > 100){
    //     //         break;
    //     //     }
    //     //     // break;
    //     // }
    //     count.counter = 0;
    //     while (true) {
    //         path = this.possiblePaths.dequeue();
    //         currLoc = this.io.finalLoc(...loc, path);
    //         if (objectsAreSame(currLoc, this.endLoc)) {
    //             findPath = false;
    //             break;
    //         }
    //         for (let move of this.checkSeq) {
    //             moves = path + move;
    //             if (this.io.isValidMove(...currLoc, move)) {
    //                 this.possiblePaths.enqueue(moves);
    //                 this.io.addSearchCube(this.io.newLoc(...currLoc, move))
    //             }
    //         }

    //         console.log(currLoc, this.possiblePaths)
    //         count.count();
    //         if (count.counter > 20000) {
    //             break;
    //         }
    //     }
    //     console.log(this.possiblePaths, path)
    // }

    // addStep(cube) {
    //     let checkSeq = this.checkSeq;
    //     let [col, row] = cube.loc;
    //     for (let side of checkSeq) {
    //         if (this.io.isValidMove(col, row, side)) {
    //             let newLoc = this.io.newLoc(col, row, side);
    //             // console.log(cube.loc, side, newLoc);
    //             let newCube = new Cube(...newLoc);
    //             newCube.cubeType = 'searching';
    //             cubesManager.registerCube(newCube, cubesManager.searchCubeKeys)
    //         }
    //     }
    // }
}