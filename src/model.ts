/**
 * Medusa browser beta
 * @interfaces Inteface model declaration
 * @description On this file we declare the interfaces used on application
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { WebviewTag } from "electron";
export interface DATASettingsType {
    searchEngineUrl:string
    defaultTab:TabElement
}
export type DATATabsType = TabElement[]

export interface HistoryElement {
    id?:number,
    tabId?:string,
    time?:number,
    title: string
    icon: string
    url: string | null
    content: string | null
}

export interface TabElement {
    id: number
    groupId?: number
    time: number
    isActive: boolean
    isClosed: boolean
    current: HistoryElement
    element?:HTMLElement
    _getTabElement?:any
    _getTabStatus?:any
    _toogleActive?:any
}

export interface TabsGroupElement {
    id : number
    time: number
    title : string
    current: HistoryElement
    color:string
    isActive: boolean
    tabs: TabElement[]
}

export interface TabsBarWrapperElement {
    wrapper:HTMLDivElement
    tabsGroups :TabsGroupElement[]
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