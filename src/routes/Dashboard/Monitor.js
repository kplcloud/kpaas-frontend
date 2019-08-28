import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Tooltip } from 'antd';
import { Pie, WaterWave} from 'components/Charts';
// import Donut from './Charts/Donut'
// import CountDown from 'components/CountDown';
import ActiveChart from '../../components/ActiveChart';
import Authorized from '../../utils/Authorized';
import styles from './Monitor.less';
import SliderChart from './Monitors/SliderChart'

const { Secured } = Authorized;

// use permission as a parameter
const havePermissionAsync = new Promise(resolve => {
  // Call resolve on behalf of passed
  setTimeout(() => resolve(), 1000);
});
@Secured(havePermissionAsync)
@connect(({ monitor, loading }) => ({
  monitor,
  loading: loading.models.monitor,
}))
export default class Monitor extends PureComponent {
  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'monitor/fetchTags',
    });
  }

  render() {
    const { monitor, loading } = this.props;
    const { tags } = monitor;

    return (
      <Fragment>
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
            <Card title="集群网终流量" bordered={false}>
              <SliderChart {...this.props} />
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card title="全局请求量" style={{ marginBottom: 24 }} bordered={false}>
              <ActiveChart {...this.props} />
            </Card>
            <Card
              title="集群CPU使用情况"
              style={{ marginBottom: 24 }}
              bodyStyle={{ textAlign: 'center' }}
              bordered={false}
            >
            {/* <Chart
                height={180}
                data={dv}
                scale={cols}
                // padding={[80, 100, 80, 80]}
                forceFit
            /> */}
            {tags && tags.cpu && <Pie
              animate={false}
              color="#2FC25B"
              percent={(tags.cpu.used / tags.cpu.total)*100}
              subTitle="CPU使用率"
              total={`${((tags.cpu.used / tags.cpu.total)*100).toFixed(2)}%`}
              height={180}
              lineWidth={1}
            />}
              
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xl={18} lg={24} sm={24} xs={24}>
            <Card title="各个语言占比" bordered={false} className={styles.pieCard}>
            {tags && tags.language &&
              <Row style={{ padding: '16px 0' }}>
                <Col span={6}>
                  <Pie
                    animate={true}
                    percent={tags.language.Golang}
                    subTitle="Golang"
                    total={`${tags.language.Golang}%`}
                    height={128}
                    lineWidth={4}
                  />
                </Col>
                <Col span={6}>
                  <Pie
                    animate={false}
                    color="#5DDECF"
                    percent={tags.language.Java}
                    subTitle="Java"
                    total={`${tags.language.Java}%`}
                    height={128}
                    lineWidth={4}
                  />
                </Col>
                <Col span={6}>
                  <Pie
                    animate={false}
                    color="#2FC25B"
                    percent={tags.language.Python}
                    subTitle="Python"
                    total={`${tags.language.Python}%`}
                    height={128}
                    lineWidth={4}
                  />
                </Col>
                <Col span={6}>
                  <Pie
                    animate={false}
                    color="#EE799F"
                    percent={tags.language.NodeJs ? tags.language.NodeJs : 0}
                    subTitle="NodeJs"
                    total={`${tags.language.NodeJs ? tags.language.NodeJs : 0}%`}
                    height={128}
                    lineWidth={4}
                  />
                </Col>
              </Row>}
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={24} xs={24}>
            <Card
              title="集群内存资源"
              bodyStyle={{ textAlign: 'center', fontSize: 0 }}
              bordered={false}
            >
              {tags &&  tags.memory && <WaterWave height={161} title="集群内存剩余" percent={((1-(tags.memory.used / tags.memory.total))*100).toFixed(2)} />}
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
