/**
 * Created by huyunting on 2018/5/11.
 */
import request from '../utils/request';
export async function templateList(params) {
  return request('/template/', {
    method: 'GET',
    params,
  });
}

export async function oneTemplate(params) {
  return request('/template/' + params.id, {
    method: 'GET',
    params,
  });
}
export async function updateTemplate(params) {
  return request('/template/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
export async function addTemplate(params) {
  return request('/template/', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function messageTemplateList(params) {
  return request('/messageTemplate/', {
    method: 'GET',
    params,
  });
}

export async function oneMessageTemplate(params) {
  return request('/messageTemplate/' + params.id, {
    method: 'GET',
    params,
  });
}
export async function updateMessageTemplate(params) {
  return request('/messageTemplate/' + params.id, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function addMessageTemplate(params) {
  return request('/messageTemplate/', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
