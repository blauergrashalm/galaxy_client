import { Field } from "./Field.js";
import { NetManager } from "./Websocket.js";
import { Dot } from "./Dot.js";
var Galaxy = (function () {
    function Galaxy() {
        this.fields = {};
        this.dots = {};
        this.activeField = null;
        this.network = new NetManager(this);
    }
    Galaxy.prototype.buildGame = function (data) {
        this.x_size = data.state.size_x;
        this.y_size = data.state.size_y;
        this.fields_by_pos = new Array(this.x_size);
        for (var i = 0; i < this.fields_by_pos.length; i++) {
            this.fields_by_pos[i] = new Array(this.y_size);
        }
        var elem = document.querySelector(".game-grid");
        for (var _i = 0, _a = data.state.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            var f = new Field(field.id, field.x, field.y, this.network, this);
            this.fields[f.id] = f;
            this.fields_by_pos[f.x][f.y] = f;
            elem.appendChild(f.html);
        }
        this.interconnectFields();
        for (var _b = 0, _c = data.state.dots; _b < _c.length; _b++) {
            var dot = _c[_b];
            var d = new Dot(dot.id, dot.x, dot.y, this.network, this);
            this.dots[d.id] = d;
            elem.appendChild(d.html);
            if (dot.fields)
                for (var _d = 0, _e = dot.fields; _d < _e.length; _d++) {
                    var field_id = _e[_d];
                    this.fields[field_id].registerDot(d);
                }
        }
    };
    Galaxy.prototype.fieldClicked = function (f) {
        for (var f_id in this.fields) {
            if (this.fields.hasOwnProperty(f_id)) {
                var field = this.fields[f_id];
                field.deactivate();
            }
        }
        f.activate();
        this.activeField = f;
    };
    Galaxy.prototype.dotClicked = function (d) {
        if (!this.activeField)
            return;
        this.makeChange(this.activeField, d);
        this.activeField.deactivate();
        this.activeField = null;
    };
    Galaxy.prototype.makeChange = function (f, d) {
        this.network.send({ command: "game_change", payload: { field: f.id, dot: d.id } });
    };
    Galaxy.prototype.applyChange = function (data) {
        this.fields[data.field].registerDot(this.dots[data.dot]);
    };
    Galaxy.prototype.interconnectFields = function () {
        for (var x = 0; x < this.x_size; x++) {
            for (var y = 0; y < this.y_size; y++) {
                var field = this.fields_by_pos[x][y];
                var up = y === 0 ? null : this.fields_by_pos[x][y - 1];
                var down = y === this.y_size - 1 ? null : this.fields_by_pos[x][y + 1];
                var right = x === this.x_size - 1 ? null : this.fields_by_pos[x + 1][y];
                var left = x === 0 ? null : this.fields_by_pos[x - 1][y];
                field.setSurounding(up, right, down, left);
            }
        }
    };
    return Galaxy;
}());
export { Galaxy };
//# sourceMappingURL=Galaxy.js.map