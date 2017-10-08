// @flow
import { ipcRenderer as ipc } from 'electron';
import { routerActions } from 'react-router-redux';
import { isUri } from 'valid-url';

import {
  showLoading,
  hideLoading
} from './ui';

import {
  electronAlert
} from '../utils/ElectronHelper';

import resetData from './data';
import { resetCurrentEntry } from './entries';

import type { Info } from '../types/UserType';

import {
  USER_LOG_IN,
  USER_LOG_OUT
} from '../constants/actions';

import { FETCH_USER } from '../constants/ipc';

export const setUser = (info: Info) => ({
  type: USER_LOG_IN,
  payload: info
});

export const removeUser = () => ({
  type: USER_LOG_OUT
});

export const userLogOut = () => async (dispatch: any) => {
  dispatch(showLoading('user', 'Logout user...'));

  try {
    // Remove user, reset data & remove current entry
    // Don't reset history yet
    dispatch(removeUser());
    dispatch(resetData());
    dispatch(resetCurrentEntry());

    // Redirect to login
    dispatch(routerActions.push('/login'));
  } catch (e) {
    electronAlert(e.message);
  }

  dispatch(hideLoading('user'));
};

export const userLogIn = (server: string, token: string) => async (dispatch: any) => {
  // Test on empty fields
  if (server.length === 0 || token.length === 0) {
    return electronAlert('Please fill required fields');
  }

  let url = server;
  if (!server.startsWith('http')) {
    url = `http://${server}`;
  }

  // Test if server is valid url!
  if (!isUri(url)) {
    return electronAlert('Server URL is invalid!');
  }

  // Show loading
  dispatch(showLoading('user', 'Loading user...'));

  // Call fetch user in main process
  ipc.send(FETCH_USER, { server: url, token });
};
