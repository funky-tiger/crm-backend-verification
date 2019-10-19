/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/newline-after-import */
import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeAccountLogout() {
  return request('/vita-boot/sys/logout', {
    method: 'GET',
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
