/**
 * Created by huyunting on 2018/6/4.
 */
import {cronjobList, addCronjob, updateCronjob, oneCronjob, deleteCronjob, updatCronjobLogPath,addConfigEnv,updateConfigEnv,deleteConfigEnv,getConfigEnv,addConfigMap,getConfigMap,addConfigMapData,updateConfigMapData,deleteConfigMapData,getConfigMapData} from '../services/cronjob';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {

  namespace: 'cronjob',

  state: {
    list: [],
    btnLoading: false,
    loading: false,
    page: [],
    cronjobInfo: [],
    configEnvList: [],
    configEnvPage: [],
    configMapInfo: {},
    configMapDataList: [],
    configMapDataPage: [],
  },

  effects: {
    *list({payload}, {call, put}) {
      yield put({type: "openLoading"})
      const response = yield call(cronjobList, payload);
      if (!response || response.code != 0) {
        message.error("获取信息失败，请等技术冷却后再试~")
        return
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({type: "hideLoading"})

    },
    *add({payload}, {call, put}){
      yield put({type: "openBtnLoading"});
      const response = yield call(addCronjob, payload);
      yield put({type: "hideBtnLoading"});
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("添加成功~");
      yield put(routerRedux.push('/project/cornjob/list'));
    },
    *update({payload}, {call, put}){
      yield put({type: "openBtnLoading"});
      const response = yield call(updateCronjob, payload);
      yield put({type: "hideBtnLoading"});
      if (!response) {
        message.error("操作失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("操作成功~");
      yield put(routerRedux.push('/project/cornjob/list'));
    },
    *delete({payload}, {call, put}){
      yield put({type: "openBtnLoading"});
      if (!payload.name || !payload.namespace) {
        message.error("删除操作有误，请等技术冷却后再试~");
        console.log("delete cronjob params ", payload);
        return
      }
      const response = yield call(deleteCronjob, payload);
      yield put({type: "hideBtnLoading"});
      console.log("delete cronjob response", response);
      if (!response) {
        message.error("操作失败，请等技术冷却后再试~");
        return
      } else if (response.code !== 0) {
        message.error(response.error);
        return
      }
      // message.success("操作成功~");
      
      const response2 = yield call(cronjobList, payload);
      if (!response2 || response2.code != 0) {
        message.error("获取信息失败，请等技术冷却后再试~")
        return
      }
      yield put({
        type: 'save',
        payload: response2.data,
      });
      yield put({type: "hideLoading"})
    },
    *getOneCronjob({payload}, {call, put}){
      const response = yield call(oneCronjob, payload);
      if (!response) {
        message.error("网络异常，请等技术冷却后再试~")
        return
      }
      if (response.code != 0) {
        message.error(response.error)
        return
      }
      if (response.data && response.data.git_path && response.data.git_type) {
        if (response.data.git_type == "branch") {
          yield put({
            type: "gitlab/branchList",
            payload: {
              "git": response.data.git_path,
            }
          });
        }
        if (response.data.git_type == "tag") {
          yield put({
            type: "gitlab/tagList",
            payload: {
              "git": response.data.git_path,
            }
          });
        }
      }
      yield put({
        type: 'saveOne',
        payload: response.data,
      });
    },
    *updateLogPath({payload}, {call, put}){
      const response = yield call(updatCronjobLogPath, payload);
      if (!response) {
        message.error("操作失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("操作成功~");
      yield put({type: "getOneCronjob", payload: {...payload}});
    },

    *addConfigEnv({payload}, {call, put}){
      const response = yield call(addConfigEnv, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("添加成功~");
      yield put({type: "getConfigEnv", payload: {...payload}});
    },
    *updateConfigEnv({payload}, {call, put}){
      const response = yield call(updateConfigEnv, payload);
      if (!response) {
        message.error("修改失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("修改成功~");
      yield put({type: "getConfigEnv", payload: {...payload}});
    },
    *deleteConfigEnv({payload}, {call, put}){
      const response = yield call(deleteConfigEnv, payload);
      if (!response) {
        message.error("删除失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("删除成功~");
      yield put({type: "getConfigEnv", payload: {...payload}});
    },
    *getConfigEnv({payload}, {call, put}){
      const response = yield call(getConfigEnv, payload);
      if (!response) {
        message.error("获取失败，请等技术冷却后再试~");
        return
      }
      yield put({
        type: 'saveConfigEnv',
        payload: response.data,
      });
    },

    *addConfigMap({payload}, {call, put}){
      const response = yield call(addConfigMap, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("添加成功~");
      yield put({type: "getConfigMap", payload: {...payload}});
    },
    *getConfigMap({payload}, {call, put}){
      const response = yield call(getConfigMap, payload);
      if (response.code != 0) {
        //message.error(response.message);
        return
      }
      yield put({
        type: 'saveConfigMap',
        payload: response.data,
      });
    },

    *addConfigMapData({payload}, {call, put}){
      const response = yield call(addConfigMapData, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("添加成功~");
      yield put({type: "getConfigMapData", payload: {...payload}});
    },
    *updateConfigMapData({payload}, {call, put}){
      const response = yield call(updateConfigMapData, payload);
      if (!response) {
        message.error("修改失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("修改成功~");
      yield put({type: "getConfigMapData", payload: {...payload}});
    },
    *deleteConfigMapData({payload}, {call, put}){
      const response = yield call(deleteConfigMapData, payload);
      if (!response) {
        message.error("删除失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("删除成功~");
      yield put({type: "getConfigMapData", payload: {...payload}});
    },
    *getConfigMapData({payload}, {call, put}){
      const response = yield call(getConfigMapData, payload);
      if (response.code != 0) {
        //message.error(response.message);
        return
      }
      yield put({
        type: 'saveConfigMapData',
        payload: response.data,
      });
    },

  },

  reducers: {
    saveOne(state, action){
      return {
        ...state,
        cronjobInfo: action.payload,
      }
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
        // page: action.payload.page,
      };
    },
    openLoading(state){
      return {
        ...state,
        loading: true,
      }
    },
    hideLoading(state){
      return {
        ...state,
        loading: false,
      }
    },
    openBtnLoading(state){
      return {
        ...state,
        btnLoading: true,
      }
    },
    hideBtnLoading(state){
      return {
        ...state,
        btnLoading: false,
      }
    },
    saveConfigEnv(state,action){
      return{
        ...state,
        configEnvList: action.payload.list,
        configEnvPage: action.payload.page,
      }
    },
    saveConfigMap(state,action){
      return{
        ...state,
        configMapInfo: action.payload,
      }
    },
    saveConfigMapData(state,action){
      return{
        ...state,
        configMapDataList: action.payload.list,
        configMapDataPage: action.payload.page,
      }
    },
  },
};
