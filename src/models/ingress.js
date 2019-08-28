import { ingressList, addIngress, UpdateIngress, ingressDetail, getProjectByNamespace } from '../services/ingress';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'ingress',

  state: {
    list: [],
    page: [],
    loading: false,
    projectList: [],
    detail: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(ingressList, payload);
      yield put({ type: 'hideLoading' });
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
    },
    * addNamespace({ payload }, { call, put }) {
      const response = yield call(addIngress, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      // yield put({type: "list", payload})

    },
    * detail({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const response = yield call(ingressDetail, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        console.log('Ingress Detail Response', response);
        // message.error('获取失败~');
        return;
      }
      if (response.code !== 0) {
        console.log('Ingress Detail Response', response);
        // message.error(response.error);
        return;
      }
      yield put({ type: 'saveDetail', payload: response.data });

    },
    * getProjectListByNamespace({ payload }, { call, put }) {
      const response = yield call(getProjectByNamespace, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }

      yield put({
        type: 'saveProject',
        payload: response.data,
      });
    },
    * UpdateIngress({ payload }, { call, put }) {
      const response = yield call(UpdateIngress, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      message.success('操作成功！');
      yield put(routerRedux.push('/security/ingress/list'));
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
    saveProject(state, action) {
      return {
        ...state,
        projectList: action.payload,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    clearDtail(state) {
      return {
        ...state,
        detail: [],
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
