import { Field } from "./Field.js";
import { NetManager } from "./Websocket.js";
import { Dot } from "./Dot.js";
import { GameDialog } from "./GameDialog.js";
import { Player } from "./Player.js";

export class Galaxy {
    private fields: { [id: number]: Field } = {};
    private fields_by_pos: Field[][];
    private x_size: number;
    private y_size: number;
    private dots: { [id: number]: Dot } = {};
    private activeField: Field | null = null;
    private network: NetManager;
    private self: Player;
    private players: Player[];
    constructor() {
        this.network = new NetManager(this);
        this.registerEventHandler();
    }

    buildGame(data: any) {
        // Reset
        for (const id in this.dots) {
            this.dots[id].html.remove();
        }
        for (const id in this.fields) {
            this.fields[id].html.remove();
        }

        this.fields = {};
        this.dots = {};

        this.x_size = data.state.size_x;
        this.y_size = data.state.size_y;
        this.fields_by_pos = new Array(this.x_size);
        for (let i = 0; i < this.fields_by_pos.length; i++) {
            this.fields_by_pos[i] = new Array(this.y_size);
        }
        let elem = document.querySelector(".game-grid");
        for (const field of data.state.fields) {
            let f = new Field(field.id, field.x, field.y, this.network, this)
            this.fields[f.id] = f;
            this.fields_by_pos[f.x][f.y] = f;
            elem?.appendChild(f.html)
        }
        for (const dot of data.state.dots) {
            let d = new Dot(dot.id, dot.x, dot.y, this.network, this);
            this.dots[d.id] = d;
            elem?.appendChild(d.html);
            if (dot.fields) for (const field_id of dot.fields) {
                this.fields[field_id].registerDot(d);
            }
        }
        this.calculateDims();
    }

    fieldClicked(f: Field) {
        for (const f_id in this.fields) {
            if (this.fields.hasOwnProperty(f_id)) {
                const field = this.fields[f_id];
                field.deactivate();
            }
        }
        f.activate();
        this.activeField = f;
    }

    fieldReset(f: Field) {
        f.deactivate();
        this.makeChange(f, null);
    }

    dotClicked(d: Dot) {
        if (!this.activeField) return;
        this.makeChange(this.activeField, d);
        this.activeField.deactivate();
        this.activeField = null;
    }

    makeChange(f: Field, d: Dot | null) {
        this.network.send({ command: "game_change", payload: { field: f.id, dot: d != null ? d.id : d } })
    }

    applyChange(data: any) {
        if (data.dot !== null) {
            this.fields[data.field].registerDot(this.dots[data.dot]);
        } else {
            this.fields[data.field].removeDot();
        }
    }

    newGame() {
        let g = new GameDialog((x: number, y: number) => {
            this.network.send({ command: "new_game", payload: { height: y, width: x } })
        });
        document.querySelector(".menu-bar")?.appendChild(g.container);
    }

    registerEventHandler() {
        document.querySelector("#new")?.addEventListener("click", this.newGame.bind(this));
        window.addEventListener("resize", this.calculateDims.bind(this));
        //document.querySelector("#close").addEventListener("click", this.TODO.bind(this));
    }

    calculateDims() {
        let aspectWindow = window.innerHeight / window.innerWidth;
        let aspectGame = this.y_size / this.x_size;
        let mainWrapper = document.querySelector(".main-wrapper");
        let horizontal = true;
        if (aspectGame > aspectWindow) {
            mainWrapper?.classList.add("horizontal");
            mainWrapper?.classList.remove("vertical");
        } else {
            horizontal = false;
            mainWrapper?.classList.remove("horizontal");
            mainWrapper?.classList.add("vertical");
        }
        window.setTimeout(this.calculateCellDims.bind(this, horizontal), 0);
    }

    calculateCellDims(is_horizonatl: boolean) {
        let mainWrapper = document.querySelector(".game-area");
        if (!mainWrapper) throw "asdf";
        let relevantDim = 0;
        let relevantCellCount = 0;

        if (is_horizonatl) {
            relevantDim = this.innerDimensions(mainWrapper).height;
            relevantCellCount = this.y_size;

        } else {
            relevantDim = this.innerDimensions(mainWrapper).width;
            relevantCellCount = this.x_size;
        }
        let gap = (relevantDim / 20) / (relevantCellCount - 1);
        let dim = (relevantDim - (relevantCellCount - 1) * gap) / relevantCellCount;
        (<HTMLDivElement>document.querySelector(".game-grid")).style.gap = gap + "px";
        for (let i = 0; i < this.fields_by_pos.length; i++) {
            for (let j = 0; j < this.fields_by_pos[i].length; j++) {
                this.fields_by_pos[i][j].html.style.height = dim + "px";
                this.fields_by_pos[i][j].html.style.width = dim + "px";
            }
        }
        for (const id in this.dots) {
            if (this.dots.hasOwnProperty(id)) {
                const dot = this.dots[id];
                dot.dot.style.height = (dim / 1.5) + "px";
                dot.dot.style.width = (dim / 1.5) + "px";
            }
        }
    }

    innerDimensions(node: Element) {
        var computedStyle = getComputedStyle(node)

        let width = node.clientWidth // width with padding
        let height = node.clientHeight // height with padding

        height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
        width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
        return { height, width }
    }
}
