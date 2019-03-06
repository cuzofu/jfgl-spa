import {message} from 'antd';
import {routerRedux} from 'dva/router';
import {setToken, removeToken} from '../utils/authority';
import {reloadAuthorized} from '../utils/Authorized';
import {getUserInfo, fakeRegister, fakeAccountLogin, fakeLogout, sendVcode, mobileLogin} from '../services/login';
import {getAuthMenus} from '../services/user';

import {setStore, getStore, setAuthority} from '../utils/store';
import {notification} from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    list: [],
    currentUser:
    getStore({
      name: 'userInfo',
    }) || {},
    permissions:
    getStore({
      name: 'permissions',
    }) || {},
    roles:
    getStore({
      name: 'roles',
    }) || [],
    access_token:
    getStore({
      name: 'access_token',
    }) || '',
    refresh_token:
    getStore({
      name: 'refresh_token',
    }) || '',
    menus:
    getStore({
      name: 'menus',
    }) || [],
    // 存储路由数据(全局缓存)
  },

  effects: {
    * submit({payload}, {call, put}) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },

    * login({payload}, {call, put}) {
      const response = yield call(
        payload.type === 'account' ? fakeAccountLogin : mobileLogin,
        payload.type === 'account' ? {...payload, grant_type: 'password',} : {...payload, grant_type: 'mobile', scope: 'server',}
      );

      if (response) {
        if (!('error' in response)) {
          response.status = 'ok';
        } else {
          response.status = 'error';
        }

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });

        if (response.status === 'ok') {
          setToken(response.access_token);
          yield put({
            type: 'setAccessTokenAndRefreshToken',
            payload: response,
          });
          const usesRes = yield call(getUserInfo);

          yield put({
            type: 'saveCurrentUser',
            payload: usesRes.data,
          });

          const menus = yield call(getAuthMenus);

          yield put({
            type: 'saveMenus',
            payload: menus,
          });


          reloadAuthorized();
          yield put(routerRedux.push('/workbench'));
        } else {
          notification.error({
            message: `登录失败,失败原因: `,
            description: response.error_description,
          });
        }
      }
    },
    * logout({payload}, {call, put, select}) {
      const response = yield call(fakeLogout, payload);

      yield put({type: 'logOutClear'});

      if (response && response.code === 0) {
        try {
          // get location pathname
          const urlParams = new URL(window.location.href);
          const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          urlParams.searchParams.set('redirect', pathname);
          window.history.replaceState(null, 'login', urlParams.href);
        } finally {
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: false,
            },
          });
          reloadAuthorized();
          yield put(routerRedux.push('/user/login'));
        }
      }
    },

    * sendVCode({payload, callback}, {call, put}) {
      const response = yield call(sendVcode, payload.phone.replace(/\s+/g, ""));
      if (response && response.data) {
        message.info('发送成功!', 1);
        if (callback) callback(true);
      } else {
        message.error(response.msg, 1);
        if (callback) callback(false);
      }
    },

  },

  reducers: {
    saveMenus(state, {payload}) {
      setStore({
        name: 'menus',
        content: payload,
        type: 'session',
      });

      return {
        ...state,
        menus: payload,
      };
    },
    changeLoginStatus(state, {payload}) {
      setStore({
        name: 'access_token',
        content: payload.access_token,
        type: 'session',
      });
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    setAccessTokenAndRefreshToken(state, {payload}) {
      setStore({
        name: 'access_token',
        content: payload.access_token,
        type: 'session',
      });
      setStore({
        name: 'refresh_token',
        content: payload.refresh_token,
        type: 'session',
      });
      return {
        ...state,
        refresh_token: payload.refresh_token,
        access_token: payload.access_token,
      };
    },
    logOutClear(state) {
      setStore({
        name: 'access_token',
        content: '',
        type: 'session',
      });
      setStore({
        name: 'refresh_token',
        content: '',
        type: 'session',
      });
      setStore({
        name: 'menus',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'roles',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'permissions',
        content: [],
        type: 'session',
      });
      setStore({
        name: 'userInfo',
        content: {},
        type: 'session',
      });
      removeToken();
      setAuthority('');
      return {
        ...state,
        currentUser: {},
        permissions: {},
        roles: [],
        access_token: '',
        refresh_token: '',
      };
    },

    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {

      setStore({
        name: 'userInfo',
        content: action.payload.sysUser,
        type: 'session',
      });

      setAuthority(action.payload.roles);
      setStore({
        name: 'roles',
        content: action.payload.roles,
        type: 'session',
      });
      const list = {};
      for (let i = 0; i < action.payload.permissions.length; i++) {
        list[action.payload.permissions[i]] = true;
      }
      setStore({
        name: 'permissions',
        content: list,
        type: 'session',
      });

      return {
        ...state,
        currentUser: action.payload.sysUser,
        roles: action.payload.roles,
        permissions: list,
      };
    },

    registerHandle(state, {payload}) {
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },

  },
};
