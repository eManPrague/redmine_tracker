import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc } from 'electron';
import { createHashHistory } from 'history';

// Containers + store
import { SETTINGS_LOAD_ERROR } from './constants/dialogs';
import SettingsStorage from './utils/SettingsStorage';
import Root from './containers/Root';
import configureStore from './store';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Init app
const initApp = (val) => {
  const initialState = Immutable.fromJS(val);
  const history = createHashHistory();
  const store = configureStore(initialState, 'renderer', history);

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

  return true;
};

// Load initial store from electron-json-storage
const settings = SettingsStorage.get('settings', {});

settings
  .then(initApp)
  .catch((e) => { ipc.send(SETTINGS_LOAD_ERROR, e.stack, e.message); });
