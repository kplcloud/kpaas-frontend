/**
 * Created by huyunting on 2018/11/23.
 */
import { GetAll, AddDockerFile, UpdateDockerFile, GetOne } from '../services/dockerfile';
import { message } from 'antd';

export default {
  namespace: 'dockerfile',

  state: {
    list: [],
    detailInfo: [],
    uploader: [],
    loading: false,
    btnLoading: false,
    modalVisible: false,
    page: [],
  },

  effects: {
    * list({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(GetAll, payload);
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
    * detail({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(GetOne, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('获取信息失败，请稍再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'saveDetail', payload: response.data });

    },
    * addDockerFile({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(AddDockerFile, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('添加失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'list' });
    },
    * updateDockerFile({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(UpdateDockerFile, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('修改失败，请稍后再试' + response.error);
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('修改成功');
      yield put({ type: 'list' });
    },

  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload.items,
        page: action.payload.page,
      };
    },
    saveDetail(state, action) {
      return {
        ...state,
        detailInfo: action.payload,
        uploader: action.payload.member,
      };
    },
    saveOne(state, action) {
      return {
        ...state,
        confMap: action.payload.confMap,
        confData: action.payload.confData,
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
