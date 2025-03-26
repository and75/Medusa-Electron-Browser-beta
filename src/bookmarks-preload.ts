/**
* Medusa browser beta
* @description Bookmarks preload process
* @author Andrea Porcella
* @copyright Andrea Porcella / Bellville-system 2023
*/

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
export type Channels = string;

/**
 * Set electronHandler to comunicate with render
 */
const electronHandler = {
    ipcRenderer: {
        sendMessage(channel: Channels, ...args: unknown[]) {
            ipcRenderer.send(channel, ...args);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
            const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
            ipcRenderer.on(channel, subscription);
            return subscription;
        },
        once(channel: Channels, func: (...args: unknown[]) => void) {
            ipcRenderer.once(channel, (_event, ...args) => func(...args));
        },
        removeListener(channel: Channels, listener: any) {
            ipcRenderer.removeListener(channel, listener);
        },
        handleCounter: (callback:()=>void) => ipcRenderer.on('store-data', callback)
    }
};
contextBridge.exposeInMainWorld('electron', electronHandler);

document.addEventListener('DOMContentLoaded', () => {
    console.log('👋 Document DOMContentLoaded', document.readyState);
    console.log('👋 This message is being logged by "bookmarks-preload.ts", included via webpack');
    document.addEventListener("contextmenu", (e) => {
        console.log('contextmenu', e);
    });
    electronHandler.ipcRenderer.on('bookmark-infos', (args)=>{
        console.log('bookmark-infos', args);
    })
})
