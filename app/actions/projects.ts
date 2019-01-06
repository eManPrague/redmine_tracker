// @flow
import { ipcRenderer as ipc } from 'electron';

import {
  SET_PROJECTS
} from '../constants/actions';

import {
  showLoading
} from './ui';

import {
  FETCH_PROJECTS
} from '../constants/ipc';

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

export const fetchProjects = () => async (dispatch: any) => {
  dispatch(showLoading('projects', 'Fetching projects...'));
  ipc.send(FETCH_PROJECTS);
};
