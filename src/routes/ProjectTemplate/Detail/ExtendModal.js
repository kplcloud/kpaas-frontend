/**
 * Created by huyunting on 2018/7/18.
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Input, Button, message, Select, Alert, Icon } from 'antd';
const FormItem = Form.Item;

class ExtendModal extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOk = () => {
    const { form, onOk } = this.props;
    const { validateFields, getFieldsValue, resetFields } = form;
    validateFields(errors => {
      if (errors) {
        message.error('请填写完整信息~');
        return;
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
    resetFields();
  };
  handleCancel = () => {
    const { form, onCancel } = this.props;
    onCancel();
    form.resetFields();
  };

  render() {
    const { form, btnLoading, visible, replicas } = this.props;
    const { getFieldDecorator } = form;
    const modalOpts = {
      title: '服务伸缩',
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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    // const ruleappid =
    return (
      <Modal {...modalOpts}>
        <Form layout="vertical" hideRequiredMark>
          <Alert
            message={'服务当前副本数：' + replicas}
            type="info"
            showIcon
            style={{ marginBottom: 30 }}
          />
          <Form.Item {...formItemLayout} hasFeedback label="请选择副本数:">
            {getFieldDecorator('replicas', {
              rules: [{ required: true, message: '请选择副本数' }],
            })(
              <Select placeholder={'0'}>
                <Select.Option value={1}>1</Select.Option>
                <Select.Option value={2}>2</Select.Option>
                <Select.Option value={3}>3</Select.Option>
                <Select.Option value={4}>4</Select.Option>
                <Select.Option value={5}>5</Select.Option>
                <Select.Option value={6}>6</Select.Option>
                <Select.Option value={7}>7</Select.Option>
                <Select.Option value={8}>8</Select.Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

ExtendModal.propTypes = {};

export default Form.create()(ExtendModal);
