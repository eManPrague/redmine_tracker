import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc, remote } from 'electron';
import log from 'electron-log';
import { Provider } from 'react-redux';
import { getInitialStateRenderer } from 'electron-redux';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import configureStore from './store';

// Entry dialog
import EditDialog from './components/EditDialog';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Current window
const currentWindow = remote.getCurrentWindow();

// Test if log run
log.info(`Start edit entry ${currentWindow.entryIndex}...`);

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

// Init app
const initialState = Immutable.fromJS(getInitialStateRenderer());
const store = configureStore(initialState, 'renderer');

// Initialize renderer process 
const ipcApi = new IpcApiRenderer(store, log);
ipcApi.bind();

// Get proper entry from history
const entry = store.getState().getIn(['entries', 'history', currentWindow.entryIndex]).toJS();
console.log(entry);
if (entry && !Object.prototype.hasOwnProperty.call(entry, 'id')) {
  entry.id = null;
}
console.log(entry);

render(
  <AppContainer>
    <Provider store={store}>
      <EditDialog entryIndex={currentWindow.entryIndex} currentEntry={entry} />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
