/**
 * Medusa browser beta
 * @component ContextMenu
 * @description Add ContextMenu component
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import {
    DevToolsSvg,
    plusSvg,
    saveSvg,
    folderMinusSvg,
    OpenLinkSvg,
    OpenOnNewWinSvg,
    CopySvg,
    TabsGroupSvg,
    findSvg,
    clipboardSvg,
    ClipBoardAltSvg,
    arrowLeft,
    arrowRight,
    arrowRotate
} from "./Img";
import { LoggerFactory, LoggerFactoryType } from "./../logger";
import { ContextMenuEvent } from "electron";

export class ContextMenu extends HTMLElement {

    menu: HTMLElement
    logger: LoggerFactoryType

    set visible(value: boolean) {
        if (value) { this.setAttribute('visible', '') }
        else { this.removeAttribute('visible') }
    }
    constructor() {
        super();

        // Set logger
        this.logger = LoggerFactory(this.constructor.name);

        // Create a shadow root
        this.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        style.textContent = `
        :host{
            display:flex;
            visibility: hidden;
            position: absolute;
            font-size: 14px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 2px 3px 6px #898989;
            box-sizing: var(--box-sizing);
            color:var(--black);
            padding: var(--default-spacing) 0;
            z-index: 100;
        }
        :host * {
            box-sizing: var(--box-sizing);
        }
        :host([large]){
            width: 25vw;
            height:auto;
            font-size: 12px;
        }
        :host([visible]){
            /*display:flex !important;*/
            visibility: visible;
        }
        .item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap:var(--default-spacing);
            min-width: 200px;
            max-width: 350px;
            border-radius:0;
            padding: 5px var(--default-spacing) 5px;
            transition: var(--transition-all);
            cursor:pointer;
        }
        .item img{
            width: 14px;
            opacity: 0.6;
        }
        .item span{
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.2;
        }
        .item:hover {
            background:#dedede;
            color:000;
        }
        .item:hover img{
            opacity: 1;
        }
        `;

        this.shadowRoot.append(style);
    }

    _setMenuByType(arg: any) {

        if (this.shadowRoot.querySelector('.list')) {
            this.shadowRoot.removeChild(this.shadowRoot.querySelector('.list'));
        }

        switch (arg.type) {
            case 'tabbar-group': {
                const menu = document.createElement('div');
                menu.setAttribute('class', 'list');
                const add = this._createMenuItem('Add new tab on group', plusSvg)
                const save = this._createMenuItem('Save group', saveSvg)
                const deleteG = this._createMenuItem('Delete group', folderMinusSvg)
                menu.append(add, save, deleteG);
                menu.oncontextmenu = () => { this.visible = null }
                this.shadowRoot.append(menu);
                break;
            }
            case 'webview': {
                const menu = document.createElement('div');
                menu.setAttribute('class', 'list large');

                if (!arg.params.linkText && !arg.params.selectionText) {
                    menu.append(this._createMenuItem('Go back', arrowLeft));
                    menu.append(this._createMenuItem('Go forward', arrowRight));
                    menu.append(this._createMenuItem('Refresh this page', arrowRotate));
                    menu.append(document.createElement('hr'));
                }
                if (arg.params.linkText) {
                    menu.append(this._createMenuItem('Open link in new tab', OpenLinkSvg));
                    menu.append(this._createMenuItem('Open link in new tab on this group', TabsGroupSvg));
                    menu.append(this._createMenuItem('Open link in new windows ', OpenOnNewWinSvg));
                    menu.append(this._createMenuItem('Copy the address of the link', CopySvg));
                    menu.append(document.createElement('hr'));
                } 
                else if (arg.params.selectionText) {
                    menu.append(this._createMenuItem('Search ..."' + arg.params.selectionText + '" on web', findSvg));
                    menu.append(this._createMenuItem('Create new note', clipboardSvg));
                    menu.append(this._createMenuItem('Add on active note', ClipBoardAltSvg));
                    menu.append(document.createElement('hr'));
                }
                else {
                    menu.append(this._createMenuItem('Open page in new tab', OpenLinkSvg));
                    menu.append(this._createMenuItem('Open page in new tab on this group', TabsGroupSvg));
                    menu.append(this._createMenuItem('Open page in new windows ', OpenOnNewWinSvg));
                    menu.append(document.createElement('hr'));
                }
                
                menu.append(this._createMenuItem('Inspect', DevToolsSvg));
                menu.oncontextmenu = () => { this.visible = null }
                this.shadowRoot.append(menu);
                break;
            }
            default: {
                this.logger.logError('_setMenuByType', `ContextMenu Sorry _setMenuByType : we are out of ${arg.type}.`)
            }
        }
    }

    _createMenuItem(text: string, icon: string) {
        const item = document.createElement('div');
        item.setAttribute('class', 'item');
        const itemIcon = item.appendChild(document.createElement('img'));
        itemIcon.setAttribute('src', icon)
        const itemSpanText = item.appendChild(document.createElement('span'));
        itemSpanText.innerText = text;
        return item;
    }
    
    setContextMenuPostion(e:ContextMenuEvent) {

        const mouse:any = {
            x:e.params.x,
            y:e.params.y
        };

        const menuPostion = mouse;

        const menuDimension:any = {
            x:this.offsetWidth,
            y:this.offsetHeight
        };
        
        const parentDimension:any = {
            x:window.outerWidth-50,
            y:window.outerHeight-60
        };        

        if (mouse.x + menuDimension.x >= parentDimension.x) {
            menuPostion.x = parentDimension.x - menuDimension.x;
        } 

        if (mouse.y + menuDimension.y >= parentDimension.y) {
            menuPostion.y = parentDimension.y - menuDimension.y;
        }
    
        this.logger.logAction('normalizePozition', mouse, parentDimension, menuDimension);

        return menuPostion;
    
    }


    _setPosition(arg: any) {
        const pos = this.setContextMenuPostion(arg);
        this.logger.logAction('_setPosition', pos)
        this.setAttribute('style', `top:${pos.y}px; left:${pos.x}px`)
        this.classList.add('visible')
    }

    connectedCallback() {
        this.logger.log('Is connected!')
        // calling IPC exposed from preload script

        window.electron.ipcRenderer.on('ipc-open-contextmenu', (args: any) => {
            this.logger.logIpc('ipc-open-contextmenu', args)
            this._setMenuByType(args);
            this._setPosition(args);
            this.visible = true;
        });

        window.electron.ipcRenderer.on('ipc-hide-context-menu', (args: any) => {
            this.logger.logIpc('ipc-hide-context-menu', args)
            this.visible = false;
        });
    }
}
customElements.define("context-menu", ContextMenu);