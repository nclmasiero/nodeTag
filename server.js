// express setup
const express = require("express");
const app = express();
app.use(express.static("public"));
const server = app.listen(3000, () => {
    console.log("server listening at port 3000");
});

// socket setup
const io = require("socket.io")(server);

// requires
const Player = require("./base/Player.js");

// ### CODE ### //
var players = [];

setInterval(() => {
    for(let i = players.length - 1; i >= 0; i--) {
        if(players[i].toErase) {
            players.splice(i, 1);
            continue;
        }
        players[i].update();
    }
}, 16);

// events
io.on("connection", (socket) => {
    console.log("[CONNECT] " + socket.id);

    socket.on("requestId", (username) => {
        let id = socket.id;
        players.push(new Player(id, username, 300, 300));
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
        if(player != null) player.toErase = true;
    })
});

// ### FUNCTIONS ### //

function getPlayerById(id) {
    for(let player of players) {
        if(player.id == id) return player;
    }

    return null;
}