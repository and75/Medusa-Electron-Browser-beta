

/**
* Medusa browser beta
* @description Logger factory
* @author Andrea Porcella
* @copyright Andrea Porcella / Bellville-system 2023
*/

export type LoggerFactoryType = {
    log: (ref: string, ...mess: any) => void
    logAction: (ref: string, ...mess: any) => void
    logIpc: (ref: string, ...mess: any) => void
    logError: (ref: string, ...mess: any) => void
}

/**
 * An object that defines a set of color codes for various log categories.
 * Each property represents a specific category and its associated color.
 *
 * @property {string} className - The color code for class names.
 * @property {string} ref - The color code for references.
 * @property {string} info - The color code for informational messages.
 * @property {string} ipc - The color code for inter-process communication logs.
 * @property {string} mess - The color code for general messages.
 * @property {string} error - The color code for error messages.
 */
export function LoggerFactory(className: string) {

    const color = {
        className: '#7e57c2',
        ref: '#ffc100',
        info: '#cc5',
        ipc: '#b6bcff',
        mess: '#dddddd',
        error: 'red'
    }

    const formatMess = (ref: string | null, data: any[]) => {

        let [message] = data
        if (message && typeof message == 'string') {
            data.splice(0, 1);
        } else {
            message = '';
        }
        const formatedString = `%c${className}%c${ref}%c${message}`;
        return [formatedString, data];
    }

    const log = (ref: string, ...mess: any) => {
        const [str, data] = formatMess(ref, mess);
        return console.log(str,
            `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.info};margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`,
            ...data);
    };

    const logAction = (ref: string, ...mess: any) => {
        const [str, data] = formatMess(ref, mess);
        return console.trace(str,
            `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.ref};margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`,
            ...data);
    };

    const logIpc = (ref: string, ...mess: any) => {
        const [str, data] = formatMess(ref, mess);
        return console.trace(str,
            `background-color:${color.className};color:#fff;margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.ipc};margin-left:4px;padding:2px;border-radius:3px`,
            `background-color:${color.mess};margin-left:2px;margin-left:4px;padding:2px;border-radius:3px`,
            ...data);
    };

    const logError = (ref: string, ...mess: any) => {
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