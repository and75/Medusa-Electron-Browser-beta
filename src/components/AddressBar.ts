import { StarSvg, findSvg, LockOpenSvg, LockSvg } from "./Img";
import { IpcMessageEvent, WebviewTag } from "electron";
import { LogElement } from "./../model";
import { appLog } from "./../core";

export class AddressBar extends HTMLElement {


   bookmark: HTMLLIElement
   formAction: HTMLFormElement
   formInput: HTMLInputElement
   webview: WebviewTag | null
   addrLabelIcon: HTMLImageElement
   actionType: string;

   get url() {
      return this.getAttribute('url');
   }
   set url(value: string) {
      this.setAttribute('url', value)
      this.formInput.value = value;
      this._handleStatus(value);
   }

   constructor() {

      super();

      this.webview = null;
      this.actionType = 'no-action';

      // Add a shadow root
      this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

      // Add address label icon
      const addrLabel = document.createElement('div');
      addrLabel.setAttribute('class', 'search-label');
      const addrLabelIcon = addrLabel.appendChild(document.createElement('img'));
      addrLabelIcon.setAttribute('src', LockSvg);
      this.addrLabelIcon = addrLabelIcon;

      // Add form 
      const formAction = document.createElement('form');
      formAction.setAttribute('class', 'navigate-to-form');
      formAction.setAttribute('action', '#');
      formAction.addEventListener('submit', this._goTo.bind(this))

      // Add form input
      const formInput = formAction.appendChild(document.createElement('input'));
      formInput.setAttribute('type', 'text');
      formInput.value = this.url;
      this.formInput = formInput;
      this.formInput.addEventListener("input", this._dispatchEventInputevent.bind(this));

      // Add Action menu
      const actionMenu = document.createElement("ul");
      actionMenu.setAttribute('class', "action-menu");

      // Add Action menu bookmark Item
      const bookmark = actionMenu.appendChild(document.createElement('li'));
      const bookmarkIcon = document.createElement('img');
      bookmarkIcon.setAttribute('src', StarSvg);
      bookmarkIcon.setAttribute('title', 'Add this tab to favorites');
      bookmark.addEventListener('click', this._webviewSendRequestWebviewInfo.bind(this))
      bookmark.appendChild(bookmarkIcon);
      this.bookmark = bookmark;

      // Add style
      const style = document.createElement("style");
      style.textContent = `
             :host{
                display: flex;
                flex: auto;
                background: var(--primary-light);
                border: 2px solid var(--primary-light);
                border-radius: 11px;
                padding: 5px var(--default-spacing);
                height: 22px;
                font-size: 13px;
                transition: all 0.2s ease-out;
             }
             :host(:focus-within){
               border: 2px solid var(--primary);
               background: #ffffff;
             }
             :host .search-label{
               display: flex;
               align-items: center;
               margin-right: 5px;
             }
             :host .search-label img{
               all: unset;
               height: 14px;
               opacity: 0.5;
             }
             :host form{
                all: unset;
                display: flex;
                align-items: center;
                flex: auto;
             }
             :host input{
                all: unset;
                width:100%;
             }
             :host input:focus{
                border : 0;
             }
             :host ul.action-menu{
                all: unset;
                display: flex;
                align-items: center;
                gap: var(--default-spacing);
                list-style: none;
             }
             :host ul.action-menu li{
                all: unset;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25px;
                height: 25px;
                border-radius: var(--brd-radius-round);
                cursor: pointer;
             }
             :host ul.action-menu li img{
                all: unset;
                width: 17px;
                opacity: 0.5;
             }
             :host ul.action-menu li:hover{
                background: #ffedb6;
             }
             :host ul.action-menu li:hover img{
                opacity: 0.9;
             }

        `;

      this.shadowRoot.append(style, addrLabel, formAction, actionMenu);
   }

   _webviewSendRequestWebviewInfo(e:Event){
      console.log(this.webview)
      this.webview.send('ipc-request-webview-info');
   }

   _dispatchEventInputevent(e: Event) {
      this._log({ ref:'_dispatchEventInputevent', message: this.formInput.value, color: '#cc5' }),
      // Create and dispatch/trigger an event on the fly
      // Note: Optionally, we've also leveraged the "function expression" (instead of the "arrow function expression") so "this" will represent the element
      this.dispatchEvent(
         new CustomEvent("inputevent", {
            bubbles: true,
            detail: { text: () => this.formInput.value },
         }),
      );
   }

   private _handleStatus(str: string): string {
      if(str.length <= 3){
         this.addrLabelIcon.setAttribute('src', findSvg);
      } else if(str.length >= 4){
         if (str.startsWith('http://') || str.startsWith('https://')) {
            if (str.startsWith('http://')) {
               this.addrLabelIcon.setAttribute('src', LockOpenSvg);
            }
            if (str.startsWith('https://')) {
               this.addrLabelIcon.setAttribute('src', LockSvg);
            }
            this.actionType = 'goTo';
         } else {
            this.addrLabelIcon.setAttribute('src', findSvg);
            this.actionType = 'search';
         }
      }
      return this.actionType;
   }

   private _handleInputEvent(e: CustomEvent) {
      const str = e.detail.text();
      this._handleStatus(str);
   }

   private _goTo(e: Event) {

      e.preventDefault;

      this.webview.stop();

      function escapeRegExp(string: string) {
         return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
      }

      function replaceAll(str: string, find: string, replace: string) {
         return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
      }

      if (this.actionType == "goTo") {
         this.webview.loadURL(this.formInput.value);
      } else if(this.actionType == "search") {
         //format input value to search string compatible
         const query = replaceAll(this.formInput.value, ' ', '+');
         //set the url 
         const url = `https://www.google.com/search?q=${query}&sca_esv=572214004&source=hp`;
         //open new page
         this.webview.loadURL(encodeURI(url));
      }

   }

   _setWebView(webview: WebviewTag) {
      function handlerMessagesFromApp(event: IpcMessageEvent) {
         if (event.channel == 'pong') {
            console.log(event.channel, event.args[0], this.webview.id);
            window.electron.ipcRenderer.sendMessage('ipc-open-add-bookmark', event.args[0]);
         }
      }
      if (this.webview)
         this.webview.removeEventListener('ipc-message', handlerMessagesFromApp.bind(this));
      this.webview = webview;
      this.webview.addEventListener('ipc-message', handlerMessagesFromApp.bind(this))
   }

   _setUrl(value: string) {
      if (this.url !== value) this.url = value;
   }

   private _log(options: LogElement) {
      options.className = this.constructor.name;
      return appLog(options);
   }

   connectedCallback() {
      this._log({ message: 'Is connected!', color: '#cc5' })
      this.addEventListener("inputevent", this._handleInputEvent.bind(this));
   }

   // disconnectedCallback() { }

}
customElements.define("address-bar", AddressBar);