import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function getRoutesPage(params) {
  return request(`/admin/route/page?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function getRouteById(params = { id: '#' }) {
  return request(`/admin/route/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function addRoute(params) {
  return request('/admin/route/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function updRoute(params) {
  return request('/admin/route/', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: {
      ...params,
    },
  });
}

export async function delRoute(params) {
  return request(`/admin/route/${params.id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

// 同步至路由网关
export async function applyRoute() {
  return request('/admin/route/apply', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
