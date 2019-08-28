/**
 * Created by huyunting on 2018/5/17.
 */
import {
    list,
  } from '../services/nodes';
  import { message } from 'antd';
  export default {
    namespace: 'nodes',
  
    state: {
      list: [],
      loading: false,
      detail: {}
    },
  
    effects: {
      *list({ payload }, { call, put }) {
        yield put({ type: 'save', payload: {loading: true} });
        const response = yield call(list, payload);
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
              list: response.data.items,
              loading: false
          },
        });
        // yield put({ type: 'save', payload: {loading: false} });
        message.success('操作成功〜');
      }
    },
  
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload};
        }
    },
  };
  