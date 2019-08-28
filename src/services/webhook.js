import request from '../utils/request';

export async function webhookList(params) {
  return request(`/hooks/webhooks/${params.namespace}/project/${params.app_name}`, {
    method: 'GET',
    params,
  });
}

export async function webhookListNoApp(params) {
  return request(`/hooks/webhooks`, {
    method: 'GET',
    params,
  });
}

export async function webhookCreateNoApp(params) {
  return request(`/hooks/webhooks`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function webhookDetailNoApp(params) {
  return request(`/hooks/webhooks/${params.id}`, {
    method: 'GET',
  });
}

export async function webhookUpdateNoApp(params) {
  return request(`/hooks/webhooks/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}

export async function webhookCreate(params) {
  return request(`/hooks/webhooks/${params.namespace}/project/${params.app_name}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function webhookUpdate(params) {
  return request(`/hooks/webhooks/${params.namespace}/project/${params.app_name}/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}


export async function webhookDetail(params) {
  return request(`/hooks/webhooks/${params.namespace}/project/${params.app_name}/${params.id}`, {
    method: 'GET',
  });
}

export async function webhookTest(params) {
  return request(`/hooks/webhooks/${params.namespace}/project/${params.name}/test-send/${params.id}`, {
    method: 'POST',
  });
}

export async function EventsList() {
  return request('/event/all', {
    method: 'GET',
  });
}

