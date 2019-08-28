import { queryNotices, clearNotices, noticeDetail, config } from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    noticeDetail: {},
    config: [],
    gitAddrType: '',
  },

  effects: {
    * fetchNoticeDetail({ payload }, { call, put, select }) {
      const response = yield call(noticeDetail, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'save',
        payload: {
          noticeDetail: response.data,
        },
      });
    },
    * fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      if (!data || data.code != 0) {
        message.error(data.error);
        return;
      }
      yield put({
        type: 'saveNotices',
        payload: data.data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    * clearNotices({ payload }, { call, put, select }) {
      const data = yield call(clearNotices, payload);
      if (!data) {
        return
      }
      if (data.code != 0) {
          message.error(data.error);
          return;
      }
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    * config(_, { call, put }) {
      const res = yield call(config);
      if (!res) {
        return
      }
      if (res && res.code != 0) {
        message.error(data.error);
        return;
      }
      if (res && res.data) {
        yield put({
          type: 'saveConfig',
          payload: res.data,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveConfig(state, { payload }) {
      return {
        ...state,
        config: payload,
        gitAddrType:payload.git_addr,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
