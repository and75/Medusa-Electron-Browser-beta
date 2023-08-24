import { globeSvg, arrowRotateRight, xmarkSvg, plusSvg } from "./img";
export class TabsBar extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        
        // Create (nested) span elements
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "tabs-wrapper");
        const ul = wrapper.appendChild(document.createElement("ul"));
        const li = ul.appendChild(document.createElement('li'));
        li.setAttribute("class", "item active");
        li.setAttribute("tabindex", '0');

        const loaderIcon = li.appendChild(document.createElement('img'));
        loaderIcon.setAttribute("class", "favicon loading");
        loaderIcon.setAttribute('src', arrowRotateRight);

        const favIcon = li.appendChild(document.createElement('img'));
        favIcon.setAttribute("class", "favicon default");
        favIcon.setAttribute('src', globeSvg);

        const title = li.appendChild(document.createElement('span'));
        title.setAttribute("class", "title");
        title.innerText = 'New tab';

        const closeIcon = li.appendChild(document.createElement('img'));
        closeIcon.setAttribute("class", "close-tab");
        closeIcon.setAttribute('src', xmarkSvg);

        const add = ul.appendChild(document.createElement('li'));
        add.setAttribute("class", "add");
        
        const plus = add.appendChild(document.createElement('img'));
        plus.setAttribute("class", "favicon plus");
        plus.setAttribute('src', plusSvg);
        
        
        
        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            /* CSS truncated for brevity */
            .tabs-wrapper {
                padding: 0 10px;
                background: #f2f0ec;
            }
            .tabs-wrapper ul{
                margin: 0;
                list-style-type: none;
                padding: 0;
                display:flex;
            }
            .tabs-wrapper ul li{
                flex: 1;
                display:flex;
                align-items:center;
                gap:10px;
                background:#dbdbdb;
                padding: 7px 10px 9px;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-right: 1px solid #777;
                cursor: pointer;
                margin-top: 1px;
                max-width: 180px;
            }
            
            .tabs-wrapper ul li.active,
            .tabs-wrapper ul li:hover{
                background: #ffffff;
            }
            .tabs-wrapper ul li.add{

            }
            .tabs-wrapper ul li img.favicon{
                display:block;
                width:14px;
                opacity: 0.5;
            }
            .tabs-wrapper ul li.loading img.favicon{
                display:none;
            }
            .tabs-wrapper ul li img.favicon.loading{
                display:none;
            }
            .tabs-wrapper ul li.loading img.favicon.loading{
                display: block;
                animation: rotate 1.5s linear infinite;
            }
            @keyframes rotate{
                100% {
                  transform: rotate(360deg);
                }
              }

            .tabs-wrapper ul li img.close-tab{
                width:12px;
                opacity: 0.5;
            }
            .tabs-wrapper ul li img.close-tab:hover{
                opacity:1;
            }
            .tabs-wrapper ul li span.title{
                flex:auto;
                text-align:start;
            }
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, wrapper);

    }
}
customElements.define("tabs-bar", TabsBar);