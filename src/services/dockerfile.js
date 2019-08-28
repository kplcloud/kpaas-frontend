import request from '../utils/request';

export async function GetAll(params) {
  return request('/market/dockerfile', {
    method: 'GET',
    params,
  });
}

export async function GetOne(params) {
  return request('/market/dockerfile/' + params.id, {
    method: 'GET',
  });
}


export async function AddDockerFile(params) {
  return request('/market/dockerfile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function UpdateDockerFile(params) {
  return request('/market/dockerfile/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}



