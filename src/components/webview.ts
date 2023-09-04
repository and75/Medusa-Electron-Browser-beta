import { WebviewTag } from "electron";
import { Tab, WebView } from '../model';

export class WebViewElement extends HTMLElement {

    id: string;
    tabId : string;
    time:number;
    isReady: boolean;
    isActive: boolean;
    isLoaded: boolean;
    cache: string | null ;
    element: WebviewTag | null;


    constructor(options: Tab) {

        super();

        this.id = "webview-tab-"+options.id;
        this.tabId = options.id;
        this.time = options.time;
        this.isReady = options.isReady;
        this.isActive = options.isActive;
        this.isLoaded = options.isLoaded;

        this.initWebview();
    }

    private initWebview() {

    }

    private toogleActive(arg: any) {

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
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', this.getTabStatus());
        }
    }

    private handleCloseTab() {
        //console.log('handlecloseTab');
        window.electron.ipcRenderer.sendMessage('ipc-close-tab', this.getTabStatus());
    }

    getTab(){
        
    }

    getTabStatus() {
        
    }

    getTabElement() {
        return this.element
    }

    setTabStatus(tab:Tab) {

    }
}