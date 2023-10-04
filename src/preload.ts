// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'; 
export type Channels = string;

const electronHandler = {
  webviewpreloadPath : ipcRenderer.sendSync('get-webviewpreload-path'),
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
    removeListener(channel: Channels, listener:any){
      ipcRenderer.removeListener(channel, listener);
    }
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

/**
 * Disable dragging and selecting html elements (like links, images etc...) 
 */
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());