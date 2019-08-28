/**
 * Created by huyunting on 2018/6/4.
 */
import request from '../utils/request';
import Cookie from "js-cookie"

export async function getResources(params) {
  let ns = params && params.namespace;
  if (!ns) {
    ns = Cookie.get("namespace")
  }
  return request('/tools/generate/'+ns, {
    method: 'GET'
  });
}

export async function add(params) {
    let ns = params && params.namespace;
    if (!ns) {
      ns = Cookie.get("namespace")
    }
    return request('/tools/generate/'+ns+'/'+params.name, {
      method: 'POST',
      body: {
        ...params
      }
    });
  }