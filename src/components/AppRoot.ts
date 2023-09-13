/**
 * Medusa browser beta
 * @component AppRoot
 * @description This component manage the application wrapper
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { TabsGroupWrapper } from "./TabsGroupWrapper";
import { ActionBarWrapper } from "./ActionBarWrapper";
import { WebviewsWrapper } from "./WebviewsWrapper";

export class AppRoot extends HTMLElement {

  constructor() {

    super();

    //console.log(window.electron);

    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

    // Create (nested) span elements
    const wrapper = document.createElement("div");
    wrapper.setAttribute("class", "app-wrapper");

    const appHeader = wrapper.appendChild(document.createElement('div'))
    appHeader.setAttribute('class', 'app-header');
    appHeader.appendChild(new TabsGroupWrapper());
    appHeader.appendChild(new ActionBarWrapper());

    const appWebView = wrapper.appendChild(document.createElement('div'))
    appWebView.setAttribute('class', 'app-webview');
    appWebView.appendChild(new WebviewsWrapper());

    // Create some CSS to apply to the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
        /** Grid Layout **/
        .app-wrapper{
          display: grid;
          grid-template-columns:  auto;
          grid-template-rows: 110px calc(100vh - 110px);
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
        app-webview{
          display:block;
          height:100%;
          position:relative;
        }
            
        `;
    this.shadowRoot.append(wrapper, style);
  }

  connectedCallback() {
    console.log('App-root is connected!')
    // calling IPC exposed from preload script
    window.electron.ipcRenderer.sendMessage('ipc-get-default', ['app-root']);
  }

  attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {
    //console.log('App-root attributeChangedCallback!', attrName, oldVal, newVal);
  }

}
customElements.define("app-root", AppRoot);