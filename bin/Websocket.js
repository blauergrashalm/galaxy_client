var NetManager = (function () {
    function NetManager() {
        var _this = this;
        this.socket = new WebSocket("ws://localhost:9000");
        this.socket.addEventListener("open", function (evt) {
            _this.socket.send(JSON.stringify({ command: "player_register", payload: { name: "Herbert", passphrase: "1234" } }));
        });
    }
    return NetManager;
}());
export { NetManager };
//# sourceMappingURL=Websocket.js.map