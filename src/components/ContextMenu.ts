import { plusSvg, saveSvg, xmarkSvg,folderMinusSvg } from "./Img";

export class ContextMenu extends HTMLElement {

    menu: HTMLElement

    set visible(value: boolean) {
        if (value) { this.setAttribute('visible', '') }
        else { this.removeAttribute('visible') }
    }
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        style.textContent = `
        :host{
            display:none;
            position: fixed;
            z-index: 10000;
            width: auto;
            background: #fff;
            border-radius: 5px;
            box-shadow: 2px 3px 6px #898989;
        }

        :host['visible']{
            display:block;
        }
        :host .list {
            border-radius:inherit
        }
        :host .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap:8px;
            width: 160px;
            padding: 5px 10px 5px;
            font-size: 12px;
            color: #000;
            cursor:pointer;
            border-radius:0
        }
        :host .item img{
            width: 10px;
            opacity: 0.6;
        }
        :host .item:first-child{
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            padding-top: 10px;
        }
        
        :host .item:last-child{
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            padding-bottom: 10px;
        }
        :host .item:hover {
            background:#dedede;
            color:000;
        }
        :host .item:hover img{
            opacity: 1;
        }

        `;

        this.shadowRoot.append(style);
    }

    _setMenuByType(arg: any) {
        
        if(this.shadowRoot.querySelector('.list')){
            this.shadowRoot.removeChild(this.shadowRoot.querySelector('.list'));
        }
        
        switch (arg.type) {
            case 'tabbar-group':
                const menu = document.createElement('div');
                menu.setAttribute('class', 'list');
                let add = this._createMenuItem('Add new tab on group',plusSvg )
                let save = this._createMenuItem('Save group',saveSvg)
                let deleteG = this._createMenuItem('Delete group',folderMinusSvg)
                menu.append(add, save, deleteG);
                menu.oncontextmenu = (e) => { this.visible = null }
                this.shadowRoot.append(menu);
                break;

            default:
                console.log(`Sorry, we are out of ${arg.type}.`);
        }
    }

    _createMenuItem(text:string, icon:string){
        const item = document.createElement('div');
        item.setAttribute('class', 'item');
        const itemIcon = item.appendChild(document.createElement('img'));
        itemIcon.setAttribute('src', icon)
        const itemSpanText = item.appendChild(document.createElement('span'));
        itemSpanText.innerText =  text;
        return item;
    }

    _setPosition(arg:any){
        this.setAttribute('style', `top:${arg.clientY}px; left:${arg.clientX}px`)
    }

    connectedCallback() {
        console.log('ContextMEnu is connected!')
        // calling IPC exposed from preload script
        window.electron.ipcRenderer.on('ipc-open-contextmenu', (arg:any) => {
            //console.log('ContextMEnu ipc-open-contextmenu', arg)
            this._setMenuByType(arg);
            this._setPosition(arg);
            this.visible = true;
        });
    }
}
customElements.define("context-menu", ContextMenu);