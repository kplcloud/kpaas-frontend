/**
 * Created by huyunting on 2018/5/17.
 */
import React, {PropTypes} from 'react'
import {Modal, Form, Input, Button, message, Select} from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;

class AddMember extends React.Component {

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

  optionData = (data) => {
    var items = []
    if (data && data.length) {
      data.map((item, key) => {
        items.push(<Option key={key} value={data[key]["id"]}>{data[key]["name"]}</Option>)

      });
    }
    return items
  }
  selectChildren = (data) => {
    const children = [];
    if (data && data.length) {
      data.map((item, key) => {
        children.push(<Option key={key} value={data[key]["name"]}>{data[key]["display_name"]}</Option>)
      })
    }
    return children
  }


  render() {
    const {form, btnLoading, visible, modalType, oneMember, roleList, namespaceList} = this.props;
    const {getFieldDecorator} = form;
    const namespaces = () => {
      const items = []
      if (oneMember && oneMember.namespaces) {
        oneMember.namespaces.map((item, key) => {
          items.push(oneMember.namespaces[key]["name"])
        })
      }
      return items
    }
    const roles = () => {
      const items = []
      if (oneMember && oneMember.roles) {
        oneMember.roles.map((item, key) => {
          items.push(oneMember.roles[key]["id"])
        })
      }
      return items
    }
    const modalOpts = {
      title: '添加用户',
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
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

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
        <FormItem label="姓名:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: modalType ? oneMember.username : "",
            rules: [
              {required: true, message: '请输入用户姓名'}
            ],
          })(<Input placeholder="请输入用户姓名"/>)}
        </FormItem>
        <FormItem label="邮箱:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: modalType ? oneMember.email : "",
            rules: [
              {
                required: true,
                message: '请输入邮箱...',
              },
            ],
          })(<Input placeholder="请输入邮箱..."/>)}
        </FormItem>
        <FormItem label="密码:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: "",
          })(<Input placeholder="请输入密码..."/>)}
        </FormItem>
        <FormItem label="状态:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('state', {
            initialValue: modalType ? oneMember.state : 0,
            rules: [
              {
                required: true,
                message: '请选择用户状态...',
              },
            ],
          })(<Select placeholder="请选择用户状态...">
            <Option key="0" value={0}>创建</Option>
            <Option key="1" value={1}>激活</Option>
            <Option key="2" value={2}>关闭</Option>
          </Select>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属角色"
          hasFeedback
        >
          {getFieldDecorator('role', {
            initialValue: (oneMember && modalType) ? (roles()) : [],
            rules: [
              {required: true, message: '请选择所属角色...'},
            ],
          })(
            <Select placeholder="请选择所属角色..." mode="multiple">
              {roleList && oneMember && this.optionData(roleList)}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="所属空间"
          hasFeedback
        >
          {getFieldDecorator('namespace', {
            initialValue: (modalType && oneMember) ? namespaces() : [],
            rules: [
              {required: true, message: '请选择所属空间...'},
            ],
          })(
            <Select
              mode="multiple"
              style={{width: '100%'}}
              placeholder="请选择所属空间..."
            >
              {namespaceList && this.selectChildren(namespaceList)}
            </Select>
          )}
        </FormItem>

      </Form>
    </Modal>)
  }
}

AddMember.propTypes = {};

export default Form.create()(AddMember)
