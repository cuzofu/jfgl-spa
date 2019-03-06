import React, { PureComponent } from 'react';
import { Icon, Menu } from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';

const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

export default class TopGlobalHeader extends PureComponent {

  state = {
    current: '',
    topMenuData: [
      {
        key: 'workbench',
        path: '/workbench',
        name: '工作台',
      },
      {
        key: 'dashboard',
        path: '/dashboard',
        name: '项目看板',
      },
      {
        key: 'message',
        path: '/message',
        name: '消息板',
      },
    ],
  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={() => this.handleMenuSelect(itemPath)}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  handleMenuSelect = selectedPath => {
    const { menuData, onMenuSelect } = this.props;
    console.log(onMenuSelect);
    if (onMenuSelect) {
      onMenuSelect(this.findMenuData(selectedPath, menuData));
    }
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  findMenuData = (selectedPath, menusData) => {
    if (!menusData) return undefined;
    for (let i = 0; i < menusData.length - 1; i++) {
      const menuData = menusData[i];
      if (menuData.path === selectedPath) {
        return menuData;
      }
      if (menuData.children) {
        return this.findMenuData(selectedPath, menuData.children);
      }
    }
    return undefined;
  };

  handleClick = (e) => {
    const { match } = this.props;
    this.setState({
      current: e.key,
    });
    router.push(`/${e.key}`);
  };

  render() {
    const {current, topMenuData} = this.state;
    const { logo } = this.props;
    const {
      location: {
        pathname,
      }
    } = this.props;
    let index = 0;
    if (pathname) {
      index = topMenuData.findIndex(i => pathname.indexOf(i.path) === 0);
    }
    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
          <h1>甲方项目管理</h1>
        </Link>
        <div className={styles.center}>
          <Menu
            // onClick={this.handleClick}
            selectedKeys={[topMenuData[index < 0 ? 0 : index].key]}
            mode="horizontal"
          >
            {topMenuData.map(menu => (<Menu.Item key={menu.key}>{this.getMenuItemPath(menu)}</Menu.Item>))}
          </Menu>
        </div>
        <RightContent {...this.props} />
      </div>
    );
  }
}
