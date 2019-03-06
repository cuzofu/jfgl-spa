import React, { PureComponent } from 'react';
import { Tabs, Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './PanesHeader.less';

const { TabPane } = Tabs;
export default class PanesHeader extends PureComponent {
  onChange = key => {
    const { onTabChange } = this.props;
    if (onTabChange) {
      onTabChange(key);
    }
  };

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  };

  add = () => {};

  remove = targetKey => {
    const { onTabRemove } = this.props;
    if (onTabRemove) {
      onTabRemove(targetKey);
    }
  };

  render() {
    const {
      tabList,
      className,
      tabActiveKey,
      tabDefaultActiveKey,
      tabBarExtraContent,
      loading = false,
      wide = false,
    } = this.props;

    const clsString = classNames(styles.pageHeader, className);
    const activeKeyProps = {};
    if (tabDefaultActiveKey !== undefined) {
      activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
    }
    if (tabActiveKey !== undefined) {
      activeKeyProps.activeKey = tabActiveKey;
    }
    return (
      <div className={clsString}>
        <div className={wide ? styles.wide : ''}>
          <Skeleton
            loading={loading}
            title={false}
            active
            paragraph={{ rows: 3 }}
            avatar={{ size: 'large', shape: 'circle' }}
          >
            {tabList && tabList.length ? (
              <Tabs
                hideAdd
                type="editable-card"
                // className={styles.tabs}
                {...activeKeyProps}
                onChange={this.onChange}
                tabBarExtraContent={tabBarExtraContent}
                onEdit={this.onEdit}
              >
                {tabList.map(item => (
                  <TabPane closable={item.closable} tab={item.name} key={item.key} />
                ))}
              </Tabs>
            ) : null}
          </Skeleton>
        </div>
      </div>
    );
  }
}
