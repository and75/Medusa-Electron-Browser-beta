/**
 * Medusa browser beta
 * @component TabsGroupWrapper
 * @description This component manage the wrapper of TabsGroups
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { plusSvg } from "./Img";
import { TabElement, TabsGroupElement } from '../model';
import { Tab } from "./Tab";



export class TabsGroupWrapper extends HTMLElement {

    time: number
    isReady: boolean
    tabsWrapper: HTMLDivElement
    tabs: TabElement[]
    tabsGroups : TabsGroupElement[]


    get tabGroupList() {
        let items = this.shadowRoot.querySelectorAll(".group-wrapper.open");
        var lastchild = items[items.length-1].lastElementChild;
        return lastchild;
    }


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
        this.tabsWrapper = tabsWrapper;

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
            .tabs-wrapper .new-tab:hover img{
                opacity: 1;
            }
            .tabs-wrapper .tab-list .item img.favicon{
                width:14px;
                opacity: 0.5;
            }
            .tabs-wrapper .tab-list .item.loading img.favicon{
                display:none;
            }
            .tabs-wrapper .tab-list .item img.favicon.loading{
                display:none;
            }
            .tabs-wrapper .tab-list .item.loading img.favicon.loading{
                display: block;
                animation: rotate 1.5s linear infinite;
            }
            @keyframes rotate{
                100% {
                  transform: rotate(360deg);
                }
              }

            .tabs-wrapper .tab-list .item img.close-tab{
                width:12px;
                opacity: 0.5;
            }
            .tabs-wrapper .tab-list .item img.close-tab:hover{
                opacity:1;
            }
            .tabs-wrapper .tab-list .item span.title{
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

    private generateRandomColor(){
        let maxVal = 0xFFFFFF; // 16777215
        let randomNumber = Math.random() * maxVal; 
        randomNumber = Math.floor(randomNumber);
        let randomString = randomNumber.toString(16);
        let randColor = randomString.padStart(6, randomString);   
        return `#${randColor.toUpperCase()}`
    }

    private toogleOpenGroup(event:any){
        let target = event[0];
        target.parentElement.classList.toggle('open');
    }

    private initTabGroups(arg:TabsGroupElement[]){

        arg.map((el) => {
     
            const groupWrapper = document.createElement('div');
            groupWrapper.setAttribute("class", "group-wrapper  open");
            groupWrapper.setAttribute("id", "group-"+el.id);
            
            const groupLabel = document.createElement('div');
            groupLabel.setAttribute("class", "group-label");
            groupLabel.setAttribute("style", "background-color:"+el.color);
            groupLabel.innerText=el.title;
            groupWrapper.appendChild(groupLabel);
            groupLabel.onclick = (event) => {
                this.toogleOpenGroup(event.composedPath());
            };
            groupLabel.oncontextmenu =  this.toogleOpenMenu.bind(this);
    
            const tabList = document.createElement("div");
            tabList.setAttribute("class", "tab-list");
            groupWrapper.appendChild(tabList);

            el.tabs.map((t)=>{
                const newTab = this.initTab(t);
                tabList.append(newTab._getTabElement());
                this.tabs.push(newTab);
            })

            this.tabsWrapper.appendChild(groupWrapper);

        })

        //Add new tab button
        const buttonNewTab = this.tabsWrapper.appendChild(document.createElement('div'));
        buttonNewTab.setAttribute("class", "new-tab");
        const newIcon = document.createElement('img');
        newIcon.setAttribute("class", "favicon plus");
        newIcon.setAttribute('src', plusSvg);
        buttonNewTab.appendChild(newIcon);
        buttonNewTab.addEventListener('click', this.handleNewTab.bind(this), false)
    }

    private toogleOpenMenu(e:PointerEvent){
        const { clientX, clientY } = e;
        window.electron.ipcRenderer.sendMessage('ipc-open-contextmenu', {clientX, clientY, type:'tabbar-group'}) 
    }

    private resetGroups(){
        let find =this.tabsWrapper.querySelectorAll('.group-wrapper')
        find.forEach(el=>{
            this.tabsWrapper.removeChild(el);
        })
    }

    private initNewTab(arg:TabElement){
        const newTab = this.initTab(arg);
        this.tabGroupList.append(newTab._getTabElement());
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
        find.tab._closeTab(this.tabsWrapper);
        this.toogleNext(arg, find);
        this.tabs.splice(find.index, 1);
    }

    private handleNewTab(this: any) {
        console.log('handleNewTab', this)
        window.electron.ipcRenderer.sendMessage('ipc-set-new-tab');
    }

    private toogleNext(arg: any, find: any){
        let nextTab: TabElement;
        if (arg.isActive) {
            if (find.index == 0 && this.tabs.length == 1) {
                this.resetGroups();
                window.electron.ipcRenderer.sendMessage('ipc-get-default');
            } else {
                if ((this.tabs.length - 1) == find.index) {
                    nextTab = this.tabs[find.index - 1]
                }
                else {
                    nextTab = this.tabs[find.index + 1]
                }
                window.electron.ipcRenderer.sendMessage('ipc-toogle-tab-active', nextTab._getTabStatus());
            }
        }
    }

    private toogleActive(tab: TabElement) {
       this.tabs.map((t)=>t._toogleActive(tab))
    }

    connectedCallback() {
        console.log('TabGroupsWrapper is connected!')
        window.electron.ipcRenderer.on('ipc-get-default', (arg: any) => {
            console.log('TabGroupsWrapper ipc-get-default', arg)
            this.initTabGroups(arg);
        });
        window.electron.ipcRenderer.on('ipc-close-tab', (arg: any) => {
            this.closeTab(arg)
        });
        window.electron.ipcRenderer.on('ipc-set-new-tab', (arg: any) => {
            console.log('TabGroupsWrapper ipc-set-new-tab', arg)
            this.initNewTab(arg)
        });
        window.electron.ipcRenderer.on('ipc-toogle-tab-active', (arg: any) => {
            console.log('TabGroupsWrapper ipc-toogle-tab-active', arg)
            this.toogleActive(arg);
        })
    }
    
}
customElements.define("tabs-bar", TabsGroupWrapper);