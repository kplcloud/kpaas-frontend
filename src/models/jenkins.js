/**
 * Created by huyunting on 2018/8/3.
 */
import {
  projectBuild,
  projectBuildLogs,
  projectBuildHistory,
  projectBuildStop,
} from '../services/project';
import { LastBuilds, GetJenkinsConf } from '../services/builds';
import { message } from 'antd';
import {cronjobBuildHistory,cronjobBuildLogs} from '../services/cronjob'

export default {
  namespace: 'jenkins',

  state: {
    loading: false,
    lastBuilds: [],
    buildLogs: {},
    buildLogsLoading: false,
    buildHistory: [],
    jenkinsConf: [],
  },
  effects: {
    * buildLogs({ payload }, { call, put }) {
      // yield put({type: "clearBuildLogs"});
      // yield put({ type: 'openLoading' });
      const response = payload.types === "cronjob" ? yield call(cronjobBuildLogs, payload) : yield call(projectBuildLogs, payload);
      // yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('未获取到build日志信息或无权限访问');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveBuildLogs',
        payload: response.data,
      });
    },
    * buildHistory({ payload }, { call, put }) {
      yield put({ type: 'clearBuildHistorys' });
      console.log(payload.types,"22222222222")
      const response = payload.types === "cronjob" ? yield call(cronjobBuildHistory, payload) : yield call(projectBuildHistory, payload);
      if (!response) {
        message.error('未获取到build 历史信息或无权限访问');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveBuildHistorys',
        payload: response.data,
      });
    },

    * cronBuildHistory({ payload }, { call, put }) {
      yield put({ type: 'clearBuildHistorys' });
      const response = yield call(cronjobBuildHistory, payload);
      if (!response) {
        message.error('未获取到build 历史信息');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveBuildHistorys',
        payload: response.data,
      });
    },

    * stopBuild({ payload }, { call, put }) {
      const response = yield call(projectBuildStop, payload);
      if (!response) {
        message.error('未获取到build 历史信息');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'buildHistory',
        payload: { ...payload },
      });
    },
    * lastBuild({ payload }, { call, put }) {
      const response = yield  call(LastBuilds, payload);
      if (response && response.code === 0 && response.data) {
        yield put({
          type: 'saveLastBuildInfo',
          payload: { action: response.data },
        })
        ;
      }
    },
    * JenkinsConf({ payload }, { call, put }) {
      const response = yield  call(GetJenkinsConf, payload);
      if (response && response.code === 0 && response.data) {
        yield put({
          type: 'saveJenkinsConf',
          payload: { action: response.data },
        });
      }
    },

  },

  reducers: {
    closeLoading(state, action) {
      return {
        ...state,
        loading: false,
      };
    },
    openLoading(state, action) {
      return {
        ...state,
        loading: true,
      };
    },
    showBuildLogsLoading(state) {
      return {
        ...state,
        buildLogsLoading: true,
      };
    },
    hideBuildLogsLoading(state) {
      return {
        ...state,
        buildLogsLoading: false,
      };
    },
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
      };
    },
    saveBuildLogs(state, { payload }) {
      return {
        ...state,
        buildLogs: payload,
      };
    },
    clearBuildLogs(state) {
      return {
        ...state,
        buildLogs: {},
      };
    },
    clearBuildHistorys(state) {
      return {
        ...state,
        buildHistory: [],
      };
    },
    saveBuildHistorys(state, { payload }) {
      return {
        ...state,
        buildHistory: payload,
      };
    },
    saveProjectList(state, { payload }) {
      return {
        ...state,
        projectList: payload,
      };
    },
    saveLastBuildInfo(state, { payload }) {
      return {
        ...state,
        lastBuilds: payload.action,
      };
    },
    saveJenkinsConf(state, { payload }) {
      return {
        ...state,
        jenkinsConf: payload.action,
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
    showExtendModal(state) {
      return {
        ...state,
        extendModal: true,
      };
    },
    hideExtendModal(state) {
      return {
        ...state,
        extendModal: false,
      };
    },
    showExpansionModal(state) {
      return {
        ...state,
        expansionModal: true,
      };
    },
    hideExpansionModal(state) {
      return {
        ...state,
        expansionModal: false,
      };
    },
  },
};
