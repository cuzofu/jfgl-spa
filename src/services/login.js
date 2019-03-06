import request from '../utils/request';
import { getToken } from '../utils/authority';
import { stringify } from 'qs';

export function query() {
  return request('/api/users');
}

export function getUserInfo() {
  return request('/admin/user/info', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

//c3Nrajpzc2tq  代表 sskj:sskj
export function fakeAccountLogin(params) {
  return request(`/auth/oauth/token?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}

export function fakeLogout(params) {
  return request(`/auth/authentication/removeToken?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function sendVcode(phone) {
  return request(`/admin/smsCode/login/${phone}`, {
    method: 'GET',
  });
}

export function mobileLogin(params) {
  return request(`/auth/mobile/token?${stringify(params)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic c3Nrajpzc2tq',
    },
  });
}
