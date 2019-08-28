import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Col,
  Tooltip,
  Icon
} from 'antd';
import { MiniArea, ChartCard } from '../../components/Charts';
import numeral from 'numeral';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: { marginBottom: 24 },
};
class Metrics extends PureComponent {
  render() {
    const {detail} = this.props;
    const {metrics} = detail;
    var metric = metrics ? metrics[0] : false;
    metric = metrics
    console.log(metrics)
    console.log(metric)
    if (!metric || !metric["memory"]) {
      return ('')
    }
    return (
        <Card title="使用情况" style={{ marginBottom: 24 }} bordered={false}>
          {metric && 
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="CPU（核）"
              action={
                <Tooltip title="近15分钟CPU使用情况">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={metric.curr_cpu / 1000}
              contentHeight={46}
            >
              <MiniArea color="#87CEFA" data={metric.cpu} />
            </ChartCard>
          </Col>}
          {metric && <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="内存（字节）"
              action={
                <Tooltip title="近15分钟内存使用情况">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(metric.curr_memory).format('0,0')}
              contentHeight={46}
            >
              <MiniArea color="#90EE90" data={metric.memory} />
            </ChartCard>
          </Col>}
        </Card>
    );
  }
}
export default connect(({}) => ({
    
}))(Metrics);
