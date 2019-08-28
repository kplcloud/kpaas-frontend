import { queryActivities } from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'activities',

  state: {
    list: [],
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      if(!response) {
        return
      }
      if (response && response.code != 0){
        message.error(response.error)
        return
      }
       yield put({
        type: 'saveList',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
