/**
 * Created by huyunting on 2018/5/17.
 */
import {
    getResources,
    add
  } from '../services/resource';
  import { message } from 'antd';
  export default {
    namespace: 'resource',
  
    state: {
      list: [],
      loading: false,
      detail: {}
    },
  
    effects: {
      *list({ payload }, { call, put }) {
        yield put({ type: 'save', payload: {loading: true} });
        const response = yield call(getResources, payload);
        if (!response) {
          return
        }
        if (!response || response.code != 0) {
          message.error('操作失败，请等技术冷却后再试~', response.error);
          return;
        }
        yield put({
          type: 'save',
          payload: {
              list: response.data.items,
              loading: false
          },
        });
        // yield put({ type: 'save', payload: {loading: false} });
        // message.success('操作成功〜');
      },
      *generate({ payload }, { call, put }) {
        const response = yield call(add, payload);
        if (!response) {
          return
        }
        if (!response || response.code != 0) {
          message.error('操作失败，请等技术冷却后再试~', response.error);
          return;
        }
        message.success('操作成功〜 正在部署......');
        setTimeout(function() {
            location.reload();
          }, 1000);
      }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload};
        }
    },
  };
  