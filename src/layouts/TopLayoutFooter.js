import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{
    padding: 0,
    borderTop: '1px solid #ebedf0',
    // boxShadow: '0 -1px 4px rgba(0, 21, 41, 0.08)'
  }}>
    <GlobalFooter
      links={[
        {
          key: 'Pro 首页',
          title: 'Pro 首页',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <Icon type="github" />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Ant Design',
          title: 'Ant Design',
          href: 'https://ant.design',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
