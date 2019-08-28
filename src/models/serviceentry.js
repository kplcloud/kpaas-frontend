/**
 * Created by huyunting on 2018/6/28.
 */
import {
  serviceEntryPull,
  serviceEntryUpdate,
  serviceEntryAdd,
  serviceEntryList,
  serviceEntryOne,
} from '../services/ingress';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'serviceentry',

  state: {
    list: [],
    page: [],
    loading: false,
    serviceentryData: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(serviceEntryList, payload);
      if (!response || response.code != 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({ type: 'hideLoading' });

    },
    * entryPull({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(serviceEntryPull, payload);
      if (!response || response.code != 0) {
        message.error('更新失败，请等技术冷却后再试~');
      } else {
        message.success('更新成功~');
        yield put({ type: 'list', payload });
      }
      yield put({ type: 'hideLoading' });
    },
    * add({ payload }, { call, put }) {
      const response = yield call(serviceEntryAdd, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      message.success('添加成功');
      yield put(routerRedux.push('/security/service/entry/list'));

    },
    * update({ payload }, { call, put }) {
      const response = yield call(serviceEntryUpdate, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功');
      yield put(routerRedux.push('/security/service/entry/list'));
    },
    * one({ payload }, { call, put }) {
      const response = yield call(serviceEntryOne, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      // response.data = {
      //   "metadata": {
      //     "name": "consul-ext",
      //     "namespace": "default",
      //     "creationTimestamp": null
      //   },
      //   "spec": {
      //     "addresses": [
      //       "10.134.89.171/27",
      //       "10.134.89.172/27",
      //       "10.134.89.173/27"
      //     ],
      //     "hosts": [
      //     ],
      //     "ports": [
      //       {
      //         "name": "http-port",
      //         "number": 8500,
      //         "protocol": "TCP"
      //       }
      //     ]
      //   }
      // };
      yield put({
        type: 'saveEgress',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.list,
        page: action.payload.page,
      };
    },
    saveEgress(state, action) {
      return {
        ...state,
        serviceentryData: action.payload,
      };
    },
    clearEgress(state) {
      return {
        ...state,
        serviceentryData: [],
      };
    },
    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false,
      };
    },


  },
};
