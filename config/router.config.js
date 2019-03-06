export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },

  {
    path: '/',
    component: '../layouts/TopLayout',
    Routes: ['src/pages/Authorized'],
    routes: [

      // 工作台
      { path: '/', redirect: '/workbench' },
      {
        path: '/workbench',
        name: 'workbench',
        routes: [
          {
            path: '/workbench',
            component: './10_Workbench',
          },
        ],
      },

      // 项目看板
      {
        path: '/dashboard',
        component: '../layouts/DashboardLayout/DashboardLayout',
        name: 'dashboard',
        routes: [
          { path: '/dashboard', redirect: '/dashboard/overview' },
          // 项目总览
          {
            path: '/dashboard/overview',
            component: './20_Dashboard/01_Overview',
          },
          // 前期管理
          {
            path: '/dashboard/prophase',
            component: './20_Dashboard/02_Prophase',
          },
        ],
      },

      // 消息板
      {
        path: '/message',
        name: 'message',
        routes: [
          {
            path: '/message',
            component: './30_Message',
          },
        ],
      },

      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
