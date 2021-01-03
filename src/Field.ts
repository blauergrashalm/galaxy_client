import { NetManager } from "./Websocket.js";
import { Galaxy } from "./Galaxy.js";
import { Dot } from "./Dot.js";


const DOUBLE_CLICK_TIME = 500; //ms
export class Field {
    public html: HTMLDivElement;
    private spinner: HTMLDivElement | undefined;
    private actualField: HTMLDivElement;
    public registeredDot: Dot | undefined;
    private up: Field | undefined;
    private right: Field | undefined;
    private down: Field | undefined;
    private left: Field | undefined;

    private lastClicked = 0;

    private activated = false;

    constructor(public id: number, public x: number, public y: number, private net: NetManager, private parent: Galaxy) {
        const result = this.generateHTML();
        this.html = result[0];
        this.actualField = result[1];
        this.html.addEventListener("click", this.handleClick.bind(this));
    }

    private generateHTML(): [HTMLDivElement, HTMLDivElement] {
        const divElement = document.createElement("div");
        divElement.classList.add("game-field-wrapper");
        const actualField = document.createElement("div");
        actualField.classList.add("game-field");
        divElement.style.gridColumn = `${this.x + 1} / ${this.x + 2}`;
        divElement.style.gridRow = `${this.y + 1} / ${this.y + 2}`;
        divElement.appendChild(actualField);

        return [divElement, actualField];
    }

    handleClick(): void {
        if (this.lastClicked >= Date.now() - DOUBLE_CLICK_TIME) {
            this.parent.fieldReset(this);
        } else {
            this.parent.fieldClicked(this);
        }
        this.lastClicked = Date.now();
    }

    activate(): void {
        if (this.activated) return;
        this.activated = true;
        this.actualField.classList.add("active");
        this.spinner = document.createElement("div");
        this.spinner.classList.add("spinning-frame");
        this.html.appendChild(this.spinner);
    }

    deactivate(): void {
        this.activated = false;
        if (this.spinner) { this.spinner.remove(); this.spinner = undefined; }
        this.actualField.classList.remove("active");
    }

    registerDot(dot: Dot): void {
        this.registeredDot = dot;
        this.actualField.style.backgroundColor = dot.getColor();
        this.setBorderColor(true);
    }

    removeDot(): void {
        this.registeredDot = undefined;
        this.actualField.style.backgroundColor = "#444";
        this.setBorderColor(true);
    }

    setSurrounding(up: Field | undefined, right: Field | undefined, down: Field | undefined, left: Field | undefined): void {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
    }

    setBorderColor(propagade: boolean): void {
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

    determinBorderColor(otherField: Field | undefined): string {
        if (otherField === undefined) {
            if (this.registeredDot) return this.registeredDot.getColor(100);
            else return "#333";
        }
        if (this.registeredDot === undefined) {
            if (otherField.registeredDot === undefined) return "#333";
            else return otherField.registeredDot.getColor(100);
        } else {
            if (this.registeredDot === otherField.registeredDot) return this.registeredDot.getColor();
            else return this.registeredDot.getColor(100);
        }
    }
}
