import request from '../utils/request';

export async function loadBuilds(params) {
  return request('/build/jenkins/' + params.namespace + '/project/' + params.name + "/history", {
    method: 'GET',
    params: params,
  });
}

export async function LastBuilds(params) {
  return request('/build/jenkins/' + params.namespace + '/project/' + params.name + '/lastBuild', {
    method: 'GET',
  });
}

export async function GetJenkinsConf(params) {
  return request(`/build/jenkins/${params.namespace}/project/${params.name}/conf`, {
    method: 'GET',
  });
}

export async function rollback(params) {
  return request('/build/jenkins/' + params.namespace + '/project/' + params.name + '/rollback/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
