import React from 'react';
import { connect } from 'dva';
import { Button, Card, Pagination, Table, Icon, Tag, Badge, Popconfirm, message } from 'antd';
import AddWebhookModal from '../../Conf/Webhook/addWebhookModal';

class Webhooks extends React.PureComponent {
  componentWillMount() {
    const { dispatch, project } = this.props;
    if (project && project.name) {
      dispatch({
        type: 'webhook/list',
        payload: {
          'app_name': project.name,
          'namespace': project.namespace,
        },
      });
    }
  }

  render() {
    const { webhook: { list, page, loading }, dispatch, project: { name, namespace } } = this.props;
    const columns = [{
      title: '名称',
      key: 'name',
      render: (text, record) => (
        <span>
          <a key={text.id} onClick={() => showDetail(text.id, text.app_name, text.namespace)}>{text.name}</a>
        </span>
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
      title: 'Token',
      key: 'token',
      render: (text) => (
        <span>{text.token}</span>
      ),
    }, {
      title: '事件',
      key: 'action',
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
      render: (text) => (
        <span>
          {text && text.auther && text.auther.username}
        </span>
      ),
    }, {
      title: '操作',
      render: (text) => (
        <Popconfirm
          title="确定要为当前 webhook 发送一条数据?"
          onConfirm={() => {
            this.props.dispatch({
              type: 'webhook/webhookTest',
              payload: {
                namespace: namespace,
                name: name,
                id: text.id,
              },
            });
          }}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">测试</a>
        </Popconfirm>
      ),
    }];
    const eventsTags = (events) => {
      const tags = [];
      for (var i = 0; i < events.length; i++) {
        tags.push(<Tag key={i}>{events[i].name}</Tag>);
      }
      return <span>{tags}</span>;
    };
    const onShowSizeChange = (current) => {
      dispatch({
        type: 'webhook/list',
        payload: {
          'p': current,
          'app_name': name,
          'namespace': namespace,
        },
      });
    };
    const showModal = () => {
      dispatch({
        type: 'webhook/changeModal',
        payload: {
          visible: true,
          editStatus: false,
        },
      });
    };
    const showDetail = (id, name, namespace) => {
      dispatch({
        type: 'webhook/detail',
        payload: {
          id: id,
          app_name: name,
          namespace: namespace,
        },
      });
      dispatch({
        type: 'webhook/changeModal',
        payload: {
          visible: true,
          editStatus: true,
        },
      });
    };
    return (
      <div>
        <Card
          key="detail"
          title="Webhooks"
          style={{ marginBottom: 24 }}
          bordered={false}
          extra={(<Button onClick={showModal} type="primary" ghost><Icon type="plus"/>创建</Button>)}
        >
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
        <AddWebhookModal {...{ appName: name, namespace: namespace }}/>
      </div>

    );

  }
}

export default connect(({ webhook }) => ({
  webhook,
}))(Webhooks);
