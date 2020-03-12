const canvas = document.querySelector('#testLoop')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth-10
canvas.height = window.innerHeight-10
let t = 0;
let state = true;


function loop() {
    setInterval(function() {
        t++
        if (state == false){t = 0}
        console.log(t)}, 33)
}
loop()
canvas.onclick = function(e) {
    t = 0
}


