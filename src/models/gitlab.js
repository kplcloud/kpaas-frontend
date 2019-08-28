/**
 * Created by huyunting on 2018/6/5.
 */
import {
  gitlabBranches,
  gitlabTags,
  getTags,
  buildForCronjob,
  gitlabGetDockerfile,
  getBranches,
} from '../services/cronjob';
import { message } from 'antd';

export default {

  namespace: 'gitlab',

  state: {
    list: [],
    tags: [],
    branches: [],
    loading: false,
    buildModal: false,
    dockerfileContent: '',
  },

  effects: {
    * getTags({ payload }, { call, put }) {
      yield put({
        type: 'clearTags',
      });
      yield put({ type: 'openLoading' });
      const response = yield call(getTags, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'savaGit',
        payload: response.data,
      });
    },
    * getBranches({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getBranches, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'savaGit',
        payload: response.data,
      });
    },
    * getDockerfiles({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gitlabGetDockerfile, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        message.error('Dockerfile 获取失败~');
      }
      var content = '';
      if (response.code === 100003006) {
        content = response.error;
      } else {
        content = response.data;
      }
      yield put({
        type: 'savaDockerfile',
        payload: content,
      });
    },
    * tagList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gitlabTags, payload);
      yield put({ type: 'hideLoading' });
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'savaGit',
        payload: response.data,
      });

    },
    * branchList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(gitlabBranches, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'saveBranches',
        payload: response.data,
      });
      yield put({ type: 'hideLoading' });

    },
    * onBuildCronjob({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      if (!payload.tag || !payload.name || !payload.namespace) {
        message.error('提交失败，参数有误 请联系管理员~');
        console.log('build cronjob params', payload);
        return;
      }
      const response = yield call(buildForCronjob, payload);
      if (!response) {
        message.error('请求失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'jenkins/buildHistory',
        payload: { ...payload, name: payload.name + '-cronjob', checkProject: false },
      });
      console.log('gitlab-onbuild', payload);
      yield put({ type: 'hideBuildModal' });
      yield put({ type: 'hideLoading' });
    },
  },

  reducers: {
    saveTags(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    savaGit(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    saveBranches(state, action) {
      return {
        ...state,
        branches: action.payload,
      };
    },
    savaDockerfile(state, action) {
      return {
        ...state,
        dockerfileContent: action.payload,
      };
    },
    clearTags(state) {
      return {
        ...state,
        tags: [],
      };
    },
    // saveBranches(state, action) {
    //   return {
    //     ...state,
    //     list: action.payload,
    //   };
    // },
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
    //弹框控制展示及隐藏
    showBuildModal(state) {
      return {
        ...state,
        buildModal: true,
      };
    },
    hideBuildModal(state) {
      return {
        ...state,
        buildModal: false,
      };
    },
  },
};

