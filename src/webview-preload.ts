/**
 * Medusa browser beta
 * @description Webview preload script
 * @author Andrea Porcella
 * @copyright Andrea Porcella / Bellville-system 2023
 */

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
export type Channels = string;

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
  }
};

contextBridge.exposeInMainWorld('electron', electronHandler);



/**
 * Disable dragging and selecting html elements (like links, images etc...) 
 */
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());


document.addEventListener('DOMContentLoaded', () => {

  console.log('👋 This message is being logged by "webview-preload.ts", included via webpack');
  console.log('👋 window DOMContentLoaded', document.readyState);
  //console.log('DOMContentLoaded', document)

  ipcRenderer.on('ipc-request-webview-info', (args) => {
    const data = {
      title: document.title,
      url: document.URL,
      description: (document.querySelector('meta[name="description"]')) ? document.querySelector('meta[name="description"]').getAttribute('content'): null,
      body: document.querySelector('body').innerHTML
    }
    ipcRenderer.sendToHost('pong', data)
  });

  document.addEventListener('click', event => {
    console.log('stocazzo');
    ipcRenderer.sendToHost('ipc-hide-contextmenu');
  });

  document.querySelectorAll('a[target="_blank"]').forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault()
      console.log('click')
    })
  })

  document.addEventListener("contextmenu", (e) => {
    console.log('contextmenu', e)
  });

})

document.addEventListener("DOMContentLoaded", function (event) {
  console.log('👋 Document DOMContentLoaded');
});
window.addEventListener('beforeunload', function(event) {
  ipcRenderer.removeAllListeners('ipc-request-webview-info');
});
