var Field = (function () {
    function Field(id, x, y, net, parent) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.net = net;
        this.parent = parent;
        this.spinner = null;
        this.registeredDot = null;
        this.activated = false;
        this.generateHTML();
        this.html.addEventListener("click", this.handleClick.bind(this));
    }
    Field.prototype.generateHTML = function () {
        this.html = document.createElement("div");
        this.html.classList.add("game-field-wrapper");
        this.actualField = document.createElement("div");
        this.actualField.classList.add("game-field");
        this.html.style.gridColumn = this.x + 1 + " / " + (this.x + 2);
        this.html.style.gridRow = this.y + 1 + " / " + (this.y + 2);
        this.html.appendChild(this.actualField);
    };
    Field.prototype.handleClick = function () {
        this.parent.fieldClicked(this);
    };
    Field.prototype.activate = function () {
        if (this.activated)
            return;
        this.activated = true;
        this.actualField.classList.add("active");
        this.spinner = document.createElement("div");
        this.spinner.classList.add("spinning-frame");
        this.html.appendChild(this.spinner);
    };
    Field.prototype.deactivate = function () {
        this.activated = false;
        if (this.spinner) {
            this.spinner.remove();
            this.spinner = null;
        }
        this.actualField.classList.remove("active");
    };
    Field.prototype.registerDot = function (dot) {
        this.registeredDot = dot;
        this.actualField.style.backgroundColor = dot.getColor();
        this.setBorderColor(true);
    };
    Field.prototype.setSurounding = function (up, right, down, left) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
    };
    Field.prototype.setBorderColor = function (propagade) {
        this.actualField.style.borderTopColor = this.determinBorderColor(this.up);
        this.actualField.style.borderRightColor = this.determinBorderColor(this.right);
        this.actualField.style.borderBottomColor = this.determinBorderColor(this.down);
        this.actualField.style.borderLeftColor = this.determinBorderColor(this.left);
        if (propagade) {
            if (this.up)
                this.up.setBorderColor(false);
            if (this.right)
                this.right.setBorderColor(false);
            if (this.down)
                this.down.setBorderColor(false);
            if (this.left)
                this.left.setBorderColor(false);
        }
    };
    Field.prototype.determinBorderColor = function (otherField) {
        if (otherField === null) {
            if (this.registeredDot)
                return this.registeredDot.getColor(100);
            else
                return "#333";
        }
        if (this.registeredDot === null) {
            if (otherField.registeredDot === null)
                return "#333";
            else
                return otherField.registeredDot.getColor(100);
        }
        else {
            if (this.registeredDot === otherField.registeredDot)
                return this.registeredDot.getColor();
            else
                return this.registeredDot.getColor(100);
        }
    };
    return Field;
}());
export { Field };
//# sourceMappingURL=Field.js.map