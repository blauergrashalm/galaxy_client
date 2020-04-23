export class GameDialog {
    public container: HTMLDivElement;
    private grid: HTMLDivElement;

    private x_size = 5;
    private y_size = 5;
    private cells: HTMLDivElement[][] = [];
    private touchhandler = this.handleTouch.bind(this);
    constructor(private callback: (x: number, y: number) => void) {
        this.buildHTML();
        window.addEventListener("touchmove", this.touchhandler, { passive: false });
    }

    buildHTML() {
        let newGameButton = document.querySelector("#new");
        this.container = document.createElement("div");
        this.container.classList.add("new-game-dialog-container");

        let closeButton = document.createElement("button");
        closeButton.classList.add("close-btn");
        closeButton.innerText = "Abbrechen";
        closeButton.addEventListener("click", this.handleClose.bind(this));

        this.container.appendChild(closeButton);

        this.grid = document.createElement("div");
        this.grid.classList.add("new-game-grid");

        this.container.appendChild(this.grid);

        let dimsButton = <DOMRect>newGameButton?.getBoundingClientRect();
        this.container.style.top = (dimsButton?.top + dimsButton?.height + 10) + "px";

        for (let i = 0; i < this.x_size; i++) {
            this.cells.push([]);
            for (let j = 0; j < this.y_size; j++) {
                let cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }
    }

    handleTouch(evt: TouchEvent) {
        let elem = document.elementFromPoint(evt.touches[0].clientX, evt.touches[0].clientY);
        if (elem?.classList.contains("new-game-cell")) {
            let new_evt = new MouseEvent("mouseenter");
            elem.dispatchEvent(new_evt);

        }
        evt.stopPropagation();
        evt.preventDefault();
    }

    handleClose() {
        this.container.remove();
        window.removeEventListener("touchmove", this.touchhandler);
    }

    handleMouseOver(evt: MouseEvent | TouchEvent) {
        let target = <HTMLDivElement>evt.target;
        if (target.dataset.x == null || target.dataset.y == null) {
            console.error("Something was wrong with target data!");
            return;
        }
        let x = parseInt(target.dataset.x);
        let y = parseInt(target.dataset.y);

        let best_x = Math.min(20, Math.max(5, x + 3));
        let best_y = Math.min(20, Math.max(5, y + 3));

        this.shrinkCells(best_x, best_y);
        this.expandCells(best_x, best_y);

        for (let i = 0; i < this.x_size; i++)
            for (let j = 0; j < this.y_size; j++) {
                if (i <= x && j <= y) this.cells[i][j].classList.add("active");
                else this.cells[i][j].classList.remove("active");
            }
    }

    handleClick(evt: MouseEvent | TouchEvent) {
        let target = <HTMLDivElement>evt.target;
        if (target.dataset.x == null || target.dataset.y == null) {
            console.error("Something was wrong with target data!");
            return;
        }
        let x = parseInt(target.dataset.x) + 1;
        let y = parseInt(target.dataset.y) + 1;
        this.callback(x, y);
        this.handleClose();
    }

    shrinkCells(new_x: number, new_y: number) {
        //delete column
        for (let i = this.x_size - 1; i >= new_x; i--) {
            for (let j = 0; j < this.y_size; j++) {
                let cell = this.cells[i][j];
                cell.onanimationend = (anim) => {
                    if (anim.animationName === "fade-out-corner-cell") {
                        cell.remove();
                    }
                }
                cell.classList.add("removed");
            }
            this.cells.splice(i);
        }
        if (this.x_size > new_x) this.x_size = new_x;
        //delete row
        for (let j = this.y_size - 1; j >= new_y; j--) {
            for (let i = 0; i < this.x_size; i++) {
                let cell = this.cells[i][j];
                cell.onanimationend = (anim) => {
                    if (anim.animationName === "fade-out-corner-cell") {
                        cell.remove();
                    }
                }
                cell.classList.add("removed");
                this.cells[i].splice(j);
            }
        }
        if (this.y_size > new_y) this.y_size = new_y;
    }

    expandCells(new_x: number, new_y: number) {
        //make column
        for (let i = this.x_size; i < new_x; i++) {
            this.cells.push([]);
            for (let j = 0; j < this.y_size; j++) {
                let cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }
        if (this.x_size < new_x) this.x_size = new_x;
        //make row
        for (let j = this.y_size; j < new_y; j++) {
            for (let i = 0; i < this.x_size; i++) {
                let cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }
        if (this.y_size < new_y) this.y_size = new_y;
    }

    generateCell(i: number, j: number) {
        let cell = document.createElement("div");
        cell.classList.add("new-game-cell");
        cell.dataset.x = i.toString();
        cell.dataset.y = j.toString();
        cell.style.gridArea = `${j + 1} / ${i + 1} / ${j + 2} / ${i + 2}`;
        cell.addEventListener("mouseenter", this.handleMouseOver.bind(this));

        cell.addEventListener("click", this.handleClick.bind(this));
        return cell;
    }
}
