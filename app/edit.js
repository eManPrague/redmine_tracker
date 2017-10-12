import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import { Provider } from 'react-redux';
import { getInitialStateRenderer } from 'electron-redux';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import configureStore from './store';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Test if log run
log.info('Start edit entry...');

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

render(
  <AppContainer>
    <Provider store={store}>
      <div>Editace</div>
    </Provider>
  </AppContainer>,
  document.getElementById('root')
);
