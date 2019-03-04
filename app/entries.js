import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import { Provider } from 'react-redux';
import { getInitialStateRenderer } from 'electron-redux';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Entries from './components/Entries';
import configureStore from './store';

// Global styles
import './app.global.css';

// Test if log run
log.info('Start entries frontend...');

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

// Init app
const initialState = Immutable.fromJS(getInitialStateRenderer());
const store = configureStore(initialState, 'renderer');

// Initialize renderer process
const ipcApi = new IpcApiRenderer(store);
ipcApi.bind();

render(
  <AppContainer>
    <Provider store={store}>
      <Entries />
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
