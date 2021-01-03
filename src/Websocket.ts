import { Galaxy } from "./Galaxy.js";

export class NetManager {
    socket: WebSocket;

    constructor(private parent: Galaxy) {
        const loc = window.location
        this.socket = new WebSocket(`ws://${loc.hostname}:9000`);

        this.socket.addEventListener("open", () => {
            this.socket.send(JSON.stringify({ command: "player_register", payload: { name: "Herbert", passphrase: "1234" } }));
        });

        this.socket.addEventListener("message", this.onMessageReceived.bind(this));
    }

    onMessageReceived(evt: MessageEvent): void {
        const data = JSON.parse(evt.data);
        if (data.type === "galaxy") {
            this.parent.buildGame(data);
        } else if (data.type === "game_change") {
            this.parent.applyChange(data);
        }
    }

    close(): void {
        this.socket.send(JSON.stringify({ command: "close", payload: {} }));
    }

    send(data: any): void {
        this.socket.send(JSON.stringify(data));
    }
}
