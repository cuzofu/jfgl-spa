import React from 'react';
import { Layout } from 'antd';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import PanesWrapper from './PanesWrapper';
import Context from '../MenuContext';

import { indexOfArray } from '@/utils/commonUtils';

const { Content } = Layout;

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
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
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
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

@connect(({ panes, loading }) => ({
  panes,
  loading: loading.models.panes,
}))
class PaneLayout extends React.PureComponent {
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
    const {
      dispatch,
      route: { routes },
    } = this.props;
    dispatch({
      type: 'panes/save',
      payload: {
        routes,
      },
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
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
    const {
      route: { routes },
    } = this.props;
    return memoizeOneFormatter(routes);
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
      margin: '24px 24px 0',
      // paddingTop: fixedHeader ? 64 : 0,
    };
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
            router.push(!url ? path : url);
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

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      panes: { panes, activeKey },
    } = this.props;
    const { isMobile, menuData } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout
        style={{
          // ...this.getLayoutStyle(),
          // minHeight: '100vh',
        }}
      >
        <Content style={this.getContentStyle()}>
          <PanesWrapper
            tabList={panes}
            tabActiveKey={activeKey}
            onTabChange={this.handleTabChange}
            onTabRemove={this.handleTabRemove}
          >
            {children}
          </PanesWrapper>
        </Content>
      </Layout>
    );
    return (
      <React.Fragment>
        <Context.Provider value={this.getContext()}>
          <div>{layout}</div>
        </Context.Provider>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  ...setting,
}))(PaneLayout);
