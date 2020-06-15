class Grid {
    constructor() {
        this.offsetX = int(pix / 1.75) * 0;
        this.offsetY = int(pix / 3.5) * 0;
        this.maxWidth = canvas.width;
        this.maxHeight = canvas.height;
        this.lineColor = 'white';
        this.maxColumns = int(this.maxWidth / pix);
        this.maxRows = int(this.maxHeight / pix);
        this.wallWidth = (pix / wallFactor);
        this.initials();
        this.updateDefaults();
        this.originColumn = 4;
        this.originRow = 2;
        this.cube = new Cube(0, 0);
        this.mouseX = 0;
        this.mouseY = 0;
        this.lastLocX;// = event.clientX;
        this.lastLocY;// = event.clientY;
        this.lastOriginX;
        this.lastOriginY;
        this.buttonClicked = 0;
        // this.changeInstance = true;
        this.mouseLeftClicked = false;
        this.mouseRightClicked = false;
        this.mouseLeftClickHold = false;
        this.mouseRightClickHold = false;
        this.mouseMoving = false;
        this.mouseDragging = false;
        this.mouseHoldingObject = null;
        this.objectUnderMouse = null;
        this.lastLocUnderMouse = [];
        // console.log(this.originX, this.originY)
    }

    initials() {
        if (this.maxColumns % 2 === 0) {
            this.originX = int(this.maxColumns * pix / 2 + this.offsetX - pix);
        }
        else {
            this.originX = int(this.maxColumns * pix / 2 + this.offsetX - pix / 2);
        }
        if (this.maxRows % 2 === 0) {
            this.originY = int(this.maxRows * pix / 2 + this.offsetY - pix);
        }
        else {
            this.originY = int(this.maxRows * pix / 2 + this.offsetY - pix / 2);
        }
        // console.log(int(this.maxColumns),int(this.maxRows));
    }

    updateDefaults() {
        this.offsetX = this.originX % pix;
        this.offsetY = this.originY % pix;
        canvasLoc = canvas.getBoundingClientRect();
    }

    drawOrigin() {
        ctx.lineWidth = this.wallWidth / 2;
        ctx.beginPath();
        ctx.shadowOffsetX = ctx.lineWidth / 5
        ctx.shadowOffsetY = ctx.lineWidth / 5
        ctx.shadowBlur = ctx.lineWidth / 4
        ctx.shadowColor = 'grey'
        ctx.ellipse(this.originX + pix / 2, this.originY + pix / 2, this.wallWidth, this.wallWidth, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
        this.defaults();
    }

    makeLine(x1, y1, x2, y2) {
        ctx.lineWidth = this.wallWidth;
        ctx.strokeStyle = this.lineColor;
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
    }

    shadow() {
        ctx.shadowOffsetX = ctx.lineWidth / 5
        ctx.shadowOffsetY = ctx.lineWidth / 5
        ctx.shadowBlur = ctx.lineWidth / 4
        ctx.shadowColor = 'grey'
    }

    defaults() {
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 0
    }

    draw() {
        let x0 = this.offsetX;
        let y0 = this.offsetY;
        let xmax = this.maxWidth;
        let ymax = this.maxHeight;
        let x = -(pix - x0);
        let y = -(pix - y0);
        // this.shadow()
        while (x <= xmax + pix) {
            this.makeLine(x, 0, x, ymax)
            x = x + pix
        }
        while (y <= ymax + pix) {
            this.makeLine(0, y, xmax, y)
            y = y + pix
        }
        this.defaults()
    }

    eventHandler(event) {
        // console.log(event)
        this.updateDefaults()
        let mouseX = event.clientX - canvasLoc.x;
        let mouseY = event.clientY - canvasLoc.y;
        let type = this.classifier(mouseX, mouseY);
        let instance;
        if (type === 'cube') {
            instance = cubesManager;
        }
        else if (type === 'wall') {
            instance = wallsManager;
        }
        else {
            console.log('something went wrong');
        }
        // console.log(event.type);
        switch (event.type) {
            case 'click':
                // console.log(1, event.button, event)
                this.click(instance, mouseX, mouseY)
                break;

            case 'mousemove':
                // instance.over(mouseX, mouseY)
                this.mouseMoveHandler(mouseX, mouseY);
                break;

            case 'mouseout':
                // instance.mouseaway(mouseX, mouseY);
                cubesManager.over(mouseX, mouseY)
                break;

            case 'mouseup':
                this.mouseButtonHandler(event.button, 'up')
                break;

            case 'mousedown':
                this.mouseButtonHandler(event.button, 'down')
                break;

            case 'mousewheel':
                this.zoom(event);
                this.lastLocX = event.clientX;
                this.lastLocY = event.clientY;
                this.lastOriginX = this.originX;
                this.lastOriginY = this.originY;
                break;

            case 'resize':
                break;
        }
        this.updateDefaults();
    }

    mouseResetHandler() {
        this.mouseLeftClicked = false;
        this.mouseRightClicked = false;
        this.mouseLeftClickHold = false;
        this.mouseRightClickHold = false;
        this.mouseMoving = false;
        this.mouseDragging = false;
        this.objectUnderMouse = null;
    }

    objectUnderMouseHandler(x, y) {
        this.objectUnderMouse = null;
        let object = this.classifier(x, y);
        let [column, row] = cubesManager.classifier(x, y);
        // if (!objectsAreSame([column, row], this.lastLocUnderMouse)) {
        // object = 'cube'
        switch (object) {
            case 'cube':
                // let [column, row] = cubesManager.classifier(x,y);
                if (objectsAreSame([column, row], cubesManager.start.loc)) {
                    this.objectUnderMouse = cubesManager.start;
                }
                else if (objectsAreSame([column, row], cubesManager.end.loc)) {
                    this.objectUnderMouse = cubesManager.end;
                }
                else {
                    this.objectUnderMouse = cubesManager;
                    // console.log('1whsy');
                }
                break;
            case 'wall':
                this.objectUnderMouse = wallsManager;
                console.log('wall');
                break;
        }
        if (this.mouseHoldingObject) {
            this.mouseHoldingObject.over();
            // cubesManager.over(x,y);
        }
        else {
            // if 
            // this.objectUnderMouse.over(x, y);
            cubesManager.over(x, y);
        }
        // }
        // this.lastLocUnderMouse = [column, row];
    }

    mouseButtonHandler(button, type) {
        let bool = false;
        switch (type) {
            case 'up':
                bool = false;
                break;
            case 'down':
                bool = true;
                break;
        }
        switch (button) {
            case 0:
                this.mouseLeftClicked = bool;
                break;
            case 2:
                this.mouseRightClicked = bool;
                break;
        }
        // console.log('button: ', button, type);
    }

    mouseMoveHandler(x, y) {
        this.objectUnderMouseHandler(x, y)
        let [col, row] = cubesManager.classifier(x, y);

        // if (!objectsAreSame([col, row], this.lastLocUnderMouse)) {
        if((!objectsAreSame([col, row], this.lastLocUnderMouse)) |(! this.mouseHoldingObject)) {

            if (this.mouseRightClicked === true) {
                this.mouseRightClickHold = true;
            }
            else if (this.mouseLeftClicked === true) {
                this.mouseLeftClickHold = true;
            }
            else {
                this.mouseRightClickHold = false;
                this.mouseLeftClickHold = false;
            }

            if (this.mouseLeftClickHold === true) {
                if (!this.mouseHoldingObject) {
                    this.mouseHoldingObject = this.objectUnderMouse;
                }
                if (this.mouseHoldingObject) {
                    if (this.mouseHoldingObject.__str__() !== 'cubesManagers') {
                        this.mouseHoldingObject.drag(x, y);
                    }
                }
            }
            else if (this.mouseRightClickHold === true) {
                this.drag(x, y);
                this.mouseHoldingObject = null;
            }
            else {
                this.mouseHoldingObject = null;
            }
        }
        this.lastLocUnderMouse = [col, row];
        this.lastLocX = event.clientX;
        this.lastLocY = event.clientY;
        this.lastOriginX = this.originX;
        this.lastOriginY = this.originY;
        // this.objectUnderMouse.over(x, y);
    }

    click(instance, mouseX, mouseY) {
        let obj1 = 'wallsManagers';
        if (!this.mouseHoldingObject) {
            if (instance.__str__() === obj1) {
                instance.clicked(mouseX, mouseY);
            }
            else if (instance.__str__() === 'cubesManager') {
                instance.clicked(mouseX, mouseY);
                // console.log('working with click ');
            }
        }
    }

    hover(event) {

    }

    zoom(event) {
        // let pixOld = pix
        let x = event.clientX - canvasLoc.x;
        let y = event.clientY - canvasLoc.y;
        let xo = this.originX;
        let yo = this.originY;
        let dx = x - xo;
        let dy = y - yo;
        // let xrem = dx%pix;
        // let yrem = dy%pix;
        let xquo = (dx / pix);
        let yquo = (dy / pix);
        if (event.deltaY > 0) {
            pix = pix - pix / 10
        } else {
            pix = pix + pix / 10
        }
        if (pix < pixLimit[0]) {
            pix = pixLimit[0]
        } else if (pix > pixLimit[1]) {
            pix = pixLimit[1]
        }
        this.originX = x - xquo * pix;
        this.originY = y - yquo * pix;
        this.wallWidth = (pix / wallFactor);
        // this.updateOffset();
        // this.originX = xo;
        // this.originY= yo;
        // console.log(dx, dy, this.originX, this.originY, event.clientX, event.clientY)
        mainLoop()
    }

    drag(x, y) {
        x = x + canvasLoc.x;
        y = y + canvasLoc.y;
        this.originX = this.lastOriginX + (x - this.lastLocX);
        this.originY = this.lastOriginY + (y - this.lastLocY);
        // this.updateOffset();
    }

    // drag1(event) {
    //     // cubesManager.start.drag(event.clientX - canvasLoc.x, event.clientY - canvasLoc.y)
    //     if (this.buttonClicked == controlButton) {
    //         // console.log('draging')
    //         this.originX = this.lastOriginX + (event.clientX - this.lastLocX);
    //         this.originY = this.lastOriginY + (event.clientY - this.lastLocY);
    //         // console.log(this.originX, (event.clientX), this.lastLocX)
    //     }
    //     else if (event.buttons === 1) {
    //         // console.log(event)
    //         let mouseX = event.clientX - canvasLoc.x;
    //         let mouseY = event.clientY - canvasLoc.y;
    //         let type = this.classifier(mouseX, mouseY);
    //         let instance;
    //         // if 
    //         if (type === 'cube') {
    //             instance = cubesManager;
    //         }
    //         else {
    //             instance = wallsManager;
    //         }
    //         // console.log(1)
    //         instance.clicked(mouseX, mouseY);
    //     }
    //     // console.log(event, this.buttonClicked)
    // }

    classifier(x, y) {
        // this.updateOffset();
        let ret = 'wall';
        let width = this.wallWidth / 2;
        let locX = x - this.offsetX;
        let locY = y - this.offsetY;
        let remX = int(locX % pix);
        let remY = int(locY % pix);
        if (remX < 0) { remX = remX + pix }
        if (remY < 0) { remY = remY + pix }
        if ((width < remX) & (remX <= (pix - width)) & ((width < remY) & (remY <= (pix - width)))) {
            ret = 'cube';
            // wallsManager.mouseaway(x, y);
        }
        else {
            ret = 'wall';
            // cubesManager.mouseaway(x, y);
            // wallsManager.mouseon(x, y);
        }
        // return ret;
        return 'cube';
    }
}