/**
 * Created by huyunting on 2018/5/29.
 */
import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Table, Card, Button, Icon, Pagination, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../components/Security/namespaceSelect';
import Cookie from 'js-cookie';
import moment from 'moment';

class ServiceEntryList extends PureComponent {
  state = {
    defaultNamespace: '',
    page: 1,
  };

  componentWillMount() {
    var namespace = Cookie.get('namespace');
    this.setState({ defaultNamespace: namespace });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    var namespace = Cookie.get('namespace');
    dispatch({
      type: 'user/fetchNamespaces',
    });
    dispatch({
      type: 'serviceentry/list',
      payload: {
        'namespace': namespace,
      },
    });
  }

  onEdit = (name, namespace) => {
    this.props.dispatch(routerRedux.push('/security/service/entry/edit/' + namespace + '/' + name));
  };
  onAdd = () => {
    this.props.dispatch(routerRedux.push('/security/service/entry/create'));
  };
  serviceData = (data) => {
    var items = [];
    if (data && data.length) {
      data.map((item, key) => {
        items.push(<Tag color="blue" key={key}>{item}</Tag>);
      });

    }
    return (
      <div>
        {items}
      </div>
    );
  };
  pathData = (data) => {
    var items = [];
    if (data && data.length) {
      data.map((item, key) => {
        items.push(<Tag color="blue" key={key + 10}>{item.protocol} : {item.number} : {item.name}</Tag>);
      });
    }
    return (
      <div>
        {items}
      </div>
    );
  };

  render() {
    const { list, loading, page, namespaces, dispatch } = this.props;
    const namespacesMap = [];
    if (namespaces && namespaces.length > 0) {
      namespaces.map((item, key) => {
        namespacesMap[item.name_en] = item.name;
      });
    }

    const that = this;
    const namespaceSelectPros = {
      onOk(value) {
        dispatch({
          type: 'serviceentry/list',
          payload: {
            'namespace': value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };

    const onShowSizeChange = (current) => {
      dispatch({
        type: 'serviceentry/list',
        payload: {
          'p': current,
          'namespace': this.state.defaultNamespace,
        },
      });
    };
    const pullEgress = () => {
      dispatch({
        type: 'serviceentry/entryPull',
        payload: {
          'namespace': this.state.defaultNamespace,
        },
      });
    };

    const extraContent = (
      <div>
        <Button type="primary" ghost style={{ width: '140px', marginRight: 25 }} onClick={this.onAdd}>
          <Icon type="plus"/> 创建出口网关
        </Button>
        <Button style={{ marginRight: 20 }} onClick={pullEgress}>更新</Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros}/>
      </div>
    );
    const columns = [{
      title: 'name',
      key: 'name',
      dataIndex: 'name',
    }, {
      title: 'namespace',
      key: 'namespace',
      dataIndex: 'namespace',
    }, {
      title: 'hosts',
      key: 'hosts',
      render: (text, record) => {
        return this.serviceData(text.hosts);
      },
    }, {
      title: 'ports',
      key: 'ports',
      render: (text, record) => {
        return this.pathData(text.ports);
      },
    }, {
      title: 'address',
      key: 'addresses',
      render: (text, record) => {
        return this.serviceData(text.addresses);
      },
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a key={text.id + 100} onClick={() => this.onEdit(text.name, text.namespace)}><Icon
            type="edit"/></a>
        </span>
      ),
    }];
    return (
      <PageHeaderLayout>
        <Card title="出口网关" extra={extraContent}>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination style={{ marginTop: 20, float: 'right' }}
                      title=""
                      current={page ? page.page : 0}
                      defaultCurrent={page.page}
                      total={page.total}
                      pageSize={page.pageSize}
                      showTotal={total => `共 ${page.total} 条数据`}
                      onChange={onShowSizeChange}/>

        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ serviceentry, user }) => ({
  list: serviceentry.list,
  loading: serviceentry.loading,
  namespaces: user.namespaces,
  page: serviceentry.page,
}))(ServiceEntryList);
