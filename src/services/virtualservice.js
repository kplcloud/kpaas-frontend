import request from '../utils/request';
import Cookie from "js-cookie"

export async function virtualserviceMirror(params) {
  return request("/virtual/service/"+params.namespace+"/app/"+params.name, {
    method: "POST",
    body: {
      ...params
    }
  });
}

export async function update(params) {
  return request('/virtual/service/' + Cookie.get("namespace") + '/name/' + params.name, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function virtualserviceList(params) {
  return request('/virtual/service/' + Cookie.get("namespace"), {
    method: "GET",
    params,
  })
}
export async function virtualserviceOne(params) {
  return request('/virtual/service/' + params.namespace + '/name/' + params.name, {
    method: "GET",
    params,
  })
}
export async function virtualservicePull(params) {
  return request('/virtual/service/' + Cookie.get("namespace") + '/pull', {
    method: "GET",
    params,
  })
}
export async function virtualserviceCreateStep1(params) {
  return request('/virtual/service/' + params.namespace + '/info', {
    method: "POST",
    body: {
      ...params,
    },
  })
}
export async function virtualserviceCreateStep2(params) {
  return request('/virtual/service/' + params.namespace + '/route', {
    method: "POST",
    body: {
      ...params,
    },
  })
}
export async function virtualserviceCreate(params) {
  return request('/virtual/service/' + params.namespace + '/name/' + params.name, {
    method: "POST",
    body: {
      ...params,
    },
  })
}
export async function virtualserviceDelete(params) {
  return request('/virtual/service/' + params.namespace + '/name/' + params.name, {
    method: "DELETE",
    body: {
      ...params,
    },
  })
}
