/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';
import Cookie from 'js-cookie';

export async function getPvDetail(params) {
  return request('/persistentvolume/' + params.namespace + '/pv/' + params.volumeName, {
    method: 'GET',
  });
}

export async function addPvc(params) {
  let ns = params && params.namespace;
  if (!ns) {
    ns = Cookie.get('namespace');
  }
  return request('/persistentvolumeclaim/' + ns, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function getPvcDetail(params) {
  return request('/persistentvolumeclaim/' + params.namespace + '/pvc/' + params.name, {
    method: 'GET',
    params: params,
  });
}

export async function getPvcList(params) {
  let ns = params && params.namespace;
  if (!ns) {
    ns = Cookie.get('namespace');
  }
  return request('/persistentvolumeclaim/' + ns + "/all", {
    method: 'GET',
    params: params
  });
}

export async function list() {
  return request('/storageclass', {
    method: 'GET',
  });
};

export async function listByNamespace(params) {
  let ns = params && params.namespace;
  if (!ns) {
    ns = Cookie.get('namespace');
  }
  return request(`/storageclass`, {
    method: 'GET',
    params: {
      "limit": 100,
    }
  });
};

export async function detail(params) {
  return request('/storageclass/' + params.name, {
    method: 'GET',
  });
};

export async function add(params) {
  return request('/storageclass', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};
