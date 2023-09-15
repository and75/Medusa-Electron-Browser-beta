/**
 * Medusa browser beta
 * @component AppWebView
 * @description This component manage the wrapper and the electron webview tag
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { WebviewTag } from "electron";
import { TabElement, TabsGroupElement } from "../model";

export class WebviewsWrapper extends HTMLElement {

    currentTabElement: TabElement
    loader: HTMLDivElement
    wvContainer:HTMLDivElement
    webviews: WebviewTag[]


    constructor() {

        // Always call super first in constructor
        super();

        this.webviews = [];

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        //Create action bar
        const actionBar = document.createElement('div');
        actionBar.setAttribute('class', 'action-bar-container');
        actionBar.appendChild(document.createElement('webview-action-bar'));

        const loaderContainer = document.createElement('div');
        loaderContainer.setAttribute('class', 'loader-container');

        const wvContainer = document.createElement('div');
        wvContainer.setAttribute('class', 'wv-container');
        this.wvContainer = wvContainer;

        //Create loader element
        const loader = document.createElement('div');
        loader.setAttribute('class', 'loader');
        const loader_element = document.createElement('div');
        loader_element.setAttribute('class', 'loader__element');
        loader.appendChild(loader_element);
        this.loader = loader;
        loaderContainer.appendChild(loader)


        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
            :host{
                display: grid;
                grid-template-columns: 100%;
                grid-template-rows: 70px 5px calc(100vh - 115px);
                grid-template-areas:
                    "action-container"
                    "loader-container"
                    "wv-container";
                align-content: stretch; 
            } 

            .action-bar-container{
                grid-area: action-container;
                justify-self: stretch;  
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
        `;
        this.shadowRoot.append(style, actionBar, loaderContainer);
    }

    _addWebView(tab: TabElement) {
        this._initWebview(tab);
    }

    _existWebView(id: string) {
        return (this.webviews.length > 0) ? this.webviews.find(el => el.id == id) : null;
    }

    _reset() {
        return this.webviews.map((el) => {
            el.setAttribute('active', 'false');
        })
    }

    _deleteWebView(id: string) {
        let find = this._existWebView(id);
        if(find){
            this.shadowRoot.removeChild(find);
            let findIndex = this.webviews.findIndex(el => el.id == find.id);
            this.webviews.splice(findIndex, 1);
        }
    }

    _initWebview(tab: TabElement) {

        this._reset();

        const existWebView: WebviewTag | undefined = this._existWebView('webview-tab-' + tab.id);

        if (!existWebView) {

            const wv = document.createElement("webview");

            wv.setAttribute('active', 'true');
            wv.setAttribute('src', tab.current.url);
            wv.setAttribute('id', 'webview-tab-' + tab.id);
            wv.setAttribute('tab-id', tab.id.toString());
            wv.setAttribute('preload', 'file://' + window.electron.webviewpreloadPath);

            this.shadowRoot.append(wv);

            wv.addEventListener('dom-ready', (e) => {
                //console.log('dom-ready', e);
            })
            wv.addEventListener('did-start-loading', (e) => {
                //console.log('did-start-loading', e);
                this.loader.setAttribute('class', 'loader active')
            })
            wv.addEventListener('did-stop-loading', (e) => {
                //console.log('did-stop-loading', e);
                //console.log(wv.getURL());
                this.loader.setAttribute('class', 'loader')
            })
            wv.addEventListener('page-title-updated', (e) => {
                //console.log('page-title-updated', e)
            })
            wv.addEventListener('page-favicon-updated', (e) => {
                //console.log('page-favicon-updated', e)
            })
            wv.addEventListener('console-message', (e) => {
                //console.log('Guest page logged a message:', e.message)
            })

            this.webviews.push(wv);

        } else {
            existWebView.setAttribute('active', 'true');
        }

    }

    connectedCallback() {
        console.log('Webview is connected!')
        window.electron.ipcRenderer.on('ipc-set-active-tab', (arg: TabElement) => {
            console.log('Webview ipc-set-active-tab', Date.now(), arg);
            this._initWebview(arg);
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (arg: any) => {
            console.log('Webview ipc-set-new-tab', Date.now(), arg);
            this._addWebView(arg);
        })
        window.electron.ipcRenderer.on('ipc-close-tab', (arg: any) => {
            console.log('Webview ipc-close-tab', Date.now(), arg);
            this._deleteWebView(arg.id)
        });
    }

}
customElements.define("app-webview", WebviewsWrapper);