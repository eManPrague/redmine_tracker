// @flow
import { ipcRenderer as ipc } from 'electron';
import { push } from 'connected-react-router'
import { isUri } from 'valid-url';

import {
  showLoading,
  hideLoading
} from './ui';

import {
  electronAlert
} from '../utils/ElectronHelper';

import resetData from './data';
import { resetCurrentEntry, clearEntries } from './entries';

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
    dispatch(clearEntries());

    // Redirect to login
    dispatch(push('/login'));
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
  if (!server.startsWith('http://') && !server.startsWith('https://')) {
    url = `https://${server}`;
  }

  const localhost = url.indexOf('localhost') >= 0;

  // Request.js bug, to forward POST request from POSTS to GET, when http:// to https:// changes.
  if (url.startsWith('http://') && localhost === false) {
    url = url.replace('http', 'https');
  }

  if (!isUri(url) && localhost === false) {
    return electronAlert('Server URL is invalid!');
  }

  dispatch(showLoading('user', 'Loading user...'));

  ipc.send(FETCH_USER, { server: url, token });
};
