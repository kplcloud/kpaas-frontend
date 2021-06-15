import request from '../utils/request';
import Cookie from 'js-cookie';

export async function grouplist(params) {
  return request('/group/', {
    method: 'GET',
    params,
  });
}

export async function adminAddGroup(params) {
  return request('/group/admin-add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function member(params) {
  return request('/member/', {
    method: 'GET',
    params,
  });
}

export async function ownNamespacesList() {
  return request('/namespace/');
}

export async function memberLike(params) {
  return request('/group/member-like', {
    method: 'GET',
    params,
  });
}

export async function adminUpdateGroup(params,groupId) {
  return request(`/group/${  groupId}/admin-update`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function adminDeleteGroup(params,groupId) {
  return request(`/group/${  groupId}/admin-delete`, {
    method: 'DELETE',
  });
}

export async function adminAddProject(groupId,projectId) {
  return request(`/group/${  groupId}/admin-add-project/${ projectId}`, {
    method: 'POST',
  });
}

export async function adminAddCronjob(groupId,cronjobId) {
  return request(`/group/${  groupId}/admin-add-cronjob/${ cronjobId}`, {
    method: 'POST',
  });
}

export async function adminAddMember(groupId,memberId) {
  return request(`/group/${  groupId}/admin-add-member/${ memberId}`, {
    method: 'POST',
  });
}

export async function adminDelMember(params,groupId,memberId) {
  return request(`/group/${groupId}/admin-del-member/${  memberId}`, {
    method: 'DELETE',
  });
}

export async function adminDelProject(params,groupId,projectId) {
  return request(`/group/${groupId}/admin-del-project/${projectId}`, {
    method: 'DELETE',
  });
}

export async function adminDelCronjob(params,groupId,cronjobId) {
  return request(`/group/${groupId}/admin-del-cronjob/${cronjobId}`, {
    method: 'DELETE',
  });
}

// export async function adminProjectList(params,ns) {
//   return request(`/project/${  ns}`, {
//     method: 'GET',
//     params,
//   });
// }

export async function namespaceProjectList(params,ns) {
  return request(`/group/namespace/${  ns}/project`, {
    method: 'GET',
    params,
  });
}

export async function namespaceCronjobList(params,ns) {
  return request(`/group/namespace/${  ns}/cronjob`, {
    method: 'GET',
    params,
  });
}

// 组长
export async function ownerUpdateGroup(params,groupId) {
  return request(`/group/${groupId}/owner-update-group`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function ownerDeleteGroup(params,groupId) {
  return request(`/group/${  groupId}/owner-del-group`, {
    method: 'DELETE',
  });
}

export async function ownerAddProject(groupId,projectId) {
  return request(`/group/${groupId}/owner-add-project/${projectId}`, {
    method: 'POST',
  });
}

export async function ownerAddGroup(params) {
  return request('/group/owner-add-group', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function ownerAddMember(groupId,memberId) {
  return request(`/group/${groupId}/owner-add-member/${memberId}`, {
    method: 'POST',
  });
}

export async function ownerAddCronjob(groupId,cronjobId) {
  return request(`/group/${groupId}/owner-add-cronjob/${cronjobId}`, {
    method: 'POST',
  });
}

export async function ownerDelMember(params,groupId,memberId) {
  return request(`/group/${groupId}/owner-del-member/${memberId}`, {
    method: 'DELETE',
  });
}

export async function ownerDelProject(params,groupId,projectId) {
  return request(`/group/${groupId}/owner-del-project/${projectId}`, {
    method: 'DELETE',
  });
}

export async function ownerDelCronjob(params,groupId,cronjobId) {
  return request(`/group/${groupId}/owner-del-cronjob/${cronjobId}`, {
    method: 'DELETE',
  });
}


// 成员
export async function ownergrouplist(params) {
  return request('/group/user-my-list', {
    method: 'GET',
    params,
  });
}

export async function ownergrouplistdata(params) {
  return request('/group/user-my-list', {
    method: 'GET',
    params,
  });
}



export async function ownernslist(params) {
  return request('/group/user-ns-list', {
    method: 'GET',
    params,
  });
}

export async function groupOneData(params,groupid) {
  return request(`/group/${groupid}/rel`, {
    method: 'GET',
    params,
  });
}

export async function groupNameExists(params) {
  return request(`/group/name/exists`, {
    method: 'GET',
    params,
  });
}

export async function groupDisplayNameExists(params) {
  return request(`/group/display_name/exists`, {
    method: 'GET',
    params,
  });
}
