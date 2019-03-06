import { validateNull } from './utils';

export const getAuthority = () => {
  return localStorage.getItem('authority');
};

export const setAuthority = params => {
  return localStorage.setItem('authority', JSON.stringify(params));
};

export const setStore = params => {
  const { name, content, type } = params;
  const obj = {
    dataType: typeof content,
    content,
    type,
    datetime: new Date().getTime(),
  };
  if (type) sessionStorage.setItem(name, JSON.stringify(obj));
  else localStorage.setItem(name, JSON.stringify(obj));
};
/**
 * 获取localStorage
 */
export const getStore = params => {
  const { name, type } = params;
  let obj = {};
  let content;
  obj = localStorage.getItem(name);
  if (validateNull(obj)) obj = sessionStorage.getItem(name);
  if (validateNull(obj)) return;
  obj = JSON.parse(obj);
  if (obj.dataType === 'string') {
    content = obj.content;
  } else if (obj.dataType === 'number') {
    content = Number(obj.content);
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content);
  } else if (obj.dataType === 'object') {
    content = obj.content;
  }
  return content;
};
/**
 * 删除localStorage
 */
export const removeStore = params => {
  let { name } = params;
  localStorage.removeItem(name);
  sessionStorage.removeItem(name);
};
