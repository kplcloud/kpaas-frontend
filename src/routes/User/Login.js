import React, {Component} from 'react';
import {connect} from 'dva';
// import {Link} from 'dva/router';
import {Checkbox, Alert, Icon, Button} from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import Cookie from "js-cookie"
import {routerRedux} from 'dva/router';
import {setAuthority} from '../../utils/authority';

const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    loginType: {
      "github": <a href="/auth/github/login"><Button size="large" icon="github">Github 授权登陆</Button></a>
    }
  };

  handleSubmit = (err, values) => {
    const {type} = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  getParameterByName = (name) => {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(this.props.location.search);
      return results == null ? "": decodeURIComponent(results[1]);
  }

  componentWillMount() {
    const {dispatch} = this.props
    let email = this.getParameterByName("email");
    let token = this.getParameterByName("token");
    let namespace = this.getParameterByName("namespace");
    let username = this.getParameterByName("username");
    if (email != "" && token != "" && namespace != "") {
      Cookie.set("namespace", namespace);
      Cookie.set("username", username);
      Cookie.set("email", email);
      // Cookie.set("authorization", token.replace("Bearer+", "Bearer "));
      localStorage.setItem("authorization", token)
      localStorage.setItem("username", username)
      localStorage.setItem("email", email)
      setAuthority("admin");
      // this.props.dispatch(routerRedux.push('/dashboard/workplace'))
      window.location.href = "/"
    }
    dispatch({
      type: 'login/getLoginType',
    })
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{marginBottom: 24}} message={content} type="error" showIcon/>;
  };

  render() {
    const {login, submitting} = this.props;
    const {type} = this.state;
    const {loginType} = login;
    let that = this;
    if (loginType != "") {
      return <div className={styles.main} style={{textAlign: "center"}}>{that.state.loginType[loginType]}</div>
    }
    return (<div className={styles.main}>
        <Login defaultActiveKey={type} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
            login.type === 'account' && !login.submitting &&
            this.renderMessage(login.message)}
            <UserName name="username" placeholder="您的邮箱"/>
            <Password name="password" placeholder="您的密码"/>
          </Tab>
          <Submit loading={submitting}>登录</Submit>          
        </Login>
      </div>
    );
  }
}
