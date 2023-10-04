/**
 * Medusa browser beta
 * @component TabsGroupWrapper
 * @description This component manage the wrapper of TabsGroups
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { plusSvg } from "./Img";
import { TabElement, TabStatus, TabsGroupElement } from '../model';
import { Tab } from "./Tab";
import { LogElement } from "./../model";
import { appLog } from "./../core";



export class TabsGroupWrapper extends HTMLElement {

    time: number
    isReady: boolean
    tabsWrapper: HTMLDivElement
    groupsWrapper: HTMLDivElement
    tabs: Map<string, TabElement>
    tabsGroups: TabsGroupElement[]
    

    get tabGroupList() {
        let items = this.shadowRoot.querySelectorAll(".group-wrapper.open");
        var lastchild = items[items.length - 1].lastElementChild;
        return lastchild;
    }


    constructor() {
        super();
        this.tabsGroups = [];
        this.time = Date.now();
        this.isReady = false;
        this.tabs = new Map();
        this.createElement();
    }

    createElement() {

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create wrapper and first tab
        const tabsWrapper = document.createElement("div");
        tabsWrapper.setAttribute("class", "tabs-wrapper");
        this.tabsWrapper = tabsWrapper;


        //Add new tab button
        const buttonNewTab = this.tabsWrapper.appendChild(document.createElement('div'));
        buttonNewTab.setAttribute("class", "new-tab");
        const newIcon = document.createElement('img');
        newIcon.setAttribute("class", "favicon plus");
        newIcon.setAttribute('src', plusSvg);
        buttonNewTab.appendChild(newIcon);
        buttonNewTab.addEventListener('click', this._handleNewTab.bind(this), false)

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
             
            .tabs-wrapper {
                padding: 0 10px;
                background: #f2f0ec;
                display: flex;
                gap: 10px;
                align-items:center;
                height: 41px;
            }
            .tabs-wrapper .group-wrapper{
                display:flex;
                align-items:center;
                gap: 5px;
            }
            .tabs-wrapper .group-label{
                flex: auto;
                max-width: 77px;
                overflow: hidden;
                padding: 5px 5px;
                border-radius: 3px;
                color: #fff;
                font-size: 10px;
                text-align: start;
                font-weight: 600;
                letter-spacing: 0.5px;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-transform: uppercase;
                cursor: pointer;
            }
            .tabs-wrapper .group-wrapper .tab-list{
                display:none;
                list-style-type: none;
                margin: 0;
                padding: 0;
            }
            .tabs-wrapper .group-wrapper.open .tab-list{
                display:flex
            }
            .tabs-wrapper .tab-list .item{
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
            .tabs-wrapper .tab-list .item.active,
            .tabs-wrapper .tab-list .item:hover{
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
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, tabsWrapper);

    }

    private _toogleOpenGroup(event: any) {
        let target = event[0];
        target.parentElement.classList.toggle('open');
    }

    private _initTabGroups(arg: TabsGroupElement[]) {

        arg.map((el) => {

            const groupWrapper = document.createElement('div');
            groupWrapper.setAttribute("class", "group-wrapper  open");
            groupWrapper.setAttribute("id", "group-" + el.id);

            const groupLabel = document.createElement('div');
            groupLabel.setAttribute("class", "group-label");
            groupLabel.setAttribute("style", "background-color:" + el.color);
            groupLabel.innerText = el.title;
            groupWrapper.appendChild(groupLabel);
            groupLabel.onclick = (event) => {
                this._toogleOpenGroup(event.composedPath());
            };
            groupLabel.oncontextmenu = this._toogleOpenMenu.bind(this);

            const tabList = document.createElement("div");
            tabList.setAttribute("class", "tab-list");

            el.tabs.map((t) => {
                let newTab = this._initTab(t) as TabElement;
                tabList.append(newTab);
                this.tabs.set(t.id, newTab);
            })

            groupWrapper.appendChild(tabList);

            this.tabsWrapper.insertBefore(groupWrapper,  this.tabsWrapper.firstChild);
        })
    }

    private _toogleOpenMenu(e: PointerEvent) {
        const { clientX, clientY } = e;
        window.electron.ipcRenderer.sendMessage('ipc-open-contextmenu', { clientX, clientY, type: 'tabbar-group' })
    }

    private _resetGroups() {
        let find = this.tabsWrapper.querySelectorAll('.group-wrapper')
        find.forEach(el => {
            this.tabsWrapper.removeChild(el);
        })
    }

    private _initNewTab(arg: TabStatus) {
        const newTab = this._initTab(arg) as TabElement;
        this.tabGroupList.append(newTab);
        this.tabs.set(arg.id, newTab);
        this._toogleActive(newTab);
    }

    private _initTab(arg: TabStatus): HTMLElement {
        let tab = new Tab();
        tab.initTab(arg);
        return tab;
    }

    private _getNext(id: string) {
        let tabArray = [...this.tabs];
        this._log({ref: '_getNext', args:tabArray});
        let index = tabArray.findIndex((el) => el[0] === id);
        return {
            next: (tabArray[index + 1]) ? tabArray[index + 1][1] : null,
            prev: (tabArray[index - 1]) ? tabArray[index - 1][1] : null
        }
    }

    private _closeTab(args: any) {
        try {
            this._log({ref: '_closeTab', args});
            let find = this.tabs.get(args.id)
            let getTabNav = this._getNext(args.id);
            find._closeTab(this.tabsWrapper);
            this.tabs.delete(args.id);
            this._toogleNextActive(args, getTabNav);
        } catch (error) {
            console.error('TabsGroupWrapper _closeTab', error);
        }
    }

    private _handleNewTab(this: any) {
        this._log({ref: '_handleNewTab'});
        window.electron.ipcRenderer.sendMessage('ipc-set-new-tab');
    }

    private _toogleNextActive(arg: TabElement, nav: any) {
        if (arg.isActive) {
            let nextTab: TabElement;
            if (nav.next) {
                nextTab = nav.next;
            } else if (nav.prev) {
                nextTab = nav.prev;
            } else {
                this._resetGroups();
                window.electron.ipcRenderer.sendMessage('ipc-get-default');
                return
            }
            window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', nextTab._getTabStatus());
        }
    }

    private _toogleActive(tab: TabElement) {
        this.tabs.forEach((t) => t._toogleActive(tab))
    }

    private _setFavIcon(arg: any) {
        let find:TabElement;
        return (find = this.tabs.get(arg.tabID)) ? find._setFavIcon(arg.favicons[0]) :null;
    }

    private _setTabTitle(arg: any) {
        const find = this.tabs.get(arg.tabID);
        if (find) {
            find._setTabTitle(arg.title);
        }
    }

    private _toogleLoading(args: any) {
        const find = this.tabs.get(args.tabID);
        this._log({ref: '_toogleLoading',args});
        find._toogleLoadingIcon()
    }

    private _log(options: LogElement) {
        options.className = this.constructor.name;
        return appLog(options);
    }

    connectedCallback() {
        this._log({message:'Is connected!', color:'#cc5'})
        window.electron.ipcRenderer.on('ipc-get-default', (args: any) => {
            this._log({ref: 'ipc-get-default',args,color:'#b6bcff'});
            this._initTabGroups(args);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (args: any) => {
            this._log({ref: 'ipc-close-tab', args,color:'#b6bcff'});
            this._closeTab(args)
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (args: any) => {
            this._log({ref: 'ipc-set-new-tab', args,color:'#b6bcff'});
            this._initNewTab(args)
        });
        window.electron.ipcRenderer.on('ipc-toogle-tab-active', (args: any) => {
            this._log({ref: 'ipc-toogle-tab-active', args,color:'#b6bcff'});
            this._toogleActive(args);
        })
        window.electron.ipcRenderer.on('ipc-page-favicon-updated', (args: any) => {
            //this._log({ref: 'ipc-page-favicon-updated', args,color:'#b6bcff' });
            this._setFavIcon(args);
        })
        window.electron.ipcRenderer.on('ipc-update-tab-title', (args: any) => {
            this._log({ref: 'ipc-update-tab-title', args,color:'#b6bcff'});
            this._setTabTitle(args);
        })
        window.electron.ipcRenderer.on('ipc-page-loading-start', (args: any) => {
            this._log({ref: 'ipc-page-loading-start', args,color:'#b6bcff'});
            this._toogleLoading(args);
        })
        window.electron.ipcRenderer.on('ipc-page-loading-stop', (args: any) => {
            this._log({ref: 'ipc-page-loading-stop', args,color:'#b6bcff'});
            this._toogleLoading(args);
        })
    }

}
customElements.define("tabs-bar", TabsGroupWrapper);