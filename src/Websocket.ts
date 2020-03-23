export class NetManager{

    socket:WebSocket;

    constructor(){
        this.socket = new WebSocket("ws://localhost:9000");

        this.socket.addEventListener("open", (evt) => {
            this.socket.send(JSON.stringify({command: "player_register", payload: {name: "Herbert", passphrase: "1234"}}));
        });
    }

}