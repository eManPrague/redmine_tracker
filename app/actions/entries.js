// @flow
import { ipcRenderer as ipc } from 'electron';

import {
  STOP_ENTRY,
  DELETE_ENTRY,
  UPDATE_ENTRY,
  UPDATE_CURRENT_ENTRY,
  RESET_CURRENT_ENTRY
} from '../constants/actions';

import {
  SYNC_CURRENT_ENTRY,
  SYNC_ENTRY
} from '../constants/ipc';

import {
  showLoading
} from './ui';

export const updateCurrentEntry = (data: any) => ({
  type: UPDATE_CURRENT_ENTRY,
  payload: data
});

export const updateEntry = (index: number, entry: any) => ({
  type: UPDATE_ENTRY,
  payload: {
    index,
    entry
  }
});

export const stopEntry = (endTime: number, id: ?number) => ({
  type: STOP_ENTRY,
  payload: {
    endTime,
    id
  }
});

export const continueEntry = (entry: any) => ({
  type: UPDATE_CURRENT_ENTRY,
  payload: entry
});

export const resetCurrentEntry = () => ({
  type: RESET_CURRENT_ENTRY,
});

export const syncEntry = (index: number) => (dispatch: any) => {
  // Show sync prompt
  dispatch(showLoading('entries', 'Sync entry...'));
  ipc.send(SYNC_ENTRY, { index });
};

export const deleteEntry = (index: number) => ({
  type: DELETE_ENTRY,
  payload: {
    index
  }
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
