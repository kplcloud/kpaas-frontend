/**
 * Created by huyunting on 2018/8/30.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Tag, Modal, Button,Icon,Tooltip } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import BuildLogs from '../ProjectTemplate/Detail/BuildLogs';
import CronjobBuildModal from '../ProjectTemplate/Detail/CronjobBuildModal';
import CornjobLogModal from '../ProjectTemplate/Detail/CornjobLogModal';
import ConfigMapJob from '../ProjectTemplate/Detail/ConfigMapJob';
import Envvar from '../ProjectTemplate/Detail/Envvar';
import CornjobYaml from '../ProjectTemplate/Detail/CornjobYaml';

import { routerRedux } from 'dva/router';

const { Description } = DescriptionList;
const { Column } = Table;

var YAML = require('json2yaml');

class Detail extends PureComponent {
  state = {
    visible: false,
    title: '',
    content: '',
    showLab: 'overview',
    loggingVisible: false,
    loggingTitle: false,
    cronjobYamlVisible: false,

  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    if (location.href && location.href.indexOf('build-logs') != -1) {
      dispatch(routerRedux.push(`${match.url}/overview`));
    }
    dispatch({
      type: 'cronjob/getOneCronjob',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });
  }

  onClick = (e, name) => {
    const { dispatch, match } = this.props;
    dispatch(
      routerRedux.push(`/pods/${match.params.namespace}/job/${match.params.name}/logs/${name}`),
    );
  };

  onEditTo = () => {
    const { dispatch, match } = this.props;
    console.log(2223333);
    dispatch(
      routerRedux.push(`/project/cornjob/edit/${match.params.name}`),
    );
  };

  onShowBuildModal = () => {
    const { dispatch, cronjobInfo } = this.props;
    dispatch({
      type: 'gitlab/tagList',
      payload: {
        git: cronjobInfo.git_path,
      },
    });
    this.props.dispatch({ type: 'gitlab/showBuildModal' });
  };
  onHideBuildModal = () => {
    this.props.dispatch({ type: 'gitlab/hideBuildModal' });
  };

  handleCancel = () => {
    this.setState({ visible: false, title: '', content: '' });
  };

  showModal = (e, title, content) => {
    e.preventDefault();
    this.setState({
      visible: true,
      title: title,
      content: content,
    });
  };
  handleTabChange = key => {
    const { dispatch, match } = this.props;
    switch (key) {
      case 'overview':
        this.setState({ showLab: 'overview' });
        dispatch(routerRedux.push(`${match.url}/overview`));
        break;
      case 'env-var':
        this.setState({ showLab: 'env-var' });
        dispatch(routerRedux.push(`${match.url}/env-var`));
        break;
      case 'config-map':
        this.setState({ showLab: 'config-map' });
        dispatch(routerRedux.push(`${match.url}/config-map`));
        break;
      case 'build-logs':
        this.setState({ showLab: 'build-logs' });
        dispatch(routerRedux.push(`${match.url}/build-logs`));
        break;
      default:
        break;
    }
  };

  showLogging = (e, title) => {
    e.preventDefault();
    this.setState({
      loggingVisible: true,
      loggingTitle: title,
    });
  };

  showCronjobYaml = (e,c) => {
    e.preventDefault();
    this.setState({
      cronjobYamlVisible: true,
      cronjobYamlContent: YAML.stringify(c),
    });
  };


  showClosePort = () => {
    // e.preventDefault();
    this.setState({
      loggingVisible: false,
      cronjobYamlVisible: false,
    });
  };

  logging = (filebeat) => {
    if (!filebeat) {
      return (
        <Card title="日志采集" style={{ marginBottom: 24 }} bordered={false} extra={
          <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                  onClick={(e) => this.showLogging(e, '添加日志采集器')}>
            <Icon type="puls"/> 添加
          </Button>}></Card>
      );
    }
    let path = '';
    if (filebeat && filebeat['filebeat.prospectors'][0].paths) {
      path = filebeat['filebeat.prospectors'][0].paths[0];
      path = path.replace('*.log', '');
    }
    return (
      <Card title="日志采集" style={{ marginBottom: 24 }} bordered={false} extra={
        <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                onClick={(e) => this.showLogging(e, '编辑日志采集器')}>
          <Icon type="edit"/> 编辑
        </Button>}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="日志路径"><Tag color="cyan">{path}</Tag></Description>
          <Description term="收集规则"><Tag
            color="magenta">{filebeat && filebeat['filebeat.prospectors'][0].multiline.pattern}</Tag></Description>
          <Description term="文件后缀"><Tag color="geekblue">*.log</Tag></Description>
        </DescriptionList>
      </Card>
    );
  };

  render() {
    const { cronjobInfo, gitlab, loading, dispatch, match } = this.props;  //console.log("2222222",this.props)
    const { branches, tags, buildModal } = gitlab;
    const { cronjob_info,add_type } = cronjobInfo;
    const {cronjob_pods,cronjob_events,cronjob_yaml} = cronjobInfo;
    if(add_type && add_type=="Command"){
      var buildBtnDisplay = "none";
      var tabList = [{
        key: 'overview',
        tab: '概览',

      }, {
        key: 'env-var',
        tab: '环境变量',
        default: true,
      }, {
        key: 'config-map',
        tab: '配置',
        default: true,
      }];
    }else{
      var buildBtnDisplay = "";
      var tabList = [{
        key: 'overview',
        tab: '概览',

      }, {
        key: 'env-var',
        tab: '环境变量',
        default: true,
      }, {
        key: 'config-map',
        tab: '配置',
        default: true,
      }, {
        key: 'build-logs',
        tab: 'Build日志',
        default: true,
      }];
    }

    var that = this;
    const AddBuildModalProps = {
      visible: buildModal,
      branches: branches,
      tags: tags,
      loading: loading,
      onOk(params) {
        dispatch({
          type: 'gitlab/onBuildCronjob',
          payload: {
            tag: params.tag,
            git_type: params.git_type,
            ...match.params,
          },
        });
      },
      onCancel() {
        that.onHideBuildModal();
      },
    };
    
    const extra = (
      <DescriptionList style={{ marginBottom: 24, textAlign: 'left' }}>
        <Description term='名称'>{cronjob_info ? cronjob_info.name : '-'}</Description>
        <Description term='命名空间'>{cronjob_info ? cronjob_info.namespace : '-'}</Description>
        <Description
          term='创建时间'>{(cronjob_info && cronjob_info.creationTimestamp) ? cronjob_info.creationTimestamp : '-'}</Description>
        <Description term='计划'>{cronjob_info ? cronjob_info.schedule : '-'}</Description>
        <Description term='活跃中'>{cronjob_info ? cronjob_info.active.toString() : '-'}</Description>
        <Description term='挂起'>{cronjob_info ? (cronjob_info.suspend ? 'true' : 'false') : '-'}</Description>
        <Description term='最近调度'>{cronjob_info ? cronjob_info.lastScheduleTime : '-'}</Description>
        <Description
          term='并发策略'>{(cronjob_info && cronjob_info.cron && cronjob_info.cron.concurrencyPolicy) ? cronjob_info.cron.concurrencyPolicy : '-'}</Description>
        <Description term='启动期限秒数'>{'-'}</Description>
      </DescriptionList>
    );
    const showImage = () => {
      if (cronjob_info && cronjob_info.cron && cronjob_info.cron.jobTemplate && cronjob_info.cron.jobTemplate.spec && cronjob_info.cron.jobTemplate.spec.template && cronjob_info.cron.jobTemplate.spec.template.spec.containers) {
        const containers = cronjob_info.cron.jobTemplate.spec.template.spec.containers;
        var containerDetail = [];
        if (containers && containers.length > 0) {
          containers.map((detail, key) => {
            containerDetail.push(<Tag key={key}>{detail.image}</Tag>);
          });
          return <span>{containerDetail}</span>;
        }
      }
    };
    const lastScheduleTime = () => {
      if (cronjob_info && cronjob_info.lastScheduleTime) {
        return <span>{cronjob_info.lastScheduleTime}</span>;
      }
    };

    return (
      <PageHeaderLayout title='任务详情' extraContent={extra} loading={false} tabList={tabList}
                        // action={<Button style={{ marginRight: 30, width: 100, display: buildBtnDisplay }} type='primary'
                        //                 onClick={this.onShowBuildModal}>Build</Button>}
                        // action={<Button style={{ marginRight: 30, width: 100, display: buildBtnDisplay }} type='primary'
                        //                 onClick={this.onEditTo}>edit</Button>}
                        onTabChange={this.handleTabChange}>
        <Modal
          visible={this.state.visible}
          title={this.state.title}
          width={500}
          onOk={this.handleCancel}
          footer={[
            <Button key='back' type='primary' onClick={this.handleCancel}>
              OK
            </Button>,
          ]}
          onCancel={this.handleCancel}
          bodyStyle={{ background: '#EFEFEF', overflow: 'auto', height: '400px' }}
        >
          {this.state.content}
        </Modal>

        {buildModal && (<CronjobBuildModal {...AddBuildModalProps}/>)}

        {this.state.showLab == 'build-logs' && cronjobInfo && cronjobInfo.name && cronjobInfo.namespace && (
          <BuildLogs {...{
            name: cronjobInfo.name ,
            // name: cronjobInfo.name + '-cronjob',
            namespace: cronjobInfo.namespace,
            checkProject: false,
            types: "cronjob",
          }}/>
        )}

        {this.state.showLab == 'env-var' && cronjobInfo && cronjobInfo.name && cronjobInfo.namespace && (
          <Envvar {...{
            name: cronjobInfo.name,
            namespace: cronjobInfo.namespace,
            checkProject: false,
            match:match,
          }}/>
        )}

        {this.state.showLab == 'config-map' && cronjobInfo && cronjobInfo.name && cronjobInfo.namespace && (
          <ConfigMapJob {...{
            name: cronjobInfo.name,
            namespace: cronjobInfo.namespace,
            checkProject: false,
            match:match,
          }}/>
        )}

        {this.state.showLab === 'overview' && (
          <span>
            <Card title={`当前任务容器`} bordered={false} extra={<Tooltip title="查看CornJob YAML信息">
            <a>
              <Icon type="code-o" onClick={(e) => this.showCronjobYaml(e,cronjob_yaml)}/>
            </a>
          </Tooltip>}>
            {(cronjob_pods && cronjob_pods.length > 0) ? (
              <Table
                pagination={false}
                loading={loading}
                dataSource={cronjob_pods}
                rowKey='name'
              >
                <Column
                  title='名称'
                  dataIndex='name'
                  key='name'
                  render={(val, record, index) => {
                    return (
                      <a href='javascript:;' onClick={e => this.onClick(e, val)}>
                        {val}
                      </a>
                    );
                  }}
                />
                <Column title='标签' dataIndex='uid' key='uid'/>
                <Column title='镜像' dataIndex='create_at' key='create_at' render={showImage}/>
                <Column
                  span={26}
                  title='容器组'
                  dataIndex='status'
                  key='status'
                  render={() => {
                    return <span>1 / 1</span>;
                  }}
                />
                <Column title='创建时间' dataIndex='restart_count' key='restart_count' render={lastScheduleTime}/>
              </Table>
            ) : (<p>暂无数据</p>)}
            </Card>
            <CornjobYaml visible={this.state.cronjobYamlVisible} containers={"containers-test"} 
                      onCancel={this.showClosePort} dispatch={this.props.dispatch} content={this.state.cronjobYamlContent}/>

          

            <Card title="日志采集" style={{ marginTop: 24 }} bordered={false} extra={
            <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                    onClick={(e) => this.showLogging(e, '添加日志采集器')}>
              <Icon type={cronjobInfo && cronjobInfo.log_path ? "edit" : "plus"}/> {cronjobInfo && cronjobInfo.log_path ? "编辑" : "添加"}</Button>}>
              
                日志路径：<Tag color="green">{cronjobInfo ? cronjobInfo.log_path : '暂无'}</Tag>
            </Card>
            <CornjobLogModal visible={this.state.loggingVisible} containers={"containers-test"} title={this.state.loggingTitle}
                      onCancel={this.showClosePort} dispatch={this.props.dispatch} logPath={cronjobInfo ? cronjobInfo.log_path : ''} name={cronjob_info ? cronjob_info.name : ''}
                      namespace={cronjob_info ? cronjob_info.namespace : ''}/>

            <Card title={`事件`} style={{ marginTop: 24 }} bordered={false}>
              {(cronjob_events && cronjob_events.length > 0) ? (
              <Table
                pagination={false}
                loading={loading}
                dataSource={cronjob_events}
                rowKey='note'
              >
                <Column title='消息' dataIndex='note' key='note'/>
                <Column title='来源' dataIndex='component' key='component'/>
                <Column title='总数' dataIndex='deprecatedCount' key='deprecatedCount'/>
                <Column title='最早出现于' dataIndex='firstTime' key='firstTime'/>
                <Column title='最近出现于' dataIndex='lastTime' key='lastTime'/>
              </Table>
            ) : (<p>暂无数据</p>)}
            </Card>

          </span>
        )}

      </PageHeaderLayout>
    );
  }
}

export default connect(({ cronjob, gitlab }) => ({
  cronjobInfo: cronjob.cronjobInfo,
  loading: cronjob.loading,
  buildModal: cronjob.buildModal,
  gitlab,
}))(Detail);
