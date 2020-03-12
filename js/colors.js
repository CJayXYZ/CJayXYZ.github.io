class Colors {
    constructor(color = '#ff0000') {
        this._color = color;
        this._speed = color_rate;
        this._pattern = 0;
        this.colorFinal = randomVector(255, 3)
        this.colorInit = randomVector(255, 3)
        this.colorMoving = randomVector(255, 3)
        this.counter = 0;
        this.amazingSelector;
    }
    get color() {
        return this._color
    }
    set color(x) {
        this._color = x
    }
    get speed() {
        return this._speed
    }
    set speed(x) {
        this._speed = x
    }
    get pattern() {
        return this._pattern
    }
    set pattern(x) {
        this._pattern = x
        this.patternType()
    }
    patternType() {
        switch (this._pattern) {
            case 0:
                this._color = '#13f3ac';
                this._color = '#8ACA2B';
                this._color = '#039dfc';
                break;
            case 'randomPan':
                this.randomPan()
                break;
            case 'randomFix':
                this.randomFix();
                break;
            case 'over':
                this.overCube();
                break;
            case 'amazing':
                this.amazing();
                break;
        }
    }

    randomPan() {
        let inc = vectorMultiply(vectorInc(this.colorFinal, this.colorInit), this.speed)
        let bool;
        this.colorMoving = vectorAdd(this.colorMoving, inc);
        let i = 0;
        bool = (this.colorFinal[i] - this.colorMoving[i]) / (this.colorFinal[i] - this.colorInit[i])
        if (0 >= bool) {
            this.colorFinal = randomVector(255, 3);
            this.colorInit = this.colorMoving;
        }
        this.color = numsToRGB(...this.colorMoving)
        // console.log(this.colorMoving)
    }

    randomFix() {
        if (this.counter < 1) {
            this.color = numsToRGB(...randomVector(255, 3))
        }
        this.counter = 2;
    }

    overCube() {
        this.color = '#ac13f3'
    }

    amazing() {
        if (this.counter < 1) {
            this.amazingSelector = (Math.random()*10)
        }
        if (this.amazingSelector<6){
            this.color = '#039dfc';
        }
        else if (this.amazingSelector < 9){
            this.randomFix()
        }
        else {
            this.randomPan()
        }
        // console.log(205,Math.random())
        this.counter = 2;
        
    }
}