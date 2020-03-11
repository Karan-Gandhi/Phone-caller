const socket = io.connect(window.location.href);
let id, root, clients;

window.onload = () => setInterval(() => load(), 5000);

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

async function getClients() {
    let api = "/clients";
    let response = await fetch(api);
    let data = await response.json();
    return data;
}

socket.on("socketId", (data) => (id = data));
socket.on("connectionRequest", (data) => socket.emit("connectionConfirmation", { status: confirm(data + " is asking you to connect"), ids: [id, data] }));
socket.on("connectionSucess", (data) => console.log(data));

function requestConnection(id) {
    socket.emit("requestConnection", id);
}

function requestToCall(numb) {}
