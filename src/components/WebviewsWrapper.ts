/**
 * Medusa browser beta
 * @component AppWebView
 * @description This component manage the wrapper and the electron webview tag
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { WebviewTag } from "electron";
import { NavMenuElement, AddressBarElement, PanelMenuElement, TabElement, TabStatus } from "../model";
import { NavMenu } from "./NavMenu";
import { AddressBar } from "./AddressBar";
import { PanelMenu } from "./PanelMenu";
import { Panel } from "./Panel";

export class WebviewsWrapper extends HTMLElement {

    currentTabElement: TabElement
    loader: HTMLDivElement
    wvContainer: HTMLDivElement
    panelContainer:HTMLDivElement
    navMenu: NavMenuElement
    addressBar: AddressBarElement
    panelMenu: PanelMenuElement
    webviews: WebviewTag[]
    eventsManager: any[]
    activeWebView: WebviewTag
    sidePanel:HTMLElement | null

    constructor() {

        // Always call super first in constructor
        super();

        this.webviews = [];
        this.sidePanel = null;
        this.eventsManager = [];

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
            :host{
                display: grid;
                grid-template-columns: 1fr auto;
                grid-template-rows: 70px 5px calc(100vh - 115px);
                grid-template-areas:
                    "action-container action-container"
                    "loader-container loader-container"
                    "wv-container panel-container";
                align-content: stretch; 
            }
            .action-bar-container{
                grid-area: action-container;
                justify-self: stretch;
                display: flex;
                gap:10px;
                align-items: center;
                padding: 0 10px;
            }
            .loader-container{
                grid-area: loader-container;
                justify-self: stretch; 
            }
            .wv-container{
                grid-area: wv-container;
                justify-self: stretch;  
                border-top: 1px solid #ccc;
                background:red;
            }
            .loader {
              overflow: hidden;
              width: 100%;
              height: 5px;
              top: 0;
              left: 0;
              display: flex;
              align-items: center;
              align-content: center;
              justify-content: flex-start;
              z-index: 100000;
              transition: all 1s;
            }
            .loader .loader__element,
            .loader.active .loader__element{
                height: 5px;
                width: 100%;
                background:#7E57C2;
             }
             .loader .loader__element:before,
             .loader.active .loader__element:before {
               content: '';
               display: block;
               background-color: #ffc100;
               height: 5px;
             }
            .loader .loader__element:before {
               width: 100%;
               animation: fadeOut 1s linear both;
            }
              
            .loader.active .loader__element:before {
              width: 0;
              animation: getWidth 6s ease-in infinite;
              transition:all 2s;
            }

            @keyframes getWidth {
                0% {width: 0; opacity:1}
                100% { width: 100%; opacity:1}
            }
            @keyframes fadeOut {
                100% { opacity: 0; }
            }
    
            webview{
                grid-area: wv-container;
                justify-self: stretch;
                display:inline-flex; 
                visibility: hidden;
                line-height: 0;
                margin: 0;
                padding: 0;
            }
            webview[active=true]{
                visibility:visible;
            }

            .panel-container {
                grid-area: panel-container;
                background: #f1f1f1;
            }

        `;

        //Create action bar
        const actionBar = document.createElement('div');
        actionBar.setAttribute('class', 'action-bar-container');

        //Create navigation menu 
        this.navMenu = new NavMenu()
        actionBar.appendChild(this.navMenu);

        //Create address bar
        this.addressBar = new AddressBar();
        actionBar.appendChild(this.addressBar);

        //Create panel menu
        this.panelMenu = new PanelMenu();
        actionBar.appendChild(this.panelMenu);

        //Create loader element
        const loaderContainer = document.createElement('div');
        loaderContainer.setAttribute('class', 'loader-container');
        const loader = document.createElement('div');
        loader.setAttribute('class', 'loader');
        const loader_element = document.createElement('div');
        loader_element.setAttribute('class', 'loader__element');
        loader.appendChild(loader_element);
        this.loader = loader;
        loaderContainer.appendChild(loader)

        //Create Webviews container
        const wvContainer = document.createElement('div');
        wvContainer.setAttribute('class', 'wv-container');
        this.wvContainer = wvContainer;

        //Create Panel container
        const panelContainer = document.createElement('div');
        panelContainer.setAttribute('class', 'panel-container');
        this.panelContainer = panelContainer;
       
        this.shadowRoot.append(style, actionBar, loaderContainer, panelContainer);
    }

    _existWebView(id: string) {
        return (this.webviews.length > 0) ? this.webviews.find(el => el.id == id) : null;
    }

    _addWebView(tab: TabStatus) {
        this._initWebview(tab);
    }

    _deleteWebView(id: string): WebviewTag {
        let find = this._existWebView(id);
        if (find) {
            find.stop();
            this._removeAllHandler(find);
            this.shadowRoot.removeChild(find);

            let findIndex = this.webviews.findIndex(el => el.id == find.id);
            this.webviews.splice(findIndex, 1);
        }
        return find;
    }

    _createWebWiew(tab: TabStatus) {
        const wv = document.createElement("webview");
        wv.setAttribute('src', tab.current.url);
        wv.setAttribute('id', 'webview-tab-' + tab.id);
        wv.setAttribute('tab-id', tab.id);
        wv.setAttribute('preload', 'file://' + window.electron.webviewpreloadPath);
        this.webviews.push(wv);
        this.shadowRoot.append(wv);
        return wv;
    }

    _resetActive() {
        return this.webviews.map((el) => {
            //this._removeAllHandler(el);
            el.setAttribute('active', 'false');
        })
    }

    _setActiveWebView(webview: WebviewTag) {
        this._resetActive();
        this.navMenu._reset();
        this._registerHandler(webview);
        webview.setAttribute('active', 'true');
        if (webview.hasAttribute('ready')) {
            this.navMenu._initNav(webview);
            this.navMenu._setStatus();
            this.addressBar._setWebView(webview)
            this.panelMenu._setWebView(webview)
        }
    }

    _initWebview(tab: TabStatus) {
        const findWebView: WebviewTag | undefined = this._existWebView('webview-tab-' + tab.id)
        const webView = (findWebView) ? findWebView : this._createWebWiew(tab);
        return this._setActiveWebView(webView);
    }

    _registerHandler(el: HTMLElement | WebviewTag) {
        const handlers = [
            {
                name: 'dom-ready',
                fn: this._domReady.bind(this)
            },
            {
                name: 'did-start-loading',
                fn: this._loadingStart.bind(this)
            },
            {
                name: 'did-stop-loading',
                fn: this._loadingStop.bind(this)
            },
            {
                name: 'page-title-updated',
                fn: this._updateTabTitle.bind(this)
            },
            {
                name: 'page-favicon-updated',
                fn: this._updateTabFavIcon.bind(this)
            },
            {
                name: 'render-process-gone',
                fn: this._renderProcessGone.bind(this)
            }
        ];

        handlers.forEach((handler) => {
            el.addEventListener(handler.name, handler.fn);
            this.eventsManager.push(
                { el, name: handler.name, action: handler.fn }
            )
        })

    }

    _renderProcessGone(e: Event) {
        console.error(e)
    }

    _removeAllHandler(el: WebviewTag | HTMLElement) {
        this.eventsManager.forEach((item, index) => {
            //console.log('_removeAllHandler', item)
            if (item.el == el) {
                item.el.PointerEvent
                item.el.removeEventListener(item.name, item.action);
            }
        })
    }

    _domReady(e: any) {
        let target = e.target as HTMLElement;
        console.log('_domReady', target.hasAttribute('active'))

        
        if (target.hasAttribute('active')) {
            this.navMenu._initNav(target);
            this.addressBar._setWebView(e.target);
            this.panelMenu._setWebView(e.target)
        }
        if (!target.hasAttribute('ready')) {
            target.setAttribute('ready', '');
        }
    }

    _loadingStart(e: any) {
        let target = e.target as HTMLElement;
        let tabID = target.getAttribute('tab-id');
        let arg = { tabID };
        this.navMenu._setStatus();
        window.electron.ipcRenderer.sendMessage('ipc-page-loading-start', arg)
    }

    _loadingStop(e: any) {
        let target = e.target as HTMLElement;
        let tabID = target.getAttribute('tab-id');
        let arg = { tabID };
        console.log('_loadingStop', e, arg)
        this.navMenu._setStatus();
        window.electron.ipcRenderer.sendMessage('ipc-page-loading-stop', arg)
    }

    _updateTabTitle(e: any) {
        console.log('_updateTabTitle', e)
        let target = e.target as HTMLElement;
        let title = e.title as any
        let tabID = target.getAttribute('tab-id');
        let arg = { title, tabID };
        window.electron.ipcRenderer.sendMessage('ipc-update-tab-title', arg)
    }

    _updateTabFavIcon(e: any) {
        let target = e.target as HTMLElement;
        let favicons = e.favicons as any
        let tabID = target.getAttribute('tab-id');
        let arg = { favicons, tabID };
        console.log(arg)
        window.electron.ipcRenderer.sendMessage('ipc-page-favicon-updated', arg)
    }

    _openSidePanel(arg:any){
        if(this.sidePanel) this.sidePanel.remove();
        const sidePanel = new Panel();
        sidePanel._createPanel(arg.type);
        this.sidePanel = sidePanel
        return this.panelContainer.appendChild(this.sidePanel);
    }

    connectedCallback() {
        console.log('Webview is connected!')
        window.electron.ipcRenderer.on('ipc-set-active-tab', (arg: TabStatus) => {
            console.log('Webview ipc-set-active-tab', Date.now(), arg);
            this._initWebview(arg);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (arg: any) => {
            console.log('Webview ipc-close-tab', Date.now(), arg);
            this._deleteWebView(arg.id)
        });
        window.electron.ipcRenderer.on('ipc-open-sidepanel', (arg:any)=>{
            console.log('Webview ipc-open-sidepanel', Date.now(), arg);
            this._openSidePanel(arg)
        })
    }

}
customElements.define("app-webview", WebviewsWrapper);