import { StarSvg } from "./Img";
import { WebviewTag } from "electron";
import { LogElement } from "./../model";
import { appLog } from "./../core";

export class AddressBar extends HTMLElement {


    bookmark: HTMLLIElement
    formAction: HTMLFormElement
    formInput: HTMLInputElement
    webview: WebviewTag | null


    get url() {
        return this.getAttribute('url');
    }
    set url(value: string) {
        this.setAttribute('url', value)
        this.formInput.value = value;
    }

    constructor() {

        super();

        this.webview = null;

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        const formAction = document.createElement('form');
        formAction.setAttribute('class', 'navigate-to-form');
        formAction.setAttribute('action', '#');
        formAction.onsubmit = this._goTo.bind(this);

        const formInput = formAction.appendChild(document.createElement('input'));
        formInput.setAttribute('type', 'text');
        formInput.value = this.url;
        this.formInput = formInput;
        this.formInput.onsubmit = this._goTo.bind(this);

        //Action Menu
        const actionMenu = document.createElement("ul");
        actionMenu.setAttribute('class', "action-menu");

        //Bookmark
        const bookmark = actionMenu.appendChild(document.createElement('li'));
        const bookmarkIcon = document.createElement('img');
        bookmarkIcon.setAttribute('src', StarSvg);
        bookmarkIcon.setAttribute('title', 'Add this tab to favorites');
        bookmark.appendChild(bookmarkIcon);
        this.bookmark = bookmark;


        const style = document.createElement("style");
        style.textContent = `
             :host{
                display: flex;
                flex: auto;
                background: #dbd4e7;
                border: 2px solid #dbd4e7;
                border-radius: 11px;
                padding: 5px 10px;
                height: 22px;
                font-size: 13px;
                transition: all 0.2s ease-out;
             }
             :host(:focus-within){
               border: 2px solid #7E57C2;
               background: #ffffff;
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
                gap: 10px;
                list-style: none;
             }
             :host ul.action-menu li{
                all: unset;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 25px;
                height: 25px;
                border-radius: 50%;
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

        this.shadowRoot.append(style, formAction, actionMenu);
    }

    private _goTo(e: Event) {
        e.preventDefault;
        const target = e.target;
        //console.log('AddressBar _goTo', this.formInput.value);
        this.webview.stop()
        this.webview.loadURL(this.formInput.value);
    }

    _setWebView(webview: WebviewTag) {
        //console.log('AddressBar _setWebview', webview)
        this.webview = webview;
        this._setUrl(webview.getURL())
    }

    private _setUrl(value: any) {
        //console.log('AddressBar _setUrl', value)
        this.url = value;
    }

    _reset() { }

    private _log(options: LogElement) {
      options.className = this.constructor.name;
      return appLog(options);
    }

    connectedCallback() { 
      this._log({message:'Is connected!', color:'#cc5'})
    }

    disconnectedCallback() { }

}
customElements.define("address-bar", AddressBar);