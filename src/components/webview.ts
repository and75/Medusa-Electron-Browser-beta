
export class AppWebView extends HTMLElement {

    constructor() {
        // Always call super first in constructor
        super();

        // calling IPC exposed from preload script
        window.electron.ipcRenderer.on('ipc-example', (arg) => {
            // eslint-disable-next-line no-console
            console.log('AppWebView', arg);
        });

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create (nested) span elements
        const wrapper = document.createElement("webview");

        wrapper.setAttribute('src', "https://www.google.com");
        wrapper.setAttribute('style', "display:inline-flex; width:100%; height:100%");

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(wrapper);

    }

    connectedCallback() {
        console.log('App-webview is connected!')
    }

    attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {
        console.log('App-webview attributeChangedCallback!', attrName, oldVal, newVal);
    }
    
}
customElements.define("app-webview", AppWebView);