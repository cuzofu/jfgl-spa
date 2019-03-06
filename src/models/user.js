import { reloadAuthorized } from '../utils/Authorized';
import { query as queryUsers, getUserInfo, fakeRegister, getAuthMenus } from '../services/user';
import { setStore, getStore, setAuthority } from '../utils/store';

export default {
  namespace: 'user',

  state: {
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
    // 存储菜单数据(全局缓存)
    menus:
      getStore({
        name: 'menus',
      }) || [],
    // 存储路由数据(全局缓存)
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },

    *fetch({ call, put }) {
      const response = yield call(queryUsers);

      if (response) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *fetchCurrent(_, { call, put }) {
      // const token = yield select(state => state.user.access_token);
      //
      // if (token) {
      //   setToken(token);
      // }

      const response = yield call(getUserInfo);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        const menus = yield call(getAuthMenus);
        if (menus) {
          yield put({
            type: 'saveMenus',
            payload: menus,
          });
        }
      }
    },
  },

  reducers: {
    saveMenus(state, { payload }) {
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
    changeLoginStatus(state, { payload }) {
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
    setAccessTokenAndRefreshToken(state, { payload }) {
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

    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser: function(state, action) {
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
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    registerHandle(state, { payload }) {
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
