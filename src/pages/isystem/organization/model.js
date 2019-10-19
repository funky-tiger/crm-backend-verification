import { message, notification } from 'antd';
import {
 queryIdTree, queryById, editQuery, addQuery, delQuery
} from './service';

const Model = {
  namespace: 'Organization',
  state: {},
  effects: {
    *getQueryIdTree({ cb }, { call }) {
      const response = yield call(queryIdTree);
      if (response.success) {
        cb(response.result);
      }
    },
    *getQueryById({ params, cb }, { call }) {
      const response = yield call(queryById, params);
      if (response.success) {
        cb(response.result);
      }
    },
    *updateQuery({ params, cb }, { call }) {
      const response = yield call(editQuery, params);
      if (response.success) {
        cb();
      } else {
        notification.error({
          message: response.message,
        });
      }
      message.success(response.message);
    },
    *addNewQuery({ params, cb }, { call }) {
      const response = yield call(addQuery, params);
      if (response.success) {
        cb();
      } else {
        notification.error({
          message: response.message,
        });
      }
      message.success(response.message);
    },
    *delOneQuery({ params, cb }, { call }) {
      const response = yield call(delQuery, params);
      if (response.success) {
        cb();
      } else {
        notification.error({
          message: response.message,
        });
      }
      message.success(response.message);
    },
  },
};
export default Model;
