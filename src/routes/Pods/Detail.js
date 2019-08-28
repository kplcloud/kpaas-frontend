import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Logs from './Logs';
import Overview from './Overview';
import XtermTerminal from './XtermTerminal';

class Detail extends PureComponent {
  state = {
    showLab: 'overview',
    tabList: [{
      key: 'overview',
      tab: '概览',
      default: 'overview',
    }, {
      key: 'logs',
      tab: '日志',
    }, {
      key: 'terminal',
      tab: '控制台',
    }],
  };

  componentDidMount() {
    const that = this;
    const { dispatch, match } = that.props;
    if ((window.location.hash).indexOf('/logs') !== -1) {
      that.setState({
        showLab: 'logs',
        tabList: [{
          key: 'overview',
          tab: '概览',
        }, {
          key: 'logs',
          tab: '日志',
          default: 'logs',
        }, {
          key: 'terminal',
          tab: '控制台',
        }],
      });
    }
    dispatch({
      type: 'pods/list',
      payload: {
        namespace: match.params.namespace,
        name: match.params.svc,
      },
    });
  };

  handleTabChange = (key) => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'overview':
        this.setState({ showLab: 'overview' });
        dispatch(routerRedux.push(`${match.url}/overview`));
        break;
      case 'logs':
        this.setState({ showLab: 'logs' });
        dispatch(routerRedux.push(`${match.url}/logs`));
        break;
      case 'terminal':
        this.setState({ showLab: 'terminal' });
        dispatch(routerRedux.push(`${match.url}/terminal`));
        break;
      default:
        break;
    }
  };

  render() {

    const { pods, dispatch, match } = this.props;
    const { detail } = pods;
    const onReturn = () => {
      dispatch(routerRedux.push(`/project/detail/${match.params.namespace}/${match.params.svc}`));
    };
    const detailService = (
      <span>
        <a onClick={onReturn}><Icon type="rollback"/> &nbsp;返回服务详情</a>
      </span>
    );
    return (
      <PageHeaderLayout
        title={`Pods详情${detail && detail.pod ? ' - ' + detail.pod.metadata.name : ''}`}
        content={detailService}
        loading={false}
        tabList={this.state.tabList}
        onTabChange={this.handleTabChange}
      >


        {this.state.showLab === 'logs' && <Logs {...this.props} />}

        {this.state.showLab === 'overview' && <Overview {...this.props} />}

        {this.state.showLab === 'terminal' && <XtermTerminal {...this.props} />}

      </PageHeaderLayout>
    );
  }
}

export default connect(({ pods }) => ({
  pods,
}))(Detail);
