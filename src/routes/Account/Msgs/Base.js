import React, { Component } from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router'
import { Menu } from 'antd';
import GridContent from '../../../components/PageHeaderWrapper/GridContent';
import styles from './Base.less';
import NoticeView from './NoticeView'
import AlarmView from './AlarmView'
import ProclaimView from './ProclaimView'

const { Item } = Menu;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class Base extends Component {
  constructor(props) {
    super(props);
    const { match, location, dispatch } = props;  //console.log("xxxxxx2",this.props)
    // dispatch({
    //     type: 'binding/getUserInfo',
    //   });
    const menuMap = {
      notice: <span>通知消息</span>,
      alarm: <span>告警消息</span>,
      proclaim: <span>公告消息</span>,
    };
    const key = location.pathname.replace(`${match.path}/`, '');
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: menuMap[key] ? key : 'notice',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { match, location } = props;
    let selectKey = location.pathname.replace(`${match.path}/`, '');
    selectKey = state.menuMap[selectKey] ? selectKey : 'notice';
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
    dispatch(routerRedux.push('/account/msgs/' + key));
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
    const {dispatch,listShow } = this.props;  //console.log("base",this.state)
    const { mode, selectKey } = this.state;
    const ChildrenProps = {
        dispatch:dispatch,
        listShow,listShow,
    };
    let children = <NoticeView {...ChildrenProps}/>
    if (this.state.selectKey == "alarm"){
        children = <AlarmView {...ChildrenProps}/>
    }else if(this.state.selectKey == "proclaim"){
        children = <ProclaimView {...ChildrenProps}/>
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

export default Base;
