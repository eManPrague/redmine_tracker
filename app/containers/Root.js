// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { Router, BrowserRouter } from 'react-router-dom';

import Routes from '../routes';

type RootType = {
  store: {},
  history: {}
};

export default function Root({ store, history }: RootType) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
}
