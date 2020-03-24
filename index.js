const express = require("express"),
    app = express(),
    port = process.env.PORT || 3850,
    server = app.listen(port, () => console.log(`listening at ${port}`)),
    io = require("socket.io")(server);

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

let clients = [],
    sockets = [],
    roomCounter = 0,
    rooms = [];

app.get("/clients", (req, res) => res.json({ clients }));

io.on("connection", (socket) => {
    let roomId;
    clients.push(socket.id);
    sockets.push(socket);

    io.to(`${socket.id}`).emit("socketId", socket.id);

    socket.on("connectionConfirmation", (data) => {
        if (data.status === true) {
            roomId = roomCounter + data.ids[0].charAt(0) + data.ids[1].charAt(0);
            roomCounter++;
            rooms.push({ ids: data.ids, room: roomId });
        }
        io.to(`${rooms[roomId.charAt(0)].ids[0]}`).emit("connectionSucess", { status: true, room: roomId });
        io.to(`${rooms[roomId.charAt(0)].ids[1]}`).emit("connectionSucess", { status: true, room: roomId });
    });

    socket.on("requestCall", (data) => {
        let { roomData, number, from } = data,
            to;
        for (let i = 0; i < rooms.length; i++) if (roomData.room === rooms[i].room) to = from === rooms[i].ids[0] ? rooms[i].ids[1] : rooms[i].ids[0];
        io.to(`${to}`).emit("callRequest", number);
    });

    socket.on("requestConnection", (id) => io.to(`${id}`).emit("connectionRequest", socket.id));
    socket.on("disconnect", () => clients.splice(clients.indexOf(socket.id), 1));
});
