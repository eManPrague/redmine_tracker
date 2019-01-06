import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Root from './containers/Root';

// Global styles
import './app.global.css';

// Test if log run
log.info('Start frontend...');

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
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    const NextRoot = require('./containers/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
