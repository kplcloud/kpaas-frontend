import { gatewayList, gatewayOne, gatewayCreate } from '../services/ingress';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { message } from 'antd';

export default {
  namespace: 'gateway',

  state: {
    loading: false,
    list: [],
    detail: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gatewayList, payload);
      yield put({ type: 'closeLoading' });
      if (response && response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    * create({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gatewayCreate, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('操作失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功');
      yield put(routerRedux.push('/security/gateway/list'));
    },
    * one({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gatewayOne, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('操作失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'saveOne', payload: response.data });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveOne(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    clearOne(state) {
      return {
        ...state,
        detail: [],
      };
    },
    openLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    closeLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },
  },
};
