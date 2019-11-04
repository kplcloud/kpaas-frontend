// import { queryTags } from '../services/api';
import {getNamespaceMetrics, getDashboardMonitor, getRequestOps, getNetwork, getProjectMetrics} from '../services/monitor';
import {message} from 'antd'

export default {
  namespace: 'monitor',

  state: {
    tags: [],
    cpuAndMemory: {},
    ops: [],
    network: [],
    podMonitor: []
  },

  effects: {
    *getNetwork({payload}, {call, put}){
      const response = yield call(getNetwork);
      if (!response) {
        return
      }
      if (response.code != 0) {
        message.error(response.error)
        return
      }
      yield put({
        type: 'save',
        payload: {
          network: response.data,
        }
      });
    },
    *fetchOps({payload}, { call, put }) {
      const response = yield call(getRequestOps);
      if (!response) {
        return
      }

      if (response.code != 0) {
        message.error(response.error)
        return
      }
      yield put({
        type: 'save',
        payload: {
          ops: response.data,
        }
      });
    },
    *fetchTags(_, { call, put }) {
      const response = yield call(getDashboardMonitor);
      if (!response) {
        return
      }
      if (response.code != 0) {
        message.error(response.error)
        return
      }
      yield put({
        type: 'saveTags',
        payload: response.data,
      });
    },
    *fetchMetrics({payload}, {call, put}) {
      const response = yield call(getNamespaceMetrics);
      if(!response) {
        return
      }
      if (response && response.code != 0){
        message.error(response.error)
        return
      }
      yield put({
        type: 'saveMetrics',
        payload: response.data,
      });
    },
    *fetchProjectMetrics({payload, callback}, {call, put}) {
      const response = yield call(getProjectMetrics, payload);
      if(!response) {
        return
      }
      if (response.code != 0){
        message.error(response.error)
        return
      }
      yield put({
        type: 'save',
        payload: {
          podMonitor: response.data
        },
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      }
    },
    saveTags(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    saveMetrics(state, action) {
      return {
        ...state,
        cpuAndMemoryMetrics: action.payload,
      };
    }
  },
};
