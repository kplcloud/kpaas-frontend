import {nsList,buildList} from "../services/statistics"
import { message } from 'antd';


export default {

  namespace: 'statistics',

  state: {
    nsList: [],
    buildList: [],
    buildListPaginate: {},
  },

  effects: {
    *nsList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(nsList, payload);
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'saveNsList',
        payload: response.data,
      });
    },
    *buildList({ payload ,ns}, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(buildList, payload,ns);
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'saveBuildList',
        payload: response.data,
      });
    },
  },
  reducers: {
    saveNsList(state, action){
      return {
        ...state,
        nsList: action.payload,
      }
    },
    saveBuildList(state, action){
    return {
      ...state,
      buildList: action.payload,
      buildListPaginate: action.payload.page,
    }
},
  },
}
