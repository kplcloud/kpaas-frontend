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
    const { dispatch} = this.props;
    
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="moritor-page">
        <Notifications />
        {/* 适用于顶部的消息提示 */}
        {/* <NoticeCard /> */}
        {/* 叠加面积图 */}
        <AreaStackChart />

        <ChartArea />

        {/* <PerformanceChart /> */}
      </div>
    );
  }
}
export default connect(({ }) => ({

}))(Index);