var NetManager = (function () {
    function NetManager(parent) {
        var _this = this;
        this.parent = parent;
        var loc = window.location;
        this.socket = new WebSocket("ws://" + loc.hostname + ":9000");
        this.socket.addEventListener("open", function (evt) {
            _this.socket.send(JSON.stringify({ command: "player_register", payload: { name: "Herbert", passphrase: "1234" } }));
        });
        this.socket.addEventListener("message", this.onMessageReceived.bind(this));
    }
    NetManager.prototype.onMessageReceived = function (evt) {
        var data = JSON.parse(evt.data);
        if (data.type === "galaxy") {
            this.parent.buildGame(data);
        }
        else if (data.type === "game_change") {
            this.parent.applyChange(data);
        }
    };
    NetManager.prototype.close = function () {
        this.socket.send(JSON.stringify({ command: "close", payload: {} }));
    };
    NetManager.prototype.send = function (data) {
        this.socket.send(JSON.stringify(data));
    };
    return NetManager;
}());
export { NetManager };
//# sourceMappingURL=Websocket.js.map