// @flow
import Immutable from 'immutable';

import {
  SET_ACTIVITIES
} from '../constants/actions';

import {
  showLoading,
  hideLoading
} from './ui';

import redmineClient from '../utils/RedmineClient';

import {
  electronAlert
} from '../utils/ElectronHelper';

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

export const fetchActivities = (projectIdentifier: string) => async (dispatch: Dispatch) => {
  dispatch(showLoading('activities', 'Fetching activities...'));

  try {
    dispatch(setActivities(
      projectIdentifier,
      await redmineClient.getActivities(projectIdentifier)
    ));
  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('activities'));
};
