import { Tab, TabsGroup } from './model';

const getDateTime = ()=>{
    return new Date().getTime();
}

const DefaultTab:Tab =  {
    id: '',
    time: getDateTime(),
    isReady : false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'Google',
      url: 'https://www.google.com/',
      icon:null,
      content:null
    },
}

//Default Tabs Group
const DefaultTabsGroup: TabsGroup = {
    time: getDateTime(),
    isActive:false,
    current: 1,
    tabs: [
      {
        id: '0',
        time : getDateTime(),
        isReady : false,
        isActive: false,
        isLoaded: false,
        current: {
          title: 'Google',
          url: 'https://www.google.com/',
          icon:null,
          content:null
        },
        history: []
      },
      {
        id: '1',
        time : getDateTime(),
        isReady : false,
        isActive: true,
        isLoaded: false,
        current: {
          title: 'Github',
          url: 'https://github.com/',
          icon:null,
          content:null
        },
        history: []
      },
      {
        id: '2',
        time : getDateTime(),
        isReady : false,
        isActive: false,
        isLoaded: false,
        current: {
          title: 'Electronjs',
          url: 'https://www.electronjs.org/',
          icon:null,
          content:null
        },
        history: []
      },
      {
        id: '3',
        time : getDateTime(),
        isReady : false,
        isActive: false,
        isLoaded: false,
        current: {
          title: 'MDN Web Docs',
          url: 'https://developer.mozilla.org/en-US/',
          icon:null,
          content:null
        },
        history: []
      },
      {
        id: '4',
        time : getDateTime(),
        isReady : false,
        isActive: false,
        isLoaded: false,
        current: {
          title: 'Duck Duck Go',
          url: 'https://duckduckgo.com/?q=pippo&t=h_&ia=web',
          icon:null,
          content:null
        },
        history: []
      }
    ]
  }

 function deleteTab(index:number){
    DefaultTabsGroup.tabs.splice(index, 1);
 }

  export const store = {
    getDefaultTab: ()=>{
        const tab = DefaultTab;
        if(DefaultTabsGroup.tabs.length>0){
            let nId = DefaultTabsGroup.tabs.length+1
            tab.id = nId.toString();
        }
        return tab;
    },
    getDefaultTabsGroup : DefaultTabsGroup,
  }