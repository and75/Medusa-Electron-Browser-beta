/**
 * Medusa browser beta
 * @component TabsBar
 * @description This component manage the wrapper of Tab
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { plusSvg } from "./img";
import { TabElement, TabsBarWrapperElement, TabsGroupElement } from './../model';
import { Tab } from "./tab";
import { on, emit } from './../core'

class TabsGroupsElement extends EventTarget {

    time: number
    title : string
    isActive: boolean
    tabs: TabElement[]
    element : HTMLUListElement;
    wrapper : HTMLDivElement;

    constructor(options:TabsGroupElement){
        
        super();
        
        this.time =  options.time;
        this.title = options.title;
        this.isActive =  options.isActive;
        this.tabs = options.tabs;

    }

}
export class TabsBarWrapper extends HTMLElement {

    time: number
    isReady: boolean
    current: number
    tabsWrapper: HTMLDivElement
    tabsList: HTMLUListElement
    tabs: TabElement[]
    tabsGroups : TabsGroupElement[]

    constructor() {

        // Always call super first in constructor
        super();

        this.tabsGroups = [];

        this.time = Date.now();
        this.isReady = false;
        this.tabs = [];

        this.createElement();

    }

    createElement() {

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create wrapper and first tab
        const tabsWrapper = document.createElement("div");
        tabsWrapper.setAttribute("class", "tabs-wrapper");
        const tabsList = tabsWrapper.appendChild(document.createElement("ul"));
        this.tabsWrapper = tabsWrapper;
        this.tabsList = tabsList;

        //Add new tab
        const buttonNewTab = tabsWrapper.appendChild(document.createElement('div'));
        buttonNewTab.setAttribute("class", "new-tab");
        const newIcon = document.createElement('img');
        newIcon.setAttribute("class", "favicon plus");
        newIcon.setAttribute('src', plusSvg);
        buttonNewTab.appendChild(newIcon);
        buttonNewTab.addEventListener('click', this.handleNewTab.bind(this), false)

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
            .tabs-wrapper {
                padding: 0 10px;
                background: #f2f0ec;
                display: flex;
                gap: 10px;
                align-items:center;
            }
            .tabs-wrapper ul{
                display:flex;
                list-style-type: none;
                margin: 0;
                padding: 0;
            }
            .tabs-wrapper ul li{
                flex: 1;
                display:flex;
                align-items:center;
                gap:10px;
                background:#dbdbdb;
                padding: 7px 10px 9px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-right: 1px solid #777;
                cursor: pointer;
                margin-top: 1px;
                max-width: 180px;
            }
            .tabs-wrapper ul li.active,
            .tabs-wrapper ul li:hover{
                background: #ffffff;
            }
            .tabs-wrapper .new-tab{
                display: flex;
                justify-content: center;
                padding: 2px 2px 3px;
                border-radius: 50%;
                cursor: pointer;
                height: 20px;
                width: 20px;
                align-items: center;
            }
            .tabs-wrapper .new-tab:hover{
                background: #dbdbdb;
            }
            .tabs-wrapper .new-tab img{
                width:14px;
                opacity: 0.5;
            }
            .tabs-wrapper .new-tab:hover img{
                opacity: 1;
            }
            .tabs-wrapper ul li img.favicon{
                width:14px;
                opacity: 0.5;
            }
            .tabs-wrapper ul li.loading img.favicon{
                display:none;
            }
            .tabs-wrapper ul li img.favicon.loading{
                display:none;
            }
            .tabs-wrapper ul li.loading img.favicon.loading{
                display: block;
                animation: rotate 1.5s linear infinite;
            }
            @keyframes rotate{
                100% {
                  transform: rotate(360deg);
                }
              }

            .tabs-wrapper ul li img.close-tab{
                width:12px;
                opacity: 0.5;
            }
            .tabs-wrapper ul li img.close-tab:hover{
                opacity:1;
            }
            .tabs-wrapper ul li span.title{
                flex: auto;
                text-align: start;
                max-width: 77px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, tabsWrapper);

    }

    emit(type: string, ...args: any[]) {
        return emit(this, type, args);
    }

    on(type: string, fn: (...detail: any[]) => void) {
        return on(this, type, fn);
    }

    once(type: string, fn: (detail: string) => void) {
        return on(this, type, fn, { once: true });
    }

    private initTabGroups(arg:TabsGroupElement){
        arg.tabs.map((el) => {
            const newTab = this.initTab(el);
            this.tabsList.append(newTab.getTabElement());
            this.tabs.push(newTab);
        })
    }

    private initNewTab(arg:TabElement){
        const newTab = this.initTab(arg);
        this.tabsList.append(newTab.getTabElement());
        this.tabs.push(newTab);
        this.toogleActive(newTab);
    }

    private initTab(arg: TabElement):TabElement{
        let tab = new Tab(arg);
        return tab;
    }

    private closeTab(arg: any) {
        let find: any = {}
        this.tabs.forEach((el, index) => {
            if (el.id == arg.id) {
                find = {
                    tab: el,
                    index: index
                }
            }
        });
        find.tab.closeTab(this.tabsList);
        this.toogleNext(arg, find);
        this.tabs.splice(find.index, 1);
    }

    private handleNewTab(this: any) {
        window.electron.ipcRenderer.sendMessage('ipc-set-new-tab');
    }

    private toogleNext(arg: any, find: any){
        let nextTab: TabElement;
        if (arg.isActive) {
            if (find.index == 0 && this.tabs.length == 1) {
                window.electron.ipcRenderer.sendMessage('ipc-get-default');
            } else {
                if ((this.tabs.length - 1) == find.index) {
                    nextTab = this.tabs[find.index - 1]
                }
                else {
                    nextTab = this.tabs[find.index + 1]
                }
                this.toogleActive(nextTab);
            }
        }
    }

    private toogleActive(tab: TabElement) {
       this.tabs.map((t)=>t.toogleActive(tab))
    }

    connectedCallback() {
        window.electron.ipcRenderer.on('ipc-get-default', (arg: any) => {
            this.initTabGroups(arg);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (arg: any) => {
            this.closeTab(arg)
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (arg: any) => {
            this.initNewTab(arg)
        });
        window.electron.ipcRenderer.on('ipc-toogle-tab-active', (arg: any) => {
            this.toogleActive(arg);
        })
    }

    attributeChangedCallback(attrName: any, oldVal: any, newVal: any) {
        //console.log('Tabs-bar attributeChangedCallback!', attrName, oldVal, newVal);
    }
}
customElements.define("tabs-bar", TabsBarWrapper);