// @flow
import { ipcRenderer as ipc } from 'electron';

import {
  SET_ACTIVITIES
} from '../constants/actions';

import {
  showLoading
} from './ui';

import {
  FETCH_PROJECT_ACTIVITIES
} from '../constants/ipc';

export const setActivities = (projectIdentifier: string, activities: { [string]: string }) => ({
  type: SET_ACTIVITIES,
  payload: {
    projectIdentifier,
    activities
  }
});

export const clearActivities = () => ({
  type: SET_ACTIVITIES,
  payload: {
    activities: []
  }
});

export const fetchActivities = (projectIdentifier: string) => async (dispatch: any) => {
  dispatch(showLoading('activities', 'Fetching activities...'));
  ipc.send(FETCH_PROJECT_ACTIVITIES, { projectIdentifier });
};
