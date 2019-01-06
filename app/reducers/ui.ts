import {
  SHOW_UI_LOADING,
  HIDE_UI_LOADING,
  CHANGE_ICON
} from '../constants/actions';

import { defaultUi } from '../utils/DefaultStates';

export default (state = defaultUi, action) => {
  const payload = action.payload;

  switch (action.type) {
    case SHOW_UI_LOADING:
      return state
        .updateIn(['loading'], arr => arr.push(payload.code))
        .set('message', payload.message);
    case HIDE_UI_LOADING:
      return state.set(
        'loading',
        state.get('loading').filter((val) => val !== payload.code)
      );
    case CHANGE_ICON:
      return state.set('icon', payload.icon);
    default:
      return state;
  }
};
