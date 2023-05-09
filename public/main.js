const socket = io(ipAddress + ":" + port);

var players = [];
var id = null;
var username = "";
var boundaries;
var mainCamera = {
    x: 0,
    y: 0
};
console.log(mainCamera);

socket.on("boundaries", (_boundaries) => {
    boundaries = _boundaries;
});

socket.on("id", (_id) => {
    id = _id;
});

socket.on("update", (_players) => {
    players = _players;
});

function setup() {
    createCanvas(windowWidth, windowHeight);

    socket.emit("requestBoudaries");
}

function draw() {
    background(200);

    // UPDATE
    socket.emit("requestUpdate");
    updateCamera();
    renderScoreboard();

    // RENDER
    push();

    translate(width/2 - mainCamera.x, height/2 - mainCamera.y);

    for(let player of players) {
        renderPlayer(player);
    }

    if(boundaries) renderBoudaries();
    
    if(id != null) getInput();
    else {
        // insert name code
        mainCamera.x = width/2;
        mainCamera.y = height/2;

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
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ### FUNCTIONS ### //
function getPlayerById(id) {
    for(let player of players) {
        if(player.id == id) return player;
    }

    return null;
}

function updateCamera() {
    let player = getPlayerById(id);
    if(!player) return;

    mainCamera.x = player.position.x;
    mainCamera.y = player.position.y;
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

function renderScoreboard() {
    noStroke();
    textAlign(RIGHT);
    let size = map(width, 720, 1920, 20, 30);
    textSize(size);
    
    fill(51);
    text("LEADERBOARD:", width - size, size * 1.5);
    let rowHeight = size * 1.1;
    for(let i = 0; i < players.length; i++) {
        let player = players[i];
        fill(51);
        if(player.id == id) fill(50, 180, 50);
        text(player.username + "\t" + Math.round(player.score), width - size, size * 1.5 + i * rowHeight + rowHeight);
    }
}

function renderBoudaries() {
    noFill();
    stroke(51);
    strokeWeight(2);
    line(0, 0, boundaries.width, 0);
    line(0, 0, 0, boundaries.height);
    line(boundaries.width, boundaries.height, boundaries.width, 0);
    line(boundaries.width, boundaries.height, 0, boundaries.height);
}

function renderPlayer(player) {
    if(player.id != id) { // render username
        stroke(51);
        strokeWeight(2);
        fill(100);
        if(player.isTagged) fill(200, 50, 50);
        textAlign(CENTER, CENTER);
        textSize(player.radius);
        text(player.username, player.position.x, player.position.y - player.radius*2);
    }
    
    // render player
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