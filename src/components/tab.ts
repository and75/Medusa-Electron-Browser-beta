
import { xmarkSvg, arrowRotateRight, MedusaLogo} from "./Img";
import { TabElement, HistoryElement } from '../model';
import { on, emit } from '../core'

export class Tab extends HTMLElement {


    isClosed: boolean
    current: HistoryElement

    tabIcon: string;
    favIcon: HTMLImageElement;
    closeIcon: HTMLImageElement;
    title: string;
    url: string;
    tabTitle: HTMLSpanElement;
    listeners: EventListener[];

    get id(){
        return this.getAttribute('id')
    }

    set id (value: string){
        this.setAttribute('id', value)
    }

    get groupId(){
        return this.getAttribute('groupId')
    }

    set groupId (value: string){
        this.setAttribute('groupId', value)
    }

    get time(){
        return this.getAttribute('time')
    }

    set time (value: string){
        this.setAttribute('time', value)
    }

    get isActive(){
        return (this.hasAttribute('active')) ? true : false;
    }

    set isActive (value: boolean){
        if(value){this.setAttribute('active', '')}
        else{this.removeAttribute('active')}
    }

    get onLoading(){
        return (this.hasAttribute('onLoading')) ? true : false;
    }

    set onLoading (value: boolean){
        if(value){this.setAttribute('onLoading', '')}
        else{this.removeAttribute('onLoading')}
    }

    constructor() {

        super();

         // Create a shadow root
         this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

         // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
             :host{
                flex: 1;
                display:flex;
                align-items:center;
                gap:10px;
                background:#dbdbdb;
                padding: 7px 10px 9px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-right: 1px solid #777;
                cursor: pointer;
                margin-top: 1px;
                max-width: 180px;
                transition: all 0.2s ease-out;
            }
            :host([active]),
            :host(:hover){
                background: #ffffff;
            }

            img.favicon{
                width:14px;
            }
            img.favicon.default{
                opacity: 0.5;
            }
            :host([onLoading]) img.favicon{
                display:none;
            }
            :host img.favicon.loading{
                display:none;
            }
            :host img.favicon.loading{
                display: block;
                animation: rotate 1.5s linear infinite;
            }
            @keyframes rotate{
                100% {
                  transform: rotate(360deg);
                }
              }

            :host img.close-tab{
                width:12px;
                opacity: 0.5;
            }
            :host img.close-tab:hover{
                opacity:1;
            }
            :host span.title{
                flex: auto;
                text-align: start;
                max-width: 77px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
        this.shadowRoot.append(style)
    }


    initTab(options:any) {

        this.id = options.id;
        this.time = options.time;
        this.title = options.current.title;
        this.groupId = options.groupId;
        this.isActive = options.isActive;
        this.onLoading = options.onLoading;
        this.url = options.current.url;
        this.current = options.current;

        this.tabIcon = MedusaLogo;
        this.listeners = [];
       

        //Tab item
        if (this.isActive) {
            this.classList.add('active')
        }

        //FavIcon
        const favIcon = document.createElement('img');
        favIcon.setAttribute("class", "favicon default");
        favIcon.setAttribute('src', this.tabIcon);
        this.shadowRoot.appendChild(favIcon);
        this.favIcon = favIcon;

        //Title
        const title = document.createElement('span');
        title.setAttribute("class", "title");
        title.innerText = this.title
        this.shadowRoot.appendChild(title);
        this.tabTitle = title;

        //CloseIcon
        const closeIcon = document.createElement('img');
        closeIcon.setAttribute("class", "close-tab");
        closeIcon.setAttribute('src', xmarkSvg);
        this.shadowRoot.appendChild(closeIcon);
        this.closeIcon = closeIcon

        this.addEventListener('click', this._handleTabClick.bind(this) as EventListener, { capture: true })

        if (this.isActive) {
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this._getTabStatus());
        }

    }

    _closeTab() {
        this.removeEventListener('click', this._handleTabClick.bind(this))
        const parent = this.parentElement;
        parent.removeChild(this);
    }

    _toogleActive(arg: TabElement) {
        if (this.id != arg.id) {
            this.isActive = false;
            this.classList.remove("active");
        } else {
            this.isActive = true;
            this.classList.add("active");
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this._getTabStatus());
        }
    }

    private _handleTabClick(event: any) {
        console.log('_handleTabClick',event )
        event = event.composedPath()
        let target = event[0];
        if (target.classList.contains('close-tab')) {
            this._handleCloseTab();
        }
        else {
            this._handleActiveTab();
        }
    }

    private _handleActiveTab() {
        console.log('_handleActiveTab', this._getTabStatus())
        if (this.isActive === false) {
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', this._getTabStatus());
        }
    }

    private _handleCloseTab() {
        window.electron.ipcRenderer.sendMessage('ipc-close-tab', this._getTabStatus());
    }

    _setFavIcon(src: string) {
        if (this.tabIcon !== src) {
            this.tabIcon = src;
            this.favIcon.src = src;
            this.favIcon.classList.remove('default')
        }
    }

    _setTabTitle(title: string) {
        this.tabTitle.innerText = title;
    }

    _toogleLoadingIcon() {
        if (this.favIcon.classList.contains('loading')) {
            this.favIcon.classList.remove('loading');
            this.favIcon.src = this.tabIcon;
        } else {
            this.favIcon.src = arrowRotateRight;
            this.favIcon.classList.add('loading')
        }
    }

    setTabStatus(tab:TabElement){
        for (const [key, value] of Object.entries(tab)) {
            console.log(`${key}: ${value}`);
        }
    }

    _getTabStatus() {
        let status = {
            id: this.id,
            groupId: this.groupId,
            isActive: this.isActive,
            onLoading : this.onLoading, 
            current:this.current
        }
        return status;
    }
}
customElements.define("tab-schedule", Tab);