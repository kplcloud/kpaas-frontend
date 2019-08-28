import request from '../utils/request';

//获取公告列表
export async function getNoticeProclaim(params) {
  return request('/proclaim', {
    method: 'GET',
    params,
  });
}

//获取所有用户列表
export async function getUserList(params) {
  return request('/member/all', {
    method: 'GET',
    params,
  });
}

//命名空间列表
export async function getNamespaceList(params) {
  return request('/namespace', {
    method: 'GET',
    params,
  });
}

//增加公告
export async function addNoticeProclaim(params) {
  return request('/proclaim', {
    method: 'POST',
    body: {
      ...params
    }
  })
}

//获取详情
export async function viewNoticeProclaim(params) {
  return request('/proclaim/'+params.id, {
    method: 'GET'
  });
}

