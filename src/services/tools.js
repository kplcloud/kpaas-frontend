import request from '../utils/request';

export async function duplication(params) {
  return request('/tools/duplication/single', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function fakeTime(params) {
  return request(`/tools/faketime/${params.namespace}/project/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function fakeNamespaceTime(params) {
  return request(`/public/deploy/` + params.namespace + `/deployment/faketime`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

