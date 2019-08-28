import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Badge,
  Tag,
  Col
} from 'antd';
import StandardTable from '../Discovery/Service/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Index.less';
// import {routerRedux} from 'dva/router';
// import Metrics from '../Pods/Metrics'
// import { WaterWave } from '../../components/Charts';

@connect(({ nodes }) => ({
  list: nodes.list,
  loading: nodes.loading
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'nodes/list'
    })
  };


  render() {
    const {list, loading} = this.props;
    const that = this;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render(val, record) {
          return <Badge status="success" text={<a onClick={() => console.log(val, record)}>{val}</a>} />
        }
      },
      {
        title: '标签',
        dataIndex: 'labels',
        render(val) {
          var res = [];
          for( var i in val) {
            res.push(<div key={`label-tag-${i}`}><Tag key={`label-tag-${i}`}>{i}: {val[i]}</Tag></div>)
          }
          return res.length > 0 ? res : "-"
        }
      },
      {
        title: '已就绪',
        dataIndex: 'status',
        align: 'right',
        render: (val) => {
          let status;
          (val.conditions).map((item, key) => {
            if(item.type == "Ready") {
              status = item.status
              return
            }
          })
          let text = status
          status = status == "True" ? "success" : "error"
          return <Badge status={status} text={text} />
        },
        // mark to display a total number
        needTotal: true,
      },
      {
        title: 'CPU 请求值（核）',
        dataIndex: 'metrics',
        key: 'cpu-usage',
        render(val, record) {
          var res;
          for (var i in val) {
            if (val[i] && val[i]["cpu/usage"]) {
              res = val[i]["cpu/usage"][0]["y"]  / 1000 / 1000 / 1000 / 1000 / 1000 / 10
              break;
            }
          }
          return res && res > 0 && res.toFixed(2) + " (" + (res / record.status.capacity.cpu).toFixed(2) * 100 + "%)" || "-"
        }
      },
      {
        title: '内存请求值（字节）',
        dataIndex: 'metrics',
        key: 'memory-usage',
        render(val, record) {
          var res;
          var last = "Mi";
          for (var i in val) {
            if (val[i] && val[i]["memory/usage"]) {
              res = val[i]["memory/usage"][0]["y"]  / 1024 / 1024
              if(res > 1024) {
                res = res / 1024
                last = "Gi"
              }
              break;
            }
          }
          let m = "Mi"
          let memory = (record.status.capacity.memory.replace("Ki", "") / 1024)
          if(memory > 1024) {
            memory = memory / 1024
            m = "Gi"
          }
 
          return res && res > 0 && (res.toFixed(2) + last) + " / " + (memory.toFixed(2) + m) || "-"
        }
      },
      {
        title: 'IP',
        // dataIndex: 'status',
        align: 'right',
        render: (val) => {
          const addresses = val.status.addresses
          
          return <Tag>{addresses[0].address}</Tag>
        },
        // mark to display a total number
        // needTotal: true,
      },
      {
        title: '创建',
        dataIndex: 'create_time',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
    ];

    var detail = {
      metrics: []
    }

    return (
      <PageHeaderLayout>
        {/* <Metrics {...{detail}} style={{ marginBottom: 24 }} /> */}
        {/* <Card title="使用情况" style={{ marginBottom: 24 }} bordered={false}>
          <Col {...topColResponsiveProps}>
            <WaterWave
              height={161}
              title="剩余内存"
              percent={34}
            />
          </Col>
          <Col {...topColResponsiveProps}> */}
            {/* <ChartCard
              bordered={false}
              title="内存（字节）"
              action={
                <Tooltip title="近15分钟内存使用情况">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(metric.curr_memory).format('0,0') + `MB`}
              contentHeight={46}
            >
              <MiniArea color="#90EE90" data={metric.memory} />
            </ChartCard> */}
          {/* </Col>
        </Card> */}
        <Card title={`节点`} bordered={false}>
          <div className={styles.tableList}>            
            <StandardTable
              loading={loading}
              data={list ? {list:list, pagination: {}} : []}
              columns={columns}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}