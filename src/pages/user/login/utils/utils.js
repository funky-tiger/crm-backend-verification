import { parse } from 'qs';

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
export function setAuthority(authority) {
  return localStorage.setItem('token', `${authority}`);
}
export function setUserInfo(userInfo) {
  return localStorage.setItem('userInfo', `${JSON.stringify(userInfo)}`);
}

export function saveUserResult(result) {
  return localStorage.setItem('userInfo', `${JSON.stringify(result)}`);
}
