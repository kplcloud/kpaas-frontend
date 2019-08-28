/**
 * Created by huyunting on 2018/7/18.
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Input, Button, message, Alert, Slider } from 'antd';

class ExpansionModal extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    cpu: {
      0: '200m',
      20: '500m',
      40: '1',
      60: '2',
      80: '4',
      100: '8',
    },
    memory: {
      0: '64Mi',
      10: '128Mi',
      20: '256Mi',
      30: '512Mi',
      40: '1Gi',
      50: '2Gi',
      60: '4Gi',
      70: '6Gi',
      80: '8Gi',
      90: '12Gi',
      100: '16Gi',
    },
    defaultCpu: [20, 40],
    defaultMemory: [20, 40],
  };

  componentDidMount() {
    const { containers } = this.props;
    if (
      containers &&
      containers.limits &&
      containers.requests &&
      containers.limits.memory &&
      containers.requests.memory
    ) {
      var data = [];
      for (var key in this.state.memory) {
        if (this.state.memory[key] == containers.requests.memory) {
          data.push(parseInt(key));
        }
        if (this.state.memory[key] == containers.limits.memory) {
          data.push(parseInt(key));
        }
      }
      this.setState({ defaultMemory: data });
    }
  }

  handleOk = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue, resetFields } = form;
    validateFields((errors, values) => {
      if (errors) {
        message.error('请填写完整信息~');
        return;
      }
      const data = {
        cpu: this.state.cpu[values['cpu'][0]],
        maxCpu: this.state.cpu[values['cpu'][1]],
        memory: this.state.memory[values['memory'][0]],
        maxMemory: this.state.memory[values['memory'][1]],
      };
      console.log(data);
      onOk(data);
    });
    resetFields();
  };
  handleCancel = () => {
    const { form, onCancel } = this.props;
    onCancel();
    form.resetFields();
  };

  changeCpu = value => {
    this.setState({ defaultCpu: value });
  };
  changeMemory = value => {
    this.setState({ defaultMemory: value });
  };

  render() {
    const { form, btnLoading, visible, containers } = this.props;
    console.log('containers', containers);
    const { getFieldDecorator } = form;
    const modalOpts = {
      title: '服务扩容',
      onOk: this.handleOk,
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key="back" onClick={this.handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>
          保存
        </Button>,
      ],
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };
    return (
      <Modal {...modalOpts} width={700}>
        {containers &&
        containers.limits &&
        containers.requests &&
        containers.limits.memory &&
        containers.requests.memory && (
          <Alert
            message={
              '服务当前内存为 ' +
              containers.requests.memory +
              ', 最大内存为 ' +
              containers.limits.memory
            }
            type="info"
            showIcon
            style={{ marginBottom: 30 }}
          />
        )}
        {/*<Alert message="根据自己需求配置 (CPU:200m/500m/1/2,内存:256Mi/512Mi/2Gi)" type="info" showIcon style={{marginBottom: 30}}/>*/}
        <Form layout="vertical" hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label="CPU"
            extra={
              'CPU为 ' +
              this.state.cpu[this.state.defaultCpu[0]] +
              ', 最大CPU为 ' +
              this.state.cpu[this.state.defaultCpu[1]]
            }
          >
            {getFieldDecorator('cpu', {
              initialValue: this.state.defaultCpu,
              rules: [{ required: true, message: '请选择CPU规格' }],
            })(<Slider range step={null} marks={this.state.cpu} onChange={this.changeCpu}/>)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="内存"
            extra={
              '内存为 ' +
              this.state.memory[this.state.defaultMemory[0]] +
              ', 最大内存为 ' +
              this.state.memory[this.state.defaultMemory[1]]
            }
          >
            {getFieldDecorator('memory', {
              initialValue: this.state.defaultMemory,
              rules: [{ required: true, message: '请选择内存规格' }],
            })(<Slider range step={null} marks={this.state.memory} onChange={this.changeMemory}/>)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

ExpansionModal.propTypes = {};

export default Form.create()(ExpansionModal);
