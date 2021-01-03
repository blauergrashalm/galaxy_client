import { Field } from "./Field.js";
import { NetManager } from "./Websocket.js";
import { Dot } from "./Dot.js";
import { GameDialog } from "./GameDialog.js";

export class Galaxy {
    private fields: { [id: number]: Field } = {};
    private fields_by_pos: Field[][] = [];
    private x_size: number | undefined;
    private y_size: number | undefined;
    private dots: { [id: number]: Dot } = {};
    private activeField: Field | null = null;
    private network: NetManager
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

        this.x_size = <number>data.state.size_x;
        this.y_size = <number>data.state.size_y;
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
        this.interconnectFields(this.x_size, this.y_size);
        for (const dot of data.state.dots) {
            let d = new Dot(dot.id, dot.x, dot.y, this.network, this);
            this.dots[d.id] = d;
            elem?.appendChild(d.html);
            if (dot.fields) for (const field_id of dot.fields) {
                this.fields[field_id].registerDot(d);
            }
        }
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

    private interconnectFields(x_size: number, y_size: number) {
        for (let x = 0; x < x_size; x++) {
            for (let y = 0; y < y_size; y++) {
                let field = this.fields_by_pos[x][y];
                let up = y === 0 ? null : this.fields_by_pos[x][y - 1];
                let down = y === y_size - 1 ? null : this.fields_by_pos[x][y + 1];
                let right = x === x_size - 1 ? null : this.fields_by_pos[x + 1][y];
                let left = x === 0 ? null : this.fields_by_pos[x - 1][y];
                field.setSurrounding(up, right, down, left);
            }
        }
    }

    registerEventHandler() {
        document.querySelector("#new")?.addEventListener("click", this.newGame.bind(this));
        //document.querySelector("#close").addEventListener("click", this.TODO.bind(this));
    }
}
