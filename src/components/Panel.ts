
import { WebviewTag } from "electron";
import { bookmarkSvg, clipboardSvg, clockRotateLeft, slidersSvg, xmarkSvg, findSvg } from "./Img";
import { LogElement } from "./../model";
import { appLog } from "./../core";
export class Panel extends HTMLElement {


   search: HTMLDivElement | null;
   searchForm: HTMLFormElement | null;
   searchInput: HTMLInputElement | null;
   content: HTMLDivElement | null;
   webview: WebviewTag | null


   constructor() {

      super();

      this.webview = null;

      // Create a shadow root
      this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

      const style = document.createElement("style");
      style.textContent = `
      :host {
         all: unset;
         display:block;
         width: calc(100vw - 70vw);
         padding: 15px 10px;
         box-sizing: border-box;
         line-height: 0;
      }
      .card {
         width: 100%;
         background: #fff;
         padding: 15px 0;
         border-radius: 10px;
         height: calc(100vh - 175px);
         box-shadow: 0px 0px 4px #cfcfcf;
      }
      .card-header {
         display:flex;
         align-items:center;
         gap: 10px;
         font-size: 14px;
         font-weight: 600;
         color: #8f8f8f;
         text-transform: uppercase;
         border-bottom: 1px solid #cccc;
         padding: 0 15px 15px;
      }
      .card-header .icon{
         height: 20px;
         opacity: 0.4;
      }
      .card-header .title{
         flex:auto
      }
      .card-header ul.action-menu{
         all: unset;
         display:flex;
         align-items:center;
         gap: 10px;
         list-style:none;
      } 
      .card-header ul.action-menu li{
         all: unset;
         flex:1
      }
      .card-header ul.action-menu li img{
         all: unset;
         width: 16px;
         opacity: 0.5;
         cursor: pointer;
      }
      .card-search-box{
         all: unset;
         display: flex;
         align-items: center;
         gap: 10px;
         padding: 5px 10px;
         border: 1px solid #ccc;
         border-radius: 10px;
         margin: 15px;
      } 
      .card-search-box img{
         height: 14px;
         opacity: 0.4;
      }
      .card-search-box form{
         all: unset;
      }  
      .card-search-box form input{
         all: unset;
      }        
      .card-body {
         padding: 0 15px 15px;
         max-height: calc(100% - 60px);
      }
        `;

      this.shadowRoot.append(style);

   }
   _createPanel(type: string) {

      if(this.content) this.shadowRoot.removeChild(this.content);

      const content = document.createElement('div');
      content.setAttribute('class', 'card');

      const cardHeader = content.appendChild(document.createElement('div'));
      cardHeader.setAttribute('class', 'card-header');
      
      let iconSvg = '';
      if(type=='bookmark'){
         iconSvg=bookmarkSvg
      }
      else if(type=='history'){
         iconSvg=clockRotateLeft
      }
      else if(type=='notes'){
         iconSvg=clipboardSvg
      }
      else if(type=='settings'){
         iconSvg=slidersSvg
      }

      if(iconSvg){
         const iconImg = cardHeader.appendChild(document.createElement('img'));
         iconImg.setAttribute('class', 'icon');
         iconImg.setAttribute('src', iconSvg);
      }


      const title = cardHeader.appendChild(document.createElement('div'));
      title.setAttribute('class', 'title');
      title.innerText = type;

      //Action Menu
      const actionMenu = cardHeader.appendChild(document.createElement("ul"));
      actionMenu.setAttribute('class', "action-menu");

      //Close
      const close = actionMenu.appendChild(document.createElement('li'));
      const closeIcon = document.createElement('img');
      closeIcon.setAttribute('src', xmarkSvg);
      closeIcon.setAttribute('title', 'Close');
      closeIcon.addEventListener('click', this._reset.bind(this));
      close.appendChild(closeIcon);

      //CARD Search 
      const searchBox = content.appendChild(document.createElement('div'));
      searchBox.setAttribute('class', 'card-search-box');
      const searchIcon = searchBox.appendChild(document.createElement('img'));
      searchIcon.setAttribute('src', findSvg);
      const searchForm =  searchBox.appendChild(document.createElement('form'));
      searchForm.setAttribute('action', '#');
      const searchImput =  searchForm.appendChild(document.createElement('input'));
      searchImput.setAttribute('placeholder', 'Find');

      //Card Body
      const cardBody = content.appendChild(document.createElement('div'));
      cardBody.setAttribute('class', 'card-body');


      //Card Body
      const cardFooter = content.appendChild(document.createElement('div'));
      cardFooter.setAttribute('class', 'card-footer');

      this.content = content;
      this.shadowRoot.append(this.content);

   }

   _setWebView(webview: WebviewTag) {
      this._log({ref:'_setWebView', message: webview.getAttribute('tab-id')})
      this.webview = webview;
   }

   _reset(){
      this.remove();
   }

   private _log(options:LogElement){
      options.className = this.constructor.name;
      return appLog(options);
   }

   connectedCallback() {
      this._log({message:'Is connected!', color:'#cc5'})
   }

   disconnectedCallback() { }

}
customElements.define("side-panel", Panel);