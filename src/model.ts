/**
 * Medusa browser beta
 * @interfaces Inteface model declaration
 * @description On this file we declare the interfaces used on application
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { WebviewTag } from "electron";

export interface LogElement {
    className?:string
    ref?:string
    message?:string
    args?: any
    color?:string
}

export interface DATASettingsType {
    searchEngineUrl:string
    defaultTab:TabStatus
}
export type DATATabsType = TabStatus[]

export interface HistoryElement {
    id?:number,
    tabId?:string,
    time?:number,
    title: string
    icon: string
    url: string | null
    content: string | null
}

export interface TabElement extends HTMLElement{
    id: string
    groupId?: string
    time: number
    isActive: boolean
    isClosed?: boolean
    onLoading: boolean
    current: HistoryElement
    element?:HTMLElement
    _setFavIcon?:any
    _setTabTitle?:any
    _toogleLoadingIcon?:any
    _getTabElement?:any
    _getTabStatus?:any
    _toogleActive?:any
    _closeTab?:any
}

export interface TabStatus{
    id: string
    groupId?: string
    time: number
    isActive: boolean
    isClosed: boolean
    onLoading: boolean
    url:string
    favIcon:string
    current: HistoryElement
}

export interface TabsGroupElement {
    id : string
    time: number
    title : string
    current: HistoryElement
    color:string
    isActive: boolean
    tabs: TabStatus[]
}

export interface TabsBarWrapperElement {
    wrapper:HTMLDivElement
    tabsGroups :TabsGroupElement[]
}

export interface NavMenuElement extends HTMLElement{
    wrapper:HTMLUListElement
    backIcon: HTMLImageElement;
    forwardIcon: HTMLImageElement;
    reloadIcon: HTMLImageElement;
    webview:WebviewTag
    canGoBack:boolean
    canGoForward:boolean
    canReload:boolean
    _initNav:any
    _updateWebView:any
    _setStatus:any
    _goBack:any
    _goForward:any
    _reload:any
    _reset:any;
}

export interface AddressBarElement extends HTMLElement{
    url:string;
    bookmark: HTMLLIElement
    formAction:HTMLFormElement
    formInput:HTMLInputElement
    _setWebView:any;
}

export interface PanelMenuElement extends HTMLElement{
    bookmark: HTMLLIElement
    notes: HTMLLIElement
    history: HTMLLIElement
    settings: HTMLLIElement
    devtools: HTMLLIElement
    webview: WebviewTag | null
    _setWebView:any;
}

export interface Panel extends HTMLElement {
    search: HTMLDivElement  | null
    searchForm: HTMLFormElement  | null
    searchInput: HTMLInputElement  | null
    content: HTMLDivElement  | null
    webview: WebviewTag | null
    _setWebView:any
}

export interface WebViewElement {
    id: string;
    tabId : string;
    time:number;
    isReady: boolean;
    isActive: boolean;
    isLoaded: boolean;
    cache: string;
    element: WebviewTag;
}