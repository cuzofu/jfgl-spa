import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/DashboardSiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import Context from '../MenuContext';
import PanesWrapper from '../PanesLayout/PanesWrapper';
import Exception403 from '../../pages/Exception/403';

const { Content, Header } = Layout;

import { indexOfArray } from '@/utils/commonUtils';

const tripLastSlash = path => {
  // return path.replace(/\/$/gi, '');
  const temp = path.replace(/\/$/gi, '');
  if (path === temp) {
    return path;
  }
  return tripLastSlash(temp);
};

const replaceAllSlash = (path, toStr = '_') => path.replace(/\//g, toStr);

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      let locale = 'menu';
      if (parentName && item.name) {
        locale = `${parentName}.${item.name}`;
      } else if (item.name) {
        locale = `menu.${item.name}`;
      } else if (parentName) {
        locale = parentName;
      }
      if (item.path) {
        const result = {
          ...item,
          locale,
          authority: item.authority || parentAuthority,
        };
        if (item.routes) {
          const children = formatter(item.routes, item.authority, locale);
          // Reduce memory usage
          result.children = children;
        }
        delete result.routes;
        return result;
      }

      return null;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class DashboardLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    rendering: true,
    isMobile: false,
    menuData: this.getMenuData(),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });

    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    this.initTab();
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      // this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const { menus } = this.props;

    return memoizeOneFormatter(menus);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return '甲方项目管理';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - 甲方项目管理`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      minHeight: '700px',
      height: 'calc(100vh - 238px)',
      // margin: '24px 24px 0',
      // paddingTop: fixedHeader ? 64 : 0,
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  initTab = () => {
    const {
      location: { pathname },
      panes: { panes, activeKey },
    } = this.props;

    const currentPathMenu = this.matchParamsPath(pathname);
    if (!currentPathMenu) {
      router.push('/exception/404');
      return;
    }

    if (activeKey === replaceAllSlash(tripLastSlash(pathname))) return;
    const isExist =
      panes.filter(item => item.key === replaceAllSlash(tripLastSlash(pathname))).length > 0;
    if (isExist) {
      this.handleTabChange(replaceAllSlash(tripLastSlash(pathname)));
    } else {
      this.handleTabAdd({
        ...currentPathMenu,
        url: pathname,
      });
    }
  };

  handleTabChange = key => {
    const {
      dispatch,
      panes: { panes },
    } = this.props;
    const selectedPane = panes.filter(item => item.key === replaceAllSlash(tripLastSlash(key)));

    if (selectedPane && selectedPane.length === 1) {
      dispatch({
        type: 'panes/changeTabStatus',
        payload: {
          activeKey: replaceAllSlash(tripLastSlash(key)),
        },
        callback: () => {
          const pane = selectedPane[0];
          router.push(!pane.url ? pane.path : pane.url);
        },
      });
    }
  };

  handleTabAdd = pane => {
    if (!pane) {
      router.push('/exception/404');
      return;
    }
    const {
      dispatch,
      panes: { panes },
    } = this.props;
    const { path, name, closable, url } = pane;
    const isExist =
      panes.filter(item => item.key === replaceAllSlash(tripLastSlash(path))).length > 0;
    if (isExist) {
      this.handleTabChange(path);
    } else {
      dispatch({
        type: 'panes/changeTabStatus',
        payload: {
          panes: panes.concat([
            {
              key: replaceAllSlash(tripLastSlash(path)),
              path,
              name,
              closable,
              url,
            },
          ]),
          activeKey: replaceAllSlash(tripLastSlash(path)),
        },
        callback: () => {
          if (url) {
            // router.push(!url ? path : url);
          }
        },
      });
    }
  };

  handleTabRemove = key => {
    const {
      dispatch,
      panes: { panes },
    } = this.props;

    const index = indexOfArray(panes, 'key', replaceAllSlash(tripLastSlash(key)));
    if (index === -1) {
      return;
    }

    const newPanes = panes.filter(item => item.key !== replaceAllSlash(tripLastSlash(key)));
    const currentPane = newPanes[index - 1];
    dispatch({
      type: 'panes/changeTabStatus',
      payload: {
        panes: newPanes,
        activeKey: replaceAllSlash(tripLastSlash(newPanes[index - 1].key)),
      },
      callback: () => {
        router.push(!currentPane.url ? currentPane.path : currentPane.url);
      },
    });
  };

  findMenuData = (selectedPath, menusData) => {
    const path = tripLastSlash(selectedPath);
    if (!menusData) return undefined;
    for (let i = 0; i < menusData.length - 1; i++) {
      const menuData = menusData[i];
      if (menuData.path === path) {
        return menuData;
      }
      if (menuData.children) {
        return this.findMenuData(path, menuData.children);
      }
    }
    return undefined;
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      route,
      panes: {
        panes,
        activeKey,
      }
    } = this.props;
    const { isMobile, menuData } = this.state;
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        <Header style={{
          backgroundColor: '#fff',
          height: 48,
          lineHeight: '48px',
          borderBottom: '1px solid #ebedf0',
          borderTop: '1px solid #ebedf0'
        }}>
          团结路市政工程（宜昌市团结路市政工程位于宜昌市点军区桥边镇，起点点军大道，终点双十路，全长2310.189米，标准路段红线宽度40米。）
        </Header>
        <Layout
          style={{
            // ...this.getLayoutStyle(),
            // minHeight: '100vh',
          }}
        >
          <SiderMenu
            Authorized={Authorized}
            theme={navTheme}
            onMenuSelect={this.handleTabAdd}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
          <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              <PanesWrapper
                route={route} location={this.props.location}
                tabList={panes}
                tabActiveKey={activeKey}
                onTabChange={this.handleTabChange}
                onTabRemove={this.handleTabRemove}
              >
                {children}
              </PanesWrapper>
            </Authorized>
          </Content>
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ login, user, global, setting, panes }) => ({
  menus: login.menus,
  collapsed: global.collapsed,
  layout: setting.layout,
  panes,
  ...setting,
}))(DashboardLayout);
