/**
* Medusa browser beta
* @description Electron main process
* @author Andrea Porcella
* @copyright Andrea Porcella / Bellville-system 2023
*/

import { app, BrowserWindow, ipcMain, session } from 'electron';
import { store } from './store';
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const WEBVIEW_PRELOAD_WEBPACK_ENTRY: string;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}


const createWindow = (): void => {


  // //Query all cookies.
  // session.defaultSession.cookies.get({})
  //   .then((cookies) => {
  //     //console.log(cookies)
  //   }).catch((error) => {
  //     //console.log(error)
  //   })
    
  // // Modify the user agent for all requests to the following urls.
  // const filter = {
  //   urls: ['*://*/*'] 
  // }
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   //details.requestHeaders['User-Agent'] = 'MyAgent'
  //   console.log(details.referrer)
  //   callback({ requestHeaders: details.requestHeaders })
  // })

  ipcMain.on('get-webviewpreload-path', (e) => {
    e.returnValue = WEBVIEW_PRELOAD_WEBPACK_ENTRY;
  });
  ipcMain.on('ipc-get-default', async (event, arg) => {
    const reply = store.getTabsGroups();
    event.reply('ipc-get-default', reply);
  });
  ipcMain.on('ipc-set-active-tab', async (event, arg) => {
    event.reply('ipc-set-active-tab', arg);
  });
  ipcMain.on('ipc-toogle-tab-active', async (event, arg) => {
    event.reply('ipc-toogle-tab-active', arg);
  });
  ipcMain.on('ipc-close-tab', async (event, arg) => {
    //console.log('ipc-close-tab', arg)
    event.reply('ipc-close-tab', arg);
  });
  ipcMain.on('ipc-set-new-tab', async (event, arg) => {
    event.reply('ipc-set-new-tab', store.getDefaultTab())
  })

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      webviewTag: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


