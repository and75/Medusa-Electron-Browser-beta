/**
 * Medusa browser beta
 * @component AppRoot
 * @description This component manage the application wrapper
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { TabsGroupWrapper } from "./TabsGroupWrapper";
import { WebviewsWrapper } from "./WebviewsWrapper";
import {ContextMenu} from "./ContextMenu"

export class AppRoot extends HTMLElement {

  constructor() {

    super();

    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'


    // Create some CSS to apply to the shadow DOM
    const style = document.createElement("style");
    style.textContent = `
        /** Grid Layout **/
        :host{
          display: grid;
          grid-template-columns:  auto;
          grid-template-rows: 40px calc(100vh - 40px);
          grid-template-areas:
          "header"
          "webview";
          overflow: hidden;
        }
        tabs-bar{
          grid-area: header;
          justify-self: stretch;
        }
        app-webview{
          grid-area: webview;
          justify-self: stretch;     
        }
        context-menu[visible]{
          display:block!important;
        } 
        `;
    this.shadowRoot.append(style, new TabsGroupWrapper(), new WebviewsWrapper(), new ContextMenu());
    //this.shadowRoot.append(style);
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