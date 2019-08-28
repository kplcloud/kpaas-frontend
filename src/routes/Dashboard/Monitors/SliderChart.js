import React, { PureComponent, Fragment } from 'react';
import DataSet from "@antv/data-set";
import {
    Chart,
    Tooltip,
    Facet
  } from "bizcharts";
  import { connect } from 'dva'

const cols = {
    time: {
        type: "time",
        tickCount: 10,
        mask: "M/DD H:mm"
    }
};
@connect(({ monitor }) => ({
    monitor
}))
export default class SliderChart extends PureComponent {
    // onChange(obj) {
    //     const { startValue, endValue } = obj;
    //     ds.setState("start", new Date(startValue).getTime());
    //     ds.setState("end", new Date(endValue).getTime());
    // }
    state = {
        chartDv: []
    };

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'monitor/getNetwork',
        });
    }
  
    render() {

        const {monitor} = this.props;
        const {network} = monitor;

        if (network.length < 1) {
            return ('')
        }
        const ds = new DataSet({
            state: {
              start: new Date().getTime()-900000,
              end: new Date().getTime()
            }
        });
        const originDv = ds.createView("origin");
        originDv.source(network).transform({
            type: "fold",
            fields: ["receive", "transmit"],
            key: "type",
            value: "value",
            retains: ["receive", "transmit", "time"]
        });
        const chartDv = ds.createView();
        chartDv.source(originDv).transform({
            type: "fold",
            fields: ["receive", "transmit"],
            key: "type",
            value: "value",
            retains: ["receive", "transmit", "time"]
        }).transform({
            type: "filter",
            callback(obj) {
                const time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
                return time >= ds.state.start && time <= ds.state.end;
            }
        });
        return (
          <div>
            <Chart
            //   height={window.innerHeight - 60}
              data={chartDv}
              scale={cols}
              forceFit
              padding={[20, 80]}
            >
              <Tooltip />
              <Facet
                type="mirror"
                fields={["type"]}
                showTitle={false}
                padding={[0, 0, 40, 0]}
                eachView={(view, facet) => {
                  const { colValue, data } = facet;
                  let color;
                  let alias;
  
                  if (colValue === "receive") {
                    color = "#1890ff";
                    alias = "入网流量(Mb/s)";
                  } else if (colValue === "transmit") {
                    color = "#2FC25B";
                    alias = "出网流量(Mb/s)";
                  }
  
                  view.source(data, {
                    [`${colValue}`]: {
                      alias
                    }
                  });
                  view.axis(colValue, {
                    title: {
                      autoRotate: false,
                      offset: -10,
                      position: "end",
                      textStyle: {
                        textAlign: "start"
                      }
                    }
                  });
                  view
                    .line()
                    .position("time*" + colValue)
                    .color(color);
                }}
              />
            </Chart>
            {/* <div>
              <Slider
                width="auto"
                height={26}
                start={ds.state.start}
                end={ds.state.end}
                xAxis="time"
                yAxis="value"
                scales={{
                  time: {
                    type: "time",
                    tickCount: 10,
                    mask: "M/DD H:mm"
                  }
                }}
                data={originDv}
                backgroundChart={{
                  type: "line"
                }}
                onChange={this.onChange.bind(this)}
              />
            </div> */}
          </div>
        );
    }
}