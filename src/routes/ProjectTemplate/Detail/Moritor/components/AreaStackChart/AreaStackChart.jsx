import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import {Card} from 'antd'

export default class AreaStackChart extends Component {
  static displayName = 'AreaStackChart';

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 使用内存
  // cache内存
  // rss 内存

  render() {

    const d = [{
      "pod": "prometheus-86bd5dd5b8-qwmsl",
      "containers": [
          {
              "name": "prometheus",
              "memory": [
                  {
                      "x": "2019-11-01 17:05:00",
                      "y": 4641996800
                  },
                  {
                      "x": "2019-11-01 17:06:00",
                      "y": 4658855936
                  },
                  {
                      "x": "2019-11-01 17:07:00",
                      "y": 4523257856
                  },
                  {
                      "x": "2019-11-01 17:08:00",
                      "y": 4556603392
                  },
                  {
                      "x": "2019-11-01 17:09:00",
                      "y": 4580384768
                  },
                  {
                      "x": "2019-11-01 17:10:00",
                      "y": 4557111296
                  },
                  {
                      "x": "2019-11-01 17:11:00",
                      "y": 4576067584
                  },
                  {
                      "x": "2019-11-01 17:12:00",
                      "y": 4550004736
                  },
                  {
                      "x": "2019-11-01 17:13:00",
                      "y": 4589613056
                  },
                  {
                      "x": "2019-11-01 17:14:00",
                      "y": 4602548224
                  },
                  {
                      "x": "2019-11-01 17:15:00",
                      "y": 4633358336
                  },
                  {
                      "x": "2019-11-01 17:16:00",
                      "y": 4655239168
                  },
                  {
                      "x": "2019-11-01 17:17:00",
                      "y": 4654641152
                  },
                  {
                      "x": "2019-11-01 17:18:00",
                      "y": 4705099776
                  },
                  {
                      "x": "2019-11-01 17:19:00",
                      "y": 4717617152
                  }
              ],
              "cpu": [
                  {
                      "x": "2019-11-01 17:17:00",
                      "y": 3787651401128249
                  },
                  {
                      "x": "2019-11-01 17:18:00",
                      "y": 3787667537940336
                  },
                  {
                      "x": "2019-11-01 17:19:00",
                      "y": 3787676229541226
                  }
              ],
              "network_rx": null,
              "network_tx": null
          }
      ]
  }]

  const dd =[];

  for(let i in d[0].containers) {
    dd.push({
      country: d[i].name
    })
  }

    const data = [
      { country: 'usage', year: '14:39', value: 635 },
      { country: 'usage', year: '14:40', value: 809 },
      { country: 'usage', year: '14:41', value: 5268 },
      { country: 'usage', year: '14:42', value: 4400 },
      { country: 'usage', year: '14:43', value: 3634 },
      { country: 'usage', year: '14:44', value: 947 },
      { country: 'usage', year: '14:45', value: 947 },
      { country: 'usage', year: '14:46', value: 947 },
      { country: 'usage', year: '14:47', value: 947 },
      { country: 'usage', year: '14:48', value: 947 },
      { country: 'usage', year: '14:49', value: 947 },
      { country: 'usage', year: '14:50', value: 947 },
      { country: 'usage', year: '14:51', value: 947 },
      { country: 'usage', year: '14:52', value: 947 },
      { country: 'usage', year: '14:53', value: 947 },
      { country: 'usage', year: '14:54', value: 947 },
      { country: 'usage', year: '14:55', value: 947 },
      { country: 'usage', year: '14:56', value: 947 },
      { country: 'usage', year: '14:57', value: 947 },
      { country: 'usage', year: '14:58', value: 947 },
      { country: 'usage', year: '14:59', value: 947 },
      { country: 'usage', year: '15:00', value: 947 },
      { country: 'usage', year: '15:01', value: 947 },
      { country: 'usage', year: '15:02', value: 947 },
      { country: 'usage', year: '15:03', value: 947 },
      { country: 'usage', year: '15:04', value: 947 },
      { country: 'usage', year: '15:05', value: 947 },
      { country: 'usage', year: '15:06', value: 947 },
      { country: 'usage', year: '15:07', value: 947 },
      { country: 'usage', year: '15:08', value: 947 },

      { country: 'cache', year: '14:39', value: 106 },
      { country: 'cache', year: '14:40', value: 107 },
      { country: 'cache', year: '14:41', value: 111 },
      { country: 'cache', year: '14:42', value: 1766 },
      { country: 'cache', year: '14:43', value: 221 },
      { country: 'cache', year: '14:44', value: 767 },
      { country: 'cache', year: '14:45', value: 133 },
      { country: 'cache', year: '14:46', value: 106 },
      { country: 'cache', year: '14:47', value: 107 },
      { country: 'cache', year: '14:48', value: 111 },
      { country: 'cache', year: '14:49', value: 1766 },
      { country: 'cache', year: '14:50', value: 221 },
      { country: 'cache', year: '14:51', value: 767 },
      { country: 'cache', year: '14:52', value: 133 },
      { country: 'cache', year: '14:53', value: 106 },
      { country: 'cache', year: '14:54', value: 107 },
      { country: 'cache', year: '14:55', value: 111 },
      { country: 'cache', year: '14:56', value: 1766 },
      { country: 'cache', year: '14:57', value: 221 },
      { country: 'cache', year: '14:58', value: 767 },
      { country: 'cache', year: '14:59', value: 133 },
      { country: 'cache', year: '15:00', value: 106 },
      { country: 'cache', year: '15:01', value: 107 },
      { country: 'cache', year: '15:02', value: 111 },
      { country: 'cache', year: '15:03', value: 1766 },
      { country: 'cache', year: '15:04', value: 221 },
      { country: 'cache', year: '15:05', value: 767 },
      { country: 'cache', year: '15:06', value: 133 },
      { country: 'cache', year: '15:07', value: 133 },
      { country: 'cache', year: '15:08', value: 133 },

      { country: 'rss', year: '14:39', value: 163 },
      { country: 'rss', year: '14:40', value: 203 },
      { country: 'rss', year: '14:41', value: 276 },
      { country: 'rss', year: '14:42', value: 628 },
      { country: 'rss', year: '14:43', value: 547 },
      { country: 'rss', year: '14:44', value: 729 },
      { country: 'rss', year: '14:45', value: 408 },
      { country: 'rss', year: '14:46', value: 163 },
      { country: 'rss', year: '14:47', value: 203 },
      { country: 'rss', year: '14:48', value: 276 },
      { country: 'rss', year: '14:49', value: 628 },
      { country: 'rss', year: '14:50', value: 547 },
      { country: 'rss', year: '14:51', value: 729 },
      { country: 'rss', year: '14:52', value: 408 },
      { country: 'rss', year: '14:53', value: 163 },
      { country: 'rss', year: '14:54', value: 203 },
      { country: 'rss', year: '14:55', value: 276 },
      { country: 'rss', year: '14:56', value: 628 },
      { country: 'rss', year: '14:57', value: 547 },
      { country: 'rss', year: '14:58', value: 729 },
      { country: 'rss', year: '14:59', value: 408 },
      { country: 'rss', year: '15:00', value: 163 },
      { country: 'rss', year: '15:01', value: 203 },
      { country: 'rss', year: '15:02', value: 276 },
      { country: 'rss', year: '15:03', value: 628 },
      { country: 'rss', year: '15:04', value: 547 },
      { country: 'rss', year: '15:05', value: 729 },
      { country: 'rss', year: '15:06', value: 408 },
      { country: 'rss', year: '15:07', value: 729 },
      { country: 'rss', year: '15:08', value: 408 },
    ];

    const cols = {
      // year: {
      //   type: 'linear',
      //   tickInterval: 10,
      // },
    };

    return (
      <div className="area-stack-chart">
        <Card title="内存使用"> 
          <Chart height={400} data={data} scale={cols} forceFit>
            <Axis name="year" />
            <Axis name="value" />
            <Legend />
            <Tooltip crosshairs={{ type: 'line' }} />
            <Geom type="area" position="year*value" color="country" />
            <Geom type="line" position="year*value" size={2} color="country" />
          </Chart>
        </Card>
      </div>
    );
  }
}
