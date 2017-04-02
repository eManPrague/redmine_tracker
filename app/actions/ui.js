// @flow
import {
  SHOW_UI_LOADING,
  HIDE_UI_LOADING
} from '../constants/actions';

export const showLoading = (code: string, message: string) => ({
  type: SHOW_UI_LOADING,
  message,
  code
});

export const hideLoading = (code: string) => ({
  type: HIDE_UI_LOADING,
  code
});
