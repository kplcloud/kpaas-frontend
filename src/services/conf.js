/**
 * Created by huyunting on 2018/5/21.
 */
import request from '../utils/request';

export async function confMapList(params) {
  return request('/config/' + params.namespace, {
    method: 'GET',
    params,
  });
}

export async function addConMap(params) {
  return request('/config/' + params.namespace, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateConMap(params) {
  return request('/config/' + params.namespace + '/map/' + params.name, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function confGetOnePull(params) {
  return request('/config/' + params.namespace + '/map/' + params.name + '/onePull', {
    method: 'GET',
  });
}

export async function deleteConMap(params) {
  return request('/config/' + params.namespace + '/delete/' + params.id, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function oneConMap(params) {
  return request('/config/' + params.namespace + '/map/' + params.name, {
    method: 'GET',
    params,
  });
}
