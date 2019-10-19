import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';

import {
  fakeAccountLogin,
  getFakeCaptcha,
  getJson,
  userLogin,
  getPermissionByToken,
} from './service';
import { getPageQuery, saveUserResult, setAuthority, setUserInfo } from './utils/utils';

const Model = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *getJSON({ payload, cb }, { call, put }) {
      const response = yield call(getJson);
      if (response.success) {
        cb(response.result);
      }
    },

    *login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      yield put({
        type: 'saveUserToken',
        payload: response,
      });

      if (response.success) {
        yield put(routerRedux.replace('/'));
      } else {
        message.error(response.message);
      }
    },
    *getPermission({ payload, cb }, { call, put }) {
      const response = yield call(getPermissionByToken, payload);
      if (response && response.success) {
        if (cb) {
          cb(response);
        }
      }
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    saveUserToken(state, { payload }) {
      setAuthority(payload.result.token);
      saveUserResult(payload.result);
      return { ...state, code: payload.code, status: payload.status };
    },
  },
};
export default Model;
