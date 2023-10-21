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
import { LoggerFactory, LoggerFactoryType } from "../logger";



export class TabsGroupWrapper extends HTMLElement {

    time: number
    isReady: boolean
    tabsWrapper: HTMLDivElement
    groupsWrapper: HTMLDivElement
    tabs: Map<string, TabElement>
    tabsGroups: TabsGroupElement[]
    private logger:LoggerFactoryType;
    

    get tabGroupList() {
        const items = this.shadowRoot.querySelectorAll(".group.open");
        const lastchild = items[items.length - 1].lastElementChild;
        return lastchild;
    }


    constructor() {
        super();
        this.tabsGroups = [];
        this.time = Date.now();
        this.isReady = false;
        this.tabs = new Map();
        this.logger= LoggerFactory(this.constructor.name)
        this.createElement();
    }

    createElement() {

        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

        // Create wrapper and first tab
        const tabsWrapper = document.createElement("div");
        tabsWrapper.setAttribute("class", "tabs");
        this.tabsWrapper = tabsWrapper;

        //Add menu container
        const tabsActionMenu = document.createElement("div");
        tabsActionMenu.setAttribute("class", "action-menu");

        //Add new tab button
        const buttonNewTab = tabsActionMenu.appendChild(document.createElement('div'));
        buttonNewTab.setAttribute("class", "item new-tab");
        const newIcon = document.createElement('img');
        newIcon.setAttribute("class", "favicon plus");
        newIcon.setAttribute('src', plusSvg);
        buttonNewTab.appendChild(newIcon);
        buttonNewTab.addEventListener('click', this._handleNewTab.bind(this), false)

        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            :host {
                padding: 0 var(--default-spacing);
                background: var(--light-grey);
                display: flex;
                gap: var(--default-spacing);
                align-items:center;
                height: 41px;
            }         
            .tabs {
                fex:auto;
                display: flex;
                align-items:center;
                height: 41px;
            }
            .group{
                display:flex;
                align-items:center;
                margin: 0 5px;
                gap: 5px;
            }
            .group .label{
                flex: auto;
                max-width: 77px;
                overflow: hidden;
                padding: 5px 5px;
                border-radius: 3px;
                color: var(--white);
                font-size: 10px;
                text-align: start;
                font-weight: 600;
                letter-spacing: 0.5px;
                white-space: nowrap;
                text-overflow: ellipsis;
                text-transform: uppercase;
                cursor: pointer;
            }
            .group .tab-list{
                display:none;
                list-style-type: none;
                margin: 0;
                padding: 0;
            }
            .group.open .tab-list{
                display:flex
            }
            
            .tab-list .item{
                flex: 1;
                display:flex;
                align-items:center;
                gap:var(--default-spacing);
                background:var(--grey);
                padding: 7px var(--default-spacing) 9px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-right: 1px solid var(--dark-grey);
                cursor: pointer;
                margin-top: 1px;
                max-width: 180px;
            }
            .tab-list .item.active,
            .tab-list .item:hover{
                background: #ffffff;
            }
            .action-menu {
                display: flex;
                gap: 10px;
                align-items:center;
                height: 41px;
            }
            .action-menu .item{
                display: flex;
                justify-content: center;
                padding: 2px 2px 3px;
                border-radius: var(--brd-radius-round);
                cursor: pointer;
                height: 20px;
                width: 20px;
                align-items: center;
            }
            .action-menu .item:hover{
                background: var(--grey);
            }
            .action-menu .item img{
                width:14px;
                opacity: 0.5;
            }
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, tabsWrapper, tabsActionMenu);

    }

    private _toogleOpenGroup(event: any) {
        const target = event[0];
        target.parentElement.classList.toggle('open');
    }

    private _initTabGroups(arg: TabsGroupElement[]) {

        arg.map((el) => {
            const groupWrapper = document.createElement('div');
            groupWrapper.setAttribute("class", "group open");
            groupWrapper.setAttribute("id", "group-" + el.id);
            const groupLabel = document.createElement('div');
            groupLabel.setAttribute("class", "label");
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
                const newTab = this._initTab(t) as TabElement;
                tabList.append(newTab);
                this.tabs.set(t.id, newTab);
            })
            groupWrapper.appendChild(tabList);
            this.tabsWrapper.appendChild(groupWrapper);
        })
    }

    private _toogleOpenMenu(e: PointerEvent) {
        this.logger.logAction('_toogleOpenMenu')
        const { clientX, clientY } = e;
        window.electron.ipcRenderer.sendMessage('ipc-open-contextmenu', { clientX, clientY, type: 'tabbar-group' })
    }

    private _resetGroups() {
        const find = this.tabsWrapper.querySelectorAll('.group')
        find.forEach(el => {
            this.tabsWrapper.removeChild(el);
        })
    }

    private _initNewTab(arg: TabStatus) {
        arg.isActive = true;
        const newTab = this._initTab(arg) as TabElement;
        this.tabsWrapper.append(newTab);
        this.tabs.set(arg.id, newTab);
        return newTab;
    }

    private _initTab(arg: TabStatus): HTMLElement {
        const tab = new Tab();
        tab.initTab(arg);
        return tab;
    }

    private _getNext(id: string) {
        const tabArray = [...this.tabs];
        const index = tabArray.findIndex((el) => el[0] === id);
        const go =  {
            next: (tabArray[index + 1]) ? tabArray[index + 1][1] : null,
            prev: (tabArray[index - 1]) ? tabArray[index - 1][1] : null
        }
        this.logger.logAction('_getNext', go)
        return go;
    }

    private _closeTab(args: any) {
        try {
            this.logger.logAction('_closeTab', 'tabID : '+args.id)
            const find = this.tabs.get(args.id)
            const getTabNav = this._getNext(args.id);
            find._closeTab();
            this.tabs.delete(args.id);
            this._toogleNextActive(args, getTabNav);
        } catch (error) {
            console.error('TabsGroupWrapper _closeTab', error);
        }
    }

    private _handleNewTab(this: any) {
        this.logger.logAction('_handleNewTab')
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
            nextTab._handleActiveTab();
        }
    }

     _setFavIcon(arg: any) {
        const find = this.tabs.get(arg.tabID) as TabElement | null
        return (find) ? find._setFavIcon(arg.favicons[0]) : null;
    }

    private _setTabTitle(arg: any) {
        const find = this.tabs.get(arg.tabID);
        if (find) {
            find._setTabTitle(arg.title);
        }
    }

    private _toogleLoading(args: any) {
        const find = this.tabs.get(args.tabID);
        this.logger.logAction('_toogleLoading', args)
        find._toogleLoadingIcon()
    }

    connectedCallback() {
        this.logger.log('Is connected!')
        window.electron.ipcRenderer.on('ipc-get-default', (args: any) => {
            this.logger.logIpc('ipc-get-default', args);
            this._initTabGroups(args);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (args: any) => {
            this.logger.logIpc('ipc-close-tab', args)
            this._closeTab(args)
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (args: any) => {
            this.logger.logIpc('ipc-set-active-tab', args)
            this._initNewTab(args)
        });
        window.electron.ipcRenderer.on('ipc-page-favicon-updated', (args: any) => {
            //this.logger.logIpc('ipc-page-favicon-updated', args)
            this._setFavIcon(args);
        })
        window.electron.ipcRenderer.on('ipc-update-tab-title', (args: any) => {
            this.logger.logIpc('ipc-update-tab-title', args)
            this._setTabTitle(args);
        })
        window.electron.ipcRenderer.on('ipc-page-loading-start', (args: any) => {
            this.logger.logIpc('ipc-page-loading-start', args)
            this._toogleLoading(args);
        })
        window.electron.ipcRenderer.on('ipc-page-loading-stop', (args: any) => {
            this.logger.logIpc('ipc-page-loading-stop', args)
            this._toogleLoading(args);
        })
    }

}
customElements.define("tabs-bar-wrapper", TabsGroupWrapper);