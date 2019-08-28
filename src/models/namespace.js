import {namespaceList, addNamespace} from '../services/namespace';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'namespace',

  state: {
    list: [],
    loading: false,
    btnLoading: false,
    modalVisible: false,
  },

  effects: {
    *list({payload}, {call, put}) {
      const response = yield call(namespaceList);
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
    *addNamespace({payload}, {call, put}) {
      yield put({type: "showButtonLoading"})
      const response = yield call(addNamespace, payload);
      yield put({type: "hideModal"})
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      if (!response || response.code != 0) {
        message.error("操作失败，请等技术冷却后再试~")
        return
      }
      yield put({type: "list"})
      yield put({type: "hideModal"})

    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    showModal (state, action) {
      return {
        ...state,
        ...action.payload,
        btnLoading: false,
        modalVisible: true
      }
    },
    showButtonLoading (state) {
      return {
        ...state,
        btnLoading: true
      }
    },

    hideModal (state, action) {
      return {
        ...state,
        modalVisible: false,
        btnLoading: false,
      }
    },
  },
};
