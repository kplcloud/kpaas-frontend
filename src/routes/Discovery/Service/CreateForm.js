import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Icon,
  Select,
  Card,
  message,
  InputNumber,
  Tooltip,
  Radio,
} from 'antd';
import NamespaceSelect from '../../../components/Security/namespaceSelect';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};
let uuid = 0;
let addressUuid = 0;
let addressPorts = 0;
let uuidAddStatus = false;
let addressUuidStatus = false;
let addressPortsStatus = false;
@connect(({ services, project }) => ({
  list: services.list,
  loading: services.loading,
  detail: services.detail,
  projectList: project.projectList,
}))
@Form.create()
export default class CreateForm extends PureComponent {
  state = {
    defaultNamespace: '',
    resourceType: 'service',
  };

  componentDidMount() {
    this.addAddress();
    this.add();
    this.addAddressPorts();
  }

  componentWillUnmount() {
    uuid = 0;
    addressUuid = 0;
    addressPorts = 0;
    uuidAddStatus = false;
    addressUuidStatus = false;
    addressPortsStatus = false;
  }

  subYaml = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {};
        if (values.address && values.address.ips) {
          const ips = [];
          values.address.ips.map(items => {
            if (items) ips.push(items);
          });
          values.address.ips = ips;
        }
        if (values.address && values.address.ports) {
          const addressPorts = [];
          values.address.ports.map(items => {
            if (items && items.port && items.name) addressPorts.push(items);
          });
          values.address.ports = addressPorts;
        }
        if (values && values.routes) {
          const routes = [];
          values.routes.map(items => {
            if (items && items.port && items.protocol && items.targetPort && items.name) {
              routes.push(items);
            }
          });
          values.routes = routes;
        }

        if (values.routes.length <= 0) {
          message.error('请填写完整Ports相关信息~');
          return;
        }

        if (
          values.resource_type == 'endpoint' &&
          (values.address.ips.length <= 0 || values.address.ports.length <= 0)
        ) {
          message.error('服务类型为集群外访问，必须填写完整EndPoint');
          return;
        }
        params.name = values.name;
        params.namespace = this.state.defaultNamespace;
        params.address = values.address;
        params.routes = values.routes;
        params.editState = this.props.editState;
        params.resourceType = values.resource_type;
        params.serviceProject = values.service_project ? values.service_project : '';

        this.props.dispatch({
          type: 'services/createFrom',
          payload: { ...params },
        });
        console.log('Received values of form: ', values);
      }
    });
  };

  remove = k => {
    const { form } = this.props;
    var keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  add = data => {
    if (data && uuidAddStatus) return;
    const { form } = this.props;
    var keys = form.getFieldValue('keys');
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    let nextKeys = [];
    if (data) {
      data.map(() => {
        nextKeys = keys.concat(uuid);
      });
      uuidAddStatus = true;
    } else {
      nextKeys = keys.concat(uuid);
    }
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  removeAddress = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('addressKeys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      addressKeys: keys.filter(key => key !== k),
    });
  };
  addAddress = data => {
    if (data && addressUuidStatus) return;
    const { form } = this.props;
    var keys = form.getFieldValue('addressKeys');
    let nextKeysAddress = [];
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    if (data) {
      data.map(() => {
        nextKeysAddress = keys.concat(addressUuid);
        addressUuidStatus = true;
      });
    } else {
      nextKeysAddress = keys.concat(addressUuid);
    }
    addressUuid++;
    form.setFieldsValue({
      addressKeys: nextKeysAddress,
    });
  };

  removeAddressPorts = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('addressPortsKeys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      addressPortsKeys: keys.filter(key => key !== k),
    });
  };
  addAddressPorts = data => {
    if (data && addressPortsStatus) return;
    const { form } = this.props;
    var keys = form.getFieldValue('addressPortsKeys');
    let nextKeysPorts = [];
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    if (data) {
      data.map(() => {
        nextKeysPorts = keys.concat(addressPorts);
        addressPortsStatus = true;
      });
    } else {
      nextKeysPorts = keys.concat(addressPorts);
    }
    addressPorts++;
    form.setFieldsValue({
      addressPortsKeys: nextKeysPorts,
    });
  };

  changeResourceType = e => {
    this.setState({ resourceType: e.target.value });
  };

  render() {
    const { editState, params, detail, form, projectList } = this.props;
    const { endpoints, service } = detail;
    const { getFieldDecorator, getFieldValue } = form;
    const that = this;
    if (detail && endpoints && endpoints.addresses) {
      this.addAddress(endpoints.addresses);
    }
    if (detail && endpoints && endpoints.ports) {
      this.addAddressPorts(endpoints.ports);
    }
    if (detail && service && service.spec && service.spec.ports) {
      this.add(service.spec.ports);
    }
    getFieldDecorator('keys', { initialValue: [] });
    getFieldDecorator('addressKeys', { initialValue: [] });
    getFieldDecorator('addressPortsKeys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const address_keys = getFieldValue('addressKeys');
    const addressPortsKeys = getFieldValue('addressPortsKeys');
    const formItems = keys.map((k, index) => {
      return (
        <span key={'ports-' + k}>
          <Form.Item
            {...formItemLayout}
            label="Ports"
            help="port 的流量会被重定向后端pod的 targetPort 上"
          >
            {getFieldDecorator(`routes[${k}]['port']`, {
              initialValue:
                editState && service && service.spec && service.spec.ports && service.spec.ports[k]
                  ? service.spec.ports[k].port
                  : '',
              rules: [{ required: false, message: '请设置端口在80到65535之间' }],
            })(
              <InputNumber
                style={{ width: '150', marginRight: '10px' }}
                placeholder="Port"
                min={80}
                max={65535}
              />,
            )}
            {getFieldDecorator(`routes[${k}]['protocol']`, {
              initialValue:
                editState && service && service.spec && service.spec.ports && service.spec.ports[k]
                  ? service.spec.ports[k].protocol
                  : 'TCP',
            })(
              <Select placeholder="TCP" style={{ width: '20%', marginRight: '10px' }}>
                <Select.Option value="TCP">TCP</Select.Option>
                <Select.Option value="UDP">UDP</Select.Option>
              </Select>,
            )}
            {getFieldDecorator(`routes[${k}]['targetPort']`, {
              initialValue:
                editState && service && service.spec && service.spec.ports && service.spec.ports[k]
                  ? service.spec.ports[k].targetPort
                  : '',
            })(
              <InputNumber
                style={{ width: '150', marginRight: '10px' }}
                placeholder="targetPort"
                min={80}
              />,
            )}
            {getFieldDecorator(`routes[${k}]['name']`, {
              initialValue:
                editState && service && service.spec && service.spec.ports && service.spec.ports[k]
                  ? service.spec.ports[k].name
                  : '',
            })(<Input placeholder="portName" style={{ width: '20%', marginRight: '10px' }}/>)}
            <Icon type="plus-circle-o" onClick={() => this.add()} style={{ marginRight: '10px' }}/>
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const formAddressItems = address_keys.map((k, index) => {
      // if (editState && detail && endpoints && endpoints.addresses && endpoints.addresses[k])
      return (
        <span key={'ips-' + k}>
          <Form.Item {...formItemLayout} label="Address-IP" key={k}>
            {getFieldDecorator(`address['ips'][${k}]`, {
              initialValue:
                editState && detail && endpoints && endpoints.addresses && endpoints.addresses[k]
                  ? endpoints.addresses[k].ip
                  : '',
              rules: [{ required: false, message: '请输入合法的IP地址' }],
            })(<Input placeholder="请输入IP地址" style={{ width: '40%', marginRight: '10px' }}/>)}
            <Icon
              type="plus-circle-o"
              onClick={() => this.addAddress()}
              style={{ marginRight: '10px' }}
            />
            {address_keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={address_keys.length === 1}
                onClick={() => this.removeAddress(k)}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const formAddressPortsItems = addressPortsKeys.map((k, index) => {
      return (
        <span key={'address-' + k}>
          <Form.Item
            {...formItemLayout}
            label="Address-Ports"
            key={'ports-' + k}
            help="端口及端口名称二者缺一，Address-Ports将不会被提交"
          >
            {getFieldDecorator(`address['ports'][${k}]['port']`, {
              initialValue:
                editState && detail && endpoints && endpoints.ports && endpoints.ports[k]
                  ? endpoints.ports[k].port
                  : '',
            })(
              <InputNumber
                style={{ width: '150', marginRight: '10px' }}
                placeholder="Port"
                min={80}
                max={65535}
              />,
            )}
            {getFieldDecorator(`address['ports'][${k}]['name']`, {
              initialValue:
                editState && detail && endpoints && endpoints.ports && endpoints.ports[k]
                  ? endpoints.ports[k].name
                  : '',
            })(<Input style={{ width: '20%', marginRight: '10px' }} placeholder="portName"/>)}
            <Icon
              type="plus-circle-o"
              onClick={() => this.addAddressPorts()}
              style={{ marginRight: '10px' }}
            />
            {addressPortsKeys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={addressPortsKeys.length === 1}
                onClick={() => this.removeAddressPorts(k)}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });

    const namespaceSelectPros = {
      disabledStatus: editState,
      onOk(value) {
        that.props.dispatch({
          type: 'project/projectList',
        });
        that.setState({ defaultNamespace: value });
      },
    };

    const projectOption = () => {
      const options = [];
      if (projectList && projectList.list.length) {
        projectList.list.map((item, key) =>
          options.push(
            <Select.Option value={item.name_en} key={key}>
              {item.name_en}
            </Select.Option>,
          ),
        );
      }
      return options;
    };

    return (
      <Form onSubmit={this.subYaml}>
        <Card style={{ width: '70%', margin: '0 auto' }} title="Service">
          <Form.Item {...formItemLayout} label="业务空间">
            {getFieldDecorator('namespace', {
              initialValue: editState ? params.namespace : '',
            })(<NamespaceSelect {...namespaceSelectPros} />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="项目名称">
            {getFieldDecorator('name', {
              initialValue: editState ? params.name : '',
              rules: [{ required: true, message: '请填写项目名称' }],
            })(
              <Input placeholder="请输入项目名称" style={{ width: '40%' }} disabled={editState}/>,
            )}
          </Form.Item>
          {formItems}
          <Form.Item {...formItemLayout} label="服务类型">
            {getFieldDecorator('resource_type', {
              initialValue: this.state.resourceType,
              rules: [{ required: true, message: '请选择服务类型' }],
            })(
              <Radio.Group onChange={this.changeResourceType}>
                <Radio value="service">
                  <Tooltip title="集群公内部访问: 只提供内部访问地址（例:hello.operations:8080）集群外部无法调用">
                    <Icon type="info-circle-o"/>仅集群内部访问
                  </Tooltip>
                </Radio>
                <Radio value="endpoint">
                  <Tooltip title="集群内外均可访问：会对外提供入口">
                    <Icon type="info-circle-o"/>集群内外均可访问
                  </Tooltip>
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
          {this.state.resourceType == 'service' && (
            <Form.Item {...formItemLayout} label="可访问项目">
              {getFieldDecorator('service_project', {
                initialValue: editState && params && params.service_type ? params.service_type : '',
                rules: [{ required: true, message: '请选择可访问项目' }],
              })(
                <Select
                  showSearch
                  style={{ width: '40%' }}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {projectList && projectList.list && projectOption()}
                </Select>,
              )}
            </Form.Item>
          )}
        </Card>
        {this.state.resourceType == 'endpoint' && (
          <Card style={{ width: '70%', margin: '10px auto' }} title="EndPoint">
            {formAddressItems}
            {formAddressPortsItems}
          </Card>
        )}
        <Button
          style={{ float: 'right', marginRight: '30%', marginTop: '30px' }}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          提交
        </Button>
      </Form>
    );
  }
}
