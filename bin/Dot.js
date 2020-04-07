var Dot = (function () {
    function Dot(id, x, y, net, parent) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.net = net;
        this.parent = parent;
        this.generateHTML();
    }
    Dot.prototype.generateHTML = function () {
        this.html = document.createElement("div");
        this.html.classList.add("game-dot");
        this.html.style.gridColumn = Math.floor((this.x + 2) / 2) + " / " + (Math.ceil((this.x + 2) / 2) + 1);
        this.html.style.gridRow = Math.floor((this.y + 2) / 2) + " / " + (Math.ceil((this.y + 2) / 2) + 1);
        var dot = document.createElement("div");
        dot.classList.add("dot");
        this.html.appendChild(dot);
        dot.style.backgroundColor = this.getColor();
        dot.addEventListener("click", this.handleClick.bind(this));
    };
    Dot.prototype.handleClick = function () {
        this.parent.dotClicked(this);
    };
    Dot.prototype.getColor = function (saturation) {
        if (saturation === void 0) { saturation = 65; }
        var hue = this.id * 0.618033988749895;
        hue %= 1;
        var lightness = 40 + (this.id % 3) * 20;
        return "hsl(" + hue * 360 + ", " + saturation + "%, " + lightness + "%)";
    };
    return Dot;
}());
export { Dot };
//# sourceMappingURL=Dot.js.map