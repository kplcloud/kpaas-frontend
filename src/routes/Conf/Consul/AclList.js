import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Link, routerRedux } from 'dva/router';
import { Button, Card, Table, Icon, Pagination, Input, Tag, Popconfirm, Modal, Divider, Select } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';

const confirm = Modal.confirm;
const Search = Input.Search;
const { Option, OptGroup } = Select;


class AclList extends PureComponent {
  state = {
    name: '',
    defaultNamespace: '',
    group: '',
  };

  componentWillMount() {
    const ns = Cookie.get('namespace');
    this.setState({ defaultNamespace: ns });
  }

  componentDidMount() {
    const ns = Cookie.get('namespace');
    const { dispatch } = this.props;
    dispatch({
      type: 'consul/AclList',
      payload: {
        'namespace': ns,
      },
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });
    dispatch({
      type: 'group/ownergrouplist',
      payload: {
        'ns': ns,
      },
    });
  }

  onUpdate = (name, ns) => {
    this.props.dispatch(routerRedux.push(`/conf/consul/acl/` + ns + `/edit/` + name));
  };

  onDetail = (name, ns) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/conf/consul/acl/` + ns + `/detail/` + name));
  };

  onKVDetail = (name, ns) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/conf/consul/kv/` + ns + `/detail/` + name));
  };

  onAdd = () => {
    this.props.dispatch(routerRedux.push(`/conf/consul/acl/edit`));
  };


  showConfirm = (ns, name) => {
    const { dispatch } = this.props;
    confirm({
      title: ' 您确定要删除这个权限?',
      content: '一旦删除改权限使用该Token的服务将无法访问consul',
      onOk() {
        dispatch({
          type: 'consul/ACLDelete',
          payload: {
            name: name,
            namespace: ns,
          },
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  searchOnChange = e => {
    const { value } = e.target;
    this.setState({
      name: value,
    });
  };

  render() {
    const { namespaces, dispatch, consul: { list, AclPage, loading },ownergrouplist } = this.props;
    const namespacesMap = [];
    const that = this;
    if (namespaces && namespaces.length > 0) {
      namespaces.map((item, key) => {
        namespacesMap[item.name_en] = item.name;
      });
    }
    const namespace = (name) => {
      if (namespacesMap) {
        return namespacesMap[name];
      }
      return '';
    };
    const clearGroup = (value) => {
      this.setState({
        group: '',
        defaultNamespace: value,
      });
      dispatch({
        type: 'group/ownergrouplist',
        payload: {
          'ns': value,
        },
      });
    };
    const namespaceSelectPros = {
      disabledStatus: false,
      onOk(value) {
        dispatch({
          type: 'consul/AclList',
          payload: {
            'namespace': value,
            'name': that.state.name,
          },
        }).then(() => {
          clearGroup(value)
        });
      },
    };
    const searchChange = (value) => {
      this.setState({
        name: value,
      });
      dispatch({
        type: 'consul/AclList',
        payload: {
          'namespace': this.state.defaultNamespace,
          'name': value,
          'group': this.state.group,
        },
      });
    };

    const groupOption = () => {
      const options = [];
      if (ownergrouplist.length) {
        ownergrouplist.map((item, key) => options.push(
          <Option
            value={`${item.id}`}
            key={`${item.id}`}
          >{item.name}
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
    const groupChange = (value) => {
      const v = value === undefined ? '' : value;
      this.setState({
        group: v,
      });
      const nss = Cookie.get("namespace");

      dispatch({
        type: 'consul/AclList',
        payload: {
          "namespace": nss,
          "group":value,
          'name': this.state.name,
        },
      })

    };

    const extraContent = (
      <div>
        <Button type="primary" ghost style={{ width: '120px', marginRight: '20px' }} onClick={this.onAdd}>
          <Icon type="plus"/> 添加ACL
        </Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros} />
        <Select
          value={`${this.state.group ? this.state.group : '请选择组'}`}
          showSearch
          style={{ width: 150 ,marginLeft: '16px'}}
          placeholder="请选择组"
          onChange={groupChange}
          allowClear
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
          style={{ width: '200px', marginLeft: '20px' }}
          placeholder="搜索ACL名称..."
          onSearch={value => searchChange(value)}
          onChange={this.searchOnChange}
          enterButton
        />
      </div>
    );
    const columns = [{
      title: '名称',
      key: 'name',
      render: (text) => (
        <span>
          <a key={text.id} onClick={() => this.onDetail(text.name, text.namespace)}>{text.name}</a>
        </span>
      ),
    }, {
      title: '命名空间',
      key: 'namespace',
      render: (text) => (
        <span>{namespace(text.namespace)}</span>
      ),
    }, {
      title: 'type',
      key: 'type',
      render: (text) => (
        <Tag color={text.type === 'client' ? 'green' : 'gold'}>{text.type}</Tag>
      ),

    }, {
      title: 'token',
      key: 'token',
      render: (text) => (
        <a onClick={() => this.onKVDetail(text.name, text.namespace)}>{text.token}</a>
      ),

    }, {
      title: '操作',
      key: 'action',
      render: (text) => (
        <span>
          <a key={text.id + 100} onClick={() => this.onUpdate(text.name, text.namespace)}>编辑 </a> |
           <a key={text.id + 1000} onClick={() => this.showConfirm(text.namespace, text.name)}> 删除 </a>
        </span>
      ),
    }];
    const onShowSizeChange = (current) => {
      dispatch({
        type: 'consul/AclList',
        payload: {
          'p': current,
          'namespace': this.state.defaultNamespace,
          'name': this.state.name,
        },
      });
    };
    return (
      <PageHeaderLayout title={'Consul ACL '}>
        <Card title="Consul ACL 列表" extra={extraContent}>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination
            style={{ marginTop: 20, float: 'right' }}
            title=""
            current={AclPage ? AclPage.page : 0}
            defaultCurrent={AclPage.page}
            total={AclPage.total}
            pageSize={AclPage.pageSize}
            showTotal={() => `共 ${AclPage.total} 条数据`}
            onChange={onShowSizeChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, consul, group }) => ({
  namespaces: user.namespaces,
  consul,
  page: consul.AclPage,
  ownergrouplist: group.ownergrouplist,
}))(AclList);
