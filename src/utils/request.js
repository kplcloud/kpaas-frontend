import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import NProgress from 'nprogress';
import Cookie from 'js-cookie';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '登录失效，请您重新登录',
  403: '您没有访问权限。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
let unauthorized = 0;

function checkStatus(response) {
  NProgress.done();
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 403 || response.status === 401) {
    if (unauthorized > 0) {
      return;
    }
    unauthorized += 1;
    const errortext = codeMessage[response.status] || response.statusText;
    message.warn(errortext);
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  NProgress.start();
  const defaultOptions = {
    credentials: 'include',
    withCredentials: true,
  };
  // TODO 如果为本地环境，则加入8080 否则去掉
  if (window.location.hostname == "localhost") {
    url = 'http://localhost:8080' + url;
  }
  const newOptions = { ...defaultOptions, ...options };
  // newOptions.method = (newOptions.method).toUpperCase();
  if (newOptions.method == 'POST' || newOptions.method == 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      // newOptions.headers = {...newOptions.headers, ...{
      //   "Accept": 'application/json',
      //   'Content-Type': 'application/json; charset=utf-8',
      //   "X-HTTP-Method-Override": "PUT"
      // }}
      //       console.log(newOptions)
      // console.log(" options ",  options)
      newOptions.mode = 'cors';
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      // newOptions.headers = {
      //   Accept: 'application/json',
      //   ...newOptions.headers,
      // };
    }
  } else if (newOptions.method === 'GET' || newOptions.method === 'DELETE') {
    var body = newOptions.params;
    var param = '';
    for (var i in body) {
      if (i != '') {
        param += (i + '=' + body[i] + '&');
      }
    }
    if (param) url = url + '?' + param.substring(0, param.length - 1);

  }

  newOptions.authorization = Cookie.get("authorization");
  // newOptions.mode = "cors";
   newOptions.headers = {...newOptions.headers, ...{
        "Accept": 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        "Authorization": Cookie.get("authorization")
  }}
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      NProgress.done();
      if (response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      NProgress.done();
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }
      if (status === 403) {
        const errortext = codeMessage[status];
        notification.error({
          message: `请求拒绝 ${url}`,
          description: errortext,
        });
        // dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        // dispatch(routerRedux.push('/exception/500'));
        message.error('系统错误，请重试! status: ' + status);
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
