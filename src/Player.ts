export class Player {
    public html: HTMLDivElement;

    constructor(private id: number, private name: string) {
        this.html = this.buildHTML();
    }

    private buildHTML(): HTMLDivElement {
        let html = document.createElement("div");
        html.innerText = this.name;

        return html;
    }
}
