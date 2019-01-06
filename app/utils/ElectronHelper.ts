import { ipcRenderer as ipc } from 'electron';
import {
  ERROR_ALERT,
  INFO_ALERT
} from '../constants/dialogs';

export const electronAlert = (message) => {
  ipc.send(ERROR_ALERT, message);
};

export const electronInfo = (message) => {
  ipc.send(INFO_ALERT, message);
};
