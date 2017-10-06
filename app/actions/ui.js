// @flow
import {
  SHOW_UI_LOADING,
  HIDE_UI_LOADING
} from '../constants/actions';

export const showLoading = (code: string, message: string) => ({
  type: SHOW_UI_LOADING,
  payload: {
    message,
    code
  },
  meta: {
    scope: 'local'
  }
});

export const hideLoading = (code: string) => ({
  type: HIDE_UI_LOADING,
  payload: {
    code
  },
  meta: {
    scope: 'local'
  }
});
