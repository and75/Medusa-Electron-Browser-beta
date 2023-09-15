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
            padding: 5px 10px 5px;
            font-size: 12px;
            color: #000;
            cursor:pointer;
            border-radius:0
        }

        :host .item:first-child{
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
        }
        
        :host .item:last-child{
            border-bottom-right-radius: 5px;
            border-bottom-left-radius: 5px;
        }
        
        :host .item:hover {
            color:#fff;
            background:#000;
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

                const item = document.createElement('div');
                item.setAttribute('class', 'item');
                item.innerText = "Add new tab on group";

                const item2 = document.createElement('div');
                item2.setAttribute('class', 'item');
                item2.innerText = "Save group";

                menu.append(item, item2);
                menu.oncontextmenu = (e) => { this.visible = null }
                this.shadowRoot.append(menu);

                break;

            default:
                console.log(`Sorry, we are out of ${arg.type}.`);
        }
    }

    _setPosition(arg:any){
        this.setAttribute('style', `top:${arg.clientY}px; left:${arg.clientX}px`)
    }

    connectedCallback() {
        console.log('ContextMEnu is connected!')
        // calling IPC exposed from preload script
        window.electron.ipcRenderer.on('ipc-open-contextmenu', (arg:any) => {
            console.log('ContextMEnu ipc-open-contextmenu', arg)
            this._setMenuByType(arg);
            this._setPosition(arg);
            this.visible = true;
        });
    }
}
customElements.define("context-menu", ContextMenu);