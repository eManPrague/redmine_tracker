import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Entries from './components/Entries';

// Global styles
import './app.global.css';

// Test if log run
log.info('Start entries frontend...');

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

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
