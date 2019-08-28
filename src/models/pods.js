/**
 * Created by huyunting on 2018/5/17.
 */
import { message } from 'antd';
import {
  logs,
  list,
  detail,
  reload,
  getSession
} from '../services/pods';

export default {
  namespace: 'pods',

  state: {
    list: [],
    loading: false,
    detail: {},
    logs: {},
    session: {}
  },

  effects: {
    * getSessionId({payload}, {call, put}) {
      const response = yield call(getSession, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: {
          session: response.data,
        },
      });
    },

    * reload({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(reload, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: {
          loading: false,
        },
      });
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * list({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(list, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'saveList',
        payload: {
          list: response.data,
        },
      });
    },
    * detail({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(detail, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: {
          detail: response.data,
          loading: false,
        },
      });
    },
    * getLogs({ payload }, { call, put }) {
      const response = yield call(logs, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: {
          logs: response.data,
        },
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    saveList(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
