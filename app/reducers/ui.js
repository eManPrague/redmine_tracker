import Immutable from 'immutable';

import {
  SHOW_UI_LOADING,
  HIDE_UI_LOADING
} from '../constants/actions';

const initialState = Immutable.fromJS({
  loading: [],
  message: ''
});

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_UI_LOADING:
      return state
        .updateIn(['loading'], arr => arr.push(action.code))
        .set('message', action.message);
    case HIDE_UI_LOADING:
      return state.set(
        'loading',
        state.get('loading').filter((val) => val !== action.code)
      );
    default:
      return state;
  }
};
