import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Input,
  Icon,
  Pagination,
  Select,
  Avatar,
  Badge, Popconfirm, Alert, Modal,
  message
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
    copyProject: {},
    coypToNamespace: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    const namespace = Cookie.get('namespace');
    this.setState({ namespace: namespace });
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
    var status = this.state.status;
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


  handleOk = () => {
    if (!this.state.coypToNamespace || !this.state.copyProject.name || !this.state.copyProject.namespace) {
      this.setState({
        visible: false,
      });
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'tools/duplication',
      payload: {
        source_namespace: this.state.copyProject.namespace,
        source_app_name: this.state.copyProject.name,
        destination_namespace: this.state.coypToNamespace,
      },
    });
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

  namespaceChange = (value) => {
    this.setState({ coypToNamespace: value });
    console.log('change', value);
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
                                                           key={key}>{item.display_name}</Option>));
      }
      return options;
    };
    const extraContent = (
      <div className={styles.extraContent}>
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
    const onEdit = (item) => {
      this.setState({ visible: true, copyProject: item });
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
      <PageHeaderLayout title="服务克隆">
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
                  actions={[<a onClick={() => onEdit(item)}>克隆</a>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="http://source.qiniu.cnd.nsini.com/kplcloud/kpl-logo-blue.png" shape="square"
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
                  {item && item.pods && item.pods[0] && (
                    <List.Item.Meta
                      title="Pods状态"
                      description={item.pods[0] && item.pods[0].message ? (
                        <Badge status="error" text={item.pods[0].message}/>) : (
                        <Badge status="success" text="success"/>)}
                    />
                  )}
                  {item && item.deployment && item.deployment.spec && item.deployment.spec.template && imageVersion(item.name, item.deployment.spec.template)}
                  {item && item.deployment && logsAndRebuild(item)}
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
          title={'项目克隆'}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={{ marginBottom: 10 }}>
            <span style={{ marginLeft: 50, marginTop: 100, width: 30 }}>名称：</span>
            <Input type="text" value={this.state.copyProject.name} disabled={true}
                   style={{ width: 260, marginLeft: 20 }}/>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ marginLeft: 35, marginTop: 100, width: 30 }}>英文名：</span>
            <Input type="text" value={this.state.copyProject.name} disabled={true}
                   style={{ width: 260, marginLeft: 20 }}/>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ marginLeft: 35, marginTop: 100, width: 30 }}>空间：</span>
            <Input type="text" value={this.state.copyProject.namespace} disabled={true}
                   style={{ width: 260, marginLeft: 20 }}/>
          </div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ marginLeft: 35, marginTop: 100, width: 30 }}>创建人：</span>
            <Input type="text" value={this.state.copyProject.member_name} disabled={true}
                   style={{ width: 260, marginLeft: 20 }}/>
          </div>
          <div style={{ marginBottom: 20 }}>
            <span style={{ marginLeft: 35, marginTop: 100, width: 30 }}>克隆到：</span>
            <Select
              showSearch
              style={{ width: 260, marginLeft: 20 }}
              placeholder="请选择克隆到的业务空间"
              onChange={this.namespaceChange}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {namespaces && renderOption()}
            </Select>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ project, loading, user }) => ({
  data: project,
  namespaces: user.namespaces,
}))(Index);
