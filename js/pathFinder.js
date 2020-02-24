function print(arg) {
    console.log(arg)
}
const canvas = document.querySelector('#pathFinder')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth-100
canvas.height = window.innerHeight-100
maxW = canvas.width
maxH = canvas.height
let buttonClicked = -1
let lastLoc
let canvasLoc = canvas.getBoundingClientRect();
let pix = 50
let originShift = -1
let offset = [int((maxW%pix)/2),int((maxH%pix)/2)]
let movement = [0,0], movementAbs
let zoomFrom
let xo, yo, xoff, yoff, pixOld, ri, rj, rextLoc, row, column,cubeX,cubeY
let di = 0, dj = 0
let pixLimit = [1e-1,1e4]
let origin = offset
let lastOrigin = origin
let xmoved = offset[0], ymoved = offset[1]
let controls = 2
let gridLineRatio = 1/6
let objectAt
let wallWidth = gridLineRatio*pix/2;
let wallLength = pix;
let wallLenDelta = 0;
let wallWidDelta = 1.5;
let wx1, wx2, wy1, wy2;

let maxColumns = Math.floor(maxW/pix)
let maxRows = Math.floor(maxH/pix)

ctx.fillStyle = 'green'

function makeLine(x1,y1,x2,y2) {
    ctx.beginPath()
    ctx.shadowOffsetX = ctx.lineWidth/5
    ctx.shadowOffsetY = ctx.lineWidth/5
    ctx.shadowBlur = ctx.lineWidth/4
    ctx.shadowColor = 'grey'
    ctx.moveTo(x1,y1)
    ctx.lineTo(x2,y2)
    ctx.stroke()
}
ctx.strokeStyle = 'white'

function makeGrid(startLoc, pix) { //startLoc will specify where to start square
    x0 = startLoc[0]
    y0 = startLoc[1]
    xmax = canvas.width
    ymax = canvas.height
    x = -(pix - x0)
    y = -(pix - y0)
    ctx.lineWidth = Math.floor(pix*gridLineRatio)

    
    // print(ctx.lineWidth)
    while (x<=xmax+pix) {
        makeLine(x,0, x, ymax)
        x =x +pix
    }
    while (y<=ymax+pix) {
        makeLine(0,y, xmax, y)
        y =y +pix
    }
}

// Your code here ###########################################

origin = [offset[0]+Math.floor(maxColumns/2+originShift)*pix, offset[1]+Math.floor(maxRows/2+originShift)*pix]
reference(origin)
makeGrid(offset, pix)

function reference(origin) {
    ctx.fillStyle = '#30f'
    ctx.fillRect(origin[0], origin[1], pix, pix)
    ctx.lineWidth = Math.floor(pix*gridLineRatio)/2
    ctx.strokeStyle = 'white'
    makeLine(origin[0], origin[1], origin[0]+pix, origin[1]+pix)
    makeLine(origin[0]+pix, origin[1], origin[0], origin[1]+pix)
}
function convertToInnerSquare(x,y) {
    di = Math.floor(pix*gridLineRatio)/2
    return [x+di, y+di, pix-2*di, pix-2*di]
}
function highlightWall(column,row, wall) {
    displayGrid()
    ctx.globalAlpha = .8;
    cubeX = offset[0]+column*pix +pix/2;
    cubeY = offset[1]+row*pix + pix/2;
    wx1 = cubeX-pix/2
    wx2 = cubeX+pix/2
    wy1 = cubeY-pix/2
    wy2 = cubeY+pix/2
    wallLength = pix;
    ctx.fillStyle ='#7a0d05'
    if (wall=='left') {
        ctx.fillRect(wx1-wallWidth*wallWidDelta, wy1-wallWidth*wallLenDelta, 2*wallWidth*wallWidDelta, pix+2*wallWidth*wallLenDelta)
    }else if (wall=='top') {
        ctx.fillRect(wx1-wallWidth*wallLenDelta, wy1-wallWidth*wallWidDelta, pix+2*wallWidth*wallLenDelta, 2*wallWidth*wallWidDelta )
    }else if (wall=='right') {
        ctx.fillRect(wx2-wallWidth*wallWidDelta, wy2-wallWidth*wallLenDelta-pix, 2*wallWidth*wallWidDelta, pix+2*wallWidth*wallLenDelta)
    }else if (wall=='bottom') {
        ctx.fillRect(wx2-wallWidth*wallLenDelta-pix, wy2-wallWidth*wallWidDelta, pix+2*wallWidth*wallLenDelta, 2*wallWidth*wallWidDelta)
    }
}
function identifier(xo,yo) {
    ri = xo-offset[0];
    rj = yo-offset[1];
    column = int(ri/pix);
    row = int(rj/pix);
    xrem = ri%pix;
    yrem = rj%pix;
    if (xrem<0){xrem = xrem+pix}
    if (yrem<0){yrem = yrem+pix}
    wallWidth = gridLineRatio*pix/2;
    tile = [offset[0]+column*pix, offset[1]+row*pix]
    if (((0<=xrem & xrem<wallWidth)|
        ((pix-wallWidth<xrem) & xrem<=pix))|
        // ((-wallWidth<xrem) & xrem<=pix))|
        ((0<=yrem & yrem<=wallWidth)|
        ((pix-wallWidth<=yrem) & yrem<pix))){
            if ((0<=xrem & xrem<wallWidth)){
                highlightWall(column, row, 'left')
            } else if (0<=yrem && yrem<wallWidth){
                highlightWall(column, row, 'top')
            } else if ((pix-wallWidth<xrem) & xrem<pix){
                highlightWall(column, row, 'right')
            } else {
                highlightWall(column, row, 'bottom')
            }
    }
    else {
        return tile
    }



    // print([column,row])
    return [-10000. -10000]
}
function hover() {
    lastLoc = [event.clientX, event.clientY]
    lastOrigin = origin
    displayGrid()
    xo = event.clientX-canvasLoc.x
    yo = event.clientY-canvasLoc.y
    ctx.fillStyle = 'grey'
    ctx.globalAlpha = 0.4;
    ctx.fillRect(...convertToInnerSquare(...identifier(xo,yo)))
    ctx.globalAlpha = 1.0;
}
function displayGrid() {
    ctx.globalAlpha = 1.0;
    ctx.clearRect(0, 0, canvas.width, canvas.height, 50);
    movementAbs = [-lastLoc[0]+event.clientX, -lastLoc[1]+event.clientY]
    movement = movementAbs
    movement = [(movement[0])%pix,(movement[1])%pix]
    xmoved = offset[0]+movement[0]-pix
    ymoved = offset[1]+movement[1]-pix
    reference([lastOrigin[0]+movementAbs[0], lastOrigin[1]+movementAbs[1]])
    makeGrid([xmoved, ymoved], pix)
    // rectLoc = convertToInnerSquare(origin[0]+pix*2, origin[1]+pix*4)
    // // print(rectLoc)
    // ctx.fillRect(rectLoc[0],rectLoc[1],rectLoc[2],rectLoc[3])
}
function moveGrid() {
    if (buttonClicked == controls) {
        displayGrid()
    } else {
        hover()
    }
}
function holdGrid() {
    buttonClicked = event.button
    lastLoc = [event.clientX, event.clientY]
    lastOrigin = origin
    if (buttonClicked == controls) {
        // console.log('draging')
    }
}
function releaseGrid() {
    if (buttonClicked == controls) {
        // console.log('released')
        // offset = [offset[0]+movement[0],offset[1]+movement[1]]
        offset = [xmoved, ymoved]
        offset = [(offset[0])%pix,(offset[1])%pix]
        origin = [lastOrigin[0]+movementAbs[0], lastOrigin[1]+movementAbs[1]]
    }
    buttonClicked = -1
}
function zoomGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height, 50);
    zoomFrom = [event.clientX, event.clientY]
    xo = zoomFrom[0]-canvasLoc.x
    yo = zoomFrom[1]-canvasLoc.y
    xoff = offset[0]
    yoff = offset[1]
    pixOld = pix
    if (event.deltaY>0){
        pix = pix-pix/10
    } else {
        pix = pix+pix/10
    }
    if (pix < pixLimit[0]) {
        pix = pixLimit[0]
    }else if (pix> pixLimit[1]){
        pix = pixLimit[1]
    }

    ri = xo - origin[0]
    rj = yo - origin[1]
    di = ri - ri*pix/pixOld
    dj = rj - rj*pix/pixOld
    origin[0] = origin[0] + di
    origin[1] = origin[1] + dj
    reference(origin)

    ri = xo - xoff
    rj = yo - yoff
    di = ri - ri*pix/pixOld
    dj = rj - rj*pix/pixOld
    offset[0] = offset[0] + di
    offset[1] = offset[1] + dj
    // print([pix, offset[0], offset[1], di, dj, xo, yo])
    offset = [(offset[0])%pix,(offset[1])%pix]
    makeGrid(offset, pix)
}
function int(x) { return Math.floor(x)}
canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.onmousemove = function(e) {
    moveGrid()
}
canvas.onmousedown = function(e) {
    holdGrid()
}
canvas.onmouseup = function(e) {
    releaseGrid()
}
canvas.onmouseout = function(e) {
    releaseGrid()
}
canvas.onmousewheel = function(e) {
    zoomGrid()
    print(Math.floor(pix))
}
