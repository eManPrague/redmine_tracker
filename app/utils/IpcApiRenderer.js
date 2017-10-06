import { ipcRenderer as ipc } from 'electron';
import { routerActions } from 'react-router-redux';

import * as actions from '../constants/ipc';

import {
  hideLoading
} from '../actions/ui';

import {
  removeUser
} from '../actions/user';

import {
  electronAlert
} from './ElectronHelper';

export default class IpcApiRenderer {
  store: null;
  ipc: null;
  log: null;

  constructor(store, log) {
    this.store = store;
    this.ipc = ipc;
    this.log = log;
  }

  fetchUserResponse = async (event, data) => {
    if (data.error) {
      this.store.dispatch(removeUser());
      electronAlert(data.error);
    } else {
      this.store.dispatch(routerActions.push('/'));
    }

    this.store.dispatch(hideLoading('user'));
  }

  fetchProjectsResponse = async (event, data) => {
    if (data.error) {
      electronAlert(data.error);
    }

    this.store.dispatch(hideLoading('projects'));
  }

  fetchIssuesResponse = async (event, data) => {
    if (data.error) {
      electronAlert(data.error);
    }

    this.store.dispatch(hideLoading('issues'));
  }

  fetchActivitiesResponse = async (event, data) => {
    if (data.error) {
      electronAlert(data.error);
    }

    this.store.dispatch(hideLoading('activities'));
  }

  syncCurrentEntryResponse = async (event, data) => {
    if (data.error) {
      electronAlert(data.error);
    }

    this.store.dispatch(hideLoading('entries'));
  }

  bind() {
    // Users
    this.ipc.on(actions.FETCH_USER_RESPONSE, this.fetchUserResponse);

    // Projects
    this.ipc.on(actions.FETCH_PROJECTS_RESPONSE, this.fetchProjectsResponse);

    // Issues
    this.ipc.on(actions.FETCH_ISSUES_RESPONSE, this.fetchIssuesResponse);

    // Activities
    this.ipc.on(actions.FETCH_PROJECT_ACTIVITIES_RESPONSE, this.fetchActivitiesResponse);

    // Current entry response
    this.ipc.on(actions.SYNC_CURRENT_ENTRY_RESPONSE, this.syncCurrentEntryResponse);
  }
}
