/**
 * Created by huyunting on 2018/5/21.
 */
import {
  confMapList,
  addConMap,
  updateConMap,
  oneConMap,
  deleteConMap,
  confGetOnePull,
} from '../services/conf';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'conf',

  state: {
    list: [],
    confMap: [],//单个字典信息
    confMapCode: 1,
    confData: [],//字典数据信息
    loading: false,
    btnLoading: false,
    modalVisible: false,
    page: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(confMapList, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({ type: 'hideLoading' });

    },
    * OneConf({ payload }, { call, put }) {
      const response = yield call(oneConMap, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'saveOne',
        payload: response.data,
      });

    },
    * OneConfPull({ payload }, { call, put }) {
      const response = yield call(confGetOnePull, payload);
      if (!response) {
        yield put({
          type: 'saveOnePull',
          payload: {
            code: 1,
            data: [],
          },
        });
        console.log('Get ConfigMap Error', response);
        return;
      }
      yield put({
        type: 'saveOnePull',
        payload: response,
      });

    },

    * addConfMap({ payload }, { call, put }) {
      // yield put({type: "showButtonLoading"})
      const response = yield call(addConMap, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put(routerRedux.push('/conf/configMap'));

    },
    * updateConfMap({ payload }, { call, put }) {
      // yield put({type: "showButtonLoading"})
      const response = yield call(updateConMap, payload);

      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put(routerRedux.push('/conf/configMap'));

    },
    * deleteConfMap({ payload }, { call, put }) {
      const response = yield call(deleteConMap, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({ type: 'list', payload });
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
    saveOne(state, action) {
      return {
        ...state,
        confMap: action.payload.confMap,
        confData: action.payload.confData,
      };
    },
    saveOnePull(state, action) {
      return {
        ...state,
        confMap: action.payload.data,
        confMapCode: action.payload.code,
      };
    },
    clearConfData(state) {
      return {
        ...state,
        confData: [],
        confMap: [],
      };
    },
    openLoading(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    hideLoading(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        btnLoading: false,
        modalVisible: true,
      };
    },
    showButtonLoading(state) {
      return {
        ...state,
        btnLoading: true,
      };
    },

    hideModal(state, action) {
      return {
        ...state,
        modalVisible: false,
        btnLoading: false,
      };
    },
  },
};
