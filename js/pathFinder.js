function print(arg) {
    console.log(arg)
}
const canvas = document.querySelector('#pathFinder')
const ctx = canvas.getContext('2d')
canvas.width = 1500
canvas.height = 800
maxW = canvas.width
maxH = canvas.height
let buttonClicked = -1
let lastLoc
let pix = 40
let offset = [0,0]
let movement = [0,0], movementAbs
let zoomFrom
let xo, yo, xoff, yoff, pixOld, r1, rj
let di = 0, dj = 0
let pixLimit = [1e-1, 1e4]
let origin = offset
let lastOrigin = origin
let xmoved = offset[0], ymoved = offset[1]
let controls = 0
let gridLineRatio = 1/7

let maxColumns = Math.floor(maxW/pix)
let maxRows = Math.floor(maxH/pix)

ctx.fillStyle = 'green'

function makeLine(x1,y1,x2,y2) {
    ctx.beginPath()
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
    while (x<=xmax) {
        makeLine(x,0, x, ymax)
        x =x +pix
    }
    while (y<=ymax) {
        makeLine(0,y, xmax, y)
        y =y +pix
    }
}

// Your code here ###########################################

origin = [offset[0]+Math.floor(maxColumns/2)*pix, offset[1]+Math.floor(maxRows/2)*pix]
reference(origin)
makeGrid(offset, pix)

function reference(origin) {
    ctx.fillStyle = '#30f'
    ctx.fillRect(origin[0], origin[1], pix, pix)
    ctx.lineWidth = Math.floor(pix*gridLineRatio)
    ctx.strokeStyle = 'white'
    makeLine(origin[0], origin[1], origin[0]+pix, origin[1]+pix)
    makeLine(origin[0]+pix, origin[1], origin[0], origin[1]+pix)
}
function moveGrid() {
    if (buttonClicked == controls) {
        ctx.clearRect(0, 0, canvas.width, canvas.height, 50);
        movementAbs = [-lastLoc[0]+event.clientX, -lastLoc[1]+event.clientY]
        movement = movementAbs
        movement = [(movement[0])%pix,(movement[1])%pix]
        xmoved = offset[0]+movement[0]-pix
        ymoved = offset[1]+movement[1]-pix
        reference([lastOrigin[0]+movementAbs[0], lastOrigin[1]+movementAbs[1]])
        makeGrid([xmoved, ymoved], pix)
    } else {
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
    xo = zoomFrom[0]-canvas.offsetLeft
    yo = zoomFrom[1]-canvas.offsetTop
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
canvas.onmousewheel = function(e){
    zoomGrid()
    print(Math.floor(pix))
}