// express setup
const express = require("express");
const app = express();
app.use(express.static("public"));
const server = app.listen(3000, () => {
    console.log("server listening at port 3000");
});

// socket setup
const io = require("socket.io")(server);

io.on("connection", (socket) => {
    console.log("new connection: " + socket.id);
});