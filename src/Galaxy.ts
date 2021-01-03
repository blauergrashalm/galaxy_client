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

    buildGame(data: any): void {
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
        const elem = document.querySelector(".game-grid");
        for (const field of data.state.fields) {
            const f = new Field(field.id, field.x, field.y, this.network, this)
            this.fields[f.id] = f;
            this.fields_by_pos[f.x][f.y] = f;
            elem?.appendChild(f.html)
        }
        this.interconnectFields(this.x_size, this.y_size);
        for (const dot of data.state.dots) {
            const d = new Dot(dot.id, dot.x, dot.y, this.network, this);
            this.dots[d.id] = d;
            elem?.appendChild(d.html);
            if (dot.fields) for (const field_id of dot.fields) {
                this.fields[field_id].registerDot(d);
            }
        }
    }

    fieldClicked(f: Field): void {
        for (const f_id in this.fields) {
            const field = this.fields[f_id];
            field.deactivate();
        }
        f.activate();
        this.activeField = f;
    }

    fieldReset(f: Field): void {
        f.deactivate();
        this.makeChange(f, null);
    }

    dotClicked(d: Dot): void {
        if (!this.activeField) return;
        this.makeChange(this.activeField, d);
        this.activeField.deactivate();
        this.activeField = null;
    }

    makeChange(f: Field, d: Dot | null): void {
        this.network.send({ command: "game_change", payload: { field: f.id, dot: d != null ? d.id : d } })
    }

    applyChange(data: any): void {
        if (data.dot !== null) {
            this.fields[data.field].registerDot(this.dots[data.dot]);
        } else {
            this.fields[data.field].removeDot();
        }
    }

    newGame(): void {
        const g = new GameDialog((x: number, y: number) => {
            this.network.send({ command: "new_game", payload: { height: y, width: x } })
        });
        document.querySelector(".menu-bar")?.appendChild(g.container);
    }

    private interconnectFields(x_size: number, y_size: number) {
        for (let x = 0; x < x_size; x++) {
            for (let y = 0; y < y_size; y++) {
                const field = this.fields_by_pos[x][y];
                const up = y === 0 ? null : this.fields_by_pos[x][y - 1];
                const down = y === y_size - 1 ? null : this.fields_by_pos[x][y + 1];
                const right = x === x_size - 1 ? null : this.fields_by_pos[x + 1][y];
                const left = x === 0 ? null : this.fields_by_pos[x - 1][y];
                field.setSurrounding(up, right, down, left);
            }
        }
    }

    registerEventHandler(): void {
        document.querySelector("#new")?.addEventListener("click", this.newGame.bind(this));
        //document.querySelector("#close").addEventListener("click", this.TODO.bind(this));
    }
}
