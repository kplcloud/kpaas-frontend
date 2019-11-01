import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set';
import {Card} from 'antd'


export default class ChartArea extends Component {
  static displayName = 'ChartArea';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // 参考：https://alibaba.github.io/BizCharts/
    const data = [
      { year: '14:39', north: 322, south: 162 },
      { year: '14:40', north: 324, south: 90 },
      { year: '14:41', north: 329, south: 50 },
      { year: '14:42', north: 342, south: 77 },
      { year: '14:43', north: 348, south: 35 },
      { year: '14:44', north: 334, south: -45 },
      { year: '14:45', north: 325, south: -88 },
      { year: '14:46', north: 316, south: -120 },
      { year: '14:47', north: 318, south: -156 },
      { year: '14:48', north: 330, south: -123 },
      { year: '14:49', north: 355, south: -88 },
      { year: '14:50', north: 366, south: -66 },
      { year: '14:51', north: 337, south: -45 },
      { year: '14:52', north: 352, south: -29 },
      { year: '14:53', north: 377, south: -45 },
      { year: '14:54', north: 383, south: -88 },
      { year: '14:55', north: 344, south: -132 },
      { year: '14:56', north: 366, south: -146 },
      { year: '14:57', north: 389, south: -169 },
      { year: '14:58', north: 334, south: -184 },
      { year: '14:59', north: 334, south: -184 },
      { year: '15:00', north: 334, south: -184 },
      { year: '15:01', north: 334, south: -184 },
      { year: '15:02', north: 334, south: -184 },
      { year: '15:03', north: 334, south: -184 },
      { year: '15:04', north: 334, south: -184 },
      { year: '15:05', north: 334, south: -184 },
      { year: '15:06', north: 334, south: -184 },
      { year: '15:07', north: 334, south: -184 },
      { year: '15:08', north: 334, south: -184 },
    ];

    const dv = new DataView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['north', 'south'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });

    const cols = {
      year: {
        range: [0, 1],
      },
    };

    return (
      <div className="chart-area">
        <Card title="网络">
          {/* <h4 style={styles.title}>面积图</h4> */}
          <Chart height={400} data={dv} scale={cols} forceFit>
            <Axis name="year" />
            <Axis
              name="value"
              label={{
                formatter: (val) => {
                  return `${(val / 10000).toFixed(1)}k`;
                },
              }}
            />
            <Legend />
            <Tooltip crosshairs={{ type: 'line' }} />
            <Geom type="area" position="year*value" color="type" />
            <Geom type="line" position="year*value" size={2} color="type" />
          </Chart>
        </Card>
      </div>
    );
  }
}

const styles = {
  title: {
    margin: '0 0 40px',
    fontSize: '18px',
    paddingBottom: '15px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
  },
};
