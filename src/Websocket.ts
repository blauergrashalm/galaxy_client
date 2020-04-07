import { Galaxy } from "./Galaxy.js";

export class NetManager{

    socket:WebSocket;

    constructor(private parent:Galaxy){
        let loc=window.location
        this.socket = new WebSocket(`ws://${loc.hostname}:9000`);
        
        this.socket.addEventListener("open", (evt) => {
            this.socket.send(JSON.stringify({command: "player_register", payload: {name: "Herbert", passphrase: "1234"}}));
        });

        this.socket.addEventListener("message", this.onMessageReceived.bind(this));
    }

    onMessageReceived(evt:MessageEvent):void{
        let data = JSON.parse(evt.data);
        if(data.type === "galaxy"){
            this.parent.buildGame(data);
        }else if (data.type === "game_change"){
            this.parent.applyChange(data);
        }
    }

    close(){
        this.socket.send(JSON.stringify({command: "close", payload: {}}));
    }

    send(data:any){
        this.socket.send(JSON.stringify(data));
    }

}