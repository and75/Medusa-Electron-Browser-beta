
import { globeSvg, xmarkSvg } from "./Img";
import { TabElement, HistoryElement} from '../model';
import { on, emit } from '../core'

export class Tab extends EventTarget {

    id: number
    groupId:number
    time:number
    isActive : boolean;
    isClosed: boolean
    current: HistoryElement
    element: HTMLElement;

    favIcon: HTMLImageElement;
    closeIcon: HTMLImageElement;
    title: string;
    url: string;
    tabTitle: HTMLSpanElement;
    listeners:EventListener[];

    constructor(options: TabElement) {

        super();

        this.id = options.id;
        this.time = options.time;
        this.isActive = options.isActive;
        this.isClosed = options.isClosed;
        this.title = options.current.title;
        this.url = options.current.url;
        this.current = options.current;
        this.groupId = options.groupId;
        this.listeners = [];
        this._initTab();
        
        if(this.isActive){
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this._getTabStatus());
        }

    }


    private _initTab() {

        //Tab item
        const itemElement = document.createElement('div');
        itemElement.setAttribute("id", this.id.toString());
        itemElement.setAttribute("class", "item");
        if(this.isActive){
            itemElement.classList.add('active')
        }
       
        //FavIcon
        const favIcon = document.createElement('img');
        favIcon.setAttribute("class", "favicon default");
        favIcon.setAttribute('src', globeSvg);
        itemElement.appendChild(favIcon);
        this.favIcon = favIcon;

        //Title
        const title = document.createElement('span');
        title.setAttribute("class", "title");
        title.innerText = this.title
        itemElement.appendChild(title);
        this.tabTitle = title;

        //CloseIcon
        const closeIcon = document.createElement('img');
        closeIcon.setAttribute("class", "close-tab");
        closeIcon.setAttribute('src', xmarkSvg);
        itemElement.appendChild(closeIcon);
        this.closeIcon = closeIcon

        this.element = itemElement;
        this.element.addEventListener('click', this._handleTabClick.bind(this) as EventListener, {capture:true})
    }

    _closeTab(){
        this.element.removeEventListener('click', this._handleTabClick.bind(this))
        const parent = this.element.parentElement;
        parent.removeChild(this.element);
    }

    _toogleActive(arg:TabElement) {
        if (this.id != arg.id) {
            this.isActive = false;
            this.element.classList.remove("active");
        } else {
            this.isActive = true;
            this.element.classList.add("active");
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this._getTabStatus());
        }
    }

    private _handleTabClick(event: any) {
        event = event.composedPath()
        let target = event[0];
        console.log(target);
        if (target.classList.contains('close-tab')) {
            this._handleCloseTab();
        }
        else {
            this._handleActiveTab();
        }
    }

    private _handleActiveTab() {
        if (this.isActive === false){
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', this._getTabStatus());
        }
    }

    private _handleCloseTab() {
        window.electron.ipcRenderer.sendMessage('ipc-close-tab', this._getTabStatus());
    }

    _getTabStatus() {
        let status = {
            id: this.id,
            time:this.time,
            isActive: this.isActive,
            isClosed: this.isClosed,
            current: this.current,
        }
        return status;
    }

    _getTabElement() {
        return this.element
    }
}