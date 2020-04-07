import { NetManager } from "./Websocket.js";
import { Galaxy } from "./Galaxy.js";

export class Dot{
    public html:HTMLDivElement;

    constructor(public id:number, private x:number, private y:number, private net:NetManager, private parent:Galaxy){
        this.generateHTML();
    }

    generateHTML(){
        this.html = document.createElement("div");
        this.html.classList.add("game-dot");
        this.html.style.gridColumn = `${Math.floor((this.x+2)/2)} / ${Math.ceil((this.x+2)/2)+1}`;
        this.html.style.gridRow = `${Math.floor((this.y+2)/2)} / ${Math.ceil((this.y+2)/2)+1}`;

        let dot = document.createElement("div");
        dot.classList.add("dot");
        this.html.appendChild(dot);
        
        
        dot.style.backgroundColor = this.getColor();
        dot.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(){
        this.parent.dotClicked(this);
    }

    getColor(saturation = 65){
        let hue = this.id*0.618033988749895
        hue %= 1;
        let lightness = 40 + (this.id%3)*20;
        return `hsl(${hue*360}, ${saturation}%, ${lightness}%)`;
    }
}