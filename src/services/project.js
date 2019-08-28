import request from '../utils/request';
import Cookie from 'js-cookie';

//import cookies from "react-cookie"

export async function bindPersistentVolume(params) {
  return request(`/deployment/${params.namespace}/pvc/${params.name}/bind`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fetchPersistentVolume(params) {
  return request(`/deployment/${params.namespace}/pvc/${params.name}`, {
    method: 'GET',
  });
}

export async function putFilebeat(params) {
  return request(`/deployment/${params.namespace}/logging/${params.projectName}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function putProbe(params) {
  return request(`/deployment/${params.namespace}/probe/${params.projectName}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function putHosts(params) {
  return request(`/deployment/${params.namespace}/hosts/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function fetchProjects(params) {
  return request('/account/project', {
    method: 'GET',
  });
}

export async function fetchProjectsByNs(params) {
  return request('/projects/ns/' + params.namespace, {
    method: 'GET',
  });
}

export async function addPort(params) {
  return request(`/deployment/${params.namespace}/service/${params.projectName}/port`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function changeResourceType(params) {
  return request(`/ingress/${params.namespace}/generate/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function changeModelSwitch(params) {
  return request(`/deployment/${params.namespace}/mesh/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function onCommandArgs(params) {
  return request(`/deployment/${params.namespace}/command/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function onUpdatePomfile(params) {
  return request('/deployment/' + params.namespace + '/deploy/' + params.name + '/pomfile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function projectBuild(params) {
  return request('/build/jenkins/' + params.namespace + '/project/' + params.name + '/building', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function projectBuildStop(params) {
  return request(`/build/jenkins/${params.namespace}/project/${params.name}/abort/${params.id}`, {
    method: 'PUT',
  });
}

export async function projectBuildHistory(params) {
  return request(`/build/jenkins/${params.namespace}/project/${params.name}/history`, {
    method: 'GET',
    params,
  });
}

export async function projectBuildLogs(params) {
  return request(`/build/jenkins/${params.namespace}/project/${params.name}/console/${params.number}`, {
    method: 'GET',
    params,
  });
}

export async function downDockerfile(params) {
  return request('/project/download/dockerfile', {
    method: 'get',
  });
}

export async function fetchMetrics(params) {
  return request(`/pods/${params.namespace}/metrics/${params.name}`, {
    method: 'get',
  });
}

export async function userlogin(params) {
  return request('/auth/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getLoginType(params) {
  return request('/auth/login/type', {
    method: 'GET'
  })
}

export async function userLogout() {
  return request('/logout', {
    method: 'get',
  });
}

export async function projectList(params) {
  return request('/project/' + Cookie.get('namespace'), {
    method: 'GET',
    params,
  });
}

export async function createProject(params) {
  return request(`/project/${params.namespace}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getProjectInfo(params) {
  return request(`/project/${params.namespace}/detail/${params.name}`, {
    method: 'GET'
  });
}

export async function projectBasicStep(params) {
  return request(`/project/${params.namespace}/basic/${params.name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function projectBasicAutoSave(params) {
  return request(`/project/${params.namespace}/basic/${params.name}/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function projectRuleStep(params) {
  return request('/project/' + Cookie.get('namespace') + '/rule/' + params.id, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function projectUpdateIngress(params) {
  return request('/project/' + Cookie.get('namespace') + '/ingress/' + params.id, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getAuditList(params) {
  return request('/audit/' + Cookie.get('namespace'), {
    method: 'GET'
  });
}

export async function projectDetail(params) {
  return request(`/project/${params.namespace}/detail/${params.name}`, {
    method: 'GET'
  });
}

export async function auditProject(params) {
  return request(`/audit/${params.namespace}/name/${params.name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function refusedAuditProject(params) {
  return request(`/audit/${params.namespace}/refused/${params.name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function auditStep(params) {
  return request(`/audit/${params.namespace}/step/${params.name}/kind/${params.kind}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function extendDeployment(params) {
  return request(`/deployment/${params.namespace}/scale/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function expansionDeployment(params) {
  return request(`/deployment/${params.namespace}/expansion/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function EditProject(params) {
  return request(`/project/${params.namespace}/detail/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteProject(params) {
  return request(`/project/${params.namespace}/app/${params.name}`, {
    method: 'DELETE',
    params
  });
}

export async function putAppPause(params) {
  return request(`/project/${params.namespace}/app/${params.name}/pause`, {
    method: 'PUT',
    params,
  });
}
