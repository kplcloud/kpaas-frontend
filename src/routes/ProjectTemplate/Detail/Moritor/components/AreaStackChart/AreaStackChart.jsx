import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Button, Card, Divider, Icon, Select } from 'antd';
import moment from 'moment';
import styles from '../../../../BasicList.less';
import { Link } from 'react-router-dom';

export default class AreaStackChart extends Component {
  static displayName = '内存使用率';

  state = {
    pod: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      pod: null,
    };
  }

  // 使用内存
  // cache内存
  // rss 内存

  onChangePod = (name) => {
    this.setState({
      pod: name,
    });
  };

  render() {
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
      if (!data[pod][n]) {
        continue;
      }
      for (let x in data[pod][n]) {
        if (x != 'memory-usage' || !data[pod][n][x]) continue;
        (data[pod][n][x]).map((item, key) => dds.push({
          name: n,
          x: moment(item.x).format("H:mm:ss"),
          y: item.y / 1024 / 1024,
        }));
      }
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

    const cols = {
      y: {
        alias: "MB"
      }
    };

    return (
      <div className="area-stack-chart" style={{ marginBottom: 20 }}>
        <Card title={`内存使用 ${pod}`} extra={extraContent}>
          <Chart height={400} data={dds} scale={cols} forceFit>
            <Axis name="x"/>
            <Axis name="y" title/>
            <Legend/>
            <Tooltip crosshairs={{ type: 'line' }}/>
            <Geom type="area" position="x*y" color="name"/>
            <Geom type="line" position="x*y" size={2} color="name"/>
          </Chart>
        </Card>
      </div>
    );
  }
}
