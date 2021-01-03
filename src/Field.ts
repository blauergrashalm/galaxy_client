import { NetManager } from "./Websocket.js";
import { Galaxy } from "./Galaxy.js";
import { Dot } from "./Dot.js";


const DOUBLE_CLICK_TIME = 500; //ms
export class Field {
    public html: HTMLDivElement;
    private spinner: HTMLDivElement | null = null;
    private actualField: HTMLDivElement;
    public registeredDot: Dot | null = null;
    private up: Field | null = null;
    private right: Field | null = null;
    private down: Field | null = null;
    private left: Field | null = null;

    private lastClicked = 0;

    private activated = false;

    constructor(public id: number, public x: number, public y: number, private net: NetManager, private parent: Galaxy) {
        let result = this.generateHTML();
        this.html = result[0];
        this.actualField = result[1];
        this.html.addEventListener("click", this.handleClick.bind(this));
    }

    private generateHTML(): [HTMLDivElement, HTMLDivElement] {
        let divElement = document.createElement("div");
        divElement.classList.add("game-field-wrapper");
        let actualField = document.createElement("div");
        actualField.classList.add("game-field");
        divElement.style.gridColumn = `${this.x + 1} / ${this.x + 2}`;
        divElement.style.gridRow = `${this.y + 1} / ${this.y + 2}`;
        divElement.appendChild(actualField);

        return [divElement, actualField];
    }

    handleClick() {
        if (this.lastClicked >= Date.now() - DOUBLE_CLICK_TIME) {
            this.parent.fieldReset(this);
        } else {
            this.parent.fieldClicked(this);
        }
        this.lastClicked = Date.now();
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

    removeDot() {
        this.registeredDot = null;
        this.actualField.style.backgroundColor = "#444";
        this.setBorderColor(true);
    }

    setSurrounding(up: Field | null, right: Field | null, down: Field | null, left: Field | null) {
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

    determinBorderColor(otherField: Field | null) {
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
