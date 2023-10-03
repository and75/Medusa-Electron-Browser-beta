import { WebviewTag } from "electron";
import { arrowLeft, arrowRight, arrowRotate } from "./Img";

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
                background: #e7e7e7;;
                border-radius: 50%;
                padding: 10px;
                line-height: 0;
                margin-right: 10px; 
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
        console.log('_setWebview', webview)
        this.webview = webview;
    }

    _updateWebView(webview: WebviewTag) {
        if (this.webview.getAttribute('tab-id') == webview.getAttribute('tab-id')) {
            this.webview = webview;
        }
    }

    _goBack(e: Event) {
        console.log('Reload', this.webview, this.canGoBack)
        if (this.canGoBack) {
            this.webview.stop();
            this.webview.goBack()
        }
    }

    _goForward(e: Event) {
        console.log('GoForward', this.webview, this.canGoForward)
        if (this.canGoForward) {
            this.webview.stop();
            this.webview.goForward();
        }
    }

    _reload(e: Event) {
        console.log('canReload', this.webview, this.canReload)
        if (this.canReload) {
            this.webview.stop();
            this.webview.reload();
        }
    }

    _setStatus() {
        if(!this.webview) return;
        try {
            this.canGoBack = this.webview.canGoBack()
            this.canGoForward = this.webview.canGoForward()
            this.canReload = (!this.webview.isLoading()) ? true : false;
            console.log(this.webview.canGoBack(), this.webview.canGoForward(), this.canReload)
        } catch (error) {
            console.error(error)
        }
        console.log('_setStatus', this.webview, this.canReload)
    }

    _reset() {
        this.webview = null;
        this.canGoBack = false;
        this.canGoForward = false;
        this.canReload = false;
    }

    connectedCallback(){}
    disconnectedCallback(){
        this.backIcon.removeEventListener('click', this._goBack.bind(this))
        this.forwardIcon.removeEventListener('click', this._goForward.bind(this))
        this.reloadIcon.removeEventListener('click', this._reload.bind(this))
    }

}
customElements.define("nav-menu", NavMenu);