import request from '../utils/request';
import Cookie from 'js-cookie'

export async function getRequestOps() {
  return request('/monitor/prometheus/query/ops');
}

export async function getNetwork() {
  return request('/monitor/prometheus/query/network');
}

export async function getNamespaceMetrics() {
  return request('/workspace/' + Cookie.get("namespace") + '/metrics');
}

export async function getDashboardMonitor() {
  return request('/monitor/metrics');
}

export async function getProjectMetrics(params) {
  return request(`/project/${params.ns}/monitor/${params.name}`);
}

export async function getProjectAlerts(params) {
  return request(`/project/${params.ns}/alerts/${params.name}`);
}
