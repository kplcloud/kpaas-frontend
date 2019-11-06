import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { DataView } from '@antv/data-set';
import { Card, Select } from 'antd';
import moment from 'moment';


export default class ChartArea extends Component {
  static displayName = 'ChartArea';

  static propTypes = {};

  static defaultProps = {};

  state = {
    pod: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      pod: null,
    };
  }

  onChangePod = (name) => {
    this.setState({
      pod: name,
    });
  };

  render() {
    // 参考：https://alibaba.github.io/BizCharts/
    const { data } = this.props;
    const dds = [];
    let { pod } = this.state;

    if (!data) {
      return ('');
    }

    const pods = [];
    for (let i in  data) {
      pods.push(i);
    }
    if (pod == null) {
      pod = pods[0];
    }

    for (let n in data[pod]) {
      if (!data[pod][n] || !data[pod][n]['network-rx_rate']) {
        continue;
      }
      for (let x in data[pod][n]['network-rx_rate']) {
        dds.push({
          year: moment(data[pod][n]['network-rx_rate'][x].x).format('H:mm:ss'),
          Inflow: data[pod][n]['network-rx_rate'][x].y,
          Outflow: -(data[pod][n]['network-tx_rate'][x].y),
        });
      }
      break;
    }

    const extraContent = (
      <div style={{ marginLeft: 16, width: 360 }}>
        <Select
          defaultValue={pods[0]}
          showSearch
          style={{ width: 320 }}
          placeholder="请选择pod"
          optionFilterProp="children"
          onChange={this.onChangePod}
          //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {pods.map((item, key) => {
            return <Select.Option key={item} value={item}>{item}</Select.Option>;
          })}
        </Select>

      </div>
    );

    const dv = new DataView().source(dds);
    dv.transform({
      type: 'fold',
      fields: ['Inflow', 'Outflow'], // 展开字段集
      key: 'type', // key字段
      value: 'value', // value字段
    });

    const cols = {
      year: {
        range: [0, 1],
      },
      value: {
        alias: '流量',
      },
    };

    return (
      <div className="chart-area">
        <Card title={`网络流量 ${pod}`} extra={extraContent}>
          {/* <h4 style={styles.title}>面积图</h4> */}
          <Chart height={400} data={dv} scale={cols} forceFit>
            <Axis name="year"/>
            <Axis
              name="value"
              title
              label={{
                formatter: (val) => {
                  return `${(val / 10000).toFixed(1)}k`;
                },
              }}
            />
            <Legend/>
            <Tooltip crosshairs={{ type: 'line' }}/>
            <Geom type="area" position="year*value" color="type" title/>
            <Geom type="line" position="year*value" size={2} color="type"/>
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
