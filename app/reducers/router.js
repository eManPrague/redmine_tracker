import {
  LOCATION_CHANGE
} from 'react-router-redux';

import { defaultRouting } from '../utils/DefaultStates';

export default (state = defaultRouting, action) => {
  if (action.type === LOCATION_CHANGE) {
    return state.set('location', action.payload);
  }

  return state;
};
