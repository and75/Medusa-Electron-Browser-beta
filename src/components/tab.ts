
import { globeSvg, xmarkSvg } from "./Img";
import { TabElement, HistoryElement} from '../model';
import { on, emit, EventManager } from '../core'

export class Tab extends EventTarget {
    eventManager:EventManager
    id: number
    groupId:number
    time:number
    isActive : boolean;
    isReady: boolean;
    isLoaded: boolean
    current: HistoryElement
    history: HistoryElement[]
    element: HTMLLIElement;

    favIcon: HTMLImageElement;
    closeIcon: HTMLImageElement;
    title: string;
    url: string;
    tabTitle: HTMLSpanElement;

    listeners: any;


    
    constructor(options: TabElement) {
        super();
        this.eventManager = new EventManager();

        this.id = options.id;
        this.time = options.time;
        this.isReady = options.isReady;
        this.isLoaded = options.isLoaded;
        this.title = options.current.title;
        this.url = options.current.url;
        this.current = options.current;
        this.groupId = options.groupId;
        this.history = options.history;
        this.isActive = options.isActive;
        this.initTab();
        
        if(this.isActive){
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this.getTabStatus());
        }

    }


    private initTab() {

        const liElement = document.createElement('li');
        liElement.setAttribute("id", this.id.toString());
        liElement.setAttribute("tabindex", this.id.toString());
        liElement.setAttribute("class", "item");
        if(this.isActive){
            liElement.classList.add('active')
        }
        this.element = liElement;
        
        this.element.onclick = (event) => {
            this.handleTabClick(event.composedPath());
        };

        this.element.addEventListener('toogle-tab-active', (e)=>{
            console.log('toogle-tab-active', e);
        })

        //FavIcon
        const favIcon = document.createElement('img');
        favIcon.setAttribute("class", "favicon default");
        favIcon.setAttribute('src', globeSvg);
        liElement.appendChild(favIcon);
        this.favIcon = favIcon;

        //Title
        const title = document.createElement('span');
        title.setAttribute("class", "title");
        title.innerText = this.title
        liElement.appendChild(title);
        this.tabTitle = title;

        //CloseIcon
        const closeIcon = document.createElement('img');
        closeIcon.setAttribute("class", "close-tab");
        closeIcon.setAttribute('src', xmarkSvg);
        liElement.appendChild(closeIcon);
        this.closeIcon = closeIcon
        
    }

    closeTab(tabsList:HTMLUListElement){
        tabsList.removeChild(this.element);
    }

    toogleActive(arg: any) {
        if (this.id != arg.id) {
            this.isActive = false;
            this.element.classList.remove("active");
        } else {
            this.isActive = true;
            this.element.classList.add("active");
            window.electron.ipcRenderer.sendMessage('ipc-set-active-tab', this.getTabStatus());
        }
    }

    private handleTabClick(event: any) {
        let target = event[0];
        if (target.classList.contains('close-tab')) {
            this.handleCloseTab();
        }
        else {
            this.handleActiveTab();
        }
    }

    private handleActiveTab() {
        if (this.isActive === false){
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', this.getTabStatus());
        }
    }

    private handleCloseTab() {
        window.electron.ipcRenderer.sendMessage('ipc-close-tab', this.getTabStatus());
    }

    getTabStatus() {
        let status = {
            id: this.id,
            time:this.time,
            isReady: this.isReady,
            isActive: this.isActive,
            isLoaded: this.isLoaded,
            current: this.current,
        }
        return status;
    }

    getTabElement() {
        return this.element
    }
}