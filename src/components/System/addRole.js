/**
 * Created by huyunting on 2018/5/17.
 */
import React, {PropTypes} from 'react'
import {Modal, Form, Input, Button, message} from 'antd'
const FormItem = Form.Item;

class AddRole extends React.Component {

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
    const {form, btnLoading, visible, modalType, oneRole} = this.props;
    const {getFieldDecorator} = form;
    const modalOpts = {
      title: '添加角色',
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
        <FormItem label="名称:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: modalType ? oneRole.name : "",
            rules: [
              {required: true, message: '请输入角色名称'}
            ],
          })(<Input placeholder="请输入角色名称..."/>)}
        </FormItem>
        <FormItem label="描述:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('desc', {
            initialValue: modalType ? oneRole.description : "",
            rules: [
              {
                required: true,
                message: '请输入描述...',
              },
            ],
          })(<Input placeholder="请输入描述..."/>)}
        </FormItem>
        <FormItem label="角色级别:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('level', {
            initialValue: modalType ? oneRole.level : "",
            rules: [
              {
                required: true,
                message: '请输入角色级别...',
              },
            ],
          })(<Input placeholder="请输入角色级别..."/>)}
        </FormItem>
        <FormItem label="id:" hasFeedback {...formItemLayout} style={{display: "none"}}>
          {getFieldDecorator('id', {
            initialValue: modalType ? oneRole.id : "",
          })(<Input placeholder="id..."/>)}
        </FormItem>

      </Form>
    </Modal>)
  }
}

AddRole.propTypes = {};

export default Form.create()(AddRole)
