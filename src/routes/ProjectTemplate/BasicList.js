import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Pagination,
  Select,
  Avatar,
  Modal,
  Badge, Alert, Popconfirm,
  message,
  Divider,
} from 'antd';
import { routerRedux, Link } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './BasicList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Option, OptGroup } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const ButtonGroup = Button.Group;
const confirm = Modal.confirm;

class BasicList extends PureComponent {

  state = {
    namespace: '',
    name: '',
    status: 0,
    visible: false,
    pauseVisible: false,
    deleteName: '',
    verifyCode: '',
    sendCodeBtn: false,
    sendCodeBtnDetail: '发送',
    sendCodeBtnTime: 50,
    timeoutId: 0,
    group: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    var namespace = Cookie.get('namespace');
    this.setState({ namespace: namespace });

    const que = this.props.location.query;
    if (que) {
      const g = this.props.location.query.group;
      this.setState({ group: g });
      dispatch({
        type: 'project/projectList',
        payload: {
          'group': g,
        },
      });
    } else {
      dispatch({
        type: 'project/projectList',
      });
    }

    dispatch({
      type: 'user/fetchNamespaces',
      payload: {},
    });
    dispatch({
      type: 'group/ownergrouplist',
      payload: {
        'ns': namespace,
      },
    });
  }

  onReloadPods = (ns, pods) => {
    const { dispatch } = this.props;
    if (pods && pods[0] && pods[0].name) {
      dispatch({
        type: 'pods/reload',
        payload: {
          namespace: ns,
          name: pods[0].project_name,
          podName:  pods[0].name,
        },
      });
    } else {
      message.error('重启pods失败~');
    }
  };

  auditListParam(key, value) {
    const { dispatch } = this.props;
    var namespace = this.state.namespace;
    var name = this.state.name;
    var status = this.state.status;
    var group = this.state.group;
    if (key === 'namespace') namespace = value;
    if (key === 'name') name = value;
    if (key === 'status') status = value;
    if (key === 'group') group = value;
    Cookie.set('namespace', namespace);

    if (key === 'namespace') group = '';

    dispatch({
      type: 'project/projectList',
      payload: {
        'name': name,
        'status': status,
        'group': group,
      },
    });

    if (key === 'namespace') {
      dispatch({
        type: 'group/ownergrouplist',
        payload: {
          'ns': namespace,
        },
      });
    }

  }

  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, '');
  }

  showModal = (item) => {
    this.setState({
      deleteName: item.name,
      visible: true,
    });
  };
  handleOk = () => {
    if (this.state.verifyCode === '') {
      message.error('请输入项目名~');
      return;
    }
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: 'project/deleteProject',
      payload: {
        name: this.state.deleteName,
        namespace: this.state.namespace,
        email_type: false,
        code: this.state.verifyCode,
      },
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
      pauseVisible: false,
      verifyCode: '',
    });
  };
  changeVerifyCode = e => {
    this.setState({ verifyCode: this.trim(e.target.value) });
  };
  sendCode = () => {
    this.setState({ sendCodeBtn: true });
    const timeoutId = setInterval(this.showTime, 1000);
    this.setState({
      timeoutId: timeoutId,
    });
    this.props.dispatch({
      type: 'project/deleteProject',
      payload: {
        name: this.state.deleteName,
        namespace: this.state.namespace,
        email_type: true,
        code: '',
      },
    });
  };

  showTime = () => {
    this.setState({ sendCodeBtnTime: this.state.sendCodeBtnTime - 1 });
    if (this.state.sendCodeBtnTime <= 0) {
      clearInterval(this.state.timeoutId);
      this.setState({ sendCodeBtn: false, sendCodeBtnTime: 50 });
    }
  };

  stopApp = (containers, name) => {
    for (var i in containers) {
      if (containers[i].name != name) {
        continue;
      }
      if (containers[i].command && containers[i].command[0] == 'sleep') {
        return <span><Icon type="play-circle-o"/> 恢复 </span>;
      }
      break;
    }
    return <span><Icon type="pause-circle-o"/> 暂停 </span>;
  };

  showPause = (item) => {
    // const { dispatch } = this.props;
    this.setState({ pauseVisible: true, deleteName: item.name });
    // confirm({
    //   title: '您确定要暂停或恢复此服务',
    //   content: '确认后会自动重启动服务，若有启动参数不正确请在详情页进行修改！',
    //   okText: '确定',
    //   okType: 'danger',
    //   cancelText: '取消',
    //   onOk() {
    //     dispatch({
    //       type: 'project/appPause',
    //       payload: {
    //         namespace: item.namespace,
    //         name: item.name,
    //       },
    //     });
    //   },
    //   onCancel() {
    //     console.log('Cancel');
    //   },
    // });
  };
  handleOkPause = (sendCode) => {
    if (!sendCode && this.state.verifyCode === '') {
      message.error('请输入项目名~');
      return;
    }

    this.props.dispatch({
      type: 'project/appPause',
      payload: {
        name: this.state.deleteName,
        namespace: this.state.namespace,
        email_type: sendCode,
        code: this.state.verifyCode,
      },
    });

    if (!sendCode) {
      this.setState({
        pauseVisible: false,
      });
    } else {
      this.setState({ sendCodeBtn: true });
      const timeoutId = setInterval(this.showTime, 1000);
      this.setState({
        timeoutId: timeoutId,
      });
    }
  };

  emitEmpty = () => {
    this.groupNameInput.focus();
    this.setState({ name: '' });
  };
  onChangeGroupName = (e) => {
    this.setState({ name: e.target.value });
  };

  render() {
    const { dispatch, data: { projectList, loading }, namespaces, ownergrouplist } = this.props;
    const onAdd = () => {
      dispatch(routerRedux.push('/project/create'));
    };

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em/>}
      </div>
    );

    const optionChange = (value) => {
      this.setState({
        namespace: value,
        group: '',
        name: '',
      });
      this.ownergrouplist = {};
      this.auditListParam('namespace', value);
    };

    const groupChange = (value) => {
      const v = value === undefined ? '' : value;
      this.setState({
        group: v,
        name: '',
      });
      this.auditListParam('group', v);
    };

    const searchChange = (value) => {
      this.setState({
        name: value,
      });
      this.auditListParam('name', value);
    };
    const radioChange = (e) => {
      this.setState({
        status: e.target.value,
      });
      this.auditListParam('status', e.target.value);
    };
    const renderOption = () => {
      const options = [];
      if (namespaces.length) {
        namespaces.map((item, key) => options.push(<Option value={item.name}
                                                           key={key}>{item.display_name}</Option>));
      }
      return options;
    };
    const groupOption = () => {
      const options = [];
      if (ownergrouplist.length) {
        ownergrouplist.map((item, key) => options.push(
          <Option
            value={`${item.id}`}
            key={`${item.id}`}
          >{item.display_name}
          </Option>));
      }
      options.push(
        <OptGroup label="add Group" key="add Group">
          <Option value="" key="add Group2">
            <div>
              <Link to={{ pathname: '/group/list', query: { addGroup: 1 } }}>
                <div style={{ cursor: 'pointer' }}>
                  <Icon type="plus"/> 点击添加组
                </div>
              </Link>
            </div>
          </Option>
        </OptGroup>,
      );
      return options;
    };
    const suffix = this.state.name ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
    const extraContent = (
      <div className={styles.extraContent}>
        <Button style={{ width: '120px', marginRight: '20' }} type="primary" ghost onClick={onAdd}>
          <Icon type="plus"/> 创建服务
        </Button>
        <Select
          className={styles.extraContentSearch}
          defaultValue={this.state.namespace}
          showSearch
          style={{ width: 150 }}
          placeholder="请选择业务空间"
          optionFilterProp="children"
          onChange={optionChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {namespaces && renderOption()}
        </Select>

        <Select
          className={styles.extraContentSearch}
          value={`${this.state.group ? this.state.group : '请选择组'}`}
          showSearch
          style={{ width: 150 }}
          placeholder="请选择组"
          onChange={groupChange}
          allowClear={
            () => {
              this.setState({
                group: '',
              });
              return true;
            }
          }
          notFoundContent={
            <div>
              <Divider style={{ margin: '4px 0' }}/>
              <Link to={{ pathname: '/group/list', query: { addGroup: 1 } }}>
                <div style={{ padding: '8px', cursor: 'pointer' }}>
                  <Icon type="plus"/> 点击添加组
                </div>
              </Link>
            </div>
          }
        >
          {ownergrouplist && groupOption()}
        </Select>


        <Search
          className={styles.extraContentSearch}
          placeholder="项目英文名称..."
          onSearch={value => searchChange(value)}
          suffix={suffix}
          value={this.state.name}
          onChange={this.onChangeGroupName}
          ref={node => this.groupNameInput = node}
          enterButton
        />

      </div>
    );

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      page: projectList ? (projectList.page ? projectList.page.page : 1) : 1,
      pageSize: projectList ? (projectList.page ? projectList.page.pageSize : 0) : 0,
      total: projectList ? (projectList.page ? projectList.page.total : 0) : 0,
    };

    const onShowSizeChange = (current) => {
      const { dispatch } = this.props;
      Cookie.set('namespace', this.state.namespace);
      dispatch({
        type: 'project/projectList',
        payload: {
          'p': current,
          'name': this.state.name,
          'status': this.state.status,
          'group': this.state.group,
        },
      });
    };
    const percentNum = (step) => {
      if (step === 0) {
        return 30;
      } else if (step === 1) {
        return 60;
      } else if (step === 2) {
        return 100;
      }
    };
    const stepStatus = (step) => {
      if (step === 0) {
        return 'active';
      } else if (step === 1) {
        return 'active';
      } else if (step === 2) {
        return 'success';
      }
    };

    const onDetail = (name, namespace, step) => {
      switch (step) {
        case 0:
          dispatch(routerRedux.push(`/project/create/${namespace}/basic/${name}`));
          break;
        case 1:
          dispatch(routerRedux.push(`/project/create/${namespace}/basic/${name}`));
          break;
        case 2:
          dispatch(routerRedux.push(`/project/detail/${namespace}/${name}`));
          break;
        default:
          dispatch(routerRedux.push(`/project/detail/${namespace}/${name}`));
      }
    };

    const imageVersion = (name, template) => {
      var version = '';
      for (var i in template.spec.containers) {
        if (template.spec.containers[i].name === name) {
          let image = template.spec.containers[i].image;
          let v = image.split(':');
          version = v[1];
          break;
        }
      }
      return <List.Item.Meta key={'image' + version} title="当前镜像" description={version}/>;

    };
    const relLogs = (ns, name, pods) => {
      if (pods && pods[0] && pods[0].name) {
        dispatch(
          routerRedux.push('/pods/' + ns + '/' + name + '/detail/' + pods[0].name + '/logs'),
        );
      } else {
        message.error('日志打开失败~');
      }
    };
    const logsAndRebuild = (item) => (
      <List.Item.Meta
        key={'action-' + item.name}
        title="服务操作"
        description={[
          <span>
              <Popconfirm
                title="您确定要重启这个服务?"
                onConfirm={e => this.onReloadPods(item.namespace, item.pods)}
              >
              <a href="javascript:;">
                <Icon type="reload"/> 重启 {' '}
              </a>
            </Popconfirm>
            | {' '}
            <a key={'logs-' + item.name} href="javascript:;"
               onClick={() => relLogs(item.namespace, item.name, item.pods)}>
              <Icon type="right-square-o"/> 日志
            </a>
            </span>,
        ]}
      />
    );

    return (
      <PageHeaderLayout title="服务列表">
        <div className={styles.standardList}>
          {/* <Card bordered={false}> TODO 饼图
            <Row>
              <Col sm={8} xs={24}>
                <Info title="未完成"
                      value={(projectList ? (projectList.total ? projectList.total.todoTotal : 0) : 0) + '个任务'}
                      bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="待审核"
                      value={(projectList ? (projectList.total ? projectList.total.doingTotal : 0) : 0) + '个任务'}
                      bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="已完成"
                      value={(projectList ? (projectList.total ? projectList.total.doneTotal : 0) : 0) + '个任务'}/>
              </Col>
            </Row>
          </Card> */}
          <Card
            bordered={false}
            title="项目列表"
            style={{ marginTop: 16 }}
            extra={extraContent}
          >
            {projectList && projectList.list &&
            <List
              rowKey="name"
              loading={loading}
              pagination={false}
              dataSource={projectList.list}
              renderItem={item => (
                <List.Item
                  key={item.name + '-list-ButtonGroup'}
                  actions={[
                    <ButtonGroup key={item.name + '-ButtonGroup'}>
                      {item.audit_state == 3 && item.deployment ?
                        <Button type="dashed" key={item.name + '-ButtonGroup1'} color="warn" onClick={() => this.showPause(item)}>
                          {this.stopApp(item.deployment.spec.template.spec.containers, item.deployment.metadata.name)}
                        </Button> : ' '}
                      <Button type="danger" key={item.name + '-ButtonGroup2'} onClick={() => this.showModal(item)}>
                        下线<Icon type="close-circle-o"/>
                      </Button>
                    </ButtonGroup>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://niu.yirendai.com/kpl-logo-blue.png" shape="square"
                                    size="large"/>}
                    title={<a onClick={() => onDetail(item.name, item.namespace, item.step)}>{item.display_name}</a>}
                    description={item.name}
                    key={item.name + '-name'}
                  />
                  {item && item.deployment && item.deployment.status && (
                    <List.Item.Meta
                      key={item.name + 'deployment'}
                      title="服务状态"
                      description={item.deployment.status.conditions && item.deployment.status.conditions && item.deployment.status.conditions[1].status === 'True' ? (
                        <Badge key="success" status="success" text="success"/>) : (
                        <Badge key="error" status="error" text={item.deployment.status.conditions[1].message}/>)}
                    />
                  )}
                  {item && item.pods && item.pods[0] && (
                    <List.Item.Meta
                      key={item.name + 'pods'}
                      title="Pods状态"
                      description={item.pods[0] && item.pods[0].message ? (
                        <Badge key="pod-error" status="error" text={item.pods[0].message}/>) : (
                        <Badge key="pod-success" status="success" text="success"/>)}
                    />
                  )}
                  {/* {item && item.deployment && item.deployment.spec && item.deployment.spec.template && imageVersion(item.name, item.deployment.spec.template)} */}
                  {item && item.image_version ? <List.Item.Meta key={'image'} title="当前镜像" description={item.image_version}/> : item && item.deployment && item.deployment.spec && item.deployment.spec.template && imageVersion(item.name, item.deployment.spec.template)}
                  {item && item.deployment && logsAndRebuild(item)}
                  {item && item.audit_state !== 3 && (
                    <List.Item.Meta
                      key={item.name + 'audit_state2'}
                      title="填写进度"
                      description={(
                        <div style={{ width: 250 }} key={'pro' + item.name}><Progress percent={percentNum(item.step)}
                                                                                    status={stepStatus(item.step)}
                                                                                    size="small"/>
                        </div>)}
                    />
                  )}
                  {item && item.audit_state !== 3 && (
                    <List.Item.Meta
                      title=""
                      key={item.name + 'audit_state3'}
                    />
                  )}
                  {item && item.audit_state !== 3 && (
                    <List.Item.Meta
                      key={item.name + 'audit_state'}
                      title="更改时间"
                      description={moment(item.updated_at).format('YYYY/MM/DD HH:mm:ss')}
                    />
                  )}
                  <div key={'member' + item.name}>
                    <List.Item.Meta
                      key={item.name + 'member'}
                      title="创建者"
                      description={item.member_name}
                    />
                  </div>
                </List.Item>
              )}
            />
            }
            {projectList && !projectList.list && (
              <div style={{ textAlign: 'center', width: '100%', padding: '20px 0', height: '50px' }}>暂无数据</div>)}
            <Pagination current={paginationProps.page} defaultCurrent={paginationProps.page}
                        total={paginationProps.total}
                        pageSize={paginationProps.pageSize}
                        showTotal={total => `共 ${paginationProps.total} 条数据`}
                        onChange={onShowSizeChange}/>
          </Card>
        </div>
        <Modal
          title="确定要删除该项目？"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="我了解后果，删除此项目"
          okType="danger"
        >
          <Alert message={`如果你不读这个就会发生意想不到的坏事！`} type="warning" />
          <Alert style={{ marginTop: 20, marginBottom: 10 }} message={<span>此操作无法撤消。 这将永久删除 <b style={{color:"red"}}>{this.state.deleteName}</b> 项目，与之相关数据会全部删除，有调用关系的可能会无法调用该服务。请输入要确认的项目英文名称。</span>} type="error" />
          项目名称：<Input style={{ width: 260, marginRight: 20, marginLeft: 20 }} onKeyUp={this.changeVerifyCode}
                     placeholder={`请输入 ${this.state.deleteName} 确认删除`}/>
        </Modal>
        <Modal
          title={`您确定要暂停或恢复【${this.state.deleteName}】服务？`}
          visible={this.state.pauseVisible}
          onOk={() => this.handleOkPause(false)}
          onCancel={this.handleCancel}
          okType="dashed"
          okText="我了解后果，休眠此项目"
        >
          <Alert message={`如果你不读这个就会发生意想不到的坏事！`} type="warning" />
          <Alert style={{ marginTop: 20, marginBottom: 10 }} message={<span>此操作将会休眠 <b style={{color:"red"}}>{this.state.deleteName}</b> 项目，有调用关系的可能会无法调用该服务。请输入要确认的项目英文名称。</span>} type="error" />

          项目名称：<Input style={{ width: 260, marginRight: 20, marginLeft: 20 }} onKeyUp={this.changeVerifyCode}
                     placeholder="请确认项目名称"/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ project, loading, user, group }) => ({
  data: project,
  namespaces: user.namespaces,
  ownergrouplist: group.ownergrouplist,
}))(BasicList);

// export default connect()(BasicList);
