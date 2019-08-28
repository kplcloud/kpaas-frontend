import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import { message, notification } from 'antd';
import { queryProjectNotice } from '../services/api';
import {
  projectList,
  createProject,
  projectRuleStep,
  projectUpdateIngress,
  projectBasicStep,
  projectBasicAutoSave,
  getProjectInfo,
  getAuditList,
  projectDetail,
  auditProject,
  auditStep,
  refusedAuditProject,
  fetchMetrics,
  projectBuild,
  extendDeployment,
  expansionDeployment,
  onCommandArgs,
  onUpdatePomfile,
  changeModelSwitch,
  changeResourceType,
  addPort,
  fetchProjects,
  putProbe,
  putFilebeat,
  fetchPersistentVolume,
  bindPersistentVolume,
  deleteProject,
  EditProject,
  putAppPause,
  putHosts,
  fetchProjectsByNs,
} from '../services/project';
import {addConfigMap,getConfigMap,addConfigMapData,updateConfigMapData,deleteConfigMapData,getConfigMapData} from '../services/cronjob';


const openNotificationWithIcon = (type, title, desc) => {
  notification[type]({
    message: title,
    description: desc,
  });
};

export default {
  namespace: 'project',

  state: {
    notice: [],
    projectList: [],
    loading: false,
    projectInfo: [],
    ingressInfo: [],
    deploymentInfo: [],
    auditList: [],
    detailInfo: [],
    serviceMetrics: {},
    buildModal: false,//build弹框
    extendModal: false,//伸缩弹框
    expansionModal: false,//扩容弹框
    image: '',
    language: '',
    javaState: false,
    serviceStart: '1',
    cpuHalfNum: 0,
    overviewModalVisible: false,
    overviewPomfileModal: false,
    overviewModalLoading: false,
    projectKibanaUrl: '',
    projectTransferUrl: '',
    showModelModal: false,
    modelModalVisible: false,
    projects: {},
    persistentVolume: {},
    configMapInfo: {},
    configMapDataList: [],
    configMapDataPage: [],
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen(location => {
    //     if (location.pathname.indexOf('/project/create/') === 0) {
    //       var pathData = location.pathname.split('/');
    //       if (pathData.indexOf('project') && pathData.indexOf('template') && pathData.indexOf('create')) {
    //         if (pathData.indexOf('rule') || pathData.indexOf('basic')) {
    //           const pindex = pathData.indexOf('create');
    //           const namespace = pathData[pindex + 1];
    //           const name = pathData[pindex + 3];
    //           if (namespace && name) {
    //             dispatch({
    //               type: 'projectInfo',
    //               payload: {
    //                 name: name,
    //                 namespace: namespace,
    //               },
    //             });
    //           }
    //         }
    //       } else {
    //         message.error('访问出错了~ create');
    //       }
    //     }
    //   });
    // },
  },
  effects: {
    * fetchProjectsByNs({ payload }, { call, put }) {
      const response = yield call(fetchProjectsByNs, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      yield put({
        type: 'modal',
        payload: {
          projectList: response.data,
        },
      });
    },
    * bindPvc({ payload }, { call, put }) {
      const response = yield call(bindPersistentVolume, payload);
      if (!response) {
        return
      }
      if (response.code != 0) {
          message.error(response.error);
          return;
      }
      message.success('操作成功, 正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * appPause({ payload }, { call, put }) {
      const res = yield call(putAppPause, payload);
      if (!res) {
        return
      }
      if (!res || res.code !== 0) {
        message.error(res.error);
        return;
      }
      if (payload.email_type) {
        message.success('验证码发送成功');
        return;
      }
      message.success('操作成功, 正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * clearPersistentVolume({ _ }, { call, put }) {
      yield put({
        type: 'modal',
        payload: {
          persistentVolume: {},
        },
      });
    },
    * getPersistentVolume({ payload }, { call, put }) {
      const res = yield call(fetchPersistentVolume, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }

      yield put({
        type: 'modal',
        payload: {
          persistentVolume: res.data,
        },
      });
    },
    * fetchAll({ payload }, { call, put }) {
      const res = yield call(fetchProjects, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }
      yield put({
        type: 'modal',
        payload: {
          projects: res.data,
        },
      });
    },
    * onChangeFilebeat({ payload }, { call, put }) {
      const res = yield call(putFilebeat, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }
      message.success('操作成功, 正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onPutProbe({ payload }, { call, put }) {
      const res = yield call(putProbe, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }
      message.success('操作成功, 正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onPutHosts({ payload }, { call, put }) {
      const res = yield call(putHosts, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }
      message.success('操作成功, 正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onAddPort({ payload }, { call, put }) {
      const res = yield call(addPort, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        return;
      }
      message.success('操作成功, 正在重启服务...');
      // yield put({type: "modal", payload: {modelModalVisible: false, showModelModal: false}});
      // message.success("操作成功，正在重启服务...")
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onChangeResourceType({ payload }, { call, put }) {
      const res = yield call(changeResourceType, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        openNotificationWithIcon('error', '调整错误', res.error);
        return;
      }
      openNotificationWithIcon('success', '操作成功', '');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onModelSwitch({ payload }, { call, put }) {
      yield put({ type: 'modal', payload: { modelModalVisible: true } });
      if (!res) {
        return
      }
      const res = yield call(changeModelSwitch, payload);
      if (!res || res.code != 0) {
        message.error(res.error);
        yield put({ type: 'modal', payload: { modelModalVisible: false } });
        return;
      }
      yield put({ type: 'modal', payload: { modelModalVisible: false, showModelModal: false } });
      message.success('操作成功，正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onCommandArgs({ payload }, { call, put }) {
      yield put({ type: 'modal', payload: { overviewModalLoading: true } });
      const res = yield call(onCommandArgs, payload);
      if (!res) {
        return
      }
      if (!res || res.code != 0) {
        message.error(res.error);
        yield put({ type: 'modal', payload: { overviewModalLoading: false } });
        return;
      }
      yield put({ type: 'modal', payload: { overviewModalLoading: false, overviewModalVisible: false } });
      message.success('操作成功，正在重启服务...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onUpdatePomfile({ payload }, { call, put }) {
      yield put({ type: 'modal', payload: { overviewModalLoading: true } });
      if (!payload.name || !payload.namespace) {
        message.error('更改失败，请稍后再试');
        yield put({ type: 'modal', payload: { overviewModalLoading: false } });
        return;
      }
      const res = yield call(onUpdatePomfile, payload);
      if (!res || res.code !== 0) {
        message.error(res.error);
        yield put({ type: 'modal', payload: { overviewModalLoading: false } });
        return;
      }
      yield put({ type: 'modal', payload: { overviewModalLoading: false, overviewPomfileModal: false } });
      message.success('操作成功');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onBuild({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectBuild, payload);
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({ type: 'closeLoading' });
      yield put({ type: 'hideBuildModal' });
      if (response && response.data && response.data.projectName) {
        yield put({ type: 'clearBuildLogs' });
        yield put({
          type: 'jenkins/buildHistory',
          payload: { ...payload, name: response.data.projectName, checkProject: false },
        });
      }

      message.success('操作成功，正在Building...');
    },
    * onChangeExtend({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(extendDeployment, payload);
      yield put({ type: 'closeLoading' });
      yield put({ type: 'hideExtendModal' });
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功，服务正在进行伸缩...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * onChangeExpansion({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(expansionDeployment, payload);
      yield put({ type: 'closeLoading' });
      yield put({ type: 'hideExpansionModal' });
      if (!response) {
        message.error('服务异常，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      message.success('操作成功，服务正在进行扩容...');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * downDockerfile({ payload }, { call, put }) {
    },
    * projectList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectList, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        return;
      }
      if (response.code !== 0) {
        message.error('项目列表获取失败，请等技术冷却后再试~');
        return;
      }
      yield put({
        type: 'saveProjectList',
        payload: response.data,
      });
    },
    * fetchMetrics({ payload }, { call, put }) {
      const response = yield call(fetchMetrics, payload);
      if (!response || response.code !== 0) {
        // message.error('服务器使用获取错误~');
        yield put({
          type: 'cleanMetrics',
        });
        return;
      }

      yield put({
        type: 'saveMetrics',
        payload: response.data,
      });
    },
    * projectInfo({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getProjectInfo, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        return;
      }
      if (response.code !== 0) {
        message.error('项目信息获取失败，请稍后再试');
        return;
      }
      yield put({
        type: 'saveProjectInfo',
        payload: response.data,
      });
    },
    * fetchNotice(_, { call, put }) {
      const response = yield call(queryProjectNotice);
      if (!response) {
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveNotice',
        payload: Array.isArray(response.data) ? response.data : [],
      });
    },
    * createProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(createProject, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        yield put({
          type: 'openLoading',
        });
        message.error('保存失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      Cookie.set('projectNameEn', payload.name);
      Cookie.set('projectName', payload.display_name);
      Cookie.set('projectNameSpace', payload.namespace);
      yield put({
        type: 'saveStep',
        payload,
      });
      yield put(routerRedux.push(`/project/create/${payload.namespace}/basic/${payload.name}`));
    },
    * projectBasicAutoSave({ payload }, { call }) {
      const response = yield call(projectBasicAutoSave, payload);
    },
    * projectBasicStep({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectBasicStep, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('保存失败，请等技术冷却后再试~');
        return;
      }
      if (response.code !== 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveStep',
        payload,
      });
      // if (payload.resource_type == '2') {
      // yield put(routerRedux.push('/project/create/basic/' + payload.id));
      // } else {
      yield put(routerRedux.push('/project/create/success'));
      // }
    },
    * projectRuleStep({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectRuleStep, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('保存失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveStep',
        payload,
      });
      yield put(routerRedux.push('/project/create/success/'));
    },
    * projectUpdateIngress({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectUpdateIngress, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('保存失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put({
        type: 'saveStep',
        payload,
      });
      yield put(routerRedux.push('/security/ingress/list/'));
    },
    * projectAddIngress({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectRuleStep, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('保存失败，请等技术冷却后再试~');
        return;
      }
      if (response.code != 0) {
        message.error(response.error);
        return;
      }
      yield put(routerRedux.push('/security/ingress/list/'));
    },
    * getAuditList({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(getAuditList, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        return
      }
      if (!response || response.code != 0) {
        message.error('访问出错了~ getAuditList');
        return;
      }
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    * projectDetail({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(projectDetail, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error('访问出错了~ projectDetail');
        return;
      }
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    * auditProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(auditProject, payload);
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error('审核失败~');
        return;
      }
      message.info('审核成功~');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * refusedProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(refusedAuditProject, payload);
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error('操作失败~');
        return;
      }
      message.info('操作成功~');
      yield put(routerRedux.push('/project/list'));
    },
    * auditStepProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(auditStep, payload);
      if (!response) {
        return
      }
      if (!response || response.code !== 0) {
        message.error('审核失败~');
        return;
      }
      message.info('审核成功~');
      setTimeout(function() {
        location.reload();
      }, 1000);
    },
    * deleteProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      var response = yield call(deleteProject, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('删除失败，请稍后再试');
        return;
      }
      if (typeof response === 'string') {
        response = JSON.parse(response);
      }
      if (payload.email_type === false && response.code !== 0) {
        message.error('删除失败,' + response.error);
        return;
      }

      if (payload.email_type === false) {
        message.success('删除成功~');
        setTimeout(function() {
          location.reload();
        }, 1000);
      }

    },

    * EditProject({ payload }, { call, put }) {
      yield put({ type: 'openLoading' });
      const response = yield call(EditProject, payload);
      yield put({ type: 'closeLoading' });
      if (!response) {
        message.error('更新失败，请稍后再试' + response.error);
        return;
      }
      if (response.code !== 0) {
        message.error('调整失败', response.error);
        return;
      }
      message.success('调整成功');
      yield put({
        type: 'projectDetail',
        payload: {
          ...payload,
        },
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
      if (!response) {
        return
      }
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
    modal(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
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
    saveNotice(state, action) {
      return {
        ...state,
        notice: action.payload,
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
    saveDetailInfo(state, { payload }) {
      return {
        ...state,
        detailInfo: payload,
      };
    },
    saveList(state, { payload }) {
      if (payload && payload.project && payload.project.language) {
        return {
          ...state,
          auditList: payload,
          language: payload.project.language,
          projectKibanaUrl: payload.kibana_url ? payload.kibana_url : '',
          projectTransferUrl: payload.transfer_url ? payload.transfer_url : '',
        };
      }
      return {
        ...state,
        auditList: payload,
        projectKibanaUrl: payload.kibana_url ? payload.kibana_url : '',
        projectTransferUrl: payload.transfer_url ? payload.transfer_url : '',
      };

    },
    clearSaveList(state) {
      return {
        ...state,
        auditList: [],
      };
    },
    saveProjectInfo(state, { payload }) {
      var projectInfo = {};
      var ingressInfo = {};
      var deploymentInfo = {};
      var image = '';
      var javaState = false;
      var cpuHalfNum = 0;
      var serviceStart = 1;
      var image = '';
      for (var key in payload) {
        var info = payload[key];
        if (info && info['kind'] && info['kind'] == 'Service') {
          projectInfo = payload[key];
        }
        if (info && info['kind'] && info['mind'] == 'Ingress') {
          ingressInfo = payload[key];
        }
        if (info && info['kind'] && info['kind'] == 'Deployment') {
          deploymentInfo = payload[key];
          if (deploymentInfo && deploymentInfo.WebFields) {
            image = deploymentInfo.WebFields.image;
            javaState = (deploymentInfo.WebFields.image.indexOf('java') == -1) ? false : true;
            if (javaState) {
              cpuHalfNum = parseInt(deploymentInfo.WebFields.resources.substring(2)) / 2;
              serviceStart = deploymentInfo.WebFields.serviceStart;
            }
          }
        }
      }
      if (image == 'java') {
        var language = 'Java';
      }
      if (image == 'golang') {
        var language = 'Golang';
      }
      if (image == 'nodejs') {
        var language = 'NodeJs';
      }
      if (image == 'python') {
        var language = 'Python';
      }
      if (image === 'nginx') {
        var language = 'Nginx';
      }
      if (image === 'static') {
        var language = 'Static';
      }
      return {
        ...state,
        projectInfo: projectInfo,
        ingressInfo: ingressInfo,
        deploymentInfo: deploymentInfo,
        image: image,
        javaState: javaState,
        cpuHalfNum: cpuHalfNum,
        serviceStart: serviceStart,
        language: language,
      };
    },
    saveStep(state, { payload }) {
      return {
        ...state,
        payload,
        step: {},
      };
    },
    saveMetrics(state, { payload }) {
      return {
        ...state,
        serviceMetrics: payload,
      };
    },
    cleanMetrics(state, { _ }) {
      return {
        ...state,
        serviceMetrics: {},
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
    changeProjectImage(state, { payload }) {
      var javaState = (payload.image.indexOf('java') == -1) ? false : true;
      return {
        ...state,
        image: payload.image,
        javaState: javaState,
      };
    },
    changeImageLanguage(state, { payload }) {
      if (payload.image == 'java') {
        return {
          ...state,
          language: 'Java',
        };
      }
      if (payload.image == 'golang') {
        return {
          ...state,
          language: 'Golang',
        };
      }
      if (payload.image == 'nodejs') {
        return {
          ...state,
          language: 'NodeJs',
        };
      }
      if (payload.image == 'python') {
        return {
          ...state,
          language: 'Python',
        };
      }
      if (payload.image == 'nginx') {
        return {
          ...state,
          language: 'Nginx',
        };
      }
      if (payload.image == 'static') {
        return {
          ...state,
          language: 'Static',
        };
      }
    },
    changeServiceStart(state, { payload }) {
      return {
        ...state,
        serviceStart: payload.serviceStart,
      };
    },
    changeCupInfo(state, { payload }) {
      return {
        ...state,
        cpuHalfNum: payload.cpuHalfNum,
      };
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
