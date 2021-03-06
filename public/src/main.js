const socket = io.connect(window.location.href);
let id, root, clients, room;

window.onload = () => setInterval(() => load(), 500);

async function load() {
    clients = await getClients();
    root = document.getElementById("root");
    root.innerHTML = "";
    for (let i = 0; i < clients.clients.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = clients.clients[i];
        div.addEventListener("click", () => {
            let id_ = clients.clients[i];
            requestConnection(id_);
        });
        root.append(div);
    }
}

const getClients = async () => await (await fetch("/clients")).json();
const requestConnection = (id) => socket.emit("requestConnection", id);

socket.on("callRequest", (data) => (window.location.href = "tel:" + data));
socket.on("socketId", (data) => (id = data));
socket.on("connectionRequest", (data) => socket.emit("connectionConfirmation", { status: confirm(data + " is asking you to connect"), ids: [id, data] }));
socket.on("connectionSucess", (data) => (room = data));

function requestToCall(numb) {
    socket.emit("requestCall", { roomData: room, number: numb, from: id });
}
