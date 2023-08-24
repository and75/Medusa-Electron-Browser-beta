// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload with contextIsolation enabled
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('appAPI', {
  setTitle: (title:string) => ipcRenderer.send('set-title', title)
})


