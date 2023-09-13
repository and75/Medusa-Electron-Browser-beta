// import { plusSvg } from "./Img";
// import { HistoryElement, TabElement, TabsBarWrapperElement, TabsGroupElement } from '../model';
// import { Tab } from "./Tab";
// import { on, emit } from '../core'

// class TabsGroup extends EventTarget {

//     time: number
//     title : string
//     isActive: boolean
//     tabs: TabElement[]
//     current : HistoryElement;
//     element : HTMLUListElement;
//     wrapper : HTMLDivElement;

//     constructor(options:TabsGroupElement){
        
//         super();
        
//         this.time =  options.time;
//         this.title = options.title;
//         this.isActive =  options.isActive;
//         this.tabs = options.tabs;
//         this.current = options.current

//     }

//     createGroupElement(arg:TabsGroupElement){
//         //this.element = document.create
//     }

//     private initTabGroups(arg:TabsGroupElement){
//         arg.tabs.map((el) => {
//             const newTab = this.initTab(el);
//             this.element.append(newTab.getTabElement());
//             this.tabs.push(newTab);
//         })
//     }

//     private initNewTab(arg:TabElement){
//         const newTab = this.initTab(arg);
//         this.element.append(newTab.getTabElement());
//         this.tabs.push(newTab);
//         this.toogleActive(newTab);
//     }

//     private initTab(arg: TabElement):TabElement{
//         let tab = new Tab(arg);
//         return tab;
//     }

//     private toogleActive(tab:TabElement){

//     }





// }
