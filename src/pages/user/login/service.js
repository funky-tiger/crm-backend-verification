import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function userLogin(params) {
  return request('/vita-boot/sys/login', {
    method: 'POST',
    data: params,
  });
}

export async function getPermissionByToken(params) {
  return request('/vita-boot/sys/permission/getUserPermissionByToken', {
    method: 'GET',
    data: params,
  });
}

export async function getJson() {
  return request('/data.json');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
