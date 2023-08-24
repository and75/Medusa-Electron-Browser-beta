
export class AppWebView extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        
        // Create (nested) span elements
        const wrapper = document.createElement("webview");
        
        // attach the created elements to the shadow DOM
        this.shadowRoot.append(wrapper);

    }
}
customElements.define("app-webview", AppWebView);