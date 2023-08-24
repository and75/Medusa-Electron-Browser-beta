import { TabsBar } from "./tabs-bar";
import { NavBar } from "./nav-bar";
import { AppWebView } from "./webview";

export class AppRoot extends HTMLElement {

    constructor() {
        
        super();

        console.log(window.electron);
        
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create (nested) span elements
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "app-wrapper");

        const appHeader = wrapper.appendChild(document.createElement('div'))
        appHeader.setAttribute('class', 'app-header');

        const tabs = appHeader.appendChild(new TabsBar());
        const nav = appHeader.appendChild(new NavBar());

        const appWebView = wrapper.appendChild(document.createElement('div'))
        appWebView.setAttribute('class', 'app-webview');

        const webwiew = appWebView.appendChild(new AppWebView());

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
        /** Grid Layout **/
        .app-wrapper{
          display: grid;
          grid-template-columns:  auto;
          grid-template-rows: 112px calc(100vh - 112px);
          grid-template-areas:
          "header"
          "webview";
          overflow: hidden;
        }
        .app_header{
          grid-area: header;
          justify-self: stretch;
        }
        .app-webview{
          grid-area: webview;
          justify-self: stretch;
        }
            
        `;
        this.shadowRoot.append(wrapper, style);
    }


}
customElements.define("app-root", AppRoot);