import React, { PureComponent, Fragment } from 'react';
import { Modal, Tag, InputNumber, Form, Input, Radio, Select, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const portState = {
  uuid: 0,
  uuidAddStatus: false,
};

@Form.create()
class ServicePortModal extends PureComponent {
  onCancel = () => {
    portState.uuid = 0;
    portState.uuidAddStatus = false;
    this.props.onCancel();
    this.props.form.resetFields();
  };
  handleCreate = () => {
    const { form, dispatch, onCancel, namespace, name } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const portsParams = [];
      if (values && values.ports && values.ports.length > 0) {
        values.ports.map((item) => {
          portsParams.push(item);
        });
      }
      form.resetFields();
      dispatch({
        type: 'project/onAddPort',
        payload: {
          projectName: name,
          namespace: namespace,
          ports: portsParams,
        },
      });

      onCancel();
    });
  };

  add = (data) => {
    if (data && portState.uuidAddStatus) return;
    const { form } = this.props;
    let uuid = portState.uuid;
    const key = 'port';
    var keys = form.getFieldValue(key);
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    let nextKeys = [];
    if (data) {
      data.map(() => {
        nextKeys = keys.concat(uuid);
        keys = nextKeys;
        portState.uuid = uuid + 1;
        uuid += 1;
      });
      portState.uuidAddStatus = true;
    } else {
      nextKeys = keys.concat(uuid);
      portState.uuid = uuid + 1;
    }
    form.setFieldsValue({
      port: nextKeys,
    });
  };

  remove = (k) => {
    const keyStr = 'port';
    const { form } = this.props;
    var keys = form.getFieldValue(keyStr);
    if (keys.length === 1) {
      return;
    }
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    form.setFieldsValue({
      port: keys.filter(key => key !== k),
    });
  };

  render() {
    const { visible, form, portInfo } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    if (!visible) {
      return ('');
    }
    if (portState.uuid === 0) this.add();
    if (portInfo && portInfo.length > 0) {
      this.add(portInfo);
    }
    var items = [];
    getFieldDecorator('port', { initialValue: [] });
    const port = getFieldValue('port');
    if (port && port.length > 0) {
      items = port.map((i) => {
        return (
          <span key={`port-${i}`}>
            <FormItem label="端口及协议" hasFeedback {...formItemLayout}>
              <FormItem style={{ display: 'inline-block' }} help=" 0 ~ 65535之间">
                 {getFieldDecorator(`ports[${i}]['port']`, {
                   initialValue: (portInfo && portInfo[i] && portInfo[i].port) ? portInfo[i].port : 80,
                   rules: [{ required: true, message: '端口不能为空!' }],
                 })(
                   <InputNumber
                     placeholder="端口号"
                     max={65535}
                   />)}
              </FormItem>
              <FormItem style={{ display: 'inline-block', width: 'calc(27%)' }}>
                {getFieldDecorator(`ports[${i}]['name']`, {
                  initialValue: (portInfo && portInfo[i] && portInfo[i].name) ? portInfo[i].name : '',
                  rules: [
                    {
                      pattern: `^[a-zA-Z][-_a-zA-Z0-9]*$`,
                      message: '端口名称必须是英文字母开头 且仅包含字母数组-_',
                    },
                    { required: true, message: '名称不能为空!' },
                  ],
                })(
                  <Input placeholder="端口名称"/>,
                )}
              </FormItem>
              <FormItem
                help="协议"
                style={{
                  display: 'inline-block',
                  width: 'calc(25%)',
                  marginLeft: 'calc(2%)',
                  marginRight: 'calc(2%)',
                }}
              >
                {getFieldDecorator(`ports[${i}]['protocol']`, {
                  initialValue: (portInfo && portInfo[i] && portInfo[i].protocol) ? portInfo[i].protocol : 'TCP',
                  rules: [{ required: true, message: '协议不能为空!' }],
                })(
                  <Select>
                    <Select.Option value="TCP">TCP</Select.Option>
                    <Select.Option value="UDP">UDP</Select.Option>
                  </Select>,
                )}
              </FormItem>
              <Icon
                type="plus-circle-o"
                onClick={() => this.add()}
                style={{ marginRight: '10px' }}
              />
              {port.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={port.length === 1}
                  onClick={() => this.remove(i)}
                />
              ) : null}
            </FormItem>
          </span>
        );
      });
    }
    return (
      <Modal
        visible={visible}
        title="调整【端口及协议】"
        onCancel={this.onCancel}
        onOk={this.handleCreate}
        // footer={false}
        destroyOnClose={true}
        confirmLoading={false}
        style={{ width: 700, height: 600 }}
      >
        <Form>
          {items}
        </Form>
      </Modal>
    );
  }
}

export default connect(({}) => ({}))(ServicePortModal);
