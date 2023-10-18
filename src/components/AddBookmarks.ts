
import { bookmarkSvg, xmarkSvg} from "./Img";
import { LogElement } from "./../model";
import { appLog } from "./../core";

export class AddBookmarks extends HTMLElement {



   content: HTMLDivElement | null;

   constructor() {

      super();

      // Create a shadow root
      this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

      const style = document.createElement("style");
      style.textContent = `
      :host {
         all: unset;
         display: flex;
         padding: 20px;
         box-sizing: border-box;
         line-height: 0;
      }
      .image-preview{
         width: 160px;
         background-color: var(--light-grey);
         border-radius: 5px;
         margin: 0 13px 0 0;
         display: flex;
         align-items: center;
         justify-content: center;
         box-shadow: 1px 1px 7px 1px #ccc;
      }
      .image-preview img{
         opacity:0.2;
      }
      form{
         display: flex;
         align-items: start;
         flex-direction: column;
         gap: 10px;
         flex:auto;
      }
      form .form-row{
         display: flex;
         align-items: center;
         gap: 10px;
         width:100%;
      }
      form label{
         display: block;
         width: 30px;
         font-size: 13px;
         color:var(--black);
      }
      form input,
      form textarea{
         all: unset;
         font-size: 12px;
         display: block;
         width: 100%;
         padding: 5px;
         box-sizing: border-box;
         border-radius: 5px;
         background-color: var(--primary-light);
         color:var(--black);
      }
      form button{
         all: unset;
         align-self: center;
         font-size: 12px;
         padding: 14px;
         box-sizing: border-box;
         border-radius: 5px;
         color: var(--white);
         margin-top: 10px;
         background-color: var(--primary);
      }

        `;

      this.shadowRoot.append(style);
      this._init();

   }

   private _init() {

      const tmpl = document.createElement('template');
      tmpl.innerHTML = `
            <div class="image-preview">
               <img src='${bookmarkSvg}'  width="30px"/>
            </div>
            <form action="#">
               <div class="form-row">
                  <label>Title</label>
                  <input type="text" name="title" value="" />
               </div>
               <div class="form-row">
                  <label>Url</label>
                  <input type="url" name="url" value="" />
               </div>
               <div class="form-row">
                  <label>Tags</label>
                  <input type="tags" name="tags" value="" />
               </div>
               <div class="form-row" style="justify-content: end;">
                  <label></label>
                  <button type="submit">Confirm</button>
               </div>
            </form>  

             
      `;
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
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

   /*disconnectedCallback() { }*/

}
customElements.define("add-bookmarks", AddBookmarks);