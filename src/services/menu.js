import { getToken } from '../utils/authority';
import { stringify } from 'qs';
import request from '../utils/request';

export async function queryMenu(params) {
  return request(`/admin/menu/allTree?${stringify(params)}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getMenu(params) {
  return request('/admin/menu/' + params, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function addMenu(params) {
  return request('/admin/menu/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: params,
  });
}

export async function delMenu(params) {
  return request('/admin/menu/' + params, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function putMenu(params) {
  return request('/admin/menu/', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: params,
  });
}
