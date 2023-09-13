import { TabsGroupWrapper } from './components/TabsGroupWrapper';
import { Tab } from './components/Tab'
import { EventEmitter } from 'events';

export function emit(emitter: TabsGroupWrapper | Tab, type: string, args: any[]) {
  console.log('EVENT EMIT : ', emitter, type)
  if (type === "ready") {
    emitter.isReady = true;
  }
  emitter.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail: args }));
}

export function on(emitter: TabsGroupWrapper | Tab, type: string, fn: (detail: string) => void, options?: { [key: string]: any }) {
  console.log('EVENT ON', emitter, type)
  emitter.addEventListener(type, ((e: CustomEvent) => fn.apply(e.detail)));
}



export class EventManager extends EventEmitter {
  constructor() {
    super();
    
  }
}

