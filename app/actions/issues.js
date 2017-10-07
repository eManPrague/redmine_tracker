// @flow
import { ipcRenderer as ipc } from 'electron';

import {
  SET_ISSUES
} from '../constants/actions';

import {
  showLoading
} from './ui';

import {
  FETCH_ISSUES
} from '../constants/ipc';

import type { Issue } from '../types/RedmineTypes';

export const setIssues = (projectIdentifier: string, issues: Array<Issue>) => ({
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
    issues: []
  }
});

export const fetchIssues = (projectIdentifier: string) => async (dispatch: any) => {
  dispatch(showLoading('issues', 'Fetching issues...'));
  ipc.send(FETCH_ISSUES, { projectIdentifier });
};
