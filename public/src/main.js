const socket = io();

window.onload = () => load();

async function load() {
    let clients = await getClients();
}

async function getClients() {
    let clients = [];
    let api = "/clients";
    let response = await fetch(api);
    let data = await response.text();
    console.log(data);

    return clients;
}
