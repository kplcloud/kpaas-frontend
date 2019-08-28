/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';

export async function detail(params) {
  console.log(params)
  return request(`/pods/${params.namespace}/detail/${params.name}/pod/${params.podName}`, {
    method: 'GET',
  });
};

export async function list(params) {
  return request(`/pods/${params.namespace}/detail/${params.name}/pod`, {
    method: 'GET',
  });
};

export async function reload(params) {
  return request(`/pods/${params.namespace}/delete/${params.name}/pod/${params.podName}`, {
    method: 'DELETE',
  });
};

export async function logs(params) {
  return request(`/pods/${params.namespace}/detail/${params.name}/logs/${params.podName}/container/${params.container}`, {
    method: 'GET'
  });
};

export async function getSession(params) {
  return request(`/terminal/session/${params.namespace}/name/${params.container}/pods/${params.name}`, {
    method: 'GET',
  });
};
