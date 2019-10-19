import { message, notification } from 'antd';
import {
 queryRoleTree, queryByRoleGroupId, editQuery, addQuery, delQuery
} from './service';

const Model = {
  namespace: 'role',
  state: {},
  effects: {
    *getQueryRoleTree({ cb }, { call }) {
      const response = yield call(queryRoleTree);
      if (response.success) {
        cb(response.result);
      }
    },
    *getQueryByRoleGroupId({ params, cb }, { call }) {
      const response = yield call(queryByRoleGroupId, params);
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
