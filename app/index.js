import React from 'react';
import { render } from 'react-dom';
import { hashHistory } from 'react-router';
import { AppContainer } from 'react-hot-loader';
import { syncHistoryWithStore } from 'react-router-redux';
import Immutable from 'immutable';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { ipcRenderer as ipc } from 'electron';

// Containers + store
import { SETTINGS_LOAD_ERROR } from './constants/dialogs';
import SettingsStorage from './utils/SettingsStorage';
import Root from './containers/Root';
import configureStore from './store/configureStore';

// Global styles
import './app.global.css';

// This is important for material-ui
injectTapEventPlugin();

// Init app
const initApp = (val) => {
  const initialState = Immutable.fromJS(val);
  const store = configureStore(initialState);

  const history = syncHistoryWithStore(hashHistory, store, {
    selectLocationState(state) {
      return state
        .get('routing')
        .toJS();
    }
  });

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
  .catch((e) => ipc.send(SETTINGS_LOAD_ERROR, e.message));
