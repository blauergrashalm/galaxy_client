import { NetManager } from "./Websocket.js";
import { Galaxy } from "./Galaxy.js";
import { Dot } from "./Dot.js";


const DOUBLE_CLICK_TIME = 500; //ms
export class Field {
    public html: HTMLDivElement;
    private actualField: HTMLDivElement;
    public registeredDot: Dot | null = null;

    private lastClicked = 0;

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
    }

    deactivate() {
        this.activated = false;
        this.actualField.classList.remove("active");
    }

    registerDot(dot: Dot) {
        this.registeredDot = dot;
        this.actualField.style.backgroundColor = dot.getColor();
    }

    removeDot() {
        this.registeredDot = null;
        this.actualField.style.backgroundColor = "";
    }
}
