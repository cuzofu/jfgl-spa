import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon, Row, Col } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 湖北升思科技股份有限公司
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div>
          <img src={require('./../assets/img/login/logo_title.jpg')} width="100%" height="480" />
        </div>

        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <span className={styles.title}>甲方项目管理</span>
              </Link>
            </div>
          </div>
          <div className={styles.children}>
            <Row>
              <Col span={8}>
                {' '}
                <img src={require('./../assets/img/login/login.png')} />
              </Col>
              <Col span={16}>{children} </Col>
            </Row>
          </div>
          <GlobalFooter copyright={copyright} />
        </div>
      </div>
    );
  }
}

export default UserLayout;
