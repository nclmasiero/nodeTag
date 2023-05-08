const socket = io("localhost:3000");

var players = [];
var id = null;
var username = "";

socket.on("id", (_id) => {
    id = _id;
});

socket.on("update", (_players) => {
    players = _players;
});

function setup() {
    createCanvas(windowWidth, windowHeight);

}

function draw() {
    background(200);

    socket.emit("requestUpdate");
    for(let player of players) {
        renderPlayer(player);
    }
    
    if(id != null) getInput();
    else {
        // insert name code
        noStroke();
        fill(0, 100);
        rect(0, 0, width, height);

        noStroke();
        fill(255);
        textSize(width/20);
        textAlign(CENTER, CENTER);
        text("Type your Name:", width/2, height/4);
        text(username, width/2, height/2);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() {
    if(id != null) return;
    username += key;
}

function keyPressed() {
    if(keyCode == 8 && id == null) {
        username = username.substring(0, username.length - 1);
    }
    if(keyCode == 13 && id == null) {
        socket.emit("requestId", username);
    }
}

// ### FUNCTIONS ### //
function renderPlayer(player) {
    stroke(51);
    strokeWeight(2);
    fill(100);
    if(player.isTagged) fill(200, 50, 50);
    textAlign(CENTER, CENTER);
    textSize(player.radius);
    text(player.username, player.position.x, player.position.y - player.radius*2);
    
    if(!player.doRender) return;
    stroke(51);
    strokeWeight(2);
    fill(51);
    if(player.isTagged) fill(200, 50, 50);
    circle(player.position.x, player.position.y, player.radius*2);
}

function getInput() {
    let xDirection = 0;
    let yDirection = 0;

    if(keyIsDown(65)) xDirection--;
    if(keyIsDown(68)) xDirection++;
    if(keyIsDown(87)) yDirection--;
    if(keyIsDown(83)) yDirection++;

    if(xDirection == 0 && yDirection == 0) return;
    let data = {
        id: id,
        x: xDirection,
        y: yDirection
    };
    socket.emit("requestInput", data);
}