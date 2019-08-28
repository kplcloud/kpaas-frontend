import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar, Tooltip, Icon, Button } from 'antd';

import { Radar } from 'components/Charts';
import EditableLinkGroup from 'components/EditableLinkGroup';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';
// import ReactEcharts from "echarts-for-react";
import {
  ChartCard,
  MiniArea,
} from 'components/Charts';
import numeral from 'numeral';
import styles from './Workplace.less';

@connect(({ project, activities, chart, loading, user, monitor, group }) => ({
  project,
  activities,
  chart,
  namespaces: user.namespaces,
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
  cpuAndMemoryMetrics: monitor.cpuAndMemoryMetrics,
  ownergrouplist: group.ownergrouplist,
}))
export default class Workplace extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });
    dispatch({
      type: 'monitor/fetchMetrics',
    });
    dispatch({
      type: 'group/ownergrouplist',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  renderActivities() {
    const { activities: { list } } = this.props;
    return list.map(item => {
      const events = item.template.split(/@\{([^{}]*)\}/gi).map(key => {
        if (item[key]) {
          return (
            <a href={item[key].link} key={item[key].name}>
              {item[key].name}
            </a>
          );
        }
        return key;
      });
      return (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={<Avatar src={item.user.avatar}/>}
            title={
              <span>
                <a className={styles.username}>{item.user.name}</a>
                &nbsp;
                <span className={styles.event}>{events}</span>
              </span>
            }
            description={
              <span className={styles.datetime} title={item.updatedAt}>
                {moment(item.updatedAt).fromNow()}
              </span>
            }
          />
        </List.Item>
      );
    });
  }

  selectNamespace = (e, namespace) => {
    e.stopPropagation();
    Cookie.set('namespace', namespace);
    window.location.reload();
  };

  clickGroup = (groupId,groupName,namespace) => {
    // Cookie.set('groupName', groupName);
    // Cookie.set('group', groupId);
    Cookie.set('namespace', namespace);
    this.props.history.push({ pathname : '/project/list' ,query : { group: groupId} })
    // this.props.router.push({ state: { phoneNum: 138xx } )
  };

  render() {
    const {
      project: { notice },
      projectLoading,
      activitiesLoading,
      chart: { radarData },
      namespaces,
      cpuAndMemoryMetrics,
      ownergrouplist,
    } = this.props;

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Hello! {Cookie.get('username')}，祝您开心每一天！</div>
          {/* <div>宜人精英 | {Cookie.get("namespace")}</div> */}
          <div className={styles.contentLink}>
            {/* <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a> */}
            <a target="_black" href="https://docs.nsini.com/">
              <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"/>{' '}
              使用文档
            </a>
          </div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <Link to="/project/create/info"><Button style={{ width: 120 }} type="primary"><Icon
            type="plus"/>创建服务</Button></Link>
        </div>
        <div className={styles.extraImg}>
          <img
            alt="这是一个标题"
            src="https://niu.yirendai.com/bubbles.png"
          />
        </div>
      </div>
    );
    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{ marginBottom: 24 }}
              title={`当前 ` + Cookie.get('namespace') + ` 的服务`}
              bordered={false}
              extra={<Link to="/project/list">查看全部</Link>}
              loading={projectLoading}
              bodyStyle={{ padding: 0 }}
            >
              {notice.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.id}>
                  <Card bodyStyle={{ padding: 0 }} bordered={false}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={item.logo}/>
                          <Link to={item.href}>{item.title}</Link>
                        </div>
                      }
                      description={item.description}
                    />
                    <div className={styles.projectItemContent}>
                      <Link to={item.memberLink}>{item.member || ''}</Link>
                      {item.updatedAt && (
                        <span className={styles.datetime} title={item.updatedAt}>
                          {moment(item.updatedAt).fromNow()}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              loading={activitiesLoading}
            >
              <List loading={activitiesLoading} size="large">
                <div className={styles.activitiesList}>{this.renderActivities()}</div>
              </List>
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="指数"
              loading={cpuAndMemoryMetrics == undefined}
            >
              <div className={styles.chart}>
                {/* <Radar hasLegend height={343} data={radarData} /> */}
                <ChartCard
                  bordered={false}
                  title="CPU使用"
                  action={
                    <Tooltip title="近15分钟CPU使用率">
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={(cpuAndMemoryMetrics ? cpuAndMemoryMetrics.curr_cpu / 1000 : 0) + ` 核`}
                  contentHeight={46}
                >
                  {cpuAndMemoryMetrics && cpuAndMemoryMetrics.cpu &&
                  <MiniArea color="#87CEFA" data={cpuAndMemoryMetrics.cpu}/>
                  }
                </ChartCard>
                <ChartCard
                  bordered={false}
                  title="内存使用"
                  action={
                    <Tooltip title="近15分钟内存使用量">
                      <Icon type="info-circle-o"/>
                    </Tooltip>
                  }
                  total={numeral(cpuAndMemoryMetrics ? cpuAndMemoryMetrics.curr_memory : 0).format('0,0') + ' MB'}
                  contentHeight={46}
                >
                  {cpuAndMemoryMetrics && cpuAndMemoryMetrics.memory &&
                  <MiniArea color="#90EE90" data={cpuAndMemoryMetrics.memory}/>
                  }
                </ChartCard>
              </div>
            </Card>

            <Card bodyStyle={{ paddingTop: 12, paddingBottom: 12,marginBottom:24 }} bordered={false} title="业务空间">
              <div className={styles.members}>
                <Row gutter={48}>
                  {namespaces.map(item => (
                    <Col span={12} key={`members-item-${item.name}`}>
                      <a onClick={(e) => this.selectNamespace(e, item.name)}>
                        {/* TODO 点业务空间后set cookie 刷新当前页 */}
                        <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png" size="small"/>
                        <span className={styles.member}> {item.name}</span>
                      </a>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
            <Card
              title="归属组"
              bordered={false}
              bodyStyle={{ marginTop:12,paddingTop: 12, paddingBottom: 12,marginBottom:24}}
              extra={<Link to="/group/list">查看详情</Link>}
            >
              <div className={styles.members}>
                <Row gutter={24}>
                  {ownergrouplist && ownergrouplist.length > 0 ? ownergrouplist.map(item => (
                    <Col span={12} key={`members-item-${item.name}`}>
                      <a  onClick={() =>this.clickGroup(item.id,item.name,item.namespace)} >
                        <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png" size="small"/>
                        <span className={styles.member}> {item.display_name}</span>
                      </a>
                    </Col>
                  )) : null }
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
