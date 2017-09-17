// @flow
import Immutable from 'immutable';

import {
  SET_PROJECTS
} from '../constants/actions';

import {
  showLoading,
  hideLoading
} from './ui';

import redmineClient from '../utils/RedmineClient';

import {
  electronAlert
} from '../utils/ElectronHelper';

export const setProjects = (projects: Array<{value: string, label: string }>) => ({
  type: SET_PROJECTS,
  payload: {
    projects
  }
});

export const clearProjects = () => ({
  type: SET_PROJECTS,
  payload: {
    projects: []
  }
});

export const fetchProjects = () => async (dispatch: Dispatch) => {
  dispatch(showLoading('projects', 'Fetching projects...'));

  try {
    dispatch(setProjects(
      await redmineClient.getProjects()
    ));
  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('projects'));
};
