/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
//Import webviewtag type definiton
import { WebviewTag } from 'electron';


//Import app elements
import './index.css';
import './components/tabs-bar';
import './components/nav-bar';
import './components/webview';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

document.addEventListener("DOMContentLoaded", (event) => {

    const indicator = document.querySelector('.app-indicator');
    const tabActive = document.querySelector('.tabs-wrapper')
    console.log('stocazzo : ', tabActive)
    const webview:WebviewTag = document.querySelector('webview');
    webview.addEventListener('did-start-loading', () => {
        //let url = webview.getURL();
        console.log('did-start-loading')
        indicator.innerHTML = 'Loading..'
    })
    webview.addEventListener('did-stop-loading', () => {
        indicator.innerHTML = ' ';
    })
    webview.addEventListener('dom-ready', () => {
        let title = webview.getTitle();
        let url = webview.getURL();
        /*webview.openDevTools()*/
        console.log(title, url);
    })
});
