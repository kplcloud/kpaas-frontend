import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { Button, Card, Divider, Icon, Select } from 'antd';
import moment from 'moment';
import styles from '../../../../BasicList.less';
import { Link } from 'react-router-dom';

export default class AreaStackChart extends Component {
  static displayName = '内存使用率';

  state = {
    pod: ""
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 使用内存
  // cache内存
  // rss 内存

  onChangePod = (name) => {
    this.setState({
      pod: name
    })
    console.log(name)
  };

  render() {
    const { data } = this.props;
    const dds = [];

    if (!data) {
      return ('');
    }
    console.log(data)

    const pods = [];
    for (let i in  data) {
      console.log(data[i])
      pods.push(data[i].pod)
    }

    for (let i in  data) {
      for (let n in data[i].containers) {
        if (!data[i].containers[n].memory) {
          continue
        }
        (data[i].containers[n].memory).map((item, key) => {
          dds.push({
            name: data[i].containers[n].name,
            x: moment(item.x).format("H:mm:ss"),
            y: item.y / 1024 / 1024,
          });
        });

      }
    }
    console.log(pods)

    const cols = {
      // year: {
      //   type: 'linear',
      //   tickInterval: 10,
      // },
    };

    const extraContent = (
      <div style={{marginLeft: 16, width: 360}}>
        <Select
          defaultValue={data[0].pod}
          showSearch
          style={{ width: 320 }}
          placeholder="请选择pod"
          optionFilterProp="children"
          onChange={this.onChangePod}
          //filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {pods.map((item, key) => {
            return <Select.Option key={item} value={item}>{item}</Select.Option>
          })}
        </Select>

      </div>
    );

    return (
      <div className="area-stack-chart" style={{marginBottom: 20}}>
        <Card title="内存使用" extra={extraContent}>
          <Chart height={400} data={dds} scale={cols} forceFit>
            <Axis name="x"/>
            <Axis name="y"/>
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
