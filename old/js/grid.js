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
        this.initialOrigin();
        this.updateOffset();
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
        // console.log(this.originX, this.originY)
    }

    initialOrigin() {
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

    updateOffset() {
        this.offsetX = this.originX % pix;
        this.offsetY = this.originY % pix;
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

    newEvent(event) {
        // console.log(event)
        let mouseX = event.clientX - canvasLoc.x;
        let mouseY = event.clientY - canvasLoc.y;
        let type = this.classifier(mouseX, mouseY);
        let instance;
        if (type === 'cube') {
            instance = cubesManager;
        }
        else if (type === 'wall'){
            instance = wallsManager;
        }
        else {
            console.log('some thing went wrong');
        }
        // console.log(event.type);
        switch (event.type) {
            case 'click':
                // console.log(event.button, event)
                this.click(instance, mouseX, mouseY)
                break;

            case 'mousemove':
                instance.over(mouseX, mouseY);
                this.drag(event);
                this.updateOffset();
                break;

            case 'mouseout':
                instance.mouseaway(mouseX, mouseY);
                // this.updateOffset();
                break;

            case 'mouseup':
                this.buttonClicked = -1;
                break;

            case 'mousedown':
                this.buttonClicked = event.button
                this.lastLocX = event.clientX;
                this.lastLocY = event.clientY;
                // this.drag(mouseX, mouseY);
                // console.log(event.button)
                this.lastOriginX = this.originX
                this.lastOriginY = this.originY
                // if (this.buttonClicked == controls) {
                //     console.log('draging')
                // }
                this.drag(event);
                this.updateOffset();
                break;

            case 'mousewheel':
                this.lastLocX = event.clientX;
                this.lastLocY = event.clientY;
                this.lastOriginX = this.originX
                this.lastOriginY = this.originY
                this.zoom(event);

                // console.log(event)
                break;
        }
    }

    click(instance, mouseX, mouseY) {
        instance.clicked(mouseX, mouseY);
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
        this.updateOffset()
        // this.originX = xo;
        // this.originY= yo;
        // console.log(dx, dy, this.originX, this.originY, event.clientX, event.clientY)
        mainLoop()
    }

    drag(event) {
        if (this.buttonClicked == controls) {
            // console.log('draging')
            this.originX = this.lastOriginX + (event.clientX - this.lastLocX);
            this.originY = this.lastOriginY + (event.clientY - this.lastLocY);
            // console.log(this.originX, (event.clientX), this.lastLocX)
        }
        else if (event.buttons === 1) {
            // console.log(event)
            let mouseX = event.clientX - canvasLoc.x;
            let mouseY = event.clientY - canvasLoc.y;
            let type = this.classifier(mouseX, mouseY);
            let instance;
            if (type === 'cube') {
                instance = cubesManager;
            }
            else {
                instance = wallsManager;
            }
            // console.log(1)
            instance.clicked(mouseX, mouseY);
        }
        // console.log(event, this.buttonClicked)
    }

    classifier(x, y) {
        this.updateOffset();
        let ret = 'wall';
        let width = this.wallWidth / 2;
        let locX = x - this.offsetX;
        let locY = y - this.offsetY;
        let remX = int(locX % pix);
        let remY = int(locY % pix);
        if (remX < 0) { remX = remX + pix }
        if (remY < 0) { remY = remY + pix }
        // console.log(remX, remY, thick);
        // if ((thick< remX) | (remX<= (pix-thick)) | (thick< remY) | (remY<= (pix-thick))){
        if ((width < remX) & (remX <= (pix - width)) & ((width < remY) & (remY <= (pix - width)))) {
            // console.log(0, remX, remY, thick);
            ret = 'cube';
            wallsManager.mouseaway(x, y);
        }
        else {
            // console.log(1, remX, remY, thick);
            ret = 'wall';
            cubesManager.mouseaway(x, y);
            wallsManager.mouseon(x, y);
        }
        // ret = 'wall';
        // ret = 'cube';
        // console.log(ret)
        return ret;
    }
}