import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Modal,
  Input,
  Progress,
  Button,
  Icon,
  Pagination,
  Select,
  Avatar,
  Badge,
  Popconfirm,
  Alert,
  DatePicker,
} from 'antd';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './BasicList.less';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const Option = Select.Option;
const Search = Input.Search;

class Index extends PureComponent {

  state = {
    namespace: '',
    name: '',
    status: 0,
    visible: false,
    checkedTime: '',
    modalName: '',
    modalType: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    var namespace = Cookie.get('namespace');
    this.setState({ namespace: namespace, checkedTime: '' });
    dispatch({
      type: 'project/projectList',
      payload: {
        'status': 3,
      },
    });
    dispatch({
      type: 'user/fetchNamespaces',
      payload: {},
    });
  }

  auditListParam(key, value) {
    const { dispatch } = this.props;
    var namespace = this.state.namespace;
    var name = this.state.name;
    if (key == 'namespace') namespace = value;
    if (key == 'name') name = value;
    Cookie.set('namespace', namespace);
    dispatch({
      type: 'project/projectList',
      payload: {
        'name': name,
        'status': 3,
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
          name: pods[0].name,
        },
      });
    } else {
      message.error('重启pods失败~');
    }
  };

  showModal = (type, name) => {
    this.setState({ visible: true, modalType: type, modalName: name });
  };

  handleOk = (e) => {
    const { dispatch } = this.props;
    if (this.state.modalType === 'all') {
      dispatch({
        type: 'tools/fakeNamespaceTime',
        payload: {
          namespace: this.state.namespace,
          fake_time: this.state.checkedTime,
          method: 'add',
        },
      });
    } else {
      dispatch({
        type: 'tools/fakeTime',
        payload: {
          namespace: this.state.namespace,
          name: this.state.modalName,
          fake_time: this.state.checkedTime,
          method: 'add',
        },
      });
    }
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      checkedTime: '',
    });
  };

  onChange = (value, dateString) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);

  };
  onOk = (value) => {
    this.setState({ checkedTime: moment(value).format('YYYY-MM-DD HH:mm:ss') });
  };

  fakeTime = (deployment) => {
    let fakeTime = ""
    for(let i in deployment.spec.template.spec.containers) {
      if (deployment.spec.template.spec.containers[i].name != deployment.metadata.name) {
        continue
      }
      for (let n in deployment.spec.template.spec.containers[i].env) {
        if (deployment.spec.template.spec.containers[i].env[n].name == "FAKETIME") {
          fakeTime = deployment.spec.template.spec.containers[i].env[n].value;
          break
        }
      }
    }
    if (fakeTime != "") {
        return moment.unix(moment().unix() + parseInt(fakeTime)).format('YYYY-MM-DD HH:mm:ss')
    }
    return moment().format('YYYY-MM-DD HH:mm:ss')
  };

  render() {
    const { dispatch, data: { projectList, loading }, namespaces } = this.props;
    const optionChange = (value) => {
      this.setState({
        namespace: value,
      });
      this.auditListParam('namespace', value);
    };
    const searchChange = (value) => {
      this.setState({
        name: value,
      });
      this.auditListParam('name', value);
    };
    const renderOption = () => {
      const options = [];
      if (namespaces.length) {
        namespaces.map((item, key) => options.push(<Option value={item.name}
                                                           key={key}>{item.name}</Option>));
      }
      return options;
    };
    const extraContent = (
      <div className={styles.extraContent}>
        {/* <Button type="primary" ghost onClick={() => this.showModal('all', '')}>修改全部时间</Button> */}
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

        <Search
          className={styles.extraContentSearch}
          placeholder="项目英文名称..."
          onSearch={value => searchChange(value)}
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
          'status': 3,
        },
      });
    };
    const percentNum = (step) => {
      if (step == 0) {
        return 30;
      } else if (step == 1) {
        return 60;
      } else if (step == 2) {
        return 100;
      }
    };
    const stepStatus = (step) => {
      if (step == 0) {
        return 'active';
      } else if (step == 1) {
        return 'active';
      } else if (step == 2) {
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
      return <List.Item.Meta key={'image'} title="当前镜像" description={version}/>;

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
        key={'action-' + item.id}
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
            <a key={'logs-' + item.id} href="javascript:;"
               onClick={() => relLogs(item.namespace, item.name, item.pods)}>
              <Icon type="right-square-o"/> 日志
            </a>
            </span>,
        ]}
      />
    );

    return (
      <PageHeaderLayout title="调整服务时间">
        <div className={styles.standardList}>
          <Card
            bordered={false}
            title="项目列表"
            style={{ marginTop: 16 }}
            extra={extraContent}
          >
            {projectList && projectList.list &&
            <List
              rowKey="id"
              loading={loading}
              pagination={false}
              dataSource={projectList.list}
              renderItem={item => (
                <List.Item
                  actions={[<a onClick={() => this.showModal('one', item.name)}>修改时间</a>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://niu.yirendai.com/kpl-logo-blue.png" shape="square"
                                    size="large"/>}
                    title={<a onClick={() => onDetail(item.name, item.namespace, item.step)}>{item.display_name}</a>}
                    description={item.name}
                  />
                  {item && item.deployment && item.deployment.status && (
                    <List.Item.Meta
                      title="运行状态"
                      description={item.deployment.status.conditions && item.deployment.status.conditions && item.deployment.status.conditions[1].status === 'True' ? (
                        <Badge status="success" text="success"/>) : (
                        <Badge status="error" text={item.deployment.status.conditions[1].message}/>)}
                    />
                  )}
                  {item && item.deployment && item.deployment.spec && item.deployment.spec.template && imageVersion(item.name, item.deployment.spec.template)}
                  {/* {item && item.deployment && logsAndRebuild(item)} */}
                  {/* {item && item.audit_state !== 3 && (
                    <List.Item.Meta
                      title="填写进度"
                      description={(
                        <div style={{ width: 250 }} key={'pro' + item.id}>
                          <Progress
                            percent={percentNum(item.step)}
                            status={stepStatus(item.step)}
                            size="small"
                          />
                        </div>)}
                    />
                  )} */}
                  <List.Item.Meta
                    title="应用当前时间"
                    description={item.deployment ? this.fakeTime(item.deployment) : moment().format('YYYY-MM-DD HH:mm:ss')}
                  />
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
          title={this.state.modalType === 'all' ? '修改 ' + this.state.namespace + ' 业务空间时间' : '修改 ' + this.state.modalName + ' 服务时间'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Alert
            showIcon
            message={this.state.modalType === 'all' ? '将要修改整个 ' + this.state.namespace + ' 业务空间时间...' : '将要修改 ' + this.state.modalName + ' 服务时间...'}
            type="error" style={{marginBottom: 20, marginLeft: '10%', width: '80%' }}/>
          <span style={{ marginLeft: 50, marginTop: 100 }}>选择服务时间：</span>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select Time"
            onChange={this.onChange}
            onOk={this.onOk}
            style={{ width: 200 }}
          />
          <Alert
            showIcon
            message="请您确保该每台宿主机都编译了faketime扩展在 /usr/local/lib/libfaketime.so.1"
            type="warning" style={{ marginTop: 20, marginLeft: '10%', width: '80%' }}/>
          <Alert
            showIcon
            message="请您确保该应用使用的基础镜像是ubuntu，而非alpine; 如果是alpine可能不会生效。"
            type="warning" style={{ marginTop: 20, marginLeft: '10%', width: '80%' }}/>
        </Modal>

      </PageHeaderLayout>
    );
  }
}

export default connect(({ project, loading, user }) => ({
  data: project,
  namespaces: user.namespaces,
}))(Index);
