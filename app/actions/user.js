// @flow
import { routerActions } from 'react-router-redux';
import {
  showLoading,
  hideLoading
} from './ui';

import {
  electronAlert
} from '../utils/ElectronHelper';

import type { Info } from '../types/UserType';

import {
  USER_LOG_IN,
  USER_LOG_OUT
} from '../constants/actions';

import redmineClient from '../utils/RedmineClient';

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
    dispatch(removeUser());
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

  // Set info to client
  redmineClient.setCredentials(server, token);

  // Show loading
  dispatch(showLoading('user', 'Loading user...'));

  // Try to get user information
  try {
    const info = {
      server,
      token,
      user: await redmineClient.getUser()
    };

    // Set user
    dispatch(setUser(info));

    // Redirect
    dispatch(routerActions.push('/'));
  } catch (e) {
    dispatch(removeUser());
    electronAlert(e);
  }

  dispatch(hideLoading('user'));
};
