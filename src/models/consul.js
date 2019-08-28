import { message } from 'antd';
import {
  consulAclList,
  consulAclOne,
  consulAclCreate,
  consulAclUpdate,
  consulAclDelete,
  consulKVList,
  consulKVDetail,
  consulKVUpdate,
  consulKVDelete,
} from '../services/consul';
import * as routerRedux from 'react-router-redux';

export default {
  namespace: 'consul',

  state: {
    list: [],
    detail: [],
    AclPage: [],
    loading: false,
    kvList: [],
    kvData: [],
  },

  effects: {
    * AclList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(consulAclList, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('数据获取失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveAcl',
        payload: response.data,
      });
    },
    * AclDetail({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(consulAclOne, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('数据获取失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveAclDetail',
        payload: response.data,
      });
    },
    * ACLCreate({ payload }, { call, put }) {
      const response = yield call(consulAclCreate, payload);
      if (!response) {
        message.error('添加失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('添加成功~');
      yield put(routerRedux.push('/conf/consul/acl/list'));
    },
    * ACLUpdate({ payload }, { call, put }) {
      const response = yield call(consulAclUpdate, payload);
      if (!response) {
        message.error('修改失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('修改成功~');
      yield put(routerRedux.push('/conf/consul/acl/list'));
    },
    * ACLDelete({ payload }, { call, put }) {
      var response = yield call(consulAclDelete, payload);
      if (response.typeOf === 'string') {
        response = JSON.parse(response);
      }
      if (!response) {
        message.error('删除失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('删除成功~');
      window.location.reload();
    },
    * KVList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(consulKVList, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('数据获取失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveKVList',
        payload: response.data,
      });
    },
    * KVDetail({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(consulKVDetail, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('数据获取失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveKVDetail',
        payload: response.data,
      });
    },
    * KVCreate({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(consulKVUpdate, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('添加失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('添加成功~');
      yield put({ type: 'consul/KVList', payload: { ...payload } });
      yield put({ type: 'saveKVDetail', payload: {} });
    },
    * KVDelete({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      var response = yield call(consulKVDelete, payload);
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('删除失败');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('删除成功~');
      yield put({ type: 'consul/KVList', payload: { ...payload, prefix: payload.prefixStr } });
      yield put({ type: 'saveKVDetail', payload: {} });
    },
  },
  reducers: {
    openLoading(state) {
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
    saveAcl(state, action) {
      return {
        ...state,
        list: action.payload.items,
        AclPage: action.payload.page,
      };
    },
    saveAclDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveKVList(state, action) {
      return {
        ...state,
        kvList: action.payload,
      };
    },
    saveKVDetail(state, action) {
      return {
        ...state,
        kvData: action.payload,
      };
    },
  },
};
