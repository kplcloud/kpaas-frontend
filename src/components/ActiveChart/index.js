import React, { Component } from 'react';

import { MiniArea } from '../Charts';
import NumberInfo from '../NumberInfo';

import styles from './index.less';

export default class ActiveChart extends Component {
  
  componentDidMount() {
    this.fetchOps();
    let that = this;
    this.timer = setInterval(() => {
      // montior/fetchOps
      that.fetchOps();
    }, 5000);
  }

  fetchOps = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'monitor/fetchOps'
    })
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {monitor} = this.props;
    const {ops} = monitor;
    if (!ops || ops.length < 1) {
      return ('')
    }
    let total = Math.round(ops[ops.length-1].y) + " Ops"
    return (
      <div className={styles.activeChart}>
        <NumberInfo subTitle="实时请求" total={total} />
        <div style={{ marginTop: 32 }}>
          <MiniArea
            animate={false}
            line
            borderWidth={2}
            height={84}
            scale={{
              y: {
                tickCount: 3,
              },
            }}
            yAxis={{
              tickLine: false,
              label: false,
              title: false,
              line: false,
            }}
            data={ops}
          />
        </div>
        
        {ops && (
          <div className={styles.activeChartLegend}>
            {/* <span>00:00</span> */}
            <span>{ops[Math.floor(ops.length / 2)].x}</span>
            <span> </span>
            <span>{ops[ops.length - 1].x}</span>
          </div>
        )}
      </div>
    );
  }
}
