/**
 * Created by huyunting on 2018/5/11.
 */
import {templateList, oneTemplate, addTemplate, updateTemplate} from '../services/template';
import {message} from 'antd';
import {routerRedux} from 'dva/router';


export default {
  namespace: 'template',

  state: {
    list: [],
    page: [],
    loading: false,
    oneTempData: [],
  },

  effects: {
    *GetTempList({payload}, {call, put}) {
      yield put({type: 'openLoading'});
      const response = yield call(templateList, payload);
      if (!response || response.code != 0) {
        message.error("获取信息失败，请等技术冷却后再试~")
        return
      }
      yield put({type: 'closeLoading'});
      yield put({
        type: 'save',
        payload: response.data,
      });

    },
    *GetOneTemplate({payload}, {call, put}){
      const response = yield call(oneTemplate, payload);
      if (!response) {
        message.error("获取信息失败，请等技术冷却后再试~")
        return
      }
      if (response.code != 0) {
        message.error("获取信息失败~")
        return
      }
      yield put({type: "saveOne", payload: response.data})
    },
    *createTemplate({payload}, {call, put}) {
      yield put({type: "openLoading"})
      const response = yield call(addTemplate, payload);
      yield put({type: "closeLoading"})
      if (!response) {
        yield put({
          type: "openLoading"
        })
        message.error("保存失败，请等技术冷却后再试~")
        return
      }
      if (response.code != 0) {
        message.error(response.error)
        return
      }
      message.success("添加成功~");
      yield put(routerRedux.push('/template/list'));
    },
    *updateTemplate({payload}, {call, put}) {
      yield put({type: "openLoading"})
      const response = yield call(updateTemplate, payload);
      yield put({type: "closeLoading"})
      if (!response) {
        yield put({
          type: "openLoading"
        })
        message.error("保存失败，请等技术冷却后再试~")
        return
      }
      if (response.code != 0) {
        message.error(response.error)
        return
      }
      yield put(routerRedux.push('/template/list'));
    },


  },

  reducers: {
    saveOne(state, action) {
      return {
        ...state,
        oneTempData: action.payload,
      }
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload.list,
        page: action.payload.page,
      };
    },
    closeLoading(state){
      return {
        ...state,
        loading: false,
      }
    },
    openLoading(state){
      return {
        ...state,
        loading: true,
      }
    },

  },
};
