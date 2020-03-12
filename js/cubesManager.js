class CubesManager {
    constructor() {
        this.hoverList = [];
        this.selectedList = [];
        this.start = null;
        this.end = null;
        this.traceList = [];
        this.pathList = [];
        this.allCubes = [this.hoverList, this.selectedList, this.traceList, this.pathList];
        this.lastHover = null;
        this.overCube = null;
        this.all = []
        this.onCube = false;
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
            this.selectedList[i].fill.pattern = 'amazing'
            this.selectedList[i].draw();
            all.push(this.selectedList[i].loc);
        }
        for (let i = 0; i < this.hoverList.length; i++) {
            // console.log(this.hoverList)
            // if (! this.hoverList[i]){//this.hoverList.splice(i, 1);break;
            // }
            this.hoverList[i].fadeSpeed = .003;
            // this.hoverList[i].fill.pattern = 'randomFix';
            this.hoverList[i].fill.pattern = 0;
            this.hoverList[i].hover();
            
            all.push(this.hoverList[i].loc);
            if (this.hoverList[i].state === false) {
                this.hoverList.splice(i, 1);
            }
            // else if (! this.hoverList[i]) {
            //     this.hoverList.splice(i, 1);
            // }
        }
        if (this.start) {
            this.start.draw();
        }
        if (this.end) {
            this.end.draw();
        }
        if (this.overCube) {
            this.overCube.fill.pattern = 0;
            this.overCube.over();
        }
        if (all.length!== this.all.length) {
            this.all = all;
            // console.log(...all);
        }

        this.defaults();
    }

    over(x, y) {
        let [column, row] = this.classifier(x, y);
        if (! objectsAreSame(this.lastHover, [column, row])){
            // console.log(column, row);
            this.overCube = new Cube(column, row);
        }
        else {
            this.overCube = new Cube(column, row);
        }
        this.lastHover = [column, row];
        this.onCube = true;
    }

    clicked(x, y) {
        let [column, row] = this.classifier(x, y);
        if (!(ifin(this.selectedList, [column, row]))) {
            let cube = new Cube(column, row)
            // cube.fill.speed = .3;
            // cube.fill.pattern = 'randomFix'
            // cube.fill.pattern = 0
            cube.fill.speed = 3
            cube.fill.pattern = 'amazing'
            this.selectedList.push(cube)
        }
        // print(this.selectedList)
        // console.log(classNames(this.selectedList).indexOf([column, row]));
    }

    classifier(x, y) {
        let originX = grid.originX;
        let originY = grid.originY;
        let column = int((x - originX) / pix);
        let row = int((y - originY) / pix);
        return [column, row]
    }

    mouseaway(x,y) {
        if (this.onCube === true) {
            // console.log('cube out')
            this.hoverList.push(new Cube(...this.lastHover));
            this.overCube = null;
        }
        this.onCube = false;
    }
}