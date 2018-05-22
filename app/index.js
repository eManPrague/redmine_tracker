import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import { createHashHistory } from 'history';
import { getInitialStateRenderer } from 'electron-redux';

import IpcApiRenderer from './utils/IpcApiRenderer';

// Containers + store
import Root from './containers/Root';
import configureStore from './store';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Test if log run
log.info('Start frontend...');

// Bind error catcher
window.onerror = (error) => {
  ipc.send('errorInWindow', error);
  log.error(error);
};

// Init app
const initialState = Immutable.fromJS(getInitialStateRenderer());
const history = createHashHistory();
const store = configureStore(initialState, 'renderer', history);

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
