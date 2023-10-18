

export type LoggerFactoryType = {
    log:(ref:string, ...mess:any)=>void
    logAction:(ref:string, ...mess:any)=>void
    logIpc:(ref:string, ...mess:any)=>void
    logError:(ref:string, ...mess:any)=>void
}

export function LoggerFactory(className:string){
   
    const color = {
        className : '#7e57c2',
        ref:'#ffc100',
        info:'#cc5',
        ipc:'#b6bcff',
        mess:'#dddddd',
        error: 'red'
    }
    
    const formatMess = (ref:string|null, data:any[])=>{
        
        let [message] = data 
        if(message &&  typeof message == 'string' ){
            data.splice(0,1);
        } else {
            message= '';
        }
        const formatedString = `%c${className}%c${ref}%c${message}`;
        return [formatedString, data];
    }

    const log =  (ref:string, ...mess:any)=>{
        const [str, data] = formatMess(ref, mess);
        return console.log(str,  
              `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.info};margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`, 
              ...data);
    };

    const logAction =  (ref:string, ...mess:any)=>{
        const [str, data] = formatMess(ref, mess);
        return console.trace(str,  
              `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.ref};margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`, 
              ...data);
    };

    const logIpc = (ref:string, ...mess:any)=>{
        const [str, data] = formatMess(ref, mess);
        return console.trace(str,  
              `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.ipc};margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`, 
              ...data);
    };

    const logError = (ref:string, ...mess:any)=>{
        const [str, data] = formatMess(ref, mess);
        return console.trace(str,  
              `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.error};color:#fff;margin-left:4px;padding:2px;border-radius:3px`, 
              `background-color:${color.error};color:#fff;margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`, 
              ...data);
    };

    return {
        log,
        logAction,
        logIpc,
        logError
    }

}