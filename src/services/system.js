/**
 * Created by huyunting on 2018/5/17.
 */
import request from '../utils/request';

export async function changeRolePerm(params) {
  return request('/role/' + params.id + "/permission", {
    method: 'POST',
    body: {
      ...params
    }
  })
}

export async function selectedPerm(params) {
  return request('/role/' + params.id + "/permission", {
    method: 'GET'
  })
}

export async function deletePermission(params) {
  return request('/permission/'+params.key, {
    method: 'DELETE',
    body: {
      ...params,
    },
  })
}

export async function updatePermission(params) {
  return request('/permission/'+params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function dragPermission(params) {
  return request('/permission/drag', {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
export async function permissions(params) {
  return request('/permission/list', {
    method: 'GET',
    params,
  });
}
export async function member(params) {
  return request('/member', {
    method: 'GET',
    params,
  });
}
export async function addMember(params) {
  return request('/member', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function oneMember(params) {
  return request('/member/' + params.id, {
    method: 'GET',
  });
}
export async function updateMember(params) {
  return request('/member/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}
export async function role(params) {
  return request('/role', {
    method: 'GET',
    params,
  });
}
export async function oneRole(params) {
  return request('/role/' + params.id, {
    method: 'GET',
    params,
  });
}
export async function addRole(params) {
  return request('/role', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function updateRole(params) {
  return request('/role/' + params.id, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

