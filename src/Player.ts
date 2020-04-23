export class Player {
    public html: HTMLDivElement;
    private name: string;
    private id: number;

    constructor(data: any) {

    }

    buildHTML() {
        this.html = document.createElement("div");
        this.html.innerText = this.name;
    }
}
