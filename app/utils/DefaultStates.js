// @flow
import Immutable from 'immutable';

export const defaultRouting = Immutable.fromJS({
  location: {
    pathname: '/',
    search: '',
    hash: ''
  }
});

export const defaultUi = Immutable.fromJS({
  loading: [],
  message: ''
});
