import {egressList, egressPull, egressAdd, egressOne,egressUpdate, getProjectByNamespace} from '../services/ingress';
import {message} from 'antd';
import {routerRedux} from 'dva/router';
export default {
  namespace: 'egress',

  state: {
    list: [],
    page: [],
    loading: false,
    projectList: [],
    egressData: [],
  },

  effects: {
    *list({payload}, {call, put}) {
      yield put({type: "showLoading"})
      const response = yield call(egressList, payload);
      if (!response || response.code != 0) {
        message.error("获取信息失败，请等技术冷却后再试~");
        return
      }
      yield put({
        type: 'save',
        payload: response.data,
      });
      yield put({type: "hideLoading"})

    },
    *egressPull({payload}, {call, put}){
      yield put({type: "showLoading"});
      const response = yield call(egressPull, payload);
      if (!response || response.code != 0) {
        message.error("更新失败，请等技术冷却后再试~");
      } else {
        message.success("更新成功~");
        yield put({type: "list", payload})
      }
      yield put({type: "hideLoading"});
    },
    *add({payload}, {call, put}){
      const response = yield call(egressAdd, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("添加成功");
      yield put(routerRedux.push('/security/egress/list'));

    },
    *update({payload},{call,put}){
      const response = yield call(egressUpdate, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      message.success("操作成功");
      yield put(routerRedux.push('/security/egress/list'));
    },
    *one({payload}, {call, put}){
      const response = yield call(egressOne, payload);
      if (!response) {
        message.error("添加失败，请等技术冷却后再试~");
        return
      }
      if (response.code != 0) {
        message.error(response.error);
        return
      }
      yield put({
        type: 'saveEgress',
        payload: response.data,
      })
    },
    *getProjectListByNamespace({payload}, {call, put}){
      const response = yield call(getProjectByNamespace, payload);
      if (!response || response.code !== 0) {
        message.error("操作失败，请等技术冷却后再试~");
        return
      }

      yield put({
        type: 'saveProject',
        payload: response.data,
      });
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
    saveEgress(state, action){
      return {
        ...state,
        egressData: action.payload,
      };
    },
    saveProject(state, action) {
      return {
        ...state,
        projectList: action.payload,
      };
    },
    showLoading(state){
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
    }


  },
};
