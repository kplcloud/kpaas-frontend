import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import moment from 'moment';
import numeral from 'numeral';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/styles/hljs';
import { MiniArea, ChartCard } from '../../../components/Charts';
import styles from '../Detail.less';
import basicStyles from '../BasicList.less';
import OverviewModal from './OverviewModal';
import ServicePortModal from './ServicePortModal';
import ProbeModal from './ProbeModal';
import FilebeatLogModal from './FilebeatLogModal';
import OverviewPomfileModal from './OverviewPomModal';
import HostsModal from './HostsModal';
import { Col, Popconfirm, Button, Icon, Card, Tag, Modal, Table, Tooltip } from 'antd';
import DescriptionList from '../../../components/DescriptionList';

const confirm = Modal.confirm;
const { Description } = DescriptionList;

var YAML = require('json2yaml');
var yaml2json = require('js-yaml');

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 12,
  style: { marginBottom: 24 },
};

class Overview extends React.PureComponent {
  state = {
    pods: [], //容器
    visible: false,
    title: '',
    content: '',
    showLab: '',
    portVisible: false,
    probeVisible: false,
    probeTitle: '',
    loggingVisible: false,
    loggingTitle: false,
    hostsModalVisible: false,
    deployment: {},
  };

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    dispatch({
      type: 'project/projectInfo',
      payload: {
        name: params.name,
        namespace: params.namespace,
      },
    });
  }

  showYamlModal = (e, title, deploy) => {
    e.preventDefault();
    this.setState({
      visible: true,
      title: title,
      content: YAML.stringify(deploy),
    });
  };

  handleCancel = () => {
    this.setState({ visible: false, title: '', content: '' });
  };
  podsTag = status => {
    if (status === 'Pending') {
      return <Tag color="gold">{status}</Tag>;
    }
    if (status === 'Running' || status === 'Succeeded') {
      return <Tag color="green">{status}</Tag>;
    }
    if (status === 'Failed') {
      return <Tag color="red">{status}</Tag>;
    }
    if (status === 'Unknown') {
      return <Tag>{status}</Tag>;
    }
  };
  podsData = data => {
    var items = [];
    for (var key in data) {
      items.push({
        key: key,
        name: data[key]['name'],
        node: data[key]['node_name'],
        status: this.podsTag(data[key]['status']),
        restart: data[key]['restart_count'],
        message: data[key]['message'],
        lastMessage: data[key]['last_message'],
        memory: (
          <span>
            <MiniArea color="#90EE90" data={data[key]['memory']}/> {data[key]['curr_memory']}MB
          </span>
        ),
        cpu: (
          <span>
            <MiniArea color="#87CEFA" data={data[key]['cpu']}/> {data[key]['curr_cpu'] / 1000}
          </span>
        ),
        created_at: moment(data[key]['create_at']).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
    return items;
  };

  lable = data => {
    var items = [];
    for (var key in data) {
      var len = key.length + data[key].length;
      if (len >= 40) {
        items.push(
          <Tag key={key} color="blue" onClick={(e) => this.showModal(e, key, data[key])}>
            {key}
          </Tag>,
        );
      } else {
        items.push(
          <Tag key={key}>
            {key}:{data[key]}
          </Tag>,
        );
      }
    }
    return items;
  };

  imagedata = (containers, initContainers) => {
    var items = [];
    containers.map((item, key) => {
      items.push(<div key={key}>{containers[key]['image']}</div>);
    });
    if (initContainers && initContainers.length) {
      initContainers.map((item, key) => {
        items.push(<div key={key + 100}>{initContainers[key]['image']}</div>);
      });
    }
    return items;
  };
  endpointData = (name, namespace, ports) => {
    var items = [];
    for (var key in ports) {
      items.push(
        <Tag key={name + ':' + ports[key]['port'] + ' ' + ports[key]['protocol']}>
          {name + ':' + ports[key]['port'] + '  ' + ports[key]['protocol']}
        </Tag>,
      );
    }
    return items;
  };
  portdata = data => {
    var items = [];
    for (var key in data) {
      items.push(
        <Tag key={key}>
          {data[key]['port']}-{data[key]['protocol']}-{data[key]['name']}
        </Tag>,
      );
    }

    return items;
  };
  httpPathList = paths => {
    var listItems = [];
    for (var key in paths) {
      listItems.push(
        <DescriptionList key={key} className={styles.headerList} size="small" col="3">
          <Description term="path">{paths[key]['path']}</Description>
          <Description term="serviceName">{paths[key]['backend']['serviceName']}</Description>
          <Description term="servicePort">{paths[key]['backend']['servicePort']}</Description>
        </DescriptionList>,
      );
    }
    return listItems;
  };

  ingressesList = data => {
    var items = [];
    for (var key in data) {
      items.push(
        <Card
          style={{ marginTop: 10 }}
          key={key}
          title={
            <a href={'http://' + data[key]['host']} target="_blank">{data[key]['host']}</a>
          }
        >
          {this.httpPathList(data[key]['http']['paths'])}
        </Card>,
      );
    }
    return items;
  };

  handleCancelEditModal = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'project/modal',
      payload: {
        overviewModalVisible: false,
      },
    });
  };

  handleOkEditModal = (project, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/onCommandArgs',
      payload: {
        name: project.name,
        namespace: project.namespace,
        command: values.command,
        args: values.args,
      },
    });
  };

  showEditModal = (e, deploy) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'project/modal',
      payload: {
        overviewModalVisible: true,
      },
    });
  };

  handleOkPomfileModal = (project, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/onUpdatePomfile',
      payload: {
        name: project.name,
        namespace: project.namespace,
        path: values.path,
      },
    });
  };

  handleCancelPomfileModal = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'project/modal',
      payload: {
        overviewPomfileModal: false,
      },
    });
  };
  showPomfileModal = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'project/modal',
      payload: {
        overviewPomfileModal: true,
      },
    });
  };
  showHostsModal = (e, deployment) => {
    e.preventDefault();
    this.setState({
      hostsModalVisible: true,
      deployment: deployment,
    });
  };

  imageVersion = (project, deploy) => {
    var version = '';
    for (var i in deploy.spec.template.spec.containers) {
      if (deploy.spec.template.spec.containers[i].name === project.name) {
        let image = deploy.spec.template.spec.containers[i].image;
        let v = image.split(':');
        version = v[1];
        break;
      }
    }
    return <Tag color="#108ee9">{version}</Tag>;
  };

  getFields = (project) => {
    const { templateProject } = this.props.auditList;
    let fields = {};
    for (var i in templateProject) {
      if (templateProject[i].kind === 'Deployment') {
        fields = JSON.parse(templateProject[i].fields);
        break;
      }
    }
    return fields;
  };

  showModal = (e, title, content, conType) => {
    e.preventDefault();
    var val;
    if (conType == 'list') {
      val = content.join(',');
    } else {
      val = content;
    }
    this.setState({
      visible: true,
      title: title,
      content: val,
    });
  };

  detail = (project, deployment) => {
    var deploy;
    if (deployment && deployment.spec && deployment.spec.template.spec.containers) {
      deploy = (deployment.spec.template.spec.containers).map((item, key) => {
        if (item.name === project.name) {
          return item;
        }
      });
    } else {
      return;
    }
    deploy = deploy[0];
    var command = (
      <Description term="命令、参数">
        <Tooltip title="调整服务参数">
          <a>
            <Icon type="edit" onClick={(e) => this.showEditModal(e, deploy)}/>
          </a>
        </Tooltip>
      </Description>
    );
    if (deploy && deploy.command) {
      command = (
        <Description term="命令、参数">
          <Tooltip title="点击查看参细参数">
            <Tag
              color="blue"
              onClick={(e) => this.showModal(e, deploy.command, deploy.args, 'list')}
            >
              {(deploy.command).map((item) => {
                return item + ' ';
              })}
            </Tag>
          </Tooltip>{` `}
          <Tooltip title="调整服务参数">
            <a>
              <Icon type="edit" onClick={(e) => this.showEditModal(e)}/>
            </a>
          </Tooltip>
        </Description>);
    }

    const { overviewModalVisible, overviewModalLoading, overviewPomfileModal } = this.props.project;
    const fields = this.getFields(project);

    let pomfile = (<Description/>);
    if (project && project.language === 'Java') {
      pomfile = (<Description term="pomfile">
        <Tag>{fields.pom_file}</Tag>
        <Tooltip title="调整服务参数">
          <a>
            <Icon type="edit" onClick={(e) => this.showPomfileModal(e, deploy)}/>
          </a>
        </Tooltip>
      </Description>);
    }
    return (
      <Card title="详情" style={{ marginBottom: 24 }} bordered={false} extra={<Tooltip title="查看Deployment YAML信息">
        <a>
          <Icon type="code-o" onClick={(e) => this.showYamlModal(e, 'Deployment', deployment)}/>
        </a>
      </Tooltip>}>

        <OverviewModal
          deployment={deploy}
          visible={overviewModalVisible}
          loading={overviewModalLoading}
          handleCancel={this.handleCancelEditModal}
          handleOk={this.handleOkEditModal}
          project={project}
        />
        <OverviewPomfileModal
          deployment={fields}
          visible={overviewPomfileModal}
          loading={overviewModalLoading}
          handleCancel={this.handleCancelPomfileModal}
          handleOk={this.handleOkPomfileModal}
          project={project}
        />

        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="名称">{project.name}</Description>
          <Description term="命名空间">{project.namespace}</Description>
          <Description term="标签">{this.lable(deployment.metadata.labels)}</Description>
          <Description term="当前镜像版本">{this.imageVersion(project, deployment)}</Description>
          <Description term="升级策略">{deployment.spec.strategy.type}</Description>
          <Description term="TOKEN"><Tag color="volcano">{deployment.metadata.uid}</Tag></Description>
          <Description term="创建时间">
            {moment(deployment.metadata.creationTimestamp).format('YYYY-MM-DD HH:mm:ss')}
          </Description>
          <Description term="配置资源">
            {/* <Tag color="green">初始内存: {deploy.resources && deploy.resources.requests && deploy.resources.requests.memory}</Tag> */}
            <Tag
              color="geekblue">最大内存: {deploy && deploy.resources && deploy.resources.limits && deploy.resources.limits.memory}</Tag>
          </Description>
          {/* <Description term="选择器">
            {this.lable(deployment.spec.selector.matchLabels)}
          </Description> */}

          <Description term="Git"><Tag>{fields.git_addr}</Tag></Description>
          <Description term="镜像">
            {this.imagedata(
              deployment.spec.template.spec.containers,
              deployment.spec.template.spec.initContainers,
            )}
          </Description>
          <Description term="容器组">
            <Tag color="green">
              {(deployment.status.availableReplicas ? deployment.status.availableReplicas : 0) +
              ' / ' +
              (deployment.status ? deployment.status.replicas : 0) +
              '个运行中'}
            </Tag>
            {deployment.status.unavailableReplicas > 0 ? (
              <Tag color="red">
                {' ' + (deployment.status ? deployment.status.unavailableReplicas : 0) + '个失败'}
              </Tag>
            ) : (
              ''
            )}
          </Description>
          {pomfile}
          {command}
          <Description term="hosts"><Tag>
            {deployment.spec.template.spec.hostAliases && deployment.spec.template.spec.hostAliases[0].ip}
          </Tag>
            <Tooltip title="自定义Hosts">
              <a>
                <Icon type="edit" onClick={(e) => this.showHostsModal(e, deployment)}/>
              </a>
            </Tooltip>
          </Description>
          {/* <Description term="日志路径"><Tag>{fields.mountPath}</Tag></Description> */}
        </DescriptionList>
      </Card>
    );

  };

  onClickDetail = (e, name, service, project) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push(`/pods/${project.namespace}/${project.name}/detail/${name}`),
    );
  };

  onReloadPods = (e, name, podName, ns) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
      type: 'pods/reload',
      payload: {
        namespace: ns,
        name: name,
        podName: podName,
      },
    });
  };

  showAddProbe = (e, title) => {
    e.preventDefault();
    this.setState({
      probeVisible: true,
      probeTitle: title,
    });
  };

  showLogging = (e, title) => {
    e.preventDefault();
    this.setState({
      loggingVisible: true,
      loggingTitle: title,
    });
  };

  logging = (configmap) => {
    if (!configmap || !configmap.data['filebeat.yml']) {
      return (
        <Card title="日志采集" style={{ marginBottom: 24 }} bordered={false} extra={
          <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                  onClick={(e) => this.showLogging(e, '添加日志采集器')}>
            <Icon type="puls"/> 添加
          </Button>}></Card>
      );
    }

    let filebeat = yaml2json.safeLoad(configmap.data['filebeat.yml']);
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

  probe = (project, containers) => {
    let container;
    for (let i in containers) {
      if (containers[i].name != project.name) {
        continue;
      }
      container = containers[i];
    }
    let probe;
    if (container && container['readinessProbe']) {
      probe = container.readinessProbe;
    } else if (container && container['livenessProbe']) {
      probe = container.livenessProbe;
    }

    if (!container || !probe) {
      return (
        <Card title="健康检测" style={{ marginBottom: 24 }} bordered={false} extra={
          <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                  onClick={(e) => this.showAddProbe(e, '添加健康检测')}>
            <Icon type="puls"/> 添加
          </Button>}></Card>
      );
    }

    return (
      <Card title="健康检测" style={{ marginBottom: 24 }} bordered={false} extra={
        <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                onClick={(e) => this.showAddProbe(e, '编辑健康检测')}>
          <Icon type="edit"/> 编辑
        </Button>}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description
            term="就绪">{container.readinessProbe ? 'TCP' : container.livenessProbe ? 'HTTP' : ''}</Description>
          <Description
            term="端口">{probe && probe.tcpSocket && probe.tcpSocket.port ? probe.tcpSocket.port : ''}</Description>
          <Description term="初始化等候时间">{probe && probe.initialDelaySeconds}s</Description>
          <Description term="检测时间间隔">{probe && probe.periodSeconds}s</Description>
          <Description term="检测超时时间">{probe && probe.timeoutSeconds}s</Description>
          <Description term="连续成功次数">{probe && probe.successThreshold}</Description>
          <Description term="连续失败次数">{probe && probe.failureThreshold}</Description>
        </DescriptionList>
      </Card>
    );
  };

  container = (pods, project) => {
    const that = this;
    const { dispatch } = this.props;
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        width: 260,
        render: function(val, record, index) {
          return (<span>
            <a href="javascript:;" onClick={e => that.onClickDetail(e, val, record, project)}>
              {val}
            </a> <br/>
            <b color="red" style={{ color: 'red' }}>{record['message']}</b>
            </span>
          );
        },
      },
      {
        title: '节点',
        dataIndex: 'node',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '已重启',
        dataIndex: 'restart',
      },
      {
        title: 'CPU（核）',
        dataIndex: 'cpu',
      },
      {
        title: '内存（字节）',
        dataIndex: 'memory',
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span><Popconfirm
            title="您确定要重启这个Pods?"
            onConfirm={e => this.onReloadPods(e, project.name, text.name, project.namespace)}
          >
            <a href="javascript:;">
              <Icon type="reload"/> 重启 {' '}
            </a>
          </Popconfirm>
          | {' '}
            <a href="javascript:;" onClick={(e) => {
              e.preventDefault();
              dispatch(
                routerRedux.push('/pods/' + project.namespace + '/' + project.name + '/detail/' + text.name + '/logs'),
              );
            }}>
              <Icon type="right-square-o"/> 日志
            </a>
            | {' '}
            <a href="javascript:;" onClick={(e) => {
              e.preventDefault();
              // /terminal/{namespace}/index/{name}/pod/{podName}/container/{container}
              window.open(`/terminal/${project.namespace}/index/${project.name}/pod/${text.name}/container/${project.name}`)
            }}>
              <Icon type="code-o"/> 控制台
            </a>
          </span>
        ),
      },
    ];

    return (
      <Card title="容器组" style={{ marginBottom: 24 }} bordered={false}>
        <Table columns={columns} dataSource={this.podsData(pods)} size="small" pagination={false}/>
      </Card>
    );
  };

  showAddPort = (e) => {
    e.preventDefault();
    this.setState({
      portVisible: true,
    });
  };

  showClosePort = () => {
    // e.preventDefault();
    this.setState({
      portVisible: false,
      probeVisible: false,
      loggingVisible: false,
      hostsModalVisible: false,
    });
  };

  serviceParam = service => {
    const { dispatch } = this.props;
    const onAdd = () => {
      dispatch(routerRedux.push('/project/discovery/services/create'));
    };
    // todo 如果没有服务 显示创建服务 如果有显示添加端口
    return (
      <Card title="Service" style={{ marginBottom: 24 }} bordered={false}
            extra={<div className={basicStyles.extraContent}>
              {service ?
                <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost onClick={this.showAddPort}>
                  <Icon type="edit"/> 调整端口
                </Button> :
                <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost onClick={onAdd}>
                  <Icon type="plus"/> 创建服务
                </Button>}

              <Tooltip title="查看Service YAML信息">
                <a>
                  <Icon type="code-o" onClick={(e) => this.showYamlModal(e, 'Service', service)}/>
                </a>
              </Tooltip></div>}>
        {service &&
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="名称">{service.metadata.name}</Description>
          <Description term="标签">{this.lable(service.metadata.labels)}</Description>
          <Description term="选择器">{this.lable(service.spec.selector)}</Description>
          <Description term="端口">{this.portdata(service.spec.ports)}</Description>
          <Description term="注释">{this.lable(service.metadata.annotations)}</Description>
          <Description term="端点">
            {this.endpointData(
              service.metadata.name,
              service.metadata.namespace,
              service.spec.ports,
            )}
          </Description>
          <Description term="创建时间">
            {moment(service.metadata.creationTimestamp).format('YYYY-MM-DD HH:mm:ss')}
          </Description>
        </DescriptionList>
        }
      </Card>
    );
  };
  showConfirm = (name, namespace) => {
    var that = this;
    confirm({
      title: '您确定要添加外部访问地址吗?',
      okText: '确定',
      cancelText: '不了',
      onOk() {
        that.props.dispatch({
          type: 'project/onChangeResourceType',
          payload: {
            name,
            namespace,
            resource_type: '2',
          },
        });
      },
    });
  };
  ingressesParam = (ingresses, project) => {
    return (
      <Card title="外部地址" style={{ marginBottom: 24 }} bordered={false} extra={
        <span>
          {!ingresses || ingresses.length == 0 && <Button style={{ width: '120px', marginRight: '16px' }} type="primary" ghost
                                 onClick={() => this.showConfirm(project.name, project.namespace)}>
            <Icon type="puls"/> 添加
          </Button>}
          <Tooltip title="查看外部地址 YAML信息" hidden={true}>
            <a>
              <Icon type="code-o" onClick={(e) => this.showYamlModal(e, 'Ingress', ingresses)}/>
            </a>
          </Tooltip>
        </span>
      }>
        {ingresses && ingresses.spec && ingresses.spec.rules && this.ingressesList(ingresses.spec.rules)}
      </Card>
    );
  };

  render() {
    const { auditList, serviceMetrics, ingress: { detail } } = this.props;
    const { project, ingresses, service, deployment, pods, filebeat, configmap } = auditList;
    const { portVisible, probeVisible, probeTitle, loggingVisible, loggingTitle, hostsModalVisible } = this.state;
    const projectStep = metrics => {
      return (
        <Card title="服务使用情况" style={{ marginBottom: 24 }} bordered={false}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="CPU（核）"
              action={
                <Tooltip title="近15分钟CPU使用情况">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={metrics.curr_cpu / 1000}
              contentHeight={46}
            >
              <MiniArea color="#87CEFA" data={metrics.cpu}/>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="内存（字节）"
              action={
                <Tooltip title="近15分钟内存使用情况">
                  <Icon type="info-circle-o"/>
                </Tooltip>
              }
              total={numeral(metrics.curr_memory).format('0,0') + `MB`}
              contentHeight={46}
            >
              <MiniArea color="#90EE90" data={metrics.memory}/>
            </ChartCard>
          </Col>
        </Card>
      );
    };
    return (
      <div>
        <Modal
          visible={this.state.visible}
          title={this.state.title}
          width={600}
          onOk={this.handleOk}
          footer={[
            <Button key="back" type="primary" onClick={this.handleCancel}>
              OK
            </Button>,
          ]}
          onCancel={this.handleCancel}
          bodyStyle={{ background: '#EFEFEF', overflow: 'auto', maxHeight: '500px', margin: 0, padding: 0 }}
        >
          <SyntaxHighlighter language='yaml' style={tomorrowNightEighties}>{this.state.content}</SyntaxHighlighter>
        </Modal>
        {/*审核进度*/}
        {serviceMetrics && serviceMetrics.cpu != null && projectStep(serviceMetrics)}
        {deployment && project && this.detail(project, deployment)}
        {pods && this.container(pods, project)}
        {deployment && this.logging(configmap)}
        <FilebeatLogModal visible={loggingVisible} filebeat={filebeat} title={loggingTitle}
                          onCancel={this.showClosePort} dispatch={this.props.dispatch} name={project.name}
                          namespace={project.namespace}/>
        {deployment && this.probe(project, deployment.spec.template.spec.containers)}
        {deployment && deployment.spec && (
          <ProbeModal visible={probeVisible} containers={deployment.spec.template.spec.containers} title={probeTitle}
                      onCancel={this.showClosePort} dispatch={this.props.dispatch} name={project.name}
                      namespace={project.namespace}/>
        )}
        {deployment && <HostsModal visible={hostsModalVisible} deployment={deployment} onCancel={this.showClosePort}/>}

        {this.serviceParam(service)}
        <ServicePortModal visible={portVisible} onCancel={this.showClosePort} dispatch={this.props.dispatch}
                          name={project.name} namespace={project.namespace}
                          portInfo={service ? service.spec.ports : []}/>
        {this.ingressesParam(detail, project)}
      </div>
    );
  }
}

export default connect(({ pods, project, ingress }) => ({
  pods,
  project,
  ingress,
}))(Overview);
