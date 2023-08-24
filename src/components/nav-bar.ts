import { arrowLeft, arrowRight, arrowRotate, bookmarkSvg, clipboardSvg, clockRotateLeft, slidersSvg } from "./img";

export class NavBar extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        // write element functionality in here
        // Create a shadow root
        this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'
        

        // Create (nested) span elements
        const wrapper = document.createElement("div");
        wrapper.setAttribute("class", "navbar-wrapper");

        //Nav elements
        const nav = wrapper.appendChild(document.createElement("ul"));
        nav.setAttribute('class', "nav");

        const back = nav.appendChild(document.createElement('li'));
        const backIcon = back.appendChild(document.createElement('img'));
        backIcon.setAttribute('src', arrowLeft)
        back.appendChild(backIcon);

        const forward = nav.appendChild(document.createElement('li'));
        const forwardIcon = forward.appendChild(document.createElement('img'));
        forwardIcon.setAttribute('src', arrowRight)
        forward.appendChild(forwardIcon);

        const reload = nav.appendChild(document.createElement('li'));
        const reloadIcon = reload.appendChild(document.createElement('img'));
        reloadIcon.setAttribute('src', arrowRotate)
        reload.appendChild(reloadIcon);

        const form = wrapper.appendChild(document.createElement("form"));
        const input = form.appendChild(document.createElement('input'));
        input.setAttribute("type", "text");
        input.setAttribute('placeholder', 'Navigate to...');
        
        //App Action menu
        const appMenu = wrapper.appendChild(document.createElement("ul"));
        appMenu.setAttribute('class', "nav app-menu");

        const bookmark = appMenu.appendChild(document.createElement('li'));
        const bookmarkIcon = bookmark.appendChild(document.createElement('img'));
        bookmarkIcon.setAttribute('src', bookmarkSvg)

        const notes = appMenu.appendChild(document.createElement('li'));
        const notesIcon = notes.appendChild(document.createElement('img'));
        notesIcon.setAttribute('src', clipboardSvg)
   

        const history = appMenu.appendChild(document.createElement('li'));
        const historyIcon = history.appendChild(document.createElement('img'));
        historyIcon.setAttribute('src', clockRotateLeft)


        const settings = appMenu.appendChild(document.createElement('li'));
        const settingsIcon = settings.appendChild(document.createElement('img'));
        settingsIcon.setAttribute('src', slidersSvg)

        
        // Create some CSS to apply to the shadow DOM
        const style = document.createElement("style");
        style.textContent = `
            .navbar-wrapper {
                display:flex;
                padding: 15px 10px;
                background: #fff;
                border-bottom: 1px solid #ccc;
                align-item:center;
                gap:10px
            }
            .navbar-wrapper form {
                display:flex;
                flex: auto;
            }
            .navbar-wrapper form input{
                width: 100%;
                padding: 12px 10px 10px;
                background: #fff;
                border: 1px solid #ccc;
                border-radius: 5px;
                line-height: 0;
            }
            .navbar-wrapper ul.nav{
                display:flex;
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .navbar-wrapper ul.nav li{
                background: #e7e7e7;;
                border-radius: 50%;
                padding: 10px;
                line-height: 0;
                margin-right: 10px; 
                cursor:pointer;  
            }
            .navbar-wrapper ul.nav li:last-child{
                margin-right:0;
            }
            .navbar-wrapper ul.nav li img{
                width:20px;
                height:20px;
                opacity:0.75;
            }
            .navbar-wrapper ul.nav.app-menu li{
                background: #e4c6ea;  
                margin-right: 0px;
                margin-left: 20px;
            }
            .navbar-wrapper ul.nav.app-menu li:first-child{
                margin-left:0;
            }
            
        `;

        // attach the created elements to the shadow DOM
        this.shadowRoot.append(style, wrapper);

    }
}
customElements.define("nav-bar", NavBar);