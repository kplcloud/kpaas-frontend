import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function fetchMenu() {
  return request('/permission/menu')
}

export async function queryCurrent() {
  return request('/account/current');
}

export async function queryNamespaces() {
  return request('/member/namespaces');
}
export async function NamespacesList() {
  return request('/namespace');
}
export async function ChoiceNamespace(params) {
  return request('/member/choice/namespace', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
