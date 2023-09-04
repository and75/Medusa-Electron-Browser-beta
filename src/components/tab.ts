
import { globeSvg, xmarkSvg } from "./img";
import { TabElement, HistoryElement, TabsGroupElement} from './../model';
import { on, emit } from './../core'

export class Tab extends EventTarget {

    id: string
    time:number
    isReady: boolean;
    isActive: boolean
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

        this.id = options.id;
        this.time = options.time;
        this.isReady = options.isReady;
        this.isLoaded = options.isLoaded;
        this.isActive = options.isActive;
        this.title = options.current.title;
        this.url = options.current.url;
        this.current = options.current;
        this.history = options.history;

        this.initTab();

    }

    emit(type: string, ...args: any[]) {
        return emit(this, type, args);
    }

    on(type: string, fn: (...detail: any[]) => void) {
        return on(this, type, fn);
    }

    once(type: string, fn: (detail: string) => void) {
        return on(this, type, fn, { once: true });
    }

    private initTab() {

        const liElement = document.createElement('li');
        liElement.setAttribute("id", this.id);
        liElement.setAttribute("tabindex", this.id);
        this.element = liElement;
        
        if (this.isActive) {
            this.element.setAttribute("class", "item active");
        } else {
            this.element.setAttribute("class", "item");
        }

        this.element.onclick = (event) => {
            this.handleTabClick(event.composedPath());
        };

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
        window.electron.ipcRenderer.removeListener('ipc-toogle-tab-active', this.listeners);
        tabsList.removeChild(this.element);
    }

    toogleActive(arg: any) {
        if (this.id != arg.id) {
            this.isActive = false;
            this.element.setAttribute("class", "item");
        } else {
            this.isActive = true;
            this.element.setAttribute("class", "item active");
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
        if (this.isActive === false) {
            //this.emit('toogle-active-tab', this.getTabStatus())
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', this.getTabStatus());
        }
    }

    private handleCloseTab() {
        //console.log('handlecloseTab');
        window.electron.ipcRenderer.sendMessage('ipc-close-tab', this.getTabStatus());
    }

    getTab(){
        let tab = {
            id: this.id,
            time:this.time,
            isReady: this.isReady,
            isActive: this.isActive,
            isLoaded: this.isLoaded,
            current: this.current,
            history: this.history,
        }
        return tab;
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

    setTabStatus(tab:Tab) {

    }
}