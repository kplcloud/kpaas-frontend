import request from '../utils/request';

//获取公告列表
export async function getNoticeList(params) {
  return request('/notice/message', {
    method: 'GET',
    params,
  });
}

//获取详情
export async function getNoticeView(params) {
  return request('/notice/detail/'+params.id, {
    method: 'GET'
  });
}

export async function getNoticeReadCount(params) {
  return request('/notice/message/readcount', {
    method: 'GET',
    params,
  });
}

//命名空间列表
export async function getNamespaceList(params) {
  return request('/notice/namespace', {
    method: 'GET',
    params,
  });
}

//清空所有消息
export async function clearAllNotice(params) {
  return request('/notice/clear/bytype', {
    method: 'GET',
    params,
  });
}


