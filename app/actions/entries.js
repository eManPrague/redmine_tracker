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

export const stopEntry = (endTime: number, id: number) => ({
  type: STOP_ENTRY,
  payload: {
    endTime,
    id
  }
});

export const closeEntry = (entry: any, endTime: number, sync: boolean) => async (dispatch: any) => {
  dispatch(showLoading('entries', 'Sync entry...'));

  let id: number = 0;

  if (sync) {
    try {
      id = await redmineClient.createEntry({
        issueId: entry.get('issue'),
        activity: entry.get('activity'),
        description: entry.get('description'),
        startTime: entry.get('startTime'),
        endTime
      });
    } catch (e) {
      electronAlert(e.message);
    }
  }

  dispatch(stopEntry(
    endTime,
    id
  ));

  dispatch(hideLoading('entries'));
};
