/**
 * Created by huyunting on 2018/6/22.
 */
/**
 * Created by huyunting on 2018/6/22.
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
class PodsLogs extends React.PureComponent {
  render() {
    return <Card style={{ marginBottom: 24 }}>暂未开放使用~</Card>;
  }
}

export default connect(({ project }) => ({}))(PodsLogs);
