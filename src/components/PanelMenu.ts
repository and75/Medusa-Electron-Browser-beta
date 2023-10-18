
import { WebviewTag } from "electron";
import { bookmarkSvg, clipboardSvg, clockRotateLeft, slidersSvg, DevToolsSvg, TabsGroupSvg } from "./Img";
import { LogElement } from "./../model";
import { appLog } from "./../core";

export class PanelMenu extends HTMLElement {

   bookmark: HTMLLIElement
   notes: HTMLLIElement
   history: HTMLLIElement
   tabGroup: HTMLLIElement
   settings: HTMLLIElement
   devtools: HTMLLIElement
   webview: WebviewTag | null

   constructor() {

      super();

      this.webview = null;

      // Create a shadow root
      this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

      //Action Menu
      const actionMenu = document.createElement("ul");
      actionMenu.setAttribute('class', "action-menu");

      //History
      const history = actionMenu.appendChild(document.createElement('li'));
      const historyIcon = document.createElement('img');
      historyIcon.setAttribute('src', clockRotateLeft);
      historyIcon.setAttribute('title', 'History');
      historyIcon.setAttribute('panel', 'history');
      historyIcon.addEventListener('click', this._openPanel.bind(this));
      history.appendChild(historyIcon);
      this.history = history;

      //Bookmark
      const bookmark = actionMenu.appendChild(document.createElement('li'));
      const bookmarkIcon = document.createElement('img');
      bookmarkIcon.setAttribute('src', bookmarkSvg);
      bookmarkIcon.setAttribute('title', 'Bookmark');
      bookmarkIcon.setAttribute('panel', 'bookmark');
      bookmarkIcon.addEventListener('click', this._openPanel.bind(this));
      bookmark.appendChild(bookmarkIcon);
      this.bookmark = bookmark;

      //TabsGroup
      const tabGroup = actionMenu.appendChild(document.createElement('li'));
      const tabGroupIcon = document.createElement('img');
      tabGroupIcon.setAttribute('src', TabsGroupSvg);
      tabGroupIcon.setAttribute('title', 'Tab Groups');
      tabGroupIcon.setAttribute('panel', 'tabgroup');
      tabGroupIcon.addEventListener('click', this._openPanel.bind(this));
      tabGroup.appendChild(tabGroupIcon);
      this.bookmark = tabGroup;

      //Notes
      const notes = actionMenu.appendChild(document.createElement('li'));
      const notesIcon = document.createElement('img');
      notesIcon.setAttribute('src', clipboardSvg);
      notesIcon.setAttribute('title', 'Notes');
      notesIcon.setAttribute('panel', 'notes');
      notesIcon.addEventListener('click', this._openPanel.bind(this));
      notes.appendChild(notesIcon);
      this.notes = notes;


      //Settings
      const settings = actionMenu.appendChild(document.createElement('li'));
      const settingsIcon = document.createElement('img');
      settingsIcon.setAttribute('src', slidersSvg);
      settingsIcon.setAttribute('title', 'Settings');
      settingsIcon.setAttribute('panel', 'settings');
      settingsIcon.addEventListener('click', this._openPanel.bind(this));
      settings.appendChild(settingsIcon);

      this.settings = settings;

      //Devtools
      const devtools = actionMenu.appendChild(document.createElement('li'));
      const devtoolsIcon = document.createElement('img');
      devtoolsIcon.setAttribute('src', DevToolsSvg);
      devtoolsIcon.setAttribute('title', 'Settings');
      devtools.appendChild(devtoolsIcon);
      devtools.addEventListener('click', this._openDevTool.bind(this))
      this.devtools = devtools;

      const style = document.createElement("style");
      style.textContent = `
             :host{
               display: flex;
               flex: 0;
               align-items: center;
               justify-content: end;
               gap: var(--default-spacing);
             }
             :host ul.action-menu{
                all: unset;
                display: flex;
                align-items: end;
                gap: var(--default-spacing);
                list-style: none;
             }
             :host ul.action-menu li {
               all: unset;
               display: flex;
               align-items: center;
               background: var(--btn-bg-color);
               border-radius: var(--brd-radius-round);
               width: 40px;
               height: 40px;
               cursor: pointer;
               justify-content: center;
               transition: all 0.2s ease-out;
           }
           :host ul.action-menu li img {
               all: unset;
               height: 20px;
           }
           :host ul.action-menu li:hover{
                background: var(--primary-light);
           }
        `;

      this.shadowRoot.append(style, actionMenu);
      
   }

   _setWebView(webview: WebviewTag) {
      this._log({ ref: '_setWebView', message: webview.getAttribute('tab-id') })
      this.webview = webview;
   }

   _openPanel(e: Event) {
      const target = e.target as HTMLElement
      const type = target.getAttribute('panel');
      if (type) {
         this._log({ ref: '_openPanel', message: type })
         window.electron.ipcRenderer.sendMessage('ipc-open-sidepanel', { type: type });
      }
   }

   _openDevTool() {
      if (this.webview.isDevToolsOpened()) {
         this.webview.closeDevTools();
      } else {
         this.webview.openDevTools();
      }
   }

   private _log(options: LogElement) {
      options.className = this.constructor.name;
      return appLog(options);
   }

   connectedCallback() {
      this._log({message:'Is connected!', color:'#cc5'})
   }

   // disconnectedCallback() { }

}
customElements.define("panel-menu", PanelMenu);