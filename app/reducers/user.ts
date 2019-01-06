// @flow
import Immutable from 'immutable';

import {
  USER_LOG_IN,
  USER_LOG_OUT
} from '../constants/actions';

const initialState = Immutable.fromJS({
  isLoggedIn: false,
  server: null,
  token: null,
  user: null
});

export default (state: Immutable.Map<mixed, mixed> = initialState, action: any) => {
  switch (action.type) {
    case USER_LOG_IN:
      return state.merge({
        isLoggedIn: true,
        ...action.payload
      });

    case USER_LOG_OUT:
      return state.merge({
        token: null,
        user: null,
        isLoggedIn: false
      });

    default:
      return state;
  }
};
