import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider, Col, Icon, message, InputNumber } from 'antd';
import styles from './style.less';
import Cookie from 'js-cookie';
import NamespaceSelect from '../../../../components/Security/namespaceSelect';

const InputGroup = Input.Group;

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  state = {
    hostsNum: 1,
    editState: false,
    domain: '',
    selectedItems: [],
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    if (params && params.namespace && params.name) {
      this.setState({ editState: true });
      dispatch({
        type: 'virtualservice/one',
        payload: {
          ...params,
        },
      });
      Cookie.set('virtualServiceEdit', true);
    } else {
      Cookie.set('virtualServiceEdit', false);
    }
    if (window.location.host.indexOf('kpl.nsini.com') !== -1) {
      this.setState({ domain: '.kpl.nsini.com' });
    } else {
      this.setState({ domain: '.kpl.nsini.com' });
    }
  }

  gatewayOption = (data) => {
    const items = [];
    if (data && data.length) {
      data.map((item, index) => {
        items.push(<Option key={index} value={item.name}>
          {item.name}
        </Option>);
      });
    }
    return items;
  };
  addService = () => {
    if (this.state.hostsNum >= 15) {
      message.error('您添加的数据太多了~');
      return;
    }
    this.setState({ hostsNum: this.state.hostsNum + 1 });
  };

  render() {
    const { form, dispatch, gateway, virtualservice } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const { oneInfo } = virtualservice;
    const self = this;
    let debug = false;
    if (window.location.host === 'kplcloud.kpl.nsini.com') {
      debug = true;
    }
    const handleNameChange = (value) => {
      this.props.form.setFieldsValue({
        host_0: debug ? `${value}-${Cookie.get('namespace')}${this.state.domain}` : `${value}.${Cookie.get('namespace')}${this.state.domain}`,
      });
    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const hostData = [];
          if (this.state.editState && this.state.hostsNum >= 1) {
            for (i = 1; i <= this.state.hostsNum + 1; i++) {
              if (values['host_' + i] && values['host_' + i]) {
                hostData.push(values[`host_${i}`]);
              }
            }
          }
          if (!this.state.editState) {
            hostData.push(values[`host_0`]);
          }
          const ns = Cookie.get('namespace');
          const params = {
            name: values.name,
            namespace: ns,
            gateways: values.gateways,
            hosts: hostData,
            port: values.port,
            status: this.state.editState,
          };
          dispatch({
            type: 'virtualservice/pushCreate',
            payload: params,
          });
        }
      });
    };
    const hostsItems = [];
    const hostsItemsLength = this.state.editState ? ((oneInfo && oneInfo.hosts) ? (oneInfo.hosts.length + this.state.hostsNum) : this.state.hostsNum) : 0;
    for (var i = 1; i < (this.state.editState ? hostsItemsLength : hostsItemsLength + 1); i++) {
      hostsItems.push(
        <InputGroup key={i}>
          <Col span={this.state.editState ? 20 : 24}>
            {getFieldDecorator('host_' + i, {
              initialValue: this.state.editState ? (oneInfo ? oneInfo.hosts[i - 1] : '') : '',
              rules: (i == 1) ? [{ required: true, message: '请输入host...' }, {
                pattern: `^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$`,
                message: 'host前缀仅支持字母、数字、-',
              }] : [{
                pattern: `^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$`,
                message: 'host前缀仅支持字母、数字、-',
              }],
            })(<Input rows={4} placeholder="eg:名称.业务空间"/>)}
          </Col>
          {this.state.editState && (
            <Col span={4}>
              <Button onClick={() => this.addService()}><Icon type="plus"/></Button>
            </Col>
          )}
        </InputGroup>,
      );
    }
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          style={{ width: 500 }}
        >
          <Form.Item {...formItemLayout} label="项目名称" extra="请与创建好的项目名称保持一致">
            {getFieldDecorator('name', {
              initialValue: this.state.editState ? (oneInfo ? oneInfo.name : '') : '',
              rules: [{ required: true, message: '请输入名称' }],
            })(
              <Input
                disabled={this.state.editState}
                placeholder="项目名称仅支持 英文字母 数字 - _"
                onBlur={(e) => handleNameChange(e.target.value)}
                addonAfter={(
                  <NamespaceSelect {...{
                    disabledStatus: this.state.editState,
                    onOk(value) {
                      self.setState({ selectedItems: [] });
                      self.props.form.setFieldsValue({
                        host_0: `${self.state.name}-${value}${self.state.domain}`,
                      });
                      self.props.dispatch({
                        type: 'gateway/list',
                        payload: {
                          namespace: value,
                        },
                      });
                    },
                  }}
                  />
                )}
              />,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="大网关" extra="如果没有可选的大网关，请点击创建大网关按钮进行创建">
            {getFieldDecorator('gateways', {
              initialValue: this.state.editState ? (oneInfo ? oneInfo.gateways : []) : this.state.selectedItems,
              rules: [{ required: true, message: '请选择业务空间' }],
            })(
              <Select placeholder="请选择 gateways" mode="multiple">
                {this.gatewayOption(gateway)}
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="端口号" extra="根据项目需要填写，默认8080">
            {getFieldDecorator('port', {
              initialValue: this.state.editState && oneInfo && oneInfo.http && oneInfo.http[0] && oneInfo.http[0].route && oneInfo.http[0].route[0] && oneInfo.http[0].route[0].destination && oneInfo.http[0].route[0].destination.port.number ? oneInfo.http[0].route[0].destination.port.number : 8080,
              rules: [{ required: true, message: '请选择业务空间' }],
            })(
              <InputNumber min={1} max={100000} style={{ width: 400 }}/>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="hosts" extra="host 示例: hello.kpass.xxx.com">
            {this.state.editState && hostsItems}
            {!this.state.editState && getFieldDecorator('host_0', {
              initialValue: '',
            })(<Input rows={4} placeholder="eg:名称.业务空间" disabled/>)}
          </Form.Item>
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
            <Button type="primary" onClick={onValidateForm}>
              提交
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }}/>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如有不清楚请联系管理员</h4>
          <p>请根据自己的需求设置合适的参数。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ gateway, user, virtualservice }) => ({
  gateway: gateway.list,
  virtualservice,
  namespaces: user.namespaces,
}))(Step1);
