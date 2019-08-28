import {getNoticeList, getNoticeReadCount, getNoticeView, clearAllNotice} from '../services/message';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'msgs',

  state: {
    noticeList: [],
    noticePage: {},
    readcount:{
      all:0,
      read:0,
      unread:0,
    },
    loading: false,
    listShow: true,
    noticeInfo:{},
  },

  effects: {
    *noticelist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getNoticeList, payload);
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
    *noticeReadCount({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getNoticeReadCount, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'saveRead',
        payload: response.data,
      });
    },
    *getNoticeView({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getNoticeView, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'saveView',
        payload: response.data,
      });
    },
    *clearAllNotice({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(clearAllNotice, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'noticeReadCount',
        payload: payload,
      });
      yield put({
        type: 'noticelist',
        payload: payload,
      });
    },

    
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        noticeList: action.payload.list,
        noticePage: action.payload.page,
      };
    },
    saveView(state, action) {
      return {
        ...state,
        noticeInfo: action.payload.data,
      };
    },
    saveRead(state, action) {
      return {
        ...state,
        readcount:{
          all: action.payload.read + action.payload.unread,
          read: action.payload.read,
          unread: action.payload.unread,
        }
      };
    },
    listShow(state, action) {
      return {
        ...state,
        listShow: true,
      };
    },
    listHidden(state, action) {
      return {
        ...state,
        listShow: false,
      };
    },
  },
};
