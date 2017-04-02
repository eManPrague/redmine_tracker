/* eslint-disable no-unused-expressions */
import { spy } from 'sinon';

import * as actions from '../../app/actions/user';
import * as constants from '../../app/constants/actions';

jest.mock('electron-json-storage');
jest.mock('ElectronHelper');

describe('actions', () => {
  const server = 'http://fake-redmine.com';
  const token = 'abcd1234abcd1234abcd1234';
  const info = {
    server,
    token
  };

  it('should logout user', () => {
    expect(actions.removeUser()).toEqual({
      type: constants.USER_LOG_OUT
    });
  });

  it('should login user', () => {
    expect(actions.setUser(info)).toEqual({
      type: constants.USER_LOG_IN,
      info
    });
  });

  describe('login process', () => {
    it('empty values', () => {
      const fn = actions.userLogIn('', '');
      const dispatch = spy();

      const getState = () => ({
        userLoggedIn: false
      });


      fn(dispatch, getState);
    });
  });
});
