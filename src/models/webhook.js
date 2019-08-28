import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  webhookList,
  webhookCreate,
  webhookUpdate,
  webhookDetail,
  webhookTest,
  EventsList,
  webhookListNoApp,
  webhookCreateNoApp,
  webhookDetailNoApp,
  webhookUpdateNoApp,
} from '../services/webhook';


export default {
  namespace: 'webhook',

  state: {
    list: [],
    detail: [],
    page: [],
    loading: false,
    events: [],
    showModal: false,
    reload: false,
    editStatus: false, // true 编辑，false 创建
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(webhookList, payload);
      yield put({ type: 'hideLoading' });
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    * listNoApp({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(webhookListNoApp, payload);
      yield put({ type: 'hideLoading' });
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    * create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      if (payload.type === 'modal') {
        const response = yield call(webhookCreate, payload);
        yield put({ type: 'hideLoading' });
        if (!response || response.code !== 0) {
          message.error('提交失败，请等技术冷却后再试~');
          return;
        }
        message.success('success~');
        yield put({
          type: 'changeModal',
          payload: {
            visible: false,
            editStatus: false,
          },
        });
        yield put({ type: 'list', payload: { app_name: payload.app_name, namespace: payload.namespace } });
      } else {
        const response = yield call(webhookCreateNoApp, payload);
        yield put({ type: 'hideLoading' });
        if (!response || response.code !== 0) {
          message.error('提交失败，请等技术冷却后再试~');
          return;
        }
        message.success('success~');
        yield put(routerRedux.push(`/conf/webhook/list`));
      }
    },
    * update({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });

      if (payload.type === 'modal') {
        const response = yield call(webhookUpdate, payload);
        yield put({ type: 'hideLoading' });
        if (!response || response.code !== 0) {
          message.error('提交失败，请等技术冷却后再试~');
          return;
        }
        message.success('success~');
        yield put({
          type: 'changeModal',
          payload: {
            visible: false,
            editStatus: false,
          },
        });
        yield put({ type: 'list', payload: { app_name: payload.app_name, namespace: payload.namespace } });
      } else {
        const response = yield call(webhookUpdateNoApp, payload);
        yield put({ type: 'hideLoading' });
        if (!response || response.code !== 0) {
          message.error('提交失败，请等技术冷却后再试~');
          return;
        }
        message.success('success~');
        yield put(routerRedux.push(`/conf/webhook/list`));
      }
    },
    * detail({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(webhookDetail, payload);
      yield put({ type: 'hideLoading' });
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    * detailNoApp({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(webhookDetailNoApp, payload);
      yield put({ type: 'hideLoading' });
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'saveDetail',
        payload: response.data,
      });
    },
    * webhookTest({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(webhookTest, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('发送失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('发送成功~');
    },
    * eventList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(EventsList, payload);
      if (!response || response.code !== 0) {
        message.error('获取信息失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'saveEvent',
        payload: response.data,
      });
      yield put({ type: 'hideLoading' });
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveEvent(state, action) {
      return {
        ...state,
        events: action.payload,
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
    changeModal(state, action) {
      return {
        ...state,
        showModal: action.payload.visible,
        editStatus: action.payload.editStatus,
      };
    },
    changeReload(state, action) {
      return {
        ...state,
        reload: action.payload.reload,
        editStatus: action.payload.editStatus,
      };
    },

  },
};
