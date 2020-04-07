import { Field } from "./Field.js";
import { NetManager } from "./Websocket.js";
import { Dot } from "./Dot.js";

export class Galaxy {
    private fields: { [id: number]: Field } = {};
    private fields_by_pos: Field[][];
    private x_size: number;
    private y_size: number;
    private dots: { [id: number]: Dot } = {};
    private activeField: Field = null;
    private network: NetManager
    constructor() {
        this.network = new NetManager(this);
    }

    buildGame(data: any) {
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
            elem.appendChild(f.html)
        }
        this.interconnectFields();
        for (const dot of data.state.dots) {
            let d = new Dot(dot.id, dot.x, dot.y, this.network, this);
            this.dots[d.id] = d;
            elem.appendChild(d.html);
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

    dotClicked(d: Dot) {
        if (!this.activeField) return;
        this.makeChange(this.activeField, d);
        this.activeField.deactivate();
        this.activeField = null;
    }

    makeChange(f: Field, d: Dot) {
        this.network.send({ command: "game_change", payload: { field: f.id, dot: d.id } })
    }

    applyChange(data: any) {
        this.fields[data.field].registerDot(this.dots[data.dot]);
    }

    interconnectFields() {
        for (let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                let field = this.fields_by_pos[x][y];
                let up = y === 0 ? null : this.fields_by_pos[x][y - 1];
                let down = y === this.y_size - 1 ? null : this.fields_by_pos[x][y + 1];
                let right = x === this.x_size - 1 ? null : this.fields_by_pos[x + 1][y];
                let left = x === 0 ? null : this.fields_by_pos[x - 1][y];
                field.setSurounding(up, right, down, left);
            }
        }
    }
}
