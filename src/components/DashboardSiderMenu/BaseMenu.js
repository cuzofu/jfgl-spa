import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatches = memoizeOne(
  (flatMenuKeys, path) => flatMenuKeys.filter(item => item && pathToRegexp(item).test(path)),
  isEqual
);

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }

  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
    if (!menusData) {
      return [];
    }
    if (!menusData[0].children) {
      return [];
    }
    return menusData[0].children
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item, parent);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname =>
    urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const name = item.locale ? formatMessage({ id: item.locale }) : item.name;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const name = item.locale ? formatMessage({ id: item.locale }) : item.name;
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
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          () => this.handleMenuSelect(itemPath)
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  handleMenuSelect = selectedPath => {
    const { menuData, onMenuSelect } = this.props;
    if (onMenuSelect) {
      onMenuSelect(this.findMenuData(selectedPath, menuData));
    }
  };

  findMenuData = (selectedPath, menusData) => {
    if (!menusData) return undefined;
    for (let i = 0; i < menusData.length; i++) {
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

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode="inline"
        inlineCollapsed={false}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        // className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
