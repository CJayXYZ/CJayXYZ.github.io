class Pillar {
    constructor(column, row, side) {
        this._originX = event.clientX;
        this._originY = event.clientY;
        this.column = column;
        this.row = row;
        this.side = side;
        this.startTime = new Time();
        this.fill = new Colors();
        this.width = grid.wallWidth/2;
    }

    get originX() {
        return this._originX;
    }

    get originY() {
        return this._originY;
    }

    set originX(x) {
        this._originX = x;
    }

    set originY(y) {
        this._originY = y;
    }

    draw() {
        console.log(1111, this.originX, this.originY)
        let coordinates = this.triangularCrown(this.originX, this.originY, 0)
        // coordinates= [ [this.originX, this.originY],[469.75, 400],[318.25, 300]]
        // coordinates = [[150,150], [250,250],[500,300], [300,50]]
        // coordinates = [[150,150], [25,250],[500,300]]//, [300,50]]
        drawPolygon(coordinates)
    }

    triangleType(type) {
        let coordinates;
        this.width = grid.wallWidth/2;
        switch (type) {
            case 'R':
                coordinates = this.triangularCrown(this.originX, this.originY, 0)
                drawPolygon(coordinates)
                coordinates = this.triangularCrown(this.originX+pix, this.originY, 180)
                drawPolygon(coordinates)
                break;
            case 'D':
                coordinates = this.triangularCrown(this.originX, this.originY, 90)
                drawPolygon(coordinates)
                coordinates = this.triangularCrown(this.originX, this.originY+pix, 270)
                drawPolygon(coordinates)
                break;
        }
    }

    triangularCrown(x=0, y=0, a=0){
        let width = this.width;
        let i = [x,y];
        let j = [x-width, y + width];
        let k = [x+width, y+ width];
        // console.log(i,j,k)
        return rotateAll([i, j, k],a);
    }
}