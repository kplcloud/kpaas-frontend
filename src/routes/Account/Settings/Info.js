import React, { Component } from 'react';
import { connect } from 'dva';
//import router from 'umi/router';
//import { FormattedMessage } from 'umi/locale';
import {routerRedux} from 'dva/router'
import { Menu } from 'antd';
import GridContent from '../../../components/PageHeaderWrapper/GridContent';
import styles from './Info.less';
import BaseView from './BaseView'
import BindingView from './BindingView'
import NoticeView from './NoticeView'

const { Item } = Menu;

@connect(({ user,binding }) => ({
  currentUser: user.currentUser,
  bindingInfo: binding,
}))
class Info extends Component {
  constructor(props) {
    super(props);
    const { match, location, dispatch } = props;
    dispatch({
        type: 'binding/getUserInfo',
      });
    const menuMap = {
      base: <span>基本设置</span>,
      //security: <span>安全设置</span>,
      binding: <span>账号绑定</span>,
      notice: <span>消息订阅设置</span>,
    };
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'base',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'base';
    if (selectKey !== state.selectKey) {
      return { selectKey };
    }
    return null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getmenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = ({ key }) => {
    const {dispatch} = this.props;
    //router.push(`/account/settings/${key}`);
    dispatch(routerRedux.push('/account/settings/' + key));
    
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      let mode = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const {currentUser,dispatch,bindingInfo } = this.props;  //console.log("info",this.props)
    const { mode, selectKey } = this.state;
    const ChildrenProps = {
        currentUser:currentUser,
        dispatch:dispatch,
        bindingInfo:bindingInfo,
    };
    let children = <BaseView {...ChildrenProps}/>
    if (this.state.selectKey == "binding"){
        children = <BindingView {...ChildrenProps}/>
    }else if(this.state.selectKey == "notice"){
        children = <NoticeView {...ChildrenProps}/>
    }
    
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            this.main = ref;
          }}
        >
          <div className={styles.leftmenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={this.selectKey}>
              {this.getmenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
              {children}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Info;
