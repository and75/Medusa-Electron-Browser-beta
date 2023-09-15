/**
* Medusa browser beta
* @component NavBar
* @description This component manage the wrapper of Navigation bar
* @author Andrea Porcella
* @copyright Andrea Porcella / Bellville-system 2023
*/

import { arrowLeft, arrowRight, arrowRotate, bookmarkSvg, clipboardSvg, clockRotateLeft, slidersSvg } from "./Img";
import { TabElement } from '../model';

export class WebviewActionBar extends HTMLElement {

    backIcon: HTMLImageElement;
    forwardIcon: HTMLImageElement;
    reloadIcon: HTMLImageElement;
    urlInput: HTMLInputElement;
    bookmarkIcon: HTMLImageElement;
    notesIcon: HTMLImageElement;
    historyIcon: HTMLImageElement;
    settingsIcon: HTMLImageElement;
    currentTab:TabElement;
    currentTabIndex:number;


    constructor() {

        // Always call super first in constructor
        super();

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create (nested) span elements
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "navbar-wrapper");

        //Nav elements wrapper
        const nav = wrapper.appendChild(document.createElement("ul"));
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

        //Input Url
        const form = wrapper.appendChild(document.createElement("form"));
        const urlInput = document.createElement('input');
        urlInput.setAttribute("type", "text");
        urlInput.setAttribute('placeholder', 'Navigate to...');
        form.appendChild(urlInput)
        this.urlInput = urlInput;


        //APP ACTION MENU//
        //Container
        const appMenu = wrapper.appendChild(document.createElement("ul"));
        appMenu.setAttribute('class', "nav app-menu");

        //HistoryIcon
        const history = appMenu.appendChild(document.createElement('li'));
        const historyIcon = document.createElement('img');
        historyIcon.setAttribute('src', clockRotateLeft);
        history.appendChild(historyIcon);
        this.historyIcon = historyIcon;

        //BookMark
        const bookmark = appMenu.appendChild(document.createElement('li'));
        const bookmarkIcon = document.createElement('img');
        bookmarkIcon.setAttribute('src', bookmarkSvg)
        bookmark.appendChild(bookmarkIcon);
        this.bookmarkIcon = bookmarkIcon;

        //NotesIcon
        const notes = appMenu.appendChild(document.createElement('li'));
        const notesIcon = document.createElement('img');
        notesIcon.setAttribute('src', clipboardSvg)
        notes.appendChild(notesIcon);
        this.notesIcon = notesIcon;

        //SettingsIcon
        const settings = appMenu.appendChild(document.createElement('li'));
        const settingsIcon = document.createElement('img');
        settingsIcon.setAttribute('src', slidersSvg)
        settings.appendChild(settingsIcon);
        this.settingsIcon = settingsIcon;


        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            .navbar-wrapper {
                display:flex;
                padding: 15px 10px;
                background: #fff;
                align-item:center;
                gap:10px
            }
            .navbar-wrapper form {
                display:flex;
                flex: auto;
            }
            .navbar-wrapper form input{
                width: 100%;
                padding: 12px 10px 10px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                line-height: 0;
            }
            .navbar-wrapper ul.nav{
                display:flex;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .navbar-wrapper ul.nav li{
                background: #e7e7e7;;
                border-radius: 50%;
                padding: 10px;
                line-height: 0;
                margin-right: 10px; 
                cursor:pointer;  
            }
            .navbar-wrapper ul.nav li:last-child{
                margin-right:0;
            }
            .navbar-wrapper ul.nav li img{
                width:20px;
                height:20px;
                opacity:0.75;
            }
            .navbar-wrapper ul.nav.app-menu li{ 
                margin-right: 0px;
                margin-left: 20px;
            }
            .navbar-wrapper ul.nav.app-menu li:first-child{
                margin-left:0;
            }
            
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, wrapper);

    }

    private initNavigation(){
        this.urlInput.value = this.currentTab.current.url;
    }

    connectedCallback() {
        console.log('Nav-bar is connected!')
        window.electron.ipcRenderer.on('ipc-set-active-tab', (arg: any) => {
            // eslint-disable-next-line no-console
            console.log('Nav-Bar ipc-set-active-tab', arg);
            this.urlInput.value = arg.current.url
        });
        window.electron.ipcRenderer.on('ipc-toogle-tab-active', (arg: any) => {
            // eslint-disable-next-line no-console
            //console.log('ipc-toogle-tab-active', Date.now(), arg);
            this.urlInput.value = arg.current.url
        });
    }

}
customElements.define("webview-action-bar", WebviewActionBar);