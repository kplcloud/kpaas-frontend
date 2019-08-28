import React, { PureComponent, Fragment } from 'react';
import { Modal, Tooltip, InputNumber, Form, Input, Radio, Icon } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@Form.create()
class ProbeModal extends PureComponent {
  state = {
    protocol: 'TCP',
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch, onCancel, namespace, name } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'project/onPutProbe',
        payload: {
          projectName: name,
          namespace: namespace,
          ...values,
        },
      });
      form.resetFields();
      onCancel();
    });
  };

  onChangeProtocol = (e) => {
    e.preventDefault();
    this.setState({
      protocol: e.target.value,
    });
  };

  render() {
    const { visible, onCancel, form, title, containers, name, namespace } = this.props;
    const { getFieldDecorator } = form;
    const { protocol } = this.state;
    if (!visible) {
      return ('');
    }

    let container;
    for (let i in containers) {
      if (containers[i].name != name) {
        continue;
      }
      container = containers[i];
    }

    let probe;
    if (container.readinessProbe) {
      probe = container.readinessProbe;
    } else if (container.livenessProbe) {
      probe = container.livenessProbe;
    }
    console.log(probe);
    console.log(probe && probe.httpGet && probe.httpGet.path);
    console.log(protocol);
    return (
      <Modal
        visible={visible}
        title={title}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        // footer={false}
        destroyOnClose={true}
        confirmLoading={false}
      >
        <Form>
          <FormItem label="检测端口"
                    {...formItemLayout}
          >
            {getFieldDecorator('port', {
              initialValue: container.livenessProbe && container.livenessProbe.httpGet ? (probe && probe.httpGet && probe.httpGet.port) : (probe && probe.tcpSocket && probe.tcpSocket.port),
              rules: [{ required: true, message: '检测端口不能为空!' }],
            })(
              <InputNumber min={80} placeholder={8080} max={65535}/>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="协议"
          >
            {getFieldDecorator('protocol', {
              initialValue: container.livenessProbe ? 'HTTP' : 'TCP',
            })(
              <Radio.Group onChange={this.onChangeProtocol}>
                <Radio value="TCP">TCP</Radio>
                <Radio value="HTTP">HTTP</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<Tooltip title="容器启动后第一次执行探测是需要等待多少秒。">
              <Icon type="info-circle-o"/>初始化等候时间</Tooltip>}
          >
            {getFieldDecorator('initial_delay_seconds', {
              initialValue: probe && probe.initialDelaySeconds,
              rules: [{ required: true, message: '初始化等候时间!' }],
            })(
              <InputNumber min={1} placeholder={10} max={360}/>,
            )} 秒
          </FormItem>
          <FormItem
            label={<Tooltip title="执行探测的频率。默认是10秒，最小1秒。">
              <Icon type="info-circle-o"/>检测间隔时间</Tooltip>}

            {...formItemLayout}
          >
            {getFieldDecorator('period_seconds', {
              initialValue: probe && probe.periodSeconds,
              rules: [{ required: true, message: '检测间隔时间不能为空!' }],
            })(
              <InputNumber min={1} placeholder={10} max={65535}/>,
            )} 秒
          </FormItem>
          <FormItem
            label={<Tooltip title="探测超时时间。默认1秒，最小1秒。">
              <Icon type="info-circle-o"/>检测超时时间</Tooltip>}
            {...formItemLayout}
          >
            {getFieldDecorator('timeout_seconds', {
              initialValue: probe && probe.timeoutSeconds,
              rules: [{ required: true, message: '检测超时时间不能为空!' }],
            })(
              <InputNumber min={1} placeholder={1} max={360}/>,
            )} 秒
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<Tooltip title="探测失败后，最少连续探测成功多少次才被认定为成功。默认是 1。对于 liveness 必须是 1。最小值是 1">
              <Icon type="info-circle-o"/>连续成功时间</Tooltip>}
          >
            {getFieldDecorator('success_threshold', {
              initialValue: probe && probe.successThreshold,
              rules: [{ required: true, message: '连续成功时间不能为空!' }],
            })(
              <InputNumber min={1} placeholder={1} max={65535}/>,
            )} 秒
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<Tooltip title="探测成功后，最少连续探测失败多少次才被认定为失败。默认是 3。最小值是 1。">
              <Icon type="info-circle-o"/>连续失败时间</Tooltip>}
          >
            {getFieldDecorator('failure_threshold', {
              initialValue: probe && probe.failureThreshold,
              rules: [{ required: true, message: '连续失败时间不能为空!' }],
            })(
              <InputNumber min={1} placeholder={3} max={65535}/>,
            )} 秒
          </FormItem>
          {protocol == 'HTTP' && container.livenessProbe ?
            <FormItem label={<Tooltip title="如果是http 需要服务提供一个检测uri http_status返回200就行">
              <Icon type="info-circle-o"/>路径</Tooltip>}
                      {...formItemLayout}
            >
              {getFieldDecorator('path', {
                initialValue: probe.httpGet.path,
              })(
                <span><Input placeholder="/health" value={probe.httpGet.path}/></span>,
              )}
            </FormItem> : ''}
        </Form>
      </Modal>
    );
  }
}

export default connect(({}) => ({}))(ProbeModal);
