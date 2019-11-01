/**
 * Created by huyunting on 2018/5/3.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { Row, Col, Steps, Button, Card, Popover, Input, Tooltip, Progress, Modal, Tag, Icon, message } from 'antd';
import styles from './Detail.less';
import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ConfigMapProject from './Detail/ConfigMapProject';
import Webhooks from './Detail/Webhooks';
import Overview from './Detail/Overview';
import Dockerfile from './Detail/Dockerfile';
import JenkinsConf from './Detail/JenkinsConf';
import BuildLogs from './Detail/BuildLogs';
import BuildMoadl from './Detail/BuildModal';
import ExtendModal from './Detail/ExtendModal';
import ExpansionModal from './Detail/ExpansionModal';
import ModelSwitch from './Detail/ModelSwitch';
import ForeignDrawer from './Detail/ForeignDrawer';
import RollbackModal from './Detail/RollbackModal';
import PersistentVolume from './Detail/PersistentVolume';
import EditProjectInfo from '../../components/Project/EditProjectInfo';
import UnAuditOverview from './Detail/UnAuditOverview';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';
import Monitor from './Detail/Moritor';

const visitData = [];
const beginDay = new Date().getTime();
const confirm = Modal.confirm;
const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}
const { Description } = DescriptionList;
const tabList = [{
  key: 'overview',
  tab: '概览',
}, {
  key: 'configmap',
  tab: '配置',
  default: 'configmap',
}, {
  key: 'build-logs',
  tab: 'Build日志',
}, {
  key: 'persistentvolume',
  tab: '持久化存储',
}, {
  key: 'webhooks',
  tab: 'Webhooks',
}, {
  key: 'monitor',
  tab: '监控',
}];
const tabList2 = [
  {
    key: 'overview2',
    tab: '概览',
  }, {
    key: 'yaml',
    tab: 'Yaml',
  }, {
    key: 'jenkins',
    tab: 'Jenkins',
  }, {
    key: 'dockerfile',
    tab: 'Dockerfile',
  },
];
// const customDot = (dot, {status}) => (status === 'process' ? (
//     <Popover placement="topLeft" arrowPointAtCenter>
//       {dot}
//     </Popover>
//   ) : dot);

class Detail extends PureComponent {
  state = {
    pods: [], //容器
    visible: false,
    title: '',
    content: '',
    showLab: '',
    gitVersion: '',
    loading: false,
    foreignDrawerVisible: false,
    rollbackModalVisible: false,
    refusedMsg: '',
  };

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    if (!params.name || !params.namespace) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({ type: 'project/clearSaveList' });
    dispatch({
      type: 'project/projectDetail',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });

    dispatch({
      type: 'project/fetchMetrics',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });
    dispatch({
      type: 'ingress/detail',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });
  }

  submitFun = (e) => {
    const { dispatch, match: { params } } = this.props;
    if (!params.namespace || !params.name) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({
      type: 'project/auditProject',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });
  };


  refusedFun = (e) => {
    const { dispatch, match: { params } } = this.props;
    if (!params.name || !params.namespace) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({
      type: 'project/refusedProject',
      payload: {
        name: params.name,
        namespace: params.namespace,
        message: this.state.refusedMsg,
      },
    });
  };


  resendFunc = (kind) => {
    const { dispatch, match: { params } } = this.props;
    if (!params.name || !params.namespace) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({
      type: 'project/auditStepProject',
      payload: {
        name: params.name,
        namespace: params.namespace,
        kind: kind,
      },
    });
  };

  // 校验审核状态
  checkAudit = (state) => {
    if (state === 0) {
      return '未创建完成';
    }
    if (state === 1) {
      return '待审核';
    }
    if (state === 2) {
      return '审核未通过';
    }
    if (state === 3) {
      const { auditList } = this.props.data;
      const { deployment } = auditList;
      if (!deployment) {
        return '审核通过';
      }
      const { status } = deployment;
      if (status.unavailableReplicas && status.unavailableReplicas > 0) {
        let replicas = status.replicas;
        let readyReplicas = status.readyReplicas;
        // let unavailableReplicas = status.unavailableReplicas;
        let percent = Math.round((readyReplicas / replicas) * 100);
        return <Progress type="circle" percent={percent} width={60}/>;
      }
      return <Progress type="circle" percent={100} width={60}/>;
    }
    return '--';
  };

  handleTabChange = key => {
    const { dispatch, match } = this.props;
    this.setState({ showLab: key });
    dispatch(routerRedux.push(`${match.url}/${key}`));
  };
  onShowBuildModal = () => {
    const { dispatch, match: { params }, data } = this.props;
    const { auditList } = data;
    const { project } = auditList;
    // dispatch({
    //   type: 'gitlab/getBranches',
    //   payload: {
    //     name: params.name,
    //     namespace: params.namespace,
    //   },
    // });
    dispatch({
      type: 'gitlab/getTags',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });

    if (project && project.language && project.language === 'Java') {
      dispatch({
        type: 'jenkins/lastBuild',
        payload: {
          name: project.name,
          namespace: project.namespace,
        },
      });
    }
    this.props.dispatch({ type: 'project/showBuildModal' });
  };
  onHideBuildModal = () => {
    this.props.dispatch({ type: 'project/hideBuildModal' });
  };
  onShowExtendModal = () => {
    this.props.dispatch({ type: 'project/showExtendModal' });
  };
  onHideExtendModal = () => {
    this.props.dispatch({ type: 'project/hideExtendModal' });
  };
  onShowExpansionModal = () => {
    this.props.dispatch({ type: 'project/showExpansionModal' });
  };
  onShowModelModal = () => {
    this.props.dispatch({
      type: 'project/modal', payload: {
        showModelModal: true,
      },
    });
  };
  onHideModelModal = () => {
    this.props.dispatch({
      type: 'project/modal', payload: {
        showModelModal: false,
      },
    });
  };
  handleOk = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/onModelSwitch',
      payload: params,
    });
  };
  onHideExpansionModal = () => {
    this.props.dispatch({ type: 'project/hideExpansionModal' });
  };

  onShowForeignDrawer = (e) => {
    e.preventDefault();
    this.setState({ foreignDrawerVisible: true });
  };

  onCloseForeignDrawer = (e) => {
    e.preventDefault();
    this.setState({ foreignDrawerVisible: false });
  };

  onSaveResourceType = (params) => {
    this.props.dispatch({ type: 'project/onChangeResourceType', payload: params });
    this.setState({ foreignDrawerVisible: false });
  };

  onShowRollbackModal = (e) => {
    e.preventDefault();
    const { dispatch, data } = this.props;
    const { auditList } = data;
    const { project } = auditList;
    dispatch({
      type: 'builds/loadBuilds',
      payload: {
        name: project.name,
        namespace: project.namespace,
      },
    });
    this.setState({ rollbackModalVisible: true });
  };

  onCloseRollbackModal = (e) => {
    e.preventDefault();
    this.setState({ rollbackModalVisible: false });
  };
  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  changeRefusedMessage = e => {
    this.setState({ refusedMsg: e.target.value });
  };

  render() {
    const { data, gitlab, dispatch, builds, jenkins, ingress, match } = this.props;
    const { buildModal, extendModal, expansionModal, projectKibanaUrl, projectTransferUrl, showModelModal, modelModalVisible } = data;
    const { auditList, serviceMetrics } = data;
    const { branches, tags, loading } = gitlab;
    const { project, ingresses, service, deployment, pods, templateProject } = auditList;
    const auditRole = Cookie.get('auditRole');
    const that = this;
    const action = (
      <Fragment>
        <Button type="primary" onClick={() => this.submitFun()}>开始部署</Button>
        <Popover
          content={(
            <span>
              <Input.TextArea placeholder="请填写驳回理由..." onBlur={this.changeRefusedMessage}/>
              <Button type="primary" style={{ marginTop: 10 }} onClick={() => this.refusedFun()}>OK</Button>
            </span>
          )}
          placement="leftBottom"
          title="驳回理由"
          trigger="click"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Button> 驳回 </Button>
        </Popover>
      </Fragment>
    );

    const { foreignDrawerVisible, rollbackModalVisible } = this.state;
    // 获取项目提交信息
    var webFiles = {};
    if (templateProject && templateProject.length > 0) {
      templateProject.map((item, key) => {
        if (item.kind === 'Deployment') {
          webFiles = JSON.parse(item.fields);
        }
      });
    }
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="创建人">{project && project.member ? project.member.username : ''}</Description>
        <Description term="业务空间"><Tag color="orange"
                                     style={{ fontSize: 20 }}>{project ? project.namespace : ''}</Tag></Description>
        <Description
          term="项目中文名">{project ? project.display_name : ''}<EditProjectInfo {...{ 'project': project, ...this.props }}/></Description>
        <Description
          term="备注">{project ? project.desc : ''}<EditProjectInfo {...{ 'project': project, ...this.props }}/></Description>
        <Description term="创建时间">{project ? moment(project.created_at).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
        <Description
          term="调用链地址"
          hidden={templateProject && auditRole && auditRole === 'true' && project && project.audit_state === 1 ? true : false}
        >
          <a target="true" href={projectTransferUrl}>Jeager(链路追踪)</a>
        </Description>
        <Description term="项目语言"><Tag color="cyan">{project ? project.language : ''}</Tag></Description>
        <Description
          term="日 志 平 台 "
          hidden={templateProject && auditRole && auditRole === 'true' && project && project.audit_state === 1 ? true : false}
        >
          <a target="true" href={projectKibanaUrl}>Kibana(日志分析平台)</a>
        </Description>
      </DescriptionList>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{project ? this.checkAudit(project.audit_state) : 0}</div>
        </Col>
      </Row>
    );
    // 展示未审核信息
    const projectTemplateList = () => {
      const options = [];
      if (templateProject.length) {
        templateProject.map((item, key) => {
          options.push(
            <Card title={item.kind} style={{ marginBottom: 24 }} bodyStyle={{ padding: 0 }} bordered={false} key={key}>
              <div className="language-bash">
                <SyntaxHighlighter language='yaml' style={tomorrowNight}>{item.final_template}</SyntaxHighlighter>
              </div>
            </Card>,
          );
        });
      }
      return options;
    };

    // 发布失败展示信息
    const pushErrorTemplateList = () => {
      const options = [];
      if (templateProject.length) {
        templateProject.map((item, key) => {
          if (item.state != 1) {
            options.push(<Card title={item.kind} style={{ marginBottom: 24 }}
                               bordered={false} key={key} extra={<Button type="danger" ghost
                                                                         onClick={() => this.resendFunc(item.kind)}>重新发布</Button>}>
              <pre className="language-bash">{item.final_template}</pre>
            </Card>);
          }
        });
      }
      return options;
    };

    // 服务扩容、伸缩、版本发布
    // build modal props
    const AddBuildModalProps = {
      visible: buildModal,
      branches: branches,
      tags: tags,
      jenkins: jenkins,
      loading: loading,
      language: data.language,
      project: project,
      onOk(params) {
        dispatch({
          type: 'project/onBuild',
          payload: params,
        });
      },
      onCancel() {
        that.onHideBuildModal();
      },
    };

    const AddExtendModalProps = {
      visible: extendModal,
      loading: loading,
      replicas: deployment ? deployment.spec.replicas : 0,
      onOk(params) {
        dispatch({
          type: 'project/onChangeExtend',
          payload: {
            ...params,
            name: project.name,
            namespace: project.namespace,
          },
        });
      },
      onCancel() {
        that.onHideExtendModal();
      },
    };

    const AddExpansionModalProps = {
      visible: expansionModal,
      loading: loading,
      containers: deployment && deployment.spec && deployment.spec.template && deployment.spec.template.spec && deployment.spec.template.spec.containers ? deployment.spec.template.spec.containers[0].resources : {},
      onOk(params) {
        dispatch({
          type: 'project/onChangeExpansion',
          payload: {
            ...params,
            name: project.name,
            namespace: project.namespace,
          },
        });
      },
      onCancel() {
        that.onHideExpansionModal();
      },
    };

    return (
      <PageHeaderLayout
        title={project ? '项目名称：' + project.name : ''}
        logo={<img alt="" src="https://niu.yirendai.com/kpl-logo-blue.png"/>}
        action={auditRole && project && auditRole == 'true' && project.audit_state == 1 ? action : function() {
          if (project && project.audit_state != 3) {
            return (<span> </span>);
          }
          return (<Fragment>
            <Button.Group style={{ marginRight: 20 }}>
              <Button type="primary"
                      onClick={that.onShowBuildModal}>Build</Button>
              <Button type="danger"
                      onClick={that.onShowRollbackModal}>回滚</Button>
            </Button.Group>
            <Button.Group>
              {/* <Button onClick={that.onShowForeignDrawer}>服务类型</Button> */}
              <Button onClick={that.onShowModelModal}>模式</Button>
              <Button onClick={that.onShowExpansionModal}>扩容</Button>
              <Button onClick={that.onShowExtendModal}>伸缩</Button>
            </Button.Group>
          </Fragment>);
        }()}
        content={description}
        extraContent={extra}
        tabList={(project && project.audit_state && project.audit_state === 3) ? tabList : tabList2}
        loading={loading}
        onTabChange={this.handleTabChange}
      >
        <RollbackModal
          visible={rollbackModalVisible}
          onClose={this.onCloseRollbackModal}
          builds={builds}
          {...this.props}
        />
        {foreignDrawerVisible && foreignDrawerVisible === true && <ForeignDrawer
          visible={foreignDrawerVisible}
          onClose={this.onCloseForeignDrawer}
          onSaveResourceType={this.onSaveResourceType}
          data={auditList}/>}

        {project && this.state.showLab && this.state.showLab === 'configmap' && (
          <ConfigMapProject {...{
            match: match,
            name: project.name,
            namespace: project.namespace,
            checkProject: true,
          }}/>)}
        {project && this.state.showLab && this.state.showLab === 'build-logs' && (
          <BuildLogs {...{ name: project.name, namespace: project.namespace, checkProject: true }}/>)}
        {project && this.state.showLab && this.state.showLab === 'dockerfile' && (
          <Dockerfile {...{ ...auditList.project, ...this.props }}/>)}
        {project && this.state.showLab && this.state.showLab === 'jenkins' && (
          <JenkinsConf {...{ ...auditList.project, ...this.props }}/>)}
        {(this.state.showLab === 'overview' || (this.state.showLab === '' && (deployment || pods || service || ingresses))) && (
          <Overview {...{
            'auditList': auditList,
            'serviceMetrics': serviceMetrics,
            'deployment': deployment,
            'project': project,
            ...ingress,
            ...this.props,
          }}/>)}
        {(this.state.showLab === 'persistentvolume') &&
        <PersistentVolume
          project={project}
          deployment={deployment}
        />
        }
        
      {this.state.showLab === 'webhooks' && (<Webhooks {...{ 'project': project }}/>)}
      {this.state.showLab === 'monitor' && (<Monitor/>)}

        {buildModal && <BuildMoadl {...AddBuildModalProps}/>}
        {extendModal && <ExtendModal {...AddExtendModalProps}/>}
        {expansionModal && <ExpansionModal {...AddExpansionModalProps}/>}
        {showModelModal && <ModelSwitch
          visible={showModelModal}
          loading={modelModalVisible}
          handleCancel={this.onHideModelModal}
          handleOk={this.handleOk}
          project={project}
          templateProject={templateProject}/>}
        {/*未审核展示列表信息*/}
        {templateProject && auditRole && auditRole === 'true' && window.location.href.indexOf('yaml') === -1 && window.location.href.indexOf('jenkins') === -1 && window.location.href.indexOf('dockerfile') === -1 && project && project.audit_state === 1 && (
          <UnAuditOverview {...{ webFiles, project }} />)}
        {templateProject && auditRole && auditRole === 'true' && window.location.href.indexOf('yaml') !== -1 && window.location.href.indexOf('jenkins') === -1 && project && project.audit_state === 1 && projectTemplateList()}
        {/*审核失败相关展示信息*/}
        {templateProject && auditRole && auditRole === 'true' && project && project.audit_state > 1 && pushErrorTemplateList()}
      </PageHeaderLayout>
    );
  }

}

export default connect(({ project, gitlab, builds, jenkins, ingress }) => ({
  data: project,
  gitlab,
  builds,
  jenkins,
  ingress,
  loading: project.loading,
}))(Detail);
