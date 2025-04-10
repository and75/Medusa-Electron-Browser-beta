/**
 * Medusa browser beta
 * @description Store
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { TabElement, TabsGroupElement, DATATabsType, DATASettingsType } from './model';

const getDateTime = () => {
  return new Date().getTime();
}
const DATAColors :string[] = [
  '#9575CD', 'var(--primary)','#5E35B1','#512DA8','#4527A0','#311B92','#B388FF','#7C4DFF','#651FFF','#6200EA'
]
const DATASettings: DATASettingsType = {
  searchEngineUrl: "https://duckduckgo.com/?q=",
  defaultTab: {
    id: '0',
    groupId: '0',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
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
    id: '1',
    groupId: '1',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'Google',
      url: 'https://www.google.com/',
      icon: null,
      content: null
    }
  },
  {
    id: '2',
    groupId: '2',
    time: getDateTime(),
    isActive: true,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'Github',
      url: 'https://github.com/',
      icon: null,
      content: null
    }
  },
  {
    id: '3',
    groupId: '2',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'Electronjs',
      url: 'https://www.electronjs.org/',
      icon: null,
      content: null
    }
  },
  {
    id: '4',
    groupId: '2',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/',
      icon: null,
      content: null
    }
  },
  {
    id: '5',
    groupId: '1',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'Duck Duck Go',
      url: 'https://duckduckgo.com/?q=fender&t=h_&ia=web',
      icon: null,
      content: null
    },
  },
  {
    id: '6',
    groupId: '1',
    time: getDateTime(),
    isActive: false,
    isClosed: false,
    onLoading:false,
    url:'',
    favIcon : '',
    current: {
      title: 'Il Sole 24 ore',
      url: 'https://www.ilsole24ore.com/',
      icon: null,
      content: null
    },
  }
  
]
//Default Tabs Group
const DefaultTabsGroups: TabsGroupElement[] =
  [

    {
      id : '1',
      time: getDateTime(),
      isActive: false,
      title: 'Search',
      color:'var(--primary-light)',
      current: {
        title: 'Google',
        url: 'https://www.google.com/',
        icon: null,
        content: null
      },
      tabs: []
    },
    {
      id : '2',
      time: getDateTime(),
      isActive: false,
      title: 'Js documentation',
      color:'#7C4DFF',
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
      const nextID =  DATATabs.length+1
      tab.id = nextID.toString();
    }
    return tab;
  },
  getTabsGroups : ()=>{
    const TabsGroups = DefaultTabsGroups.map((el)=>{
       const elTabs = DATATabs.filter(t=>t.groupId==el.id) 
       el.tabs = elTabs
       return el
    })
    return TabsGroups;
  }

}