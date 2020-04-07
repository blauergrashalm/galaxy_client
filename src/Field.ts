import { NetManager } from "./Websocket.js";
import { Galaxy } from "./Galaxy.js";
import { Dot } from "./Dot.js";

export class Field {
    public html: HTMLDivElement;
    private spinner: HTMLDivElement = null;
    private actualField: HTMLDivElement;
    public registeredDot: Dot = null;
    private up: Field;
    private right: Field;
    private down: Field;
    private left: Field;

    private activated = false;

    constructor(public id: number, public x: number, public y: number, private net: NetManager, private parent: Galaxy) {
        this.generateHTML();
        this.html.addEventListener("click", this.handleClick.bind(this));
    }

    generateHTML() {
        this.html = document.createElement("div");
        this.html.classList.add("game-field-wrapper");
        this.actualField = document.createElement("div");
        this.actualField.classList.add("game-field");
        this.html.style.gridColumn = `${this.x + 1} / ${this.x + 2}`;
        this.html.style.gridRow = `${this.y + 1} / ${this.y + 2}`;
        this.html.appendChild(this.actualField);
    }

    handleClick() {
        this.parent.fieldClicked(this);
    }

    activate() {
        if (this.activated) return;
        this.activated = true;
        this.actualField.classList.add("active");
        this.spinner = document.createElement("div");
        this.spinner.classList.add("spinning-frame");
        this.html.appendChild(this.spinner);
    }

    deactivate() {
        this.activated = false;
        if (this.spinner) { this.spinner.remove(); this.spinner = null; }
        this.actualField.classList.remove("active");
    }

    registerDot(dot: Dot) {
        this.registeredDot = dot;
        this.actualField.style.backgroundColor = dot.getColor();
        this.setBorderColor(true);
    }

    setSurounding(up: Field, right: Field, down: Field, left: Field) {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
    }

    setBorderColor(propagade: boolean) {
        this.actualField.style.borderTopColor = this.determinBorderColor(this.up);
        this.actualField.style.borderRightColor = this.determinBorderColor(this.right);
        this.actualField.style.borderBottomColor = this.determinBorderColor(this.down);
        this.actualField.style.borderLeftColor = this.determinBorderColor(this.left);
        if (propagade) {
            if (this.up) this.up.setBorderColor(false);
            if (this.right) this.right.setBorderColor(false);
            if (this.down) this.down.setBorderColor(false);
            if (this.left) this.left.setBorderColor(false);
        }
    }

    determinBorderColor(otherField: Field) {
        if (otherField === null) {
            if (this.registeredDot) return this.registeredDot.getColor(100);
            else return "#333";
        }
        if (this.registeredDot === null) {
            if (otherField.registeredDot === null) return "#333";
            else return otherField.registeredDot.getColor(100);
        } else {
            if (this.registeredDot === otherField.registeredDot) return this.registeredDot.getColor();
            else return this.registeredDot.getColor(100);
        }
    }
}
