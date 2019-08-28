/**
 * Created by huyunting on 2018/5/17.
 */
import { message } from 'antd';
import {
  list,
  add,
  detail,
  getPvcList,
  getPvcDetail,
  addPvc,
  getPvDetail,
  listByNamespace,
} from '../services/storage';

export default {
  namespace: 'storage',

  state: {
    list: [],
    loading: false,
    detail: {},
    pvcList: [],
    pvcDetail: {},
    pvDetail: {},
    pagination: {}
  },

  effects: {
    * pvcAdd({ payload }, { call, put }) {
      const response = yield call(addPvc, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * pvDetail({ payload }, { call, put }) {
      const response = yield call(getPvDetail, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          pvDetail: response.data,
        },
      });
    },
    * pvcDetail({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(getPvcDetail, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          pvDetail: response.data.pv,
          pvcDetail: response.data.pvc,
          loading: false,
        },
      });
    },
    *pvcList({ payload }, { call, put }) {
      const response = yield call(getPvcList, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          pvcList: (response.data) && response.data.items,
          pagination: (response.data) && response.data.page,
          loading: false,
        },
      });
    },
    * getDetail({ payload }, { call, put }) {
      const response = yield call(detail, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
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
    * list({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(list, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          list: response.data,
          loading: false,
        },
      });
      // yield put({ type: 'save', payload: {loading: false} });
      message.success('操作成功〜');
    },
    * listByNamespace({ payload }, { call, put }) {
      yield put({ type: 'save', payload: { loading: true } });
      const response = yield call(listByNamespace, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          list: response.data,
          loading: false,
        },
      });
    },
    * add({ payload }, { call, put }) {
      const response = yield call(add, payload);
      if (!response || response.code != 0) {
        message.error('操作失败，请等技术冷却后再试~', response.error);
        return;
      }
      this.list();
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
