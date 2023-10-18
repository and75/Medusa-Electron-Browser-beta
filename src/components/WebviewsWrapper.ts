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
import { LoggerFactory, LoggerFactoryType } from "./../logger";

export class WebviewsWrapper extends HTMLElement {

    currentTabElement: TabElement
    loader: HTMLDivElement
    wvContainer: HTMLDivElement
    panelContainer: HTMLDivElement
    navMenu: NavMenuElement
    addressBar: AddressBarElement
    panelMenu: PanelMenuElement
    webviews: WebviewTag[] 
    private eventsManager: any[]
    private activeWebView: WebviewTag
    private sidePanel: HTMLElement | null
    private logger: LoggerFactoryType;

    constructor() {

        super();
        this.logger = LoggerFactory(this.constructor.name);
        this.webviews = [];
        this.sidePanel = null;
        this.eventsManager = [];

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
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
                gap:var(--default-spacing);
                align-items: center;
                padding: 0 var(--default-spacing);
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
                background:var(--primary);
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
        const findWebView: WebviewTag | undefined = this._existWebView('webview-tab-' + id)
        this.logger.logAction('_deleteWebView', findWebView)
        if (findWebView) {
            findWebView.stop();
            this._removeAllHandler(findWebView);
            this.shadowRoot.removeChild(findWebView);
            const findIndex = this.webviews.findIndex(el => el.id == findWebView.id);
            this.webviews.splice(findIndex, 1);
        }
        return findWebView;
    }

    _createWebWiew(tab: TabStatus) {
        const wv = document.createElement("webview");
        wv.setAttribute('src', tab.current.url);
        wv.setAttribute('id', 'webview-tab-' + tab.id);
        wv.setAttribute('tab-id', tab.id);
        //wv.setAttribute('preload', 'file://' + window.electron.webviewpreloadPath);
        this.webviews.push(wv);
        this.shadowRoot.append(wv);
        return wv;
    }

    _resetActive() {
        return this.webviews.map((el) => {
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
            },
            {
                name: 'content-bounds-updated',
                fn: this._contentBoundsUpdated.bind(this)
            }
        ];

        handlers.forEach((handler) => {
            el.addEventListener(handler.name, handler.fn);
            this.eventsManager.push(
                { el, name: handler.name, action: handler.fn }
            )
        })

    }

    _contentBoundsUpdated(e: Event) {
        e.preventDefault();
    }

    _renderProcessGone(e: Event) {
        console.error(e)
    }

    _removeAllHandler(el: WebviewTag | HTMLElement) {
        this.eventsManager.forEach((item) => {
            if (item.el == el) {
                item.el.PointerEvent
                item.el.removeEventListener(item.name, item.action);
            }
        })
    }

    _domReady(e: any) {
        const target = e.target as HTMLElement;
        this.logger.logAction('_domReady', "isActive " + target.hasAttribute('active'))
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
        const target = e.target as HTMLElement;
        const tabID = target.getAttribute('tab-id');
        const args = { tabID };
        this.navMenu._setStatus();
        this.logger.logAction('_loadingStart', args)
        window.electron.ipcRenderer.sendMessage('ipc-page-loading-start', args)
    }

    _loadingStop(e: any) {
        const target = e.target as HTMLElement;
        const tabID = target.getAttribute('tab-id');
        const args = { tabID };
        this.navMenu._setStatus();
        this.logger.logAction('_loadingStop', args)
        window.electron.ipcRenderer.sendMessage('ipc-page-loading-stop', args)
    }

    _updateTabTitle(e: any) {
        const target = e.target as HTMLElement;
        const title = e.title as any
        const tabID = target.getAttribute('tab-id');
        const args = { title, tabID };
        this.logger.logAction('_updateTabTitle', args)
        window.electron.ipcRenderer.sendMessage('ipc-update-tab-title', args)
    }

    _updateTabFavIcon(e: any) {
        const target = e.target as HTMLElement;
        const favicons = e.favicons as any
        const tabID = target.getAttribute('tab-id');
        const args = { favicons, tabID };
        //this.logger.logAction('_updateTabFavIcon', args)
        window.electron.ipcRenderer.sendMessage('ipc-page-favicon-updated', args)
    }

    _openSidePanel(args: any) {
        if (this.sidePanel) this.sidePanel.remove();
        const sidePanel = new Panel();
        sidePanel._createPanel(args.type);
        this.sidePanel = sidePanel
        this.logger.logAction('_openSidePanel', args)
        return this.panelContainer.appendChild(this.sidePanel);
    }

    connectedCallback() {
        this.logger.log('Is connected!')
        window.electron.ipcRenderer.on('ipc-set-active-tab', (args: TabStatus) => {
            this.logger.logIpc('ipc-set-active-tab', args)
            this._initWebview(args);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (args: any) => {
            this.logger.logIpc('ipc-close-tab', args)
            this._deleteWebView(args.id)
        });
        window.electron.ipcRenderer.on('ipc-open-sidepanel', (args: any) => {
            this.logger.logIpc('ipc-open-sidepanel', args)
            this._openSidePanel(args)
        })
    }

}
customElements.define("webviews-wrapper", WebviewsWrapper);