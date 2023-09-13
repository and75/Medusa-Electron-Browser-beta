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

    wrapper: WebviewTag;
    currentTabElement: TabElement
    webviews: WebviewTag[]
    loader:HTMLDivElement

    constructor() {
        // Always call super first in constructor
        super();

        this.webviews = [];

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        //Create loader element
        const loader = document.createElement('div');
        loader.setAttribute('class', 'loader');
        const loader_element = document.createElement('div');
        loader_element.setAttribute('class', 'loader__element');
        loader.appendChild(loader_element);
        this.loader = loader;


        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
             
            .loader {
              overflow: hidden;
              width: 100%;
              height: 8px;
              position: absolute;
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
                height: 4px;
                width: 100%;
               /* background:#A5D6A7;*/
             }
               
             .loader .loader__element:before,
             .loader.active .loader__element:before {
               content: '';
               display: block;
               background-color: #ffc100;
               height: 4px;
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
                position: absolute;
                top: 5.59px;
                width: 100%;
                height: 100%;
                visibility: hidden;
                line-height: 0;
                margin: 0;
                padding: 0;
                border-top: 1px solid #ccc;
            }
            webview[active=true]{
                visibility:visible;
            }
        `;
        this.shadowRoot.append(style, loader);
    }

    addWebView(tab:TabElement){
        this.initWebview(tab);
        this.goTo(tab);
    }

    initWebview(tab: TabElement) {

        console.log('initTabElementview TabElement : ', tab)
        const wv = document.createElement("webview");

        if (tab.isActive) {
            wv.setAttribute('active', 'true');
            wv.setAttribute('src', tab.current.url);
        } else {
            wv.setAttribute('active', 'false');
        }
       
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
    }

    goTo(arg: any) {
        console.log('WebView GoTO : ', arg)
        const wv = this.webviews.find((el)=>{
            let TabElementId = el.getAttribute('tab-id');
            console.log('webviews.find', TabElementId)
            return TabElementId ==  arg.id
        });
        this.webviews.map((el) => {
            el.setAttribute('active', 'false');
        })
        if (!wv.hasAttribute('src')) {
            wv.setAttribute('src', arg.current.url);
        }
        wv.setAttribute('active', 'true');
    }

    deleteWebView(id: string) {
        let findWebView = this.webviews.find(el => el.id == 'webview-tab-' + id);
        let findIndex = this.webviews.findIndex(el => el.id == 'webview-tab-' + id);
        this.shadowRoot.removeChild(findWebView);
        this.webviews.splice(findIndex, 1);
    }

    connectedCallback() {
        console.log('Webview is connected!')
        window.electron.ipcRenderer.on('ipc-set-active-tab', (arg: TabsGroupElement) => {
            console.log('Webview ipc-set-active-tab', Date.now(), arg);
            this.initWebview(arg);
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (arg: any) => {
           console.log('Webview ipc-set-new-tab', Date.now(), arg);
           //this.addWebView(arg);
        })
        window.electron.ipcRenderer.on('ipc-toogle-tab-active', (arg: any) => {
            console.log('Webview ipc-toogle-tab-active', Date.now(), arg);
            //this.goTo(arg);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (arg: any) => {
            // eslint-disable-next-line no-console
            //console.log('ipc-close-tab', Date.now(), arg);
            //this.deleteWebView(arg.id)
        });
    }

    attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {
        //console.log('App-webview attributeChangedCallback!', attrName, oldVal, newVal);
    }

}
customElements.define("app-webview", WebviewsWrapper);