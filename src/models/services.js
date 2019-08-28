/**
 * Created by huyunting on 2018/5/17.
 */
import {
  list,
  detail,
  createYaml,
  createForm,
  deleteSvc,
} from '../services/services';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'services',

  state: {
    list: [],
    loading: false,
    detail: {},
  },

  effects: {
    * delete({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const res = yield call(deleteSvc, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.message);
        return;
      }
      message.success('操作成功〜');
      yield put({
        type: 'list',
      });
    },
    * createYaml({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(createYaml, payload);
      if (!response) {
        return
      }
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          // detail: response.data,
          loading: false,
        },
      });
    },

    * createFrom({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(createForm, payload);
      if (!response) {
        return
      }
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          // detail: response.data,
          loading: false,
        },
      });
      yield put(routerRedux.push('/project/discovery/services/list'));
    },
    * detail({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(detail, payload);
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
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
      // yield put({ type: 'save', payload: {loading: false} });
      //   message.success('操作成功〜');
    },
    * list({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(list, payload);
      if (!response) {
        return
      }
      if (!response || response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          list: response.data.items,
          loading: false,
        },
      });
      // yield put({ type: 'save', payload: {loading: false} });
      message.success('操作成功〜');
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
