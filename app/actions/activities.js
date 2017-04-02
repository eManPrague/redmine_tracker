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

export const setActivities = (activities: Immutable.Map<number, string>) => ({
  type: SET_ACTIVITIES,
  activities
});

export const clearActivities = () => ({
  type: SET_ACTIVITIES,
  activities: []
});

export const fetchActivities = () => async (dispatch: Dispatch) => {
  dispatch(showLoading('activities', 'Fetching activities...'));

  try {
    dispatch(setActivities(
      await redmineClient.getActivities()
    ));
  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('activities'));
};
