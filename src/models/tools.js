/**
 * Created by huyunting on 2018/5/17.
 */
import {
  duplication,
  fakeNamespaceTime,
} from '../services/tools';
import { message } from 'antd';

export default {
  namespace: 'tools',

  state: {
    loading: false,
  },

  effects: {
    * duplication({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(duplication, payload);
      if (!response) {
        return
      }
      if (response.code !== 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        return;
      }
      message.success('操作成功~');
    },
    //修改单个时间
    * fakeTime({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      if (!response) {
        return
      }
      if (response.code !== 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        return;
      }
      message.success('操作成功~');
    },
    //批量修改时间
    * fakeNamespaceTime({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(fakeNamespaceTime, payload);
      if (!response) {
        return
      }
      if (response.code !== 0) {
        message.error('操作失败，请等技术冷却后再试~' + response.error);
        return;
      }
      message.success('操作成功~');
    },
  },

  reducers: {
    openLoading(state) {
      return { ...state, loading: true };
    },
  },
};
