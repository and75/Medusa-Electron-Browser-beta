import { TabElement, TabsGroupElement, DATATabsType, DATASettingsType } from './model';

const getDateTime = () => {
  return new Date().getTime();
}

const DATASettings: DATASettingsType = {
  searchEngineUrl: "https://duckduckgo.com/?q=",
  defaultTab: {
    id: 0,
    groupId: 0,
    time: getDateTime(),
    isReady: false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'Google',
      url: 'https://www.google.com/',
      icon: null,
      content: null
    }
  }
}

const DATATabs: DATATabsType = [
  {
    id: 1,
    groupId: 1,
    time: getDateTime(),
    isReady: false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'Github',
      url: 'https://github.com/',
      icon: null,
      content: null
    },
    history: []
  },
  {
    id: 2,
    groupId: 2,
    time: getDateTime(),
    isReady: false,
    isActive: true,
    isLoaded: false,
    current: {
      title: 'Github',
      url: 'https://github.com/',
      icon: null,
      content: null
    },
    history: []
  },
  {
    id: 3,
    groupId: 2,
    time: getDateTime(),
    isReady: false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'Electronjs',
      url: 'https://www.electronjs.org/',
      icon: null,
      content: null
    },
    history: []
  },
  {
    id: 4,
    groupId: 2,
    time: getDateTime(),
    isReady: false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/',
      icon: null,
      content: null
    },
    history: []
  },
  {
    id: 5,
    groupId: 1,
    time: getDateTime(),
    isReady: false,
    isActive: false,
    isLoaded: false,
    current: {
      title: 'Duck Duck Go',
      url: 'https://duckduckgo.com/?q=pippo&t=h_&ia=web',
      icon: null,
      content: null
    },
    history: []
  }
]
//Default Tabs Group
const DefaultTabsGroups: TabsGroupElement[] =
  [

    {
      id : 1,
      time: getDateTime(),
      isActive: false,
      title: 'Search',
      current: {
        title: 'Google',
        url: 'https://www.google.com/',
        icon: null,
        content: null
      },
      tabs: []
    },
    {
      id : 2,
      time: getDateTime(),
      isActive: false,
      title: 'Js documentation',
      current: {
        title: 'Google',
        url: 'https://www.google.com/',
        icon: null,
        content: null
      },
      tabs: []
    }
  ]


export const store = {
  DefaultTabsGroups: DefaultTabsGroups,
  Tabs : DATATabs,
  getDefaultTab: () => {
    const tab = DATASettings.defaultTab;
    if (DATATabs.length > 0) {
      tab.id = DATATabs.length+1;
    }
    return tab;
  },
  getTabsGroups : ()=>{
    const TabsGroups = DefaultTabsGroups.map((el)=>{
       let elTabs = DATATabs.filter(t=>t.groupId==el.id) 
       el.tabs = elTabs
       return el
    })
    return TabsGroups;
  }

}