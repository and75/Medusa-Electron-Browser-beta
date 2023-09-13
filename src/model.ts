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
    isReady : boolean
    isActive: boolean
    isLoaded: boolean
    current: HistoryElement
    history?: HistoryElement[]
    getTabElement?:any
    getTabStatus?:any
    toogleActive?:any
}

export interface TabsGroupElement {
    id : number
    time: number
    title : string
    current: HistoryElement;
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