import React from 'react';
import { FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import PanesHeader from './PanesHeader';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './PanesWrapper.less';
import MenuContext from '@/layouts/MenuContext';

const PanesWrapper = ({ children, contentWidth, wrapperClassName, top, ...restProps }) => (
  <div style={{ margin: '6px' }} className={wrapperClassName}>
    {top}
    <MenuContext.Consumer>
      {value => (
        <PanesHeader
          wide={contentWidth === 'Fixed'}
          home={<FormattedMessage id="menu.home" defaultMessage="Home" />}
          {...value}
          key="pageheader"
          {...restProps}
          linkElement={Link}
          itemRender={item => {
            if (item.locale) {
              return <FormattedMessage id={item.locale} defaultMessage={item.name} />;
            }
            return item.name;
          }}
        />
      )}
    </MenuContext.Consumer>
    {children ? (
      <div className={styles.content}>
        <GridContent>{children}</GridContent>
      </div>
    ) : null}
  </div>
);

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PanesWrapper);
