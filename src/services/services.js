/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';
import Cookie from 'js-cookie';

export async function list(params) {
  return request('/discovery/' + Cookie.get('namespace') + '/services', {
    method: 'GET'
  });
};

export async function detail(params) {
  return request(`/discovery/${params.namespace}/services/${params.name}`, {
    method: 'GET',
  });
};

export async function createYaml(params) {
  return request('/discovery/' + Cookie.get('namespace') + '/services', {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export async function createForm(params) {
  return request(`/discovery/${params.namespace}/services/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
};

export async function deleteSvc(params) {
  return request(`/discovery/${params.namespace}/services/${params.name}`, {
    method: 'DELETE',
    // params
  });
}
