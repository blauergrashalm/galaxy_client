export class Player {
    public html: HTMLDivElement;

    constructor(private id: number, private name: string) { }

    buildHTML() {
        this.html = document.createElement("div");
        this.html.innerText = this.name;
    }
}
