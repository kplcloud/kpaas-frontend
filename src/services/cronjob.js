/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';

export async function getTags(params) {
  return request(`/git/tags/${params.namespace}/project/${params.name}`, {
    method: 'GET',
  });
};

export async function getBranches(params) {
  return request(`/git/branches/${params.namespace}/project/${params.name}`, {
    method: 'GET',
  });
};

export async function gitlabTags(params) {
  return request(`/git/tags?git=${params.git}`, {
    method: 'GET',
  });
}

export async function gitlabBranches(params) {
  return request(`/git/branches?git=${params.git}`, {
    method: 'GET',
  });
}

export async function gitlabGetDockerfile(params) {
  return request(`/git/dockerfile/${params.namespace}/project/${params.name}`, {
    method: 'GET',
  });
}


export async function buildForCronjob(params) {
  return request('/jenkins/' + params.namespace + '/build/' + params.name + '/cronjob', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function cronjobList(params) {
  return request('/cronjob/' + params.namespace, {
    method: 'GET',
    params,
  });
}

export async function deleteCronjob(params) {
  return request('/cronjob/' + params.namespace + '/' + params.name, {
    method: 'DELETE',
  });
}

export async function addCronjob(params) {
  return request('/cronjob/' + params.namespace, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateCronjob(params) {
  return request('/cronjob/' + params.namespace + '/' + params.name, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function oneCronjob(params) {
  return request('/cronjob/' + params.namespace + '/' + params.name, {
    method: 'GET',
    params,
  });
}

export async function updatCronjobLogPath(params) {
  return request('/cronjob/log/' + params.namespace + '/' + params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//config env
export async function addConfigEnv(params) {
  return request('/config/'+params.namespace+'/env/'+params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateConfigEnv(params) {
  return request('/config/'+params.namespace+'/env/'+params.name+'/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteConfigEnv(params) {
  return request('/config/'+params.namespace+'/env/'+params.name+'/' + params.id, {
    method: 'DELETE',
  });
}

export async function getConfigEnv(params) {
  return request('/config/'+params.namespace+'/env/'+params.name, {
    method: 'GET',
    params,
  });
}

//config map data
export async function addConfigMap(params) {
  return request('/configmap/'+ params.namespace + '/project/' + params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getConfigMap(params) {
  return request('/configmap/' + params.namespace + '/project/' + params.name, {
    method: 'GET',
    params,
  });
}

export async function addConfigMapData(params) {
  return request('/configmap/'+ params.namespace + '/project/' + params.name + '/data', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getConfigMapData(params) {
  return request('/configmap/'+ params.namespace + '/project/' + params.name + '/data', {
    method: 'GET',
  });
}

export async function updateConfigMapData(params) {
  return request('/configmap/'+ params.namespace + '/project/' + params.name + '/data/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function deleteConfigMapData(params) {
  return request('/configmap/'+ params.namespace + '/project/' + params.name + '/data/' + params.id, {
    method: 'DELETE',
  });
}

export async function cronjobBuildLogs(params) {
  return request(`/build/jenkins/${params.namespace}/cronjob/${params.name}/console/${params.number}`, {
    method: 'GET',
    params,
  });
}

export async function cronjobBuildHistory(params) {
  return request(`/build/jenkins/${params.namespace}/cronjob/${params.name}/history`, {
    method: 'GET',
    params,
  });
}




