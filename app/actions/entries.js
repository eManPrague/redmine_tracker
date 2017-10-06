// @flow
import { ipcRenderer as ipc } from 'electron';

import {
  UPDATE_ENTRY,
  STOP_ENTRY,
  RESET_CURRENT_ENTRY
} from '../constants/actions';

import {
  SYNC_CURRENT_ENTRY
} from '../constants/ipc';

import {
  showLoading
} from './ui';

export const updateEntry = (data: any) => ({
  type: UPDATE_ENTRY,
  payload: data
});

export const stopEntry = (endTime: number, id?: number) => ({
  type: STOP_ENTRY,
  payload: {
    endTime,
    id
  }
});

export const resetCurrentEntry = () => ({
  type: RESET_CURRENT_ENTRY,
});

/* eslint-disable max-len */
export const closeEntry = (entry: any, endTime: number, sync: boolean) => async (dispatch: any) => {
  if (sync) {
    // Show sync prompt
    dispatch(showLoading('entries', 'Sync entry...'));
    ipc.send(SYNC_CURRENT_ENTRY, { entry: entry.toJS(), endTime });
  } else {
    // Move entry to entries
    dispatch(stopEntry(endTime));
  }
};
/* eslint-enable max-len */
