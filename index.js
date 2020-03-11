const express = require("express");
const app = express();
const port = process.env.PORT || 3850;
const server = app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static("public"));
const io = require("socket.io")(server);

let clients = [];
let sockets = [];
let roomCounter = 0;
let rooms = [];

app.get("/clients", (req, res) => res.json({ clients }));

io.on("connection", (socket) => {
    let roomId;
    clients.push(socket.id);
    sockets.push(socket);

    io.to(`${socket.id}`).emit("socketId", socket.id);

    socket.on("connectionConfirmation", (data) => {
        console.log(data);
        if (data.status === true) {
            roomId = roomCounter;
            roomCounter++;
            rooms.push({ ids: data.ids });
        }
        io.to(`${rooms[roomId].ids[0]}`).emit("connectionSucess", true);
        io.to(`${rooms[roomId].ids[1]}`).emit("connectionSucess", true);
    });

    socket.on("requestConnection", (id) => io.to(`${id}`).emit("connectionRequest", socket.id));
    socket.on("disconnect", () => clients.splice(clients.indexOf(socket.id), 1));
});
