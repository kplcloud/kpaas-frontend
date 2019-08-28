/**
 * Created by huyunting on 2018/6/4.
 */
import React from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { message, Form, Input, Button, Card, Select, Icon, Col, InputNumber, Radio } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

let addStatus = {
  'service': {
    uuid: 0,
    uuidAddStatus: false,
  },
};

@Form.create()
class Add extends React.PureComponent {
  state = {
    namespace: '',
    type: 'http',
    editType: false,
  };

  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    const namespace = Cookie.get('namespace');
    if (params && params.namespace && params.name) {
      this.setState({ editType: true });
      dispatch({
        type: 'gateway/one',
        payload: {
          'namespace': params.namespace,
          'name': params.name,
        },
      });
    }
    this.setState({
      namespace: namespace,
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });
    this.add('service');
  };

  componentWillUnmount() {
    addStatus = {
      'service': {
        uuid: 0,
        uuidAddStatus: false,
      },
    };
    this.props.dispatch({
      type: 'gateway/clearOne',
    });
  };

  changeType = (e) => {
    this.setState({ type: e.target.value });
  };
  changeNamespace = (value) => {
    this.setState({ namespace: value });
  };
  add = (key, data) => {
    if (data && addStatus[key].uuidAddStatus) return;
    const { form } = this.props;
    let uuid = addStatus[key].uuid;
    var keys = form.getFieldValue(key);
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    let nextKeys = [];
    if (data) {
      data.map(() => {
        nextKeys = keys.concat(uuid);
        keys = nextKeys;
        addStatus[key].uuid = uuid + 1;
        uuid += 1;
      });
      addStatus[key].uuidAddStatus = true;
    } else {
      nextKeys = keys.concat(uuid);
      addStatus[key].uuid = uuid + 1;
    }

    if (key === 'service') {
      form.setFieldsValue({
        service: nextKeys,
      });
    }

  };

  remove = (k, keyStr) => {
    const { form } = this.props;
    var keys = form.getFieldValue(keyStr);
    if (keys.length === 1) {
      return;
    }
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    if (keyStr === 'service') {
      form.setFieldsValue({
        service: keys.filter(key => key !== k),
      });
    }
  };


  render() {
    const { form, namespaces, btnLoading, gateway: { detail } } = this.props;
    const { editType, type } = this.state;
    if (editType && detail && detail.spec && detail.spec.servers && detail.spec.servers[0].hosts) {
      this.add('service', detail.spec.servers[0].hosts);
    }
    const { validateFields, getFieldDecorator, getFieldValue, resetFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const params = [];
          const serviceData = [];
          if (values.servicedata && values.servicedata.length) {
            values.servicedata.map((item) => {
              if (serviceData && serviceData.indexOf(item) !== -1) {
                message.error(`service: ${item} 有重复`);
              }
              if (item !== '') {
                serviceData.push(item);
              }
            });
          }
          if (serviceData.length === 0) {
            message.error('请填写网关Host~');
            return;
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.port = values.ports;
          params.hosts = serviceData;
          if (editType) {
            params.type = 'edit';
            this.props.dispatch({
              type: 'gateway/create',
              payload: params,
            });
          } else {
            this.props.dispatch({
              type: 'gateway/create',
              payload: params,
            });
          }
        } else {
          if (err.ports) {
            message.error('端口名称必须是英文字母开头 且仅包含字母数组-_');
          } else {
            message.error('请填写完整参数');
          }
        }
        resetFields();
      });
    };

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name}>{item.display_name}</Option>);
        });
      }
      return items;
    };

    const onReturn = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/security/gateway/list'));
    };


    getFieldDecorator('service', { initialValue: [] });
    const services = getFieldValue('service');
    var serviceItem = [];
    if (services && services.length > 0) {
      serviceItem = services.map((k) => {
        return (
          <span key={`service-${k}`}>
            <FormItem hasFeedback help="例如(*.kpl.nsini.idc | *.kpl.nsini.com)">
              {getFieldDecorator(`servicedata[${k}]`, {
                initialValue: editType && detail && detail.spec && detail.spec.servers[0].hosts && detail.spec.servers[0].hosts[k] ? detail.spec.servers[0].hosts[k] : '',
              })(<Input rows={4} placeholder="请填写网关host" style={{ width: '89%', marginRight: '10px' }}/>)}
              <Icon
                type="plus-circle-o"
                onClick={() => this.add('service')}
                style={{ marginRight: '10px' }}
              />
              {services.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={services.length === 1}
                  onClick={() => this.remove(k, 'service')}
                />
              ) : null}
            </FormItem>
          </span>
        );
      });
    }

    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          title={this.state.editType ? '修改 大网关' : '添加 大网关'}
          style={{ marginTop: 16 }}
        >
          <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 600, marginLeft: 200 }}>
            {!this.state.editType && (
              <FormItem
                {...formItemLayout}
                label="类型 "
                hasFeedback
              >
                {getFieldDecorator('type', {
                  initialValue: 'http',
                })(
                  <Radio.Group disabled={editType} onChange={this.changeType} hidden>
                    <Radio value="http">HTTP</Radio>
                    <Radio value="grpc">gRPC</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
            )}
            <FormItem
              {...formItemLayout}
              label="命名空间 "
              hasFeedback
            >
              {getFieldDecorator('namespace', {
                initialValue: editType && detail && detail.metadata && detail.metadata.namespace ? detail.metadata.namespace : this.state.namespace,
                rules: [
                  { required: true, message: '请选择所属命名空间...' },
                ],
              })(
                <Select placeholder="请选择所属命名空间..." disabled={editType} onChange={this.changeNamespace}>
                  {namespaces && optionData()}
                </Select>,
              )}
            </FormItem>
            <FormItem label="网关名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: editType ? (detail && detail.metadata && detail.metadata.name ? detail.metadata.name : '') : (this.state.type === 'grpc' ? this.state.namespace + '-grpc-gateway' : this.state.namespace + '-gateway'),
              })(
                <Input placeholder="请输入名称..." disabled/>,
              )}
            </FormItem>
            <FormItem label="网关Host" hasFeedback {...formItemLayout} >
              {serviceItem}
            </FormItem>
            <FormItem label="端口及协议" hasFeedback {...formItemLayout}>
              <Col span={5}>
                <FormItem hasFeedback {...formItemLayout} help="端口号">
                  {getFieldDecorator(`ports['number']`, {
                    initialValue: editType ? (detail && detail.spec && detail.spec.servers && detail.spec.servers[0] && detail.spec.servers[0].port && detail.spec.servers[0] && detail.spec.servers[0].port.number ? detail.spec.servers[0].port.number : '') : (type === 'grpc' ? 50051 : 80),
                  })(
                    <InputNumber
                      placeholder="端口号: 0 ~ 65535之间"
                      max={65535}
                    />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem hasFeedback {...formItemLayout} help='端口名称'>
                  {getFieldDecorator(`ports['name']`, {
                    initialValue: editType ? (detail && detail.spec && detail.spec.servers && detail.spec.servers[0] && detail.spec.servers[0].port && detail.spec.servers[0] && detail.spec.servers[0].port.name ? detail.spec.servers[0].port.name : '') : type + '-' + (type === 'grpc' ? 50051 : 80),
                    rules: [
                      {
                        pattern: `^[a-zA-Z][-_a-zA-Z0-9]*$`,
                        message: '端口名称必须是英文字母开头 且仅包含字母数组-_',
                      },
                    ],
                  })(
                    <Input placeholder="端口名称..."/>,
                  )}
                </FormItem>
              </Col>
              <Col span={8} style={{ marginLeft: 10, marginRight: 10 }}>
                <FormItem hasFeedback {...formItemLayout} help='protocol:HTTP/GRPC'>
                  {getFieldDecorator(`ports['protocol']`, {
                    initialValue: editType ? (detail && detail.spec && detail.spec.servers && detail.spec.servers[0] && detail.spec.servers[0].port && detail.spec.servers[0] && detail.spec.servers[0].port.protocol ? detail.spec.servers[0].port.protocol : '') : type.toUpperCase(),
                  })(
                    <Input placeholder="protocol: http/grpc"/>,
                  )}
                </FormItem>
              </Col>
            </FormItem>
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >

              <br/>
              <Button onClick={onReturn}>取消</Button>
              <Button
                type="primary"
                onClick={onValidateForm}
                loading={btnLoading}
                style={{ marginRight: 120, float: 'right' }}
              >
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>


      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, gateway }) => ({
  namespaces: user.namespaces,
  gateway,
}))(Add);
