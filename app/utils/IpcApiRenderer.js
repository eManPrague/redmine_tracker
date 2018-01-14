import { ipcRenderer as ipc } from 'electron';
import { routerActions } from 'react-router-redux';

import * as actions from '../constants/ipc';

import {
  hideLoading
} from '../actions/ui';

import {
  removeUser
} from '../actions/user';

export default class IpcApiRenderer {
  store: null;
  ipc: null;

  constructor(store) {
    this.store = store;
    this.ipc = ipc;
  }

  /**
   * Fetch user response.
   */
  fetchUserResponse = async (event, data) => {
    if (data.error) {
      this.store.dispatch(removeUser());
    } else {
      this.store.dispatch(routerActions.push('/'));
    }

    this.store.dispatch(hideLoading('user'));
  }

  /**
   * Fetching general response.
   */
  fetchGeneralResponse = (event, data, loading) => {
    // Errors are currently dispatched by main user.
    if (loading) {
      this.store.dispatch(hideLoading(loading));
    }
  }

  bind() {
    // Users
    this.ipc.on(actions.FETCH_USER_RESPONSE, this.fetchUserResponse);

    // Projects
    this.ipc.on(actions.FETCH_PROJECTS_RESPONSE, (event, data) => this.fetchGeneralResponse(event, data, 'projects'));

    // Issues
    this.ipc.on(actions.FETCH_ISSUES_RESPONSE, (event, data) => this.fetchGeneralResponse(event, data, 'issues'));

    // Activities
    this.ipc.on(actions.FETCH_PROJECT_ACTIVITIES_RESPONSE, (event, data) => this.fetchGeneralResponse(event, data, 'activities'));

    // Current entry response
    this.ipc.on(actions.SYNC_CURRENT_ENTRY_RESPONSE, (event, data) => this.fetchGeneralResponse(event, data, 'entries'));

    // Sync all entry response
    this.ipc.on(actions.SYNC_ENTRY_RESPONSE, (event, data) => this.fetchGeneralResponse(event, data, 'entries'));
  }
}
