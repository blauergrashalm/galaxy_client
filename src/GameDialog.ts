export class GameDialog {
    public container: HTMLDivElement;
    private grid: HTMLDivElement;

    private x_size = 5;
    private y_size = 5;
    private cells: HTMLDivElement[][] = [];
    constructor(private callback: (x: number, y: number) => void) {
        const result = this.buildHTML();
        this.container = result[0];
        this.grid = result[1];
    }

    private buildHTML(): [HTMLDivElement, HTMLDivElement] {
        const container = document.createElement("div");
        container.classList.add("new-game-dialog-container");

        const closeButton = document.createElement("button");
        closeButton.classList.add("close-btn");
        closeButton.innerText = "Abbrechen";
        closeButton.addEventListener("click", this.handleClose.bind(this));

        container.appendChild(closeButton);

        const grid = document.createElement("div");
        grid.classList.add("new-game-grid");

        container.appendChild(this.grid);

        for (let i = 0; i < this.x_size; i++) {
            this.cells.push([]);
            for (let j = 0; j < this.y_size; j++) {
                const cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }

        return [container, grid];
    }

    handleClose(): void {
        this.container.remove();
    }

    handleMouseOver(evt: MouseEvent): void {
        const target = <HTMLDivElement>evt.target;
        if (target.dataset.x === undefined || target.dataset.y === undefined) {
            console.error("Something was wrong with target data!");
            return;
        }
        const x = parseInt(target.dataset.x);
        const y = parseInt(target.dataset.y);

        const best_x = Math.min(20, Math.max(5, x + 3));
        const best_y = Math.min(20, Math.max(5, y + 3));

        this.shrinkCells(best_x, best_y);
        this.expandCells(best_x, best_y);

        for (let i = 0; i < this.x_size; i++)
            for (let j = 0; j < this.y_size; j++) {
                if (i <= x && j <= y) this.cells[i][j].classList.add("active");
                else this.cells[i][j].classList.remove("active");
            }
    }

    handleClick(evt: MouseEvent): void {
        const target = <HTMLDivElement>evt.target;
        if (target.dataset.x === undefined || target.dataset.y === undefined) {
            console.error("Something was wrong with target data!");
            return;
        }
        const x = parseInt(target.dataset.x) + 1;
        const y = parseInt(target.dataset.y) + 1;
        this.callback(x, y);
        this.handleClose();
    }

    shrinkCells(new_x: number, new_y: number): void {
        //delete column
        for (let i = this.x_size - 1; i >= new_x; i--) {
            for (let j = 0; j < this.y_size; j++) {
                const cell = this.cells[i][j];
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
                const cell = this.cells[i][j];
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

    expandCells(new_x: number, new_y: number): void {
        //make column
        for (let i = this.x_size; i < new_x; i++) {
            this.cells.push([]);
            for (let j = 0; j < this.y_size; j++) {
                const cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }
        if (this.x_size < new_x) this.x_size = new_x;
        //make row
        for (let j = this.y_size; j < new_y; j++) {
            for (let i = 0; i < this.x_size; i++) {
                const cell = this.generateCell(i, j);
                this.cells[i].push(cell);
                this.grid.appendChild(cell);
            }
        }
        if (this.y_size < new_y) this.y_size = new_y;
    }

    generateCell(i: number, j: number): HTMLDivElement {
        const cell = document.createElement("div");
        cell.classList.add("new-game-cell");
        cell.dataset.x = i.toString();
        cell.dataset.y = j.toString();
        cell.style.gridArea = `${j + 1} / ${i + 1} / ${j + 2} / ${i + 2}`;
        cell.addEventListener("mouseenter", this.handleMouseOver.bind(this));
        cell.addEventListener("click", this.handleClick.bind(this));
        return cell;
    }
}
