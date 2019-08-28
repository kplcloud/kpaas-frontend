import React from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Breadcrumb, List, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import ConsulEdit from '../../../components/Conf/ConsulEdit';

const { Description } = DescriptionList;

class KVDetail extends React.PureComponent {

  state = {
    prefixData: [],
    prefixStr: '',
    showPrefix: '',
  };

  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    if (params && ('name' in params) && params.name !== '' && params.namespace !== '') {
      this.setState({
        prefixData: [params.namespace + '.' + params.name],
        prefixStr: params.namespace + '.' + params.name + '/',
      });
      dispatch({
        type: 'consul/KVList',
        payload: {
          'name': params.name,
          'namespace': params.namespace,
        },
      });
    }
  }

  clickPrefix = (value) => {
    const { prefixData, prefixStr } = this.state;
    const { dispatch, match: { params } } = this.props;
    this.setState({ showPrefix: '' });
    if (prefixStr.indexOf(value) === 0) {
      this.setState({
        prefixData: [params.namespace + '.' + params.name],
        prefixStr: params.namespace + '.' + params.name + '/',
      });
      dispatch({
        type: 'consul/KVList',
        payload: {
          name: params.name,
          namespace: params.namespace,
          prefix: params.namespace + '.' + params.name + '/',
        },
      });
    } else if (prefixStr.indexOf(value) > 0) {
      var data = [];
      var preStr = '';
      for (var i in prefixData) {
        if (prefixData[i] === value) {
          data.push(prefixData[i]);
          preStr += prefixData[i] + '/';
          break;
        }
        preStr += prefixData[i] + '/';
        data.push(prefixData[i]);
      }
      this.setState({ prefixData: data, prefixStr: preStr });
      dispatch({
        type: 'consul/KVList',
        payload: {
          name: params.name,
          namespace: params.namespace,
          prefix: preStr,
        },
      });
    }

  };

  addKV = () => {
    this.setState({ showPrefix: '' });
  };

  render() {
    const { match, consul: { kvList, kvData, loading }, dispatch } = this.props;
    const { params } = match;
    const { prefixStr, prefixData } = this.state;
    const that = this;
    const description = (
      <DescriptionList size='small' col='2'>
        <Description term='名称'>{params.name}</Description>
        <Description term='命名空间'>{params.namespace}</Description>
      </DescriptionList>
    );

    const titleDetail = () => {
      const params = [];
      prefixData.map((k) => {
        params.push(<Breadcrumb.Item key={k}><a onClick={() => this.clickPrefix(k)}>{k}</a></Breadcrumb.Item>);
      });
      params.push(<Breadcrumb.Item key="0"><Icon type="plus" onClick={() => this.addKV()}/></Breadcrumb.Item>);
      return <Breadcrumb>{params}</Breadcrumb>;
    };

    const onClickPrefix = (value) => {
      if (value && value.indexOf('/') !== -1) {
        const d = prefixData;
        d.push(value.substring(0, value.length - 1));
        this.setState({ prefixStr: prefixStr + value, prefixData: d, showPrefix: '' });
        dispatch({
          type: 'consul/KVList',
          payload: {
            name: params.name,
            namespace: params.namespace,
            prefix: prefixStr + value,
          },
        });
      } else {
        //@todo 设置背景颜色&& 获取详情
        this.setState({ showPrefix: value });
        dispatch({
          type: 'consul/KVDetail',
          payload: {
            name: params.name,
            namespace: params.namespace,
            prefix: prefixStr + value,
          },
        });
      }
    };
    const itemTitle = (value) => {
      return <a onClick={() => onClickPrefix(value)}><h3>{value}</h3></a>;
    };
    const itemColor = (value) => {
      if (value !== '' && this.state.showPrefix !== '' && value === this.state.showPrefix) {
        return '#a8f18f';
      }
      return '#ffffff';
    };
    const submitCreate = (key, value) => {
      dispatch({
        type: 'consul/KVCreate',
        payload: {
          name: params.name,
          namespace: params.namespace,
          prefix: this.state.prefixStr,
          key: key,
          value: value,
        },
      });
    };
    const submitDelete = (key, filder) => {
      if (filder === true) {
        if (key.length === key.indexOf('/') + 1) {
          message.error('抱歉，您没有权限删除根目录~');
          return;
        }
      }
      dispatch({
        type: 'consul/KVDelete',
        payload: {
          name: params.name,
          namespace: params.namespace,
          prefixStr: filder ? key : this.state.prefixStr,
          prefix: key,
          filder: filder ? '1' : '0',
        },
      });

    };
    // #de5fa5
    return (
      <PageHeaderLayout content={description} title={params.namespace + '.' + params.name + '  K/V 详情'}>
        <Row gutter={16}>
          <Col span={10}>
            <Card title={titleDetail()} bordered={false} bodyStyle={{ margin: 0, padding: 0 }} type="inner">
              {kvList && kvList.detail && (
                <List
                  style={{ height: 420, overflow: 'auto' }}
                  dataSource={kvList.detail}
                  loading={loading}
                  renderItem={(item) => (
                    <List.Item key={item} style={{ backgroundColor: itemColor(item) }}>
                      <List.Item.Meta style={{ marginLeft: 20 }} title={itemTitle(item)}/>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
          <Col span={14}>
            {this.state.showPrefix && kvData && (
              <ConsulEdit
                {...{
                  key: kvData.key,
                  title: kvData.key,
                  value: kvData.value,
                  deleteKey: kvData.key,
                  showPrefix: this.state.showPrefix,
                  prefix: this.state.prefixStr + this.state.showPrefix,
                  onCancel() {
                    that.setState({ showPrefix: '' });
                  },
                  onOk(v) {
                    submitCreate(kvData.key, v);
                  },
                  onDelete() {
                    submitDelete(kvData.key, false);
                  },
                }}
              />
            )}
            {this.state.showPrefix === '' && (
              <ConsulEdit
                {...{
                  showPrefix: '',
                  prefix: this.state.prefixStr,
                  deleteKey: prefixStr,
                  onSubmit(key, value) {
                    submitCreate(key, value);
                  },
                  onDeleteFilder() {
                    submitDelete(prefixStr, true);
                  },
                }}
              />
            )}


          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, consul }) => ({
  consul,
  namespaces: user.namespaces,
}))(KVDetail);
