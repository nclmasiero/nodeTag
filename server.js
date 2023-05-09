const global = require("./public/global.js");

// express setup
const express = require("express");
const app = express();
app.use(express.static("public"));
const server = app.listen(global.port, () => {
    console.log("server started.");
    console.log("ipAddress: " + global.ipAddress);
    console.log("port: " + global.port);
});

// socket setup
const io = require("socket.io")(server);

// requires
const Player = require("./base/player.js");
const collision = require("./base/collision.js");

// ### CODE ### //
var players = [];
var everTagged = false;
var boundaries = {
    width: 1600,
    height: 1200
};

setInterval(() => {
    for(let i = players.length - 1; i >= 0; i--) {
        if(players[i].toErase) {
            players.splice(i, 1);
            continue;
        }
        // generic update
        players[i].update();
        // collisions update
        for(let j = i - 1; j >= 0; j--) {
            if(collision.isOverlapping(players[i], players[j])) {
                players[i].collideWith(players[j]);
            }
        }
    }
}, 16);

setInterval(() => {
    orderArray();
}, 60);

// events
io.on("connection", (socket) => {
    console.log("[CONNECT] " + socket.id);

    socket.on("requestBoudaries", () => {
        socket.emit("boundaries", boundaries);
    });

    socket.on("requestId", (username) => {
        let id = socket.id;
        spawnPlayer(id, username);
        if(!everTagged) everTagged = true;
        socket.emit("id", id);
    });

    socket.on("requestUpdate", () => {
        socket.emit("update", players);
    });

    socket.on("requestInput", (data) => {
        let player = getPlayerById(data.id);
        if(!player) return;

        player.speed.x += data.x * player.step;
        player.speed.y += data.y * player.step;
    });

    socket.on("disconnect", () => {
        console.log("[DISCONNECT] " + socket.id);
        let player = getPlayerById(socket.id);
        if(player != null) {
            player.toErase = true;
            if(player.isTagged) everTagged = false;
        }
    })
});

// ### FUNCTIONS ### //

function orderArray() {
    let changed = true;
    while(changed) {
        changed = false;
        for(let i = 0; i < players.length - 1; i++) {
            if(players[i].score < players[i + 1].score) {
                let temp = players[i];
                players[i] = players[i + 1];
                players[i + 1] = temp;
                changed = true;
            }
        }
    }
}

function spawnPlayer(id, username) {
    players.push(new Player(id, username, !everTagged, 300, 300, boundaries));
}

function getPlayerById(id) {
    for(let player of players) {
        if(player.id == id) return player;
    }

    return null;
}