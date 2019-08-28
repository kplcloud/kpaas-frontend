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

class IngressList extends PureComponent {
  state = {
    defaultNamespace: '',
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
      type: 'ingress/list',
      payload: {
        'namespace': namespace,
      },
    });
  }

  onDetail = (name, ns) => {
    this.props.dispatch(routerRedux.push(`/security/ingress/${ns}/detail/${name}`));
  };
  onEdit = (projectName, namespace) => {
    this.props.dispatch(routerRedux.push(`/security/ingress/edit/${namespace}/${projectName}`));
  };
  onAdd = () => {
    this.props.dispatch(routerRedux.push('/security/ingress/add'));
  };
  domainData = (data) => {
    var items = [];
    if (data && data.length > 0) {
      data.map((item, key) => {
        if (item && item.domain) {
          items.push(<Tag key={key}>{item.domain}</Tag>);
        }
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
    if (data && data.length > 0) {
      data.map((item) => {
        if (item.paths && item.paths.length > 0) {
          item.paths.map((childItem) => {
            if (childItem && childItem.path) {
              items.push(
                <Tag
                  color="blue"
                  key={'path' + parseInt(Math.random() * 10000, 10) + 1}
                >
                  {childItem.path}
                </Tag>,
              );
            } else if (childItem && !childItem.path) {
              items.push(<Tag color="blue" key={'path' + parseInt(Math.random() * 10000, 10) + 1}>/.*</Tag>);
            }

          });
        }
      });
    }
    return (
      <div>
        {items}
      </div>
    );
  };
  portsData = (data) => {
    var items = [];
    if (data && data.length > 0) {
      data.map((item) => {
        if (item.paths && item.paths.length > 0) {
          item.paths.map((childItem) => {
            if (childItem && childItem.port)
              items.push(
                <Tag
                  color="blue"
                  key={'port' + parseInt(Math.random() * 10000, 10) + 1}
                >
                  {childItem.port}
                </Tag>,
              );
          });
        }
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
          type: 'ingress/list',
          payload: {
            'namespace': value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };

    const onShowSizeChange = (current) => {
      dispatch({
        type: 'ingress/list',
        payload: {
          'p': current,
          'namespace': this.state.defaultNamespace,
        },
      });
    };

    const extraContent = (
      <div>
        <Button type="primary" ghost style={{ width: '120px', marginRight: '50px' }} onClick={this.onAdd}>
          <Icon type="plus"/> 创建API
        </Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros}/>
      </div>
    );
    const columns = [{
      title: '项目名称',
      key: 'projectName',
      render: (text) => (
        <span>
         <a key={text.id + 100} onClick={() => this.onDetail(text.projectName, text.namespace)}>
           {text.projectName}
        </a>
        </span>
      ),
    }, {
      title: 'domain',
      key: 'domain',
      render: (text) => {
        return this.domainData(text.spec);
      },
    }, {
      title: 'path',
      key: 'path',
      render: (text) => {
        return this.pathData(text.spec);
      },
    }, {
      title: '端口',
      key: 'ports',
      render: (text) => {
        return this.portsData(text.spec);
      },
    }, {
      title: '创建时间',
      key: 'createdAt',
      render: (text) => (
        <span>{moment(text.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text) => (
        <span>
          <a key={text.id + 100} onClick={() => this.onEdit(text.projectName, text.namespace)}>
            <Icon type="edit"/>
          </a>
        </span>
      ),
    }];
    return (
      <PageHeaderLayout title="入口/API s">
        <Card title="API s" extra={extraContent}>
          <Table loading={loading} columns={columns} rowKey="id" dataSource={list} pagination={false}/>
          <Pagination
            style={{ marginTop: 20, float: 'right' }}
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

export default connect(({ ingress, user }) => ({
  list: ingress.list,
  loading: ingress.loading,
  namespaces: user.namespaces,
  page: ingress.page,
}))(IngressList);
