/**
 * Created by huyunting on 2018/5/15.
 */
import React, {PropTypes} from 'react'
import {Modal, Form, Input, Button, message} from 'antd'
const FormItem = Form.Item;

class AddModal extends React.Component {

  constructor(props) {
    super(props);
  };

  handleOk = () => {
    const {form, onOk} = this.props;
    const {validateFields, getFieldsValue, resetFields} = form;
    validateFields((errors) => {
      if (errors) {
        message.error("请填写完整信息~")
        return
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
    resetFields();
  };
  handleCancel = () => {
    const {form, onCancel} = this.props;
    onCancel();
    form.resetFields();
  };

  render() {
    const {form, btnLoading, visible} = this.props;
    const {getFieldDecorator} = form;
    const modalOpts = {
      title: '创建命名空间',
      onOk: this.handleOk,
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key="back" onClick={this.handleCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>
          保存
        </Button>,
      ]
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    // const ruleappid =
    return (<Modal {...modalOpts}>
      <Form layout="vertical" hideRequiredMark>
        <FormItem label="中文名称:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('display_name', {
            initialValue: "",
            rules: [
              {required: true, message: '请输入中文名称'}
            ],
          })(<Input placeholder="请输入中文名称"/>)}
        </FormItem>
        <FormItem label="英文名称:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: "",
            rules: [
              {
                required: true,
                message: '请输入英文名称',
              },
            ],
          })(<Input placeholder="请输入英文名称"/>)}
        </FormItem>

      </Form>
    </Modal>)
  }
}

AddModal.propTypes = {};

export default Form.create()(AddModal)
