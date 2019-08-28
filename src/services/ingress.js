/**
 * Created by huyunting on 2018/5/29.
 */
import request from '../utils/request';
import Cookie from 'js-cookie';

export async function ingressList(params) {
  return request(`/ingress/${params.namespace}`, {
    method: 'GET',
    params,
  });
}

export async function addIngress(params) {
  return request('/ingress', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function UpdateIngress(params) {
  return request(`/ingress/${params.namespace}/detail/${params.name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function ingressDetail(params) {
  return request(`/ingress/${params.namespace}/detail/${params.name}`, {
    method: 'GET',
    params,
  });
}

export async function getProjectByNamespace(params) {
  return request(`/ingress/${params.namespace}/project`, {
    method: 'GET',
  });
}

export async function egressList(params) {
  return request('/egress/' + params.namespace, {
    method: 'GET',
    params,
  });
}

export async function egressPull(params) {
  return request('/egress/' + params.namespace + '/pull', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function egressAdd(params) {
  return request('/egress/' + params.namespace, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function egressUpdate(params) {
  return request('/egress/' + params.namespace + '/' + params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function egressOne(params) {
  return request('/egress/' + params.namespace + '/' + params.name, {
    method: 'GET',
    params,
  });
}

export async function serviceEntryList(params) {
  return request('/service/entry/' + params.namespace, {
    method: 'GET',
    params,
  });
}

export async function serviceEntryPull(params) {
  return request('/service/entry/' + params.namespace + '/pull', {
    method: 'GET',
    params,
  });
}

export async function serviceEntryOne(params) {
  return request('/service/entry/' + params.namespace + '/name/' + params.name, {
    method: 'GET',
    params,
  });
}

export async function serviceEntryAdd(params) {
  return request('/service/entry/' + params.namespace, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function serviceEntryUpdate(params) {
  return request('/service/entry/' + params.namespace + '/name/' + params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function gatewayList(params) {
  return request(`/gateway/${params.namespace}`, {
    method: 'GET',
    params,
  });
}

export async function gatewayOne(params) {
  return request(`/gateway/${params.namespace}/detail/${params.name}`, {
    method: 'GET',
    params,
  });
}

export async function gatewayCreate(params) {
  return request(`/gateway/${params.namespace}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
