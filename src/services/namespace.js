import request from '../utils/request';
export async function namespaceList(params) {
  return request('/namespace', {
    method: 'GET',
    params,
  });
}

export async function addNamespace(params) {
  return request('/namespace', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
