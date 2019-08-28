import { stringify } from 'qs';
import request from '../utils/request';
import Cookie from 'js-cookie';

export async function noticeDetail(params) {
  return request('/notice/detail/' + params.id, {
    method: 'GET',
  });
}

export async function clearNotices(params) {
  return request('/notice/clear/all', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function queryProjectNotice() {
  return request('/project/' + Cookie.get('namespace') + '/workspace');
}

export async function queryActivities() {
  return request('/workspace/' + Cookie.get("namespace") + '/active');
}

export async function queryNotices() {
  return request('/notice/tips');
}

export async function config() {
  return request('/project/config/detail', {
    method: 'GET',
  });
}
