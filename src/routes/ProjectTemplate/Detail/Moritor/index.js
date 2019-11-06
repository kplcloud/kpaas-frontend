import React, { Component } from 'react';
import Notifications from './components/Notifications';
import NoticeCard from './components/NoticeCard';
import AreaStackChart from './components/AreaStackChart';
import ChartArea from './components/ChartArea';
// import PerformanceChart from './components/PerformanceChart';
import { connect } from 'dva';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


  componentWillMount() {
    const { dispatch, namespace, name } = this.props;
    dispatch({
      type: 'monitor/fetchProjectMetrics',
      payload: {
        ns: namespace,
        name: name,
      },
    });
    dispatch({
      type: 'monitor/fetchProjectAlerts',
      payload: {
        ns: namespace,
        name: name,
      },
    });
  }

  componentDidMount() {

  }

  render() {
    const { monitor: { podMonitor, alerts }, namespace, name } = this.props;
    return (
      <div className="moritor-page">
        <Notifications data={alerts}/>
        {/* 适用于顶部的消息提示 */}
        {/* <NoticeCard /> */}
        {/* 叠加面积图 */}
        <AreaStackChart data={podMonitor}/>

        <ChartArea data={podMonitor}/>

        {/* <PerformanceChart /> */}
      </div>
    );
  }
}

export default connect(({ monitor }) => ({ monitor }))(Index);
