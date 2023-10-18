import { TabsGroupWrapper } from './components/TabsBarWrapper';
import { Tab } from './components/Tab'
import { LogElement } from './model';

export function generateRandomColor() {
  const maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  const randomString = randomNumber.toString(16);
  const randColor = randomString.padStart(6, randomString);
  return `#${randColor.toUpperCase()}`
}

export function emit(emitter: TabsGroupWrapper | Tab, type: string, args: any[]) {
  console.log('EVENT EMIT : ', emitter, type)
  emitter.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail: args }));
}

export function on(emitter: TabsGroupWrapper | Tab, type: string, fn: (detail: string) => void, options?: { [key: string]: any }) {
  console.log('EVENT ON', emitter, type)
  emitter.addEventListener(type, ((e: CustomEvent) => fn.apply(e.detail)));
}

export function appLog(options:LogElement){

  const color = ['#7E57C2', '#ffc100', '#dddddd'];

  if(!options.className) {options.className = ''}
  if(!options.ref) {options.ref = ''}
  if(!options.message){options.message = ''}
  if(!options.args){options.args = ''}
  if(options.color){
    if(!options.ref && options.message){color[2] = options.color}
    else {color[1] = options.color}
  }
  
  const strMess = `%c${options.className}%c${options.ref}%c${options.message}`;

  return console.trace(strMess,  
    `background-color:${color[0]};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
    `background-color:${color[1]};margin-left:4px;padding:2px;border-radius:3px`, 
    `background-color:${color[2]};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`, 
    options.args);
    
}


