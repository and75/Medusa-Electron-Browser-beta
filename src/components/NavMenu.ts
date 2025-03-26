/**
 * Medusa browser beta
 * @component NavMenu
 * @description Add navigation menu
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { WebviewTag } from "electron";
import { arrowLeft, arrowRight, arrowRotate } from "./Img";
import { LogElement } from "./../model";
import { appLog } from "./../core";

export class NavMenu extends HTMLElement {

    wrapper: HTMLUListElement
    backIcon: HTMLImageElement
    forwardIcon: HTMLImageElement
    reloadIcon: HTMLImageElement
    webview: WebviewTag | null
    _canGoBack: boolean
    _canGoForward: boolean
    _canReload: boolean

    constructor() {

        super();

        this.webview = null;

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        //Nav elements wrapper
        const nav = document.createElement("ul");
        nav.setAttribute('class', "nav");

        //Back
        const back = nav.appendChild(document.createElement('li'));
        const backIcon = document.createElement('img');
        backIcon.setAttribute('src', arrowLeft)
        back.appendChild(backIcon);
        this.backIcon = backIcon;

        //Forward
        const forward = nav.appendChild(document.createElement('li'));
        const forwardIcon = document.createElement('img');
        forwardIcon.setAttribute('src', arrowRight);
        forward.appendChild(forwardIcon);

        this.forwardIcon = forwardIcon;

        //Reload
        const reload = nav.appendChild(document.createElement('li'));
        const reloadIcon = document.createElement('img');
        reloadIcon.setAttribute('src', arrowRotate);
        reload.appendChild(reloadIcon);
        this.reloadIcon = reloadIcon;

        this.backIcon.addEventListener('click', this._goBack.bind(this))
        this.forwardIcon.addEventListener('click', this._goForward.bind(this))
        this.reloadIcon.addEventListener('click', this._reload.bind(this))

        const style = document.createElement("style");
        style.textContent = `
             ul.nav{
                display:flex;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            ul.nav li{
                background: var(--btn-bg-color);
                border-radius: var(--brd-radius-round);
                padding: var(--default-spacing);
                line-height: 0;
                margin-right: var(--default-spacing);
                transition: all 0.2s ease-out;
            }
            ul.nav li:hover{
                background: var(--btn-bg-color-hover);
            }
            ul.nav li:last-child{
                margin-right:0;
            }
            ul.nav li img{
                width: 20px;
                height: 20px;
                opacity: 0.30;
            }
            ul.nav li img.active{
                opacity: 0.75;
                cursor:pointer; 
            }
            ul.nav.app-menu li{ 
                margin-right: 0px;
                margin-left: 20px;
            }
            ul.nav.app-menu li:first-child{
                margin-left:0;
            }
        `;
        this.shadowRoot.append(style, nav);
    }

    get canGoBack() {
        return this._canGoBack;
    }
    set canGoBack(value: boolean) {
        this._canGoBack = value;
        if (value) {
            this.backIcon.classList.add('active')
        } else {
            this.backIcon.classList.remove('active')
        }
    }

    get canGoForward() {
        return this._canGoForward;
    }
    set canGoForward(value: boolean) {
        this._canGoForward = value;
        if (value) {
            this.forwardIcon.classList.add('active')
        } else {
            this.forwardIcon.classList.remove('active')
        }
    }

    get canReload() {
        return this._canReload;
    }
    set canReload(value: boolean) {
        this._canReload = value;
        if (value) {
            this.reloadIcon.classList.add('active')
        } else {
            this.reloadIcon.classList.remove('active')
        }
    }

    _initNav(webview: WebviewTag) {
        this._log({ ref: '_initNav', message: 'tabId:' + webview.getAttribute('tab-id') })
        this.canGoBack
        this.webview = webview;
    }

    _updateWebView(webview: WebviewTag) {
        if (this.webview.getAttribute('tab-id') == webview.getAttribute('tab-id')) {
            this.webview = webview;
        }
    }

    _goBack(e: Event) {
        //this._log(ref:'_goBack', message:this.canGoBack)
        if (this.canGoBack) {
            this.webview.stop();
            this.webview.goBack()
        }
    }

    _goForward(e: Event) {
        //this._log(ref:'_goForward', message:this.canGoForward)
        if (this.canGoForward) {
            this.webview.stop();
            this.webview.goForward();
        }
    }

    _reload(e: Event) {
        //this._log(ref:'_reload', message:this.canReload)
        if (this.canReload) {
            this.webview.stop();
            this.webview.reload();
        }
    }

    _setStatus() {
        if (!this.webview) return;
        try {
            this.canGoBack = this.webview.canGoBack()
            this.canGoForward = this.webview.canGoForward()
            this.canReload = (!this.webview.isLoading()) ? true : false;
            this._log({ ref: '_setStatus', message: `${this.webview.canGoBack()}, ${this.webview.canGoForward()}, ${this.canReload}` })
        } catch (error) {
            console.error('NavMenu _setStatus', error)
        }
    }

    _reset() {
        this.webview = null;
        this.canGoBack = false;
        this.canGoForward = false;
        this.canReload = false;
    }

    private _log(options: LogElement) {
        options.className = this.constructor.name;
        return appLog(options);
    }

    connectedCallback() {
        this._log({message:'Is connected!', color:'#cc5'})
    }
    disconnectedCallback() {
        this.backIcon.removeEventListener('click', this._goBack.bind(this))
        this.forwardIcon.removeEventListener('click', this._goForward.bind(this))
        this.reloadIcon.removeEventListener('click', this._reload.bind(this))
    }

}
customElements.define("nav-menu", NavMenu);