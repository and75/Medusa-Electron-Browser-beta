import { plusSvg, saveSvg, folderMinusSvg } from "./Img";
import { LoggerFactory, LoggerFactoryType } from "./../logger";

export class ContextMenu extends HTMLElement {

    menu: HTMLElement
    logger:LoggerFactoryType

    set visible(value: boolean) {
        if (value) { this.setAttribute('visible', '') }
        else { this.removeAttribute('visible') }
    }
    constructor() {
        super();

        // Set logger
        this.logger = LoggerFactory(this.constructor.name);

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
            padding: 5px var(--default-spacing) 5px;
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
            padding-top: var(--default-spacing);
        }
        
        :host .item:last-child{
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
            padding-bottom: var(--default-spacing);
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
            case 'tabbar-group': {
                const menu = document.createElement('div');
                menu.setAttribute('class', 'list');
                const add = this._createMenuItem('Add new tab on group',plusSvg )
                const save = this._createMenuItem('Save group',saveSvg)
                const deleteG = this._createMenuItem('Delete group',folderMinusSvg)
                menu.append(add, save, deleteG);
                menu.oncontextmenu = () => { this.visible = null }
                this.shadowRoot.append(menu);
                break;
            }
            default:{
                this.logger.logError('_setMenuByType', `ContextMenu Sorry _setMenuByType : we are out of ${arg.type}.`)
            }
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
        this.logger.log('Is connected!')
        // calling IPC exposed from preload script
        window.electron.ipcRenderer.on('ipc-open-contextmenu', (args:any) => {
            this.logger.logIpc('ipc-open-contextmenu', args)
            this._setMenuByType(args);
            this._setPosition(args);
            this.visible = true;
        });
    }
}
customElements.define("context-menu", ContextMenu);