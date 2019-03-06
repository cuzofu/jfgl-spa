import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function queryLog(params) {
  return request(`/admin/log/logPage?${stringify(params)}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function queryNotices() {
  return request('/api/notices');
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
