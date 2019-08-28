import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Table, Card, Button, Icon, Pagination, Input, Popconfirm } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import ShowTags from '../../../components/Security/showTags';

const { Search } = Input;

class List extends PureComponent {
  state = {};

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'virtualservice/list',
      payload: {
        'name': '',
      },
    });
  }

  onEdit = (name, namespace) => {
    this.props.dispatch(routerRedux.push(`/security/virtual/service/create/editInfo/${namespace}/${name}`));
  };

  onDelete = (name, namespace) => {
    this.props.dispatch({
      type: 'virtualservice/virtualserviceDelete',
      payload: {
        name: name,
        namespace: namespace,
      },
    });
  };

  onDetail = (name, namespace) => {
    this.props.dispatch(routerRedux.push(`/security/virtual/service/detail/${namespace}/${name}`));
  };

  onAdd = () => {
    this.props.dispatch(routerRedux.push('/security/virtual/service/create'));
  };

  onShowSizeChange = (current) => {
    this.props.dispatch({
      type: 'virtualservice/list',
      payload: {
        'p': current,
      },
    });
  };

  dataPull = () => {
    this.props.dispatch({
      type: 'virtualservice/pull',
    });
  };

  render() {
    const { virtualservice, dispatch } = this.props;
    const { list, page, loading } = virtualservice;
    const namespaceSelectPros = {
      onOk(value) {
        dispatch({
          type: 'virtualservice/list',
          payload: {
            'namespace': value,
          },
        });
      },
    };

    const searchChange = (name) => {
      dispatch({
        type: 'virtualservice/list',
        payload: {
          'namespace': Cookie.get('namespace'),
          'name': name,
        },
      });
    };
    const extraContent = (
      <div>
        <Button type="primary" ghost style={{ width: '250px', marginRight: 20 }} onClick={this.onAdd}>
          <Icon type="plus"/> 添加虚拟服务(VirtualService)
        </Button>
        <Button style={{ marginRight: 20 }} onClick={this.dataPull}>更新</Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros}/>
        <Search
          style={{ width: '200px', marginLeft: '20px' }}
          placeholder="搜索名称..."
          onSearch={value => searchChange(value)}
          enterButton
        />
      </div>
    );

    const columns = [{
      title: 'name',
      key: 'name',
      render: (text) => (
        <a key={text.id} onClick={() => this.onDetail(text.name, text.namespace)}>{text.name}</a>
      ),
    }, {
      title: 'namespace',
      key: 'namespace',
      dataIndex: 'namespace',
    }, {
      title: 'hosts',
      dataIndex: 'hosts',
      render: (text) => (
        <ShowTags {...{ content: text, color: 'blue' }}/>
      ),
    }, {
      title: 'gateways',
      dataIndex: 'gateways',
      render: (text) => (
        <ShowTags {...{ content: text, color: 'blue' }}/>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text) => (
        <span>
          <a key={text.id + 100} onClick={() => this.onEdit(text.name, text.namespace)}><Icon
            type="edit"/></a>
          <Popconfirm
            title="确定要删除吗?"
            onConfirm={() => this.onDelete(text.name, text.namespace)}
            okText="Yes"
            cancelText="No"
          >
            <a style={{ marginLeft: 20 }}><Icon type="delete"/></a>
          </Popconfirm>
        </span>
      ),
    }];

    return (
      <PageHeaderLayout title="虚拟服务(VirtualService)">
        <Card title="虚拟服务列表" extra={extraContent}>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination
            style={{ marginTop: 20, float: 'right' }}
            title=""
            current={page ? page.page : 0}
            defaultCurrent={page.page}
            total={page.total}
            showTotal={total => `共 ${page.total} 条数据`}
            onChange={this.onShowSizeChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ virtualservice }) => ({
  virtualservice,
}))(List);
