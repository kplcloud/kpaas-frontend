/**
 * Created by huyunting on 2018/6/4.
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { message, Form, Input, Button, Card, Select, Icon, Col, InputNumber } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';

const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

let addStatus = {
  'port': {
    uuid: 0,
    uuidAddStatus: false,
  },
  'address': {
    uuid: 0,
    uuidAddStatus: false,
  },
  'service': {
    uuid: 0,
    uuidAddStatus: false,
  },
};

@Form.create()
class AddServiceEntry extends React.PureComponent {
  state = {
    id: 0,
    name: '添加 出口网关',
    namespace: '',
    dataNum: 1,
    serviceNum: 1,
    addressNum: 1,
    editType: false,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const namespace = Cookie.get('namespace');
    if (match.params && match.params.namespace && match.params.name) {
      this.setState({ editType: true, name: '修改 出口网关' });
      dispatch({
        type: 'serviceentry/one',
        payload: {
          'namespace': match.params.namespace,
          'name': match.params.name,
        },
      });
    }
    this.setState({
      namespace: namespace,
    });
    dispatch({
      type: 'conf/list',
      payload: {
        'namespace': namespace,
      },
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });
    this.add('port');
    this.add('address');
    this.add('service');
  };

  componentWillUnmount() {
    addStatus = {
      'port': {
        uuid: 0,
        uuidAddStatus: false,
      },
      'address': {
        uuid: 0,
        uuidAddStatus: false,
      },
      'service': {
        uuid: 0,
        uuidAddStatus: false,
      },
    };
    this.props.dispatch({
      type: 'serviceentry/clearEgress',
    });
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
    if (key === 'port') {
      form.setFieldsValue({
        port: nextKeys,
      });
    } else if (key === 'address') {
      form.setFieldsValue({
        address: nextKeys,
      });
    } else if (key === 'service') {
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

    if (keyStr === 'port') {
      form.setFieldsValue({
        port: keys.filter(key => key !== k),
      });
    } else if (keyStr === 'address') {
      form.setFieldsValue({
        address: keys.filter(key => key !== k),
      });
    } else if (keyStr === 'service') {
      form.setFieldsValue({
        service: keys.filter(key => key !== k),
      });
    }
  };

  addData = () => {
    if (this.state.dataNum >= 15) {
      message.error('您添加的数据太多了~');
      return;
    }
    this.setState({ dataNum: this.state.dataNum + 1 });
  };
  addService = () => {
    if (this.state.serviceNum >= 15) {
      message.error('您添加的数据太多了~');
      return;
    }
    this.setState({ serviceNum: this.state.serviceNum + 1 });
  };
  addAddress = () => {
    if (this.state.addressNum >= 15) {
      message.error('您添加的数据太多了~');
      return;
    }
    this.setState({ addressNum: this.state.addressNum + 1 });
  };


  render() {
    const { form, namespaces, btnLoading, serviceentryData } = this.props;
    const { metadata, spec } = serviceentryData;
    const { name, namespace } = metadata ? metadata : { name: '', namespace: '' };
    const { addresses, hosts, ports } = spec ? spec : { addresses: [], hosts: [], ports: [] };
    const { editType } = this.state;
    // const {ports, name, namespace, hosts, addresses} = serviceentryData;
    if (ports && ports.length > 0) {
      this.add('port', ports);
    }
    if (hosts && hosts.length > 0) {
      this.add('service', hosts);
    }
    if (addresses && addresses.length > 0) {
      this.add('address', addresses);
    }
    const { validateFields, getFieldDecorator, getFieldValue, resetFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const params = [];
          const portsData = [];
          const serviceData = [];
          const addressData = [];

          const checkPorts = [];
          const checkPortName = [];
          let checkparams = true;
          if (values.ports && values.ports.length) {
            values.ports.map((item) => {
              if (item.number && item.name && item.protocol) {
                item.protocol = item.protocol.toUpperCase();
                portsData.push(item);
                if (checkPorts && checkPorts.indexOf(item.number) !== -1) {
                  message.error(`端口：${item.number} 有重复`);
                  checkparams = false;
                  return;
                }
                if (checkPortName && checkPortName.indexOf(item.name) !== -1) {
                  message.error(`端口名称：${item.name} 有重复`);
                  checkparams = false;
                  return;
                }
                checkPorts.push(item.number);
                checkPortName.push(item.name);
              }
            });
          }

          if (values.servicedata && values.servicedata.length) {
            values.servicedata.map((item) => {
              if (serviceData && serviceData.indexOf(item) !== -1) {
                message.error(`service: ${item} 有重复`);
                checkparams = false;
              }
              if (item) {
                serviceData.push(item);
              }
            });
          }
          if (serviceData.length === 0) {
            message.error('service为必填项~');
            return;
          }
          if (portsData.length === 0) {
            message.error('端口及协议为必填项');
            return;
          }
          if (values.addressData && values.addressData.length) {
            values.addressData.map((item) => {
              if (item) {
                addressData.push(item);
              }
            });
          }
          if (!checkparams) return;
          params.name = values.name;
          params.namespace = values.namespace;
          params.domain = serviceData;
          params.ports = portsData;
          params.timeout = values.timeout ? values.timeout : 30;
          params.retries = values.retries ? values.retries : 12;
          params.pretimeout = values.pretimeout ? values.pretimeout : 5;
          params.addresses = addressData;

          if (editType) {
            this.props.dispatch({
              type: 'serviceentry/update',
              payload: params,
            });
          } else {
            this.props.dispatch({
              type: 'serviceentry/add',
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
        // resetFields();
      });
    };

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name_en}>{item.name}</Option>);
        });
      }
      return items;
    };

    const onReturn = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/security/service/entry/list'));
    };


    getFieldDecorator('port', { initialValue: [] });
    getFieldDecorator('address', { initialValue: [] });
    getFieldDecorator('service', { initialValue: [] });
    const port = getFieldValue('port');
    const address = getFieldValue('address');
    const services = getFieldValue('service');
    var serviceItem = [];
    if (services && services.length > 0) {
      serviceItem = services.map((k) => {
        return (
          <span key={`service-${k}`}>
            <FormItem label="域名/IP" hasFeedback {...formItemLayout} >
              {getFieldDecorator(`servicedata[${k}]`, {
                initialValue: (hosts && editType) ? (hosts[k] ? hosts[k] : '') : '',
              })(<Input rows={4} placeholder="请填写出口域名/IP" style={{ width: '89%', marginRight: '10px' }}/>)}
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

    var addressItems = [];
    if (address && address.length > 0) {
      addressItems = address.map((k) => {
        return (
          <span key={`address-${k}`}>
            <FormItem label="address" hasFeedback {...formItemLayout}>
              {getFieldDecorator(`addressData[${k}]`, {
                initialValue: (addresses && editType) ? (addresses[k] ? addresses[k] : '') : '',
              })(<Input rows={4} placeholder="请输入address..." style={{ width: '89%', marginRight: 10 }}/>)}
              <Icon
                type="plus-circle-o"
                onClick={() => this.add('address')}
                style={{ marginRight: '10px' }}
              />
              {address.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={address.length === 1}
                  onClick={() => this.remove(k, 'address')}
                />
              ) : null}
            </FormItem>
          </span>
        );
      });
    }

    var items = [];
    if (port && port.length > 0) {
      items = port.map((i) => {
        return (
          <span key={`port-${i}`}>
            <FormItem label="端口及协议" hasFeedback {...formItemLayout}>
              <Col span={5}>
               {getFieldDecorator(`ports[${i}]['number']`, {
                 initialValue: (ports && editType) ? (ports[i] ? ports[i]['number'] : '') : '',
               })(
                 <InputNumber
                   placeholder="端口: 0 ~ 65535之间"
                   max={65535}
                 />)}
              </Col>
              <Col span={8}>
                {getFieldDecorator(`ports[${i}]['name']`, {
                  initialValue: (ports && editType) ? (ports[i] ? ports[i]['name'] : '') : '',
                  rules: [
                    {
                      pattern: `^[a-zA-Z][-_a-zA-Z0-9]*$`,
                      message: '端口名称必须是英文字母开头 且仅包含字母数组-_',
                    },
                  ],
                })(
                  <Input placeholder="端口名称..."/>,
                )}
              </Col>
              <Col span={8} style={{ marginLeft: 10, marginRight: 10 }}>
                {getFieldDecorator(`ports[${i}]['protocol']`, {
                  initialValue: (ports && editType) ? (ports[i] ? ports[i]['protocol'] : '') : '',
                })(
                  <Input placeholder="protal: http/grpc"/>,
                )}
              </Col>
              <Icon
                type="plus-circle-o"
                onClick={() => this.add('port')}
                style={{ marginRight: '10px' }}
              />
              {port.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={port.length === 1}
                  onClick={() => this.remove(i, 'port')}
                />
              ) : null}
            </FormItem>
          </span>
        );
      });
    }
    // var itemsLength = editType ? (ports ? this.state.dataNum + ports.length : this.state.dataNum) : this.state.dataNum;
    // for (var i = 1; i <= itemsLength; i++) {
    //   items.push(
    //     <div key={i}>
    //       <InputGroup>
    //         <Col span={5}>
    //           {getFieldDecorator(`ports[${i}]['number']`, {
    //             initialValue: (ports && editType) ? (ports[i - 1] ? ports[i - 1]['number'] : '') : '',
    //           })(
    //             <InputNumber
    //               placeholder="端口: 0 ~ 65535之间"
    //               max={65535}
    //             />)}
    //         </Col>
    //         <Col span={8}>
    //           {getFieldDecorator(`ports[${i}]['name']`, {
    //             initialValue: (ports && editType) ? (ports[i - 1] ? ports[i - 1]['name'] : '') : '',
    //             rules: [
    //               {
    //                 pattern: `^[a-zA-Z][-_a-zA-Z0-9]*$`,
    //                 message: 'host前缀仅支持字母、数字、-',
    //               },
    //             ],
    //           })(
    //             <Input placeholder="端口名称..."/>,
    //           )}
    //         </Col>
    //         <Col span={8}>
    //           {getFieldDecorator(`ports[${i}]['protocol']`, {
    //             initialValue: (ports && editType) ? (ports[i - 1] ? ports[i - 1]['protocol'] : '') : '',
    //           })(
    //             <Input placeholder="protal: http/grpc"/>,
    //           )}
    //         </Col>
    //         <Icon onClick={() => this.addData()} type="plus-circle-o"
    //               style={{ fontSize: 18, color: '#b3b199', marginTop: 7 }}/>
    //       </InputGroup>
    //       &nbsp;
    //     </div>,
    //   );
    // }

    return (
      <PageHeaderLayout>
        <a onClick={onReturn}>
          <Icon type="rollback"/>返回
        </a>
        <Card
          bordered={false}
          title={this.state.name}
          style={{ marginTop: 16 }}
        >
          <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 600, marginLeft: 200 }}>

            <FormItem
              {...formItemLayout}
              label="命名空间 "
              hasFeedback
            >
              {getFieldDecorator('namespace', {
                initialValue: editType ? (serviceentryData ? namespace : '') : this.state.namespace,
                rules: [
                  { required: true, message: '请选择所属命名空间...' },
                ],
              })(
                editType ? (
                  <Select placeholder="请选择所属命名空间..." disabled>
                    {namespaces && optionData()}
                  </Select>
                ) : (
                  <Select placeholder="请选择所属命名空间...">
                    {namespaces && optionData()}
                  </Select>
                ),
              )}
            </FormItem>
            <FormItem label="网关名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: (editType && serviceentryData) ? name : '',
                rules: [
                  { required: true, message: '请输入名称' },
                ],
              })(editType ? (
                <Input placeholder="请输入名称..." disabled={true}/>
              ) : (
                <Input placeholder="请输入名称..."/>
              ))}
            </FormItem>
            {serviceItem}
            {addressItems}
            {items}

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
              <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>


      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, conf, serviceentry }) => ({
  namespaces: user.namespaces,
  confMap: conf.list,
  serviceentryData: serviceentry.serviceentryData,
}))(AddServiceEntry);
