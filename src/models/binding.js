import {getWechatQR, testSendWechat, unBindWechat, updateBase, getNoticeReceive,updateNoticeReceive} from '../services/binding';
import {queryCurrent} from '../services/user';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'binding',

  state: {
    wechatInfo: [],
    userInfo:[],
    noticeReceive:[],
    loading: false,
    btnLoading: false,
    modalVisible: false,
    bindListData:{
      wechatTitle: "微信",
      wechatDesc: "未绑定",
      wechatClass: "unbinding",
      wechatBindButton: "",
      wechatUnBindButton: "none",
      wechatTestButton: "none",
      emailTitle: "邮箱",
      emailDesc: "已绑定",
      emailClass: "binding",
      emailBindButton: "none",
      beeTitle: "IM",
      beeDesc: "已绑定",
      beeClass: "binding",
      beeBindButton: "none",
    },
  },

  effects: {
    *wechatInfo({payload}, {call, put}) {
      const response = yield call(getWechatQR,payload);
      if (!response) {
        return
      }
      if (response && response.code != 0) {
        message.error("获取信息失败，请等技术冷却后再试~" + response.error)
        return
      }
      yield put({
        type: 'save',
        payload: response.data,
      });

    },
    *testSendWechat({payload}, {call, put}) {
      const response = yield call(testSendWechat,payload);
      if (!response) {
        return
      }
      if (response && response.code != 0) {
        message.error("推送微信测试信息失败，请等技术冷却后再试~")
        return
      }
      yield put({
        type: 'saveTestSend',
        payload: response.data,
      });

    },
    *unBinding({payload}, {call, put}) {
      const response = yield call(unBindWechat,payload);
      if (!response) {
        return
      }
      if (response && response.code != 0) {
        message.error("解绑失败，请等技术冷却后再试~")
        return
      }

      const response2 = yield call(queryCurrent);
      if (response2) {
        yield put({
          type: 'saveUserInfo',
          payload: response2.data,
        });
      }
    },
    *getUserInfo(_, {call, put}) {
      const response = yield call(queryCurrent);
      if (response) {
        yield put({
          type: 'saveUserInfo',
          payload: response.data,
        });
      }
    },
    *updateBase({payload}, {call, put}) {
      const response = yield call(updateBase,payload);
      if (!response) {
        return
      }
      if (response && response.code != 0) {
        message.error("更新失败，请等技术冷却后再试~")
        return
      }

      const response2 = yield call(queryCurrent);
      if (response2) {
        yield put({
          type: 'saveUserInfo',
          payload: response2.data,
        });
      }
    },
    *getNoticeReceive(payload, {call, put}) {
      const response = yield call(getNoticeReceive);
      if (response) {
        yield put({
          type: 'saveNoticeReceive',
          payload: response.data,
        });
      }
    },
    *updateNoticeReceive({payload}, {call, put}) {
      const response = yield call(updateNoticeReceive,payload);
      if (!response) {
        return
      }
      if (response && response.code != 0) {
        message.error("更新失败，请等技术冷却后再试~")
        return
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        modalVisible:true,
        wechatInfo: action.payload,
      };
    },
    saveTestSend(state, action){
      return {
        ...state,
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
    saveUserInfo(state, action) {
      return {
        ...state,
        userInfo: action.payload,
        bindListData:{
          wechatTitle: "微信",
          wechatDesc: action.payload.openid?"已绑定":"未绑定",
          wechatClass: action.payload.openid?"binding":"unbinding",
          wechatBindButton: action.payload.openid?"none":"",
          wechatUnBindButton: action.payload.openid?"":"none",
          wechatTestButton: action.payload.openid?"":"none",
          emailTitle: "邮箱",
          emailDesc: "已绑定",
          emailClass: "binding",
          emailBindButton: "none",
          beeTitle: "IM",
          beeDesc: "已绑定",
          beeClass: "binding",
          beeBindButton: "none",
        },
      };
    },
    saveNoticeReceive(state, action) {
      return {
        ...state,
        noticeReceive: action.payload,
      };
    },
  },
};
