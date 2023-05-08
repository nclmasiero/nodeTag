const socket = io("localhost:3000");

socket.on("connect", () => {
    console.log("connection established.");
});

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(51);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}