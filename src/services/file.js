import { stringify } from 'qs';
import request from '../utils/request';
import { getToken } from '../utils/authority';

export async function uploadFile(params) {
  return request(`/fdfs/doclink/add`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: params,
  });
}

export async function uploadFiles(params) {
  return request(`/fdfs/doclink/addmany`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: params,
  });
}

export async function removeFile(params) {
  return request(`/fdfs/doclink/${params}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: params,
  });
}

export async function findFileById(params) {
  return request(`/fdfs/doclink/findbyglid?${stringify(params)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}
