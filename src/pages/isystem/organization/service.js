import request from '@/utils/request';

/**
 *查询公司列表
 */
export async function queryIdTree() {
  return request('/vita-boot/sys/sysOrg/queryIdTree', {
    method: 'GET',
  });
}

/**
 * 通过id查询公司详情
 */
export async function queryById(params) {
  return request('/vita-boot/sys/sysOrg/queryById', {
    method: 'GET',
    params,
  });
}

/**
 * 更新公司列表
 */
export async function editQuery(params) {
  return request('/vita-boot/sys/sysOrg/edit', {
    method: 'PUT',
    body: JSON.stringify(params),
  });
}

/**
 * 新增公司列表
 */
export async function addQuery(params) {
  return request('/vita-boot/sys/sysOrg/add', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * 删除公司列表
 */
export async function delQuery(params) {
  return request('/vita-boot/sys/sysOrg/delete', {
    method: 'DELETE',
    params,
  });
}
