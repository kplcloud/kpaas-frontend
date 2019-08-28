import request from '../utils/request';

export async function nsList() {
  return request('/member/namespaces');
}

export async function buildList(params,ns) {
  return request(`/statistics/${ns}/build`, {
    method: 'GET',
    params,
  });
}
