import { TabsBarWrapper } from './components/tabs-bar';
import { Tab } from './components/tab' 

export function emit(emitter: TabsBarWrapper | Tab, type: string, args: any[]) {
    //console.log('EVENT EMIT : ', emitter, type)
    if (type === "ready") {
      emitter.isReady = true;
    }
    emitter.dispatchEvent(new CustomEvent(type, {  bubbles: true, composed: true, detail: args },));
  }
  
export function on(emitter: TabsBarWrapper | Tab, type: string, fn: (detail: string) => void, options?: { [key: string]: any }) {
    console.log('EVENT ON', emitter, type)
    if (type === "ready" && emitter.isReady === true) {
      fn.apply(emitter, [emitter]);
    }
    emitter.addEventListener(type, ((e: CustomEvent) => fn.apply(emitter, e.detail)) as EventListener, options);
  }


