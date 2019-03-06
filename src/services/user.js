import request from '../utils/request';
import { getToken } from '../utils/authority';
import { stringify } from 'qs';

export async function query() {
  return request('/api/users');
}

export function getUserInfo() {
  return request('/admin/user/info', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export function getAuthMenus() {
  return request('/admin/menu/userMenu', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
