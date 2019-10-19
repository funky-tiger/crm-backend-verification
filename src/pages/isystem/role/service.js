import request from '@/utils/request';

/**
 *查询角色组列表
 */
export async function queryRoleTree() {
  return request('/vita-boot/sys/sysRoleGroup/queryTreeList', {
    method: 'GET',
  });
}

/**
 * 通过角色组id查询角色
 */
export async function queryByRoleGroupId(params) {
  return request('/vita-boot/sys/role/list', {
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
