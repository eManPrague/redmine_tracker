// @flow
import Immutable from 'immutable';

import {
  SET_ISSUES
} from '../constants/actions';

import {
  showLoading,
  hideLoading
} from './ui';

import redmineClient from '../utils/RedmineClient';

import {
  electronAlert
} from '../utils/ElectronHelper';

export const setIssues = (projectIdentifier: string, issues: { [string]: string }) => ({
  type: SET_ISSUES,
  payload: {
    projectIdentifier,
    issues
  }
});

export const clearIssues = (projectIdentifier: string) => ({
  type: SET_ISSUES,
  payload: {
    projectIdentifier,
    issues: {}
  }
});

export const fetchIssues = (projectIdentifier: string) => async (dispatch: Dispatch) => {
  dispatch(showLoading('issues', 'Fetching issues...'));

  try {
    dispatch(setIssues(
      projectIdentifier,
      await redmineClient.getIssues(projectIdentifier)
    ));
  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('issues'));
};
