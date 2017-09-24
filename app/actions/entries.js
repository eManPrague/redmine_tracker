// @flow
import {
  UPDATE_ENTRY,
  STOP_ENTRY
} from '../constants/actions';

import {
  showLoading,
  hideLoading
} from './ui';

import {
  electronAlert
} from '../utils/ElectronHelper';

import redmineClient from '../utils/RedmineClient';

export const updateEntry = (data: any) => ({
  type: UPDATE_ENTRY,
  payload: data
});

export const stopEntry = (endTime: number, synced: boolean) => ({
  type: STOP_ENTRY,
  payload: {
    endTime, synced
  }
});

export const closeEntry = (entry: any, endTime: number, sync: boolean) => async (dispatch: any) => {
  dispatch(showLoading('entries', 'Sync entry...'));

  try {
    // Autosync always true for now
    redmineClient.createEntry({
      issueId: entry.get('issue'),
      activity: entry.get('activity'),
      description: entry.get('description'),
      startTime: entry.get('startTime'),
      endTime
    });

  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('entries'));
};
