
// import { xmarkSvg, arrowRotateRight, MedusaLogo } from "./Img";
// import { TabElement, HistoryElement } from '../model';
import { LoggerFactory,LoggerFactoryType } from "./../logger";

export class MedButton extends HTMLElement {

    private logger:LoggerFactoryType;
    img:HTMLImageElement;

    get title() {
        return this.getAttribute('title');
    }
    set title(value:string){
        if (value) { this.setAttribute('title', value) }
    }

    get src() {
        return this.getAttribute('src');
    }
    set src(value:string){
        if (value) { 
            this.setAttribute('src', value); 
            this.img.setAttribute('src', value);
        }
    }

    get type() {
        return this.getAttribute('type');
    }

    set type(value: string) {
        if (value) { 
            this.setAttribute('type', '') 
            this._setIconByType(value)
        }
    }

    constructor() {

        super();

        this.logger = LoggerFactory(this.constructor.name);

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        const img = document.createElement('img');
        this.img = img;      

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `

        `;
        this.shadowRoot.append(style, img)
    }

    _setIconByType(type:string){
        return type;
    }

    remove() {
        this.remove();
    }
    
}
customElements.define("m-button", MedButton);