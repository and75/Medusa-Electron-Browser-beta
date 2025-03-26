/**
* Medusa browser beta
* @description Global types declaration
* @author Andrea Porcella
* @copyright Andrea Porcella / Bellville-system 2023
*/

import { ElectronHandler } from './preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
  }
}
export {};
