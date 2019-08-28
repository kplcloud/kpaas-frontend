import {getNoticeProclaim,getUserList,getNamespaceList,addNoticeProclaim,viewNoticeProclaim} from '../services/proclaim';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'proclaim',

  state: {
    proclaimList: [],
    proclaimPage: {},
    allNamespacesList: [],
    userList:[],
    proclaimView: {},
    addProclaimStatus:false,
    loading: false,
    btnLoading: false,
    modalVisible: false,
    modalType:"add",
  },

  effects: {
  	*proclaimlist({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getNoticeProclaim, payload);
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
    *namespacesList({payload}, {call, put}) {
      const response = yield call(getNamespaceList);
      if (response && response.code == 0) {
        yield put({
          type: 'saveAllNamespacesList',
          payload: response.data,
        });
      }
    },
    *userList({payload}, {call, put}) {
      const response = yield call(getUserList);
      if (response && response.code == 0) {
        yield put({
          type: 'saveUserList',
          payload: response.data,
        });
      }
    },
    *addProclaimStatus({payload}, {call, put}) {
      yield put({
          type: 'saveAddProclaimStatus',
          payload: false,
        });
    },
    *addProclaim({payload}, {call, put}) {
      const response = yield call(addNoticeProclaim,payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
  	  message.success('发布成功~');

      yield put(routerRedux.push("/system/proclaim"));
    },
    *viewProclaim({payload}, {call, put}) {
      const response = yield call(viewNoticeProclaim,payload);
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
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        proclaimList: action.payload.list,
        proclaimPage: action.payload.page,
      };
    },
    saveView(state, action) {
      return {
        ...state,
        proclaimView: action.payload,
      };
    },
    saveAddProclaimStatus(state,action) {
      return {
        ...state,
        addProclaimStatus: action.payload,
      };
    },
    saveAllNamespacesList(state, action){
      return {
        ...state,
        allNamespacesList: action.payload,
      };
    },
    saveUserList(state, action){
      return {
        ...state,
        userList: action.payload,
      };
    },
  },
};
