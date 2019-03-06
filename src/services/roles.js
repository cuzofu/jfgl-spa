import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function getDeptList(params) {
  console.log(1);
  return request(`/admin/dept/tree?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getDeptIds(params) {
  return request(`/admin/dept/tree/${params.deptId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getRoles(params) {
  // return request(`/api/admin/roles?${stringify(params)}`);
  return request(`/admin/role/rolePage?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function addRoles(params) {
  return request('/admin/role/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function delRoles(params) {
  return request(`/admin/role/${params.roleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function updRoles(params) {
  return request('/admin/role/', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function getAllMenuTree() {
  return request('/admin/menu/allTree/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getRoleMenuTree(params) {
  return request(`/admin/menu/findMenuByRole/${params.roleCode}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function updRoleMenu(params) {
  return request(`/admin/role/roleMenuUpd?${stringify(params, { arrayFormat: 'brackets' })}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
