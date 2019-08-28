import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { Card, List, Tag, Divider, Button, Icon } from 'antd';
import Cookie from 'js-cookie';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;


class GateWayList extends PureComponent {

  componentWillMount() {
    const { dispatch } = this.props;
    const namespace = Cookie.get('namespace');
    dispatch({
      type: 'gateway/list',
      payload: {
        'namespace': namespace,
      },
    });
  }

  onAdd = () => {
    this.props.dispatch(routerRedux.push('/security/gateway/create'));
  };
  onEdit = (ns, name) => {
    this.props.dispatch(routerRedux.push(`/security/gateway/${ns}/update/${name}`));
  };

  render() {
    const { dispatch, gateway } = this.props;
    const { list, loading } = gateway;
    const that = this;
    const namespaceSelectPros = {
      onOk(value) {
        dispatch({
          type: 'gateway/list',
          payload: {
            'namespace': value,
          },
        });
        that.setState({ defaultNamespace: value });
      },
    };
    const tagContent = (data) => {
      const items = [];
      for (var key in data) {
        items.push(<Tag key={key}>{data[key]}</Tag>);
      }
      return items;
    };
    const portContent = (data) => {
      return (
        <div>
          <Tag>name - {data.name}</Tag>
          <Tag>number - {data.number}</Tag>
          <Tag>protocol - {data.protocol}</Tag>
        </div>
      );
    };
    const extraContent = (
      <div>
        <Button style={{ marginRight: 20 }} type="primary" ghost onClick={this.onAdd}><Icon type="plus"/>创建大网关</Button>
        业务空间：
        <NamespaceSelect {...namespaceSelectPros}/>
      </div>
    );
    const ListContent = (selector, servers) => {
      const items = [];
      servers.map((item, key) => {
        items.push(<div key={key}>
          <Divider style={{ margin: '40px 0 24px' }}/>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="host">{tagContent(item.hosts)}</Description>
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="port">{portContent(item.port)}</Description>
          </DescriptionList>

        </div>);
      });
      return (
        <div>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="istio"><Tag color="green">{selector ? selector.istio : ''}</Tag></Description>
          </DescriptionList>
          {items}
        </div>

      );
    };

    return (
      <PageHeaderLayout>
        <Card title="大网关" extra={extraContent} loading={loading}>
          {list && (
            <List
              rowKey="id"
              grid={{ gutter: 24, lg: 2, md: 2, sm: 1, xs: 1 }}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <Card
                    title={item.name}
                    type="inner"
                    extra={(<a onClick={() => this.onEdit(item.namespace, item.name)}>编辑</a>)}
                  >
                    {ListContent(item.selector, item.servers)}
                  </Card>
                </List.Item>
              )}
            />
          )}
          {!list && (<div style={{ width: '100%' }}>暂无数据</div>)}
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ gateway }) => ({
  gateway,
}))(GateWayList);
