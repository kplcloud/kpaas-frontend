import {
  virtualserviceList,
  virtualserviceOne,
  virtualservicePull,
  virtualserviceCreateStep1,
  virtualserviceCreateStep2,
  virtualserviceCreate,
  virtualserviceDelete,
  virtualserviceMirror
} from '../services/virtualservice';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

export default {
  namespace: 'virtualservice',

  state: {
    list: [],
    page: [],
    loading: false,
    oneInfo: [],
    httpLength: 0,
    submitStatus: false,
    responseCode: 0,
    responseMsg: 'success',
    editPage: '',
  },

  effects: {
    * mirror({payload}, {call, put}){
      const response = yield call(virtualserviceMirror, payload);
      if (!response) {
        message.error('操作失败~');
        return;
      }
      if (response && response.code !== 0) {
        message.error(response.error);
        return;
      }
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * list({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(virtualserviceList, payload);
      if (!response) {
        message.error('数据获取失败~');
        return;
      }
      if (response && response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    * one({ payload }, { call, put }) {
      if (!payload.namespace || !payload.name) {
        message.error('参数错误~');
        return;
      }
      const response = yield call(virtualserviceOne, payload);
      if (!response) {
        message.error('数据获取失败~');
        return;
      }
      if (response && response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
    },
    * pull({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(virtualservicePull, payload);
      if (!response) {
        message.error('数据更新失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'list', payload: payload });
    },
    * addInfo({ payload }, { call, put }) {
      const response = yield call(virtualserviceCreateStep1, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      //@todo 页面跳转
      yield put(routerRedux.push('/security/virtual/service/create/route/' + payload.namespace + '/' + payload.name));
    },
    * addRoute({ payload }, { call, put }) {
      const response = yield call(virtualserviceCreateStep2, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('修改成功~');
      yield put({
        type: 'changeEditPage',
        payload: {
          eidt: '',
        },
      });
      setTimeout(window.location.reload(), 1000);
    },
    * pushCreate({ payload }, { call, put }) {
      if (!payload.name) {
        message.error('参数错误~');
        return;
      }
      const response = yield call(virtualserviceCreate, payload);
      if (!response) {
        message.error('添加失败，请等技术冷却后再试~');
        return;
      }
      yield put({ type: 'chooseSubmit', payload: { ...response } });
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功~');
      yield put(routerRedux.push('/security/virtual/service/list'));
    },
    * virtualserviceDelete({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(virtualserviceDelete, payload);
      yield put({ type: 'closeLoading' });
      if (!payload.name || !payload.namespace) {
        message.error('参数错误~');
        return;
      }
      if (!response) {
        message.error('操作失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功~');
      yield put({ type: 'list', payload: payload });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        page: action.payload.page,
      };
    },
    saveOne(state, action) {
      if (action.payload.http && action.payload.http.length > 0) {
        return {
          ...state,
          oneInfo: action.payload,
          httpLength: action.payload.http.length,
        };
      }
      return {
        ...state,
        oneInfo: action.payload,
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
    chooseSubmit(state, action) {
      return {
        ...state,
        submitStatus: true,
        responseCode: action.payload.code,
        responseMsg: action.payload.message,
      };
    },
    choseSubmit(state) {
      return {
        ...state,
        submitStatus: false,
      };
    },
    changeEditPage(state, action) {
      return {
        ...state,
        editPage: action.payload.edit,
      };
    },

  },
};
