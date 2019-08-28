/**
 * Created by huyunting on 2018/5/17.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import { Button, Card, Table, Icon, Pagination, Input, Tag, Popconfirm, Badge } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const Search = Input.Search;

class WebhookList extends PureComponent {
  state = {
    name: '',
    defaultNamespace: '',
  };

  componentWillMount() {
    const namespace = Cookie.get('namespace');
    this.setState({ defaultNamespace: namespace });
    this.props.dispatch({
      type: 'webhook/listNoApp',
      payload: {},
    });
  }

  onAdd = () => {
    this.props.dispatch(routerRedux.push(`/conf/webhook/create`));
  };
  onUpdate = (id) => {
    this.props.dispatch(routerRedux.push(`/conf/webhook/edit/${id}`));
  };

  render() {
    const { dispatch, webhook: { list, page, loading } } = this.props;
    const searchChange = (value) => {
      this.setState({
        name: value,
      });
      dispatch({
        type: 'webhook/listNoApp',
        payload: {
          'name': value,
        },
      });
    };
    const columns = [{
      title: '名称',
      key: 'name',
      render: (text) => (
        <span>
          <a key={text.id}>{text.name}</a>
        </span>
      ),
    }, {
      title: 'target',
      key: 'target',
      render: (text) => (
        <Tag color={text.target === 'global' ? 'green' : 'blue'}>{text.target}</Tag>
      ),
    }, {
      title: '请求地址',
      key: 'url',
      render: (text) => (
        <span>
          {text.url}
        </span>
      ),
    }, {
      title: 'token',
      key: 'token',
      render: (text) => (
        <span>{text.token ? text.token : ''}</span>
      ),
    }, {
      title: '事件',
      key: 'event',
      render: (text) => (
        <span>
          {eventsTags(text.events)}
        </span>
      ),
    }, {
      title: '启用状态',
      key: 'status',
      render: (text) => (
        <Badge status={text.status === 1 ? 'success' : 'default'} text={text.status === 1 ? '激活' : '关闭'}/>
      ),
    }, {
      title: '创建者',
      key: 'action',
      render: (text) => (
        <span>
          {text.auther.username}
        </span>
      ),
    }, {
      title: '更改时间',
      key: 'UpdatedAt',
      render: (text) => (
        <span>{moment(text.UpdatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    }, {
      title: '操作',
      key: 'action',
      render: (text) => (
        <span>
          <a key={`action_${text.id}`} onClick={() => this.onUpdate(text.id)}>编辑 </a>
        </span>
      ),
    }];
    const eventsTags = (events) => {
      const tags = [];
      for (var i = 0; i < events.length; i++) {
        tags.push(<Tag key={i + events[i].name}>{events[i].name}</Tag>);
      }
      return <span>{tags}</span>;
    };
    const onShowSizeChange = (current) => {
      dispatch({
        type: 'webhook/listNoApp',
        payload: {
          'p': current,
          'namespace': this.state.defaultNamespace,
          'name': this.state.name,
        },
      });
    };
    const extraContent = (
      <div>
        <Button type="primary" ghost style={{ width: '220px', marginRight: '20px' }} onClick={this.onAdd}>
          <Icon type="plus"/> 添加 WebHook
        </Button>
        <Search
          style={{ width: '200px', marginLeft: '20px' }}
          placeholder="搜索webhook名称..."
          onSearch={value => searchChange(value)}
          enterButton
        />
      </div>
    );
    const pageContent = (
      <span>
        <p>Webhook，也就是人们常说的钩子,是一个很有用的工具，通过定制 Webhook 来监测你在 Kplcloud 上的各种事件，最常见的莫过于 Build 事件。<br/>
        如果设置了一个监测 Build 事件的 Webhook，那么每当你的这个项目有了构建操作，这个 Webhook 都会被触发，这时 Kplcloud 就会发送一个 HTTP POST 请求到你配置好的地址。
        </p>
      </span>
    );
    return (
      <PageHeaderLayout title="webhooks" content={pageContent}>
        <Card title="webhooks 列表" extra={extraContent}>
          <Table columns={columns} dataSource={list} loading={loading} pagination={false}/>
          <Pagination
            style={{ marginTop: 20, float: 'right' }}
            title=""
            current={page ? page.page : 0}
            defaultCurrent={page.page}
            total={page.total}
            pageSize={page.pageSize}
            showTotal={total => `共 ${page.total} 条数据`}
            onChange={onShowSizeChange}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ webhook }) => ({
  webhook,
}))(WebhookList);
