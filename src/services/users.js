import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function getDeptList() {
  return request('/admin/dept/tree', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getRolesByDept(params) {
  return request(`/admin/dept/getDeptRoles?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getUser(params) {
  return request(`/admin/user/${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getUsers(params) {
  return request(`/admin/user/userPage?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function addUser(params) {
  return request('/admin/user/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function putUser(params) {
  return request('/admin/user/', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function delUser(params) {
  return request(`/admin/user/${params.userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
