import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc } from 'electron';
import log from 'electron-log';
import { createHashHistory, createBrowserHistory } from 'history';

// Containers + store
// import { SETTINGS_LOAD_ERROR } from './constants/dialogs';
// import SettingsStorage from './utils/SettingsStorage';
import Root from './containers/Root';
import configureStore from './store';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Test if log run
log.info('Start frontend...');

// Bind error catcher
window.onerror = (error, url, line) => {
  ipc.send('errorInWindow', error);
  log.error(`Error line: ${line}`);
  log.error(error);
};

// Init app
const initialState = Immutable.fromJS({});

let history = null;

if (process.env.NODE_ENV !== 'production') {
  history = createHashHistory();
} else {
  history = createBrowserHistory();
}

const store = configureStore(initialState, 'renderer', history);

console.log(store);
console.log(history);

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
