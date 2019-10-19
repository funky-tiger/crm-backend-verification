/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/newline-after-import */
import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
