import request from '../utils/request';

export async function getWechatQR(params) {
  return request('/wechat/qr', {
    method: 'POST',
    body: {
      ...params
    }
  })
}

export async function testSendWechat(params) {
  return request('/wechat/testSend', {
    method: 'GET',
    //params: params,
  });
}

export async function unBindWechat(params) {
  return request('/account/unBindWechat', {
    method: 'GET',
    //params: params,
  });
}

export async function updateBase(params) {
  return request('/account/base/update', {
    method: 'POST',
    body: {
      ...params
    }
  })
}

//消息订阅配置
export async function getNoticeReceive(params) {
  return request('/account/notice/receive', {
    method: 'GET',
    //params: params,
  });
}

//更新订阅配置
export async function updateNoticeReceive(params) {
  return request('/account/notice/update', {
    method: 'POST',
    body: {
      ...params
    }
  })
}

