/**
 * Created by huyunting on 2018/5/21.
 */
import request from '../utils/request';

export async function consulAclList(params) {
  return request(`/consul/${params.namespace}/list`, {
    method: 'GET',
    params,
  });
}

export async function consulAclOne(params) {
  return request(`/consul/${params.namespace}/one/${params.name}`, {
    method: 'GET',
  });
}

export async function consulAclCreate(params) {
  return request(`/consul/${params.namespace}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function consulAclUpdate(params) {
  return request(`/consul/${params.namespace}/one/${params.name}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function consulAclDelete(params) {
  return request(`/consul/${params.namespace}/delete/${params.name}`, {
    method: 'DELETE',
  });
}

export async function consulKVList(params) {
  return request(`/consul/kv/${params.namespace}/list/${params.name}`, {
    method: 'GET',
    params,
  });
}

export async function consulKVDetail(params) {
  return request(`/consul/kv/${params.namespace}/one/${params.name}?prefix=${params.prefix}`, {
    method: 'GET',
  });
}

export async function consulKVUpdate(params) {
  return request(`/consul/kv/${ params.namespace}/one/${params.name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function consulKVDelete(params) {
  return request(`/consul/kv/${params.namespace}/one/${params.name}?prefix=${params.prefix}&folder=${params.filder}`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
