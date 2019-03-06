import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Card, Alert, Checkbox, Icon, notification, message } from 'antd';
import { getBaseUrl } from '../../utils/utils';
import Login from '@/components/Login';
import styles from './Login.less';

const { Meta } = Card;
const { Tab, UserName, Password, Submit, Mobile, Captcha, } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () => new Promise((resolve, reject) => {
    this.loginForm.validateFields(['mobile'], {}, (err, values) => {
      if (err) {
        message.error('手机号码有误');
        reject(err);
      } else {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/sendVCode',
          payload: {phone: values.mobile},
          callback: (success) => {
            if (success) {
              resolve();
            } else {
              reject();
            }
          }
        })
          .then(resolve)
          .catch(reject);
      }
    });
  });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}

            <UserName name="username" placeholder="请输入用户名" />
            <Password
              name="password"
              placeholder="请输入账号密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
            login.type === 'mobile' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-verification-code' }))}
            <Mobile
              name="mobile"
              placeholder="手机号"
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                },
              ]}
            />
            <Captcha
              name="code"
              placeholder="验证码"
              buttonText="验证码"
              countDown={30}
              onGetCaptcha={this.onGetCaptcha}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
          </Tab>
          {/*
          <Tab key="usbkey" tab={formatMessage({ id: 'app.login.tab-login-usbkey' })}>
            {login.status === 'error' &&
              login.type === 'usbkey' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Card hoverable>
              <Password name="usbpwd" placeholder="请输入密码" />
              <Meta description="请插入加密锁,并且输入密码。" />
            </Card>
            <object
              style={{ display: 'none' }}
              classID="clsid:8DE9546F-6D19-4068-B53A-7BEF6541D18A"
              id="WebSecurityKey"
              codebase="http://www.ycjsjg.net/cmis/ocx/WebSecurityKey.cab#version=1,0,0,0"
            >
              <param name="Visible" value="0" />
              <param name="AutoScroll" value="0" />
              <param name="AutoSize" value="0" />
              <param name="AxBorderStyle" value="1" />
              <param name="Caption" value="主窗体" />
              <param name="Color" value="4278190095" />
              <param name="Font" value="宋体" />
              <param name="KeyPreview" value="0" />
              <param name="PixelsPerInch" value="96" />
              <param name="PrintScale" value="1" />
              <param name="Scaled" value="-1" />
              <param name="DropTarget" value="0" />
              <param name="HelpFile" value="" />
              <param name="ScreenSnap" value="0" />
              <param name="SnapBuffer" value="10" />
              <param name="DoubleBuffered" value="0" />
              <param name="Enabled" value="-1" />
              <param name="URLSoftwareFirms" value="" />
            </object>
            <div style={{ height: 1 }} />
          </Tab>
          */}
          <div style={{ height: 18 }} />
          <div style={{ float: 'left' }}>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <div>
            <a
              style={{ float: 'right' }}
              href={`${getBaseUrl()}group1/M00/88/29/oYYBAFxrUsWAAaeWAACKPGzUX-s03.docx`}
            >
              节后复工安全生产自查表
            </a>
            <a
              style={{ float: 'right', marginRight: '15px' }}
              href={`${getBaseUrl()}group1/M00/3D/D1/oYYBAFx41maADgHzAB9-AMnK5Qw571.doc`}
            >
              操作说明
            </a>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
