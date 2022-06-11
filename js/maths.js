function numsToRGB(r, g, b) {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function vector(start, end, step) {
    let curr = start;
    let list = [];
    while (curr <= end - 1) {
        list.push(curr);
        curr = curr + step;
    }
    return list;
}

function randomVector(num, len) {
    let vector = [];
    for (let i = 0; i < len; i++) {
        vector.push(random(0, 256));
    }
    return vector
}

function int(x) {
    return Math.floor(x);
}

function random(x, y) {
    return int(Math.random() * (y - x)) + x;
}

function vectorRatio(x, y, mode = 0) {
    let ret = [];
    for (let i = 0; i < x.length; i++) {
        let m = x[i] / y[i];
        switch (mode) {
            case 0:
                ret.push(m);
                break;
            case 1:
                if (m > 1) { m = 1 / m; }
                ret.push(m);
        }
    }
    return ret
}

function vectorMultiply(x, y) {
    let ret = [];
    let mode = typeof (y);
    for (let i = 0; i < x.length; i++) {
        switch (mode) {
            case 'object':
                ret.push(x[i] * y[i]);
                break;
            case 'number':
                ret.push(x[i] * y);
                break;
        }
    }
    return ret
}

function vectorAdd(x, y) {
    let ret = [];
    let mode = typeof (y);
    for (let i = 0; i < x.length; i++) {
        switch (mode) {
            case 'object':
                ret.push(x[i] + y[i]);
                break;
            case 'number':
                ret.push(x[i] + y);
                break;
        }
    }
    return ret
}

function vectorSubtract(x, y) {
    let ret = [];
    let mode = typeof (y);
    switch (mode) {
        case 'object':
            ret = vectorMultiply(y, -1)
            ret = vectorAdd(x, ret)
            break;
        case 'number':
            ret = vectorAdd(x, -1 * y)
            break;
    }
    return ret;
}

function vectorDivide(x, y) {
    let ret = [];
    let mode = typeof (y);
    switch (mode) {
        case 'object':
            for (let i = 0; i < x.length; i++) {
                ret.push(x[i] / y[i])
            }
            break;
        case 'number':
            ret = vectorMultiply(x, 1 / y)
            break;
    }
    return ret;
}

function vectorInc(x, y) {
    let max = 0;
    let diff = vectorSubtract(x, y);
    for (i = 0; i < x.length; i++) {
        if (max < (Math.abs(diff[i]))) {
            max = (Math.abs(diff[i]));
        }
    }
    return vectorDivide(diff, max);
}

function vectorRound(x) {
    for (i = 0; i < x.length; i++) {
        x[i] = int(x[i]);
    }
    return x;
}

function print(list) {
    let vectors = [];
    for (let i = 0; i < list.length; i++) {
        vectors.push(list[i].loc)
    }
    // console.log(vectors);
    return vectors;
}
function cubeNames(list) {
    let vectors = [];
    for (let i = 0; i < list.length; i++) {
        vectors.push(list[i].loc)
    }
    // console.log(vectors);
    return vectors;
}

function objectsAreSame(x, y) {

    var objectsAreSame = true;
    for (var propertyName in x) {
        if (x[propertyName] !== y[propertyName]) {
            objectsAreSame = false;
            break;
        }
    }
    return objectsAreSame;
}

function ifin(list, cube) {
    var ret = false;
    for (let i = 0; i < list.length; i++) {
        ret = objectsAreSame(list[i].loc, cube.loc);
        // console.log(list[i], value);
        if (ret === true) {
            break;
        }
    }
    // console.log(22)
    return ret;
}

function hash(list) {
    let product = 1;
    let add = 0;
    for (let i = 0; i < list.length; i++) {
        product = list[i] * product
        add = list[i] + add
    }
    return product + add
}

function equationOfLine(x1, y1, x2, y2) {
    let m = (y2 - y1) / (x2 - x1);
    let c = (y1 - m * x1);
    return [m, c];
}

function sideOfPoint(m, c, x, y) {
    // [m, c] = equationOfLine(x1,y1,x2,y2)
    let side = y - m * x - c;
    return [m, c, side]
}

function pointOnTriangle(x1, y1, x2, y2, x3, y3, x, y) {
    let areaMain = areaOfTriangle(x1, y1, x2, y2, x3, y3)
    let area1 = areaOfTriangle(x, y, x2, y2, x3, y3)
    let area2 = areaOfTriangle(x1, y1, x, y, x3, y3)
    let area3 = areaOfTriangle(x1, y1, x2, y2, x, y)
    return (areaMain >= (area1 + area2 + area3))
}

function areaOfTriangle(x1, y1, x2, y2, x3, y3) {
    return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2
}

function drawPolygon(coordinates) {
    // console.log(coordinates);
    // ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(...coordinates[0]);
    for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(...coordinates[i]);
    }
    ctx.closePath();
    ctx.fill();
}

function rotate(x, y, angle, x0, y0) {
    // console.log(x, y, angle, x0, y0)
    angle = rad(angle);
    let x1 = x - x0;
    let y1 = y - y0;
    let h = x;
    let k = y;
    originAngle = Math.atan(y1 / x1);
    length = Math.sqrt(x1 * x1 + y1 * y1);
    h = Math.cos(angle + originAngle) * length + x0;
    k = Math.sin(angle + originAngle) * length + y0;

    // console.log(h,k);
    return [h, k]//, deg(originAngle), deg(angle), x1, y1, length, x, y, x0,y0];
}

function rotateAll(c, angle) {
    let ret = [];
    // console.log(coordinates);
    ret.push(c[0]);
    for (let i = 1; i < c.length; i++) {
        ret.push(rotate(c[i][0], c[i][1], angle, c[0][0], c[0][1]));
    }
    // console.log(c[0], ret)
    // console.log(ret)
    return ret;
}

function translate(x, y, x1, y1) {
    return [x + x1, y + y1];
}

function translateAll(c, x1, y1) {
    let ret = [];
    for (let i = 1; i < c.length; i++) {
        ret.push(translate(c[i][0], c[i][1], x1, y1))
    }
    return ret;
}

function rad(deg) {
    return (Math.PI / 180) * deg;
}
function deg(rad) {
    return (180 / Math.PI) * rad;
}

function listToString(list) {
    let ret = '';
    for (let i of list) {
        ret = ret + '_' + i.toString()
    }
    return ret.toString().slice(1);
}

class WhileBreak {
    constructor() {
        this.counter = 0;
    }
    count() {
        this.counter = this.counter + 1;
    }
}

class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(element) {
        this.items.push(element);
    }
    dequeue() {
        if (this.isEmpty())
            return "Empty";
        return this.items.shift();
    }
    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }
    clear() {
        this.items = [];
    }
    isEmpty() {
        return this.items.length == 0;
    }
    length() {
        return this.items.length;
    }
    printQueue() {
        return this.items;
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }
}

// getLastElement() {
//     // return false;
// }

class IterList {
    constructor(list = []) {
        this.list = list;
        this.index = 0;
        this.timer = null;
    }

    get length() {
        return this.list.length
    }

    push(element) {
        this.list.push(element);
    }

    clear() {
        this.list = [];
        this.index = 0;
    }

    next() {
        let ret = null;
        if (this.ifTimeAllow()) {
            if (this.index < this.list.length) {
                ret = this.list[this.index];
                this.index = this.index + 1;
            }
        }
        return ret;
    }

    ifTimeAllow() {
        if (!this.timer) {
            return true
        }
        else {
            return this.timer.allow();
        }
    }

    setTimer(interval = 1) {
        this.timer = new Time(interval);
    }

    pop() {
        return this.list.pop();
    }

}

class UniqueIterList extends IterList {
    constructor() {
        super();
        this.keyList = new Set();
    }

    push(element) {
        let key = this.getKey(element);
        if (!this.keyList.has(key)) {
            super.push(element);
            this.keyList.add(key);
            return true;
        }
        else {
            return false;
        }
    }

    has(element) {
        let key = this.getKey(element);
        return this.keyList.has(key);
    }

    getKey(item) {
        let key;
        if (Array.isArray(item)) {
            key = listToString(item);
        }
        else {
            key = item.toString();
        }
        return key;
    }

    clear() {
        super.clear();
        this.keyList.clear();
    }
}

class Combination {
    constructor() {
        this.list1 = [];
        this.list2 = [];
        this.len1 = 0;
        this.len2 = 0;
        this.reversed = false;
    }

    combine(list1, list2) {
        this.list1 = list1;
        this.list2 = list2;
        this.len1 = list1.length;
        this.len2 = list2.length;
        let indexList = this.generateIndexList();
        // console.log(indexList)
        // console.log(this.convertToItemList(indexList));
        return this.convertToItemList(indexList);
    }

    convertToItemList(indexList) {
        let itemsList = [];
        for (let i = 0; i < indexList.length; i++) {
            let [ii, jj] = indexList[i];
            let iii = this.list1[ii];
            let jjj = this.list2[jj];
            itemsList.push([iii, jjj]);
        }
        // console.log(itemsList)
        return itemsList;
    }

    generateIndexList() {
        this.reversed = false;
        let len1 = this.len1;
        let len2 = this.len2;
        let i, j, k, max;
        let indexList = [];
        max = len2;

        if (len1 < len2) {
            let a = len1;
            len1 = len2;
            len2 = a;
            this.reversed = true;
            max = len2;
        }

        for (i = 0; i < len1; i++) {
            if (i > (max - 1)) {
                k = max - 1;
            }
            else {
                k = i;
            }
            for (j = k; j > -1; j--) {
                if (k === i) {
                    if (i === j) {
                        this.listPush(i, j, indexList);
                    }
                    else {
                        this.listPush(i, j, indexList);
                        this.listPush(j, i, indexList);
                    }
                }
                else {
                    this.listPush(i, j, indexList);
                }
            }
        }
        return indexList;
    }

    listPush(i, j, list) {
        if (this.reversed) {
            list.push([j, i]);
        }
        else {
            list.push([i, j]);
        }
    } aq
}


function oddNumber(number) {
    number = Math.round(number, 0);
    if (number%2 == 0) {
        if (number>0) {
            number = number - 1
        }
        else {
            number = number + 1
        }
    }
    return number
}