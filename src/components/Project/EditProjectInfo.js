/**
 * Created by yuntinghu on 2019/4/29.
 */

import React from 'react';
import { connect } from 'dva';
import { Button, Form, Icon, Input, Modal, message } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

@Form.create()
class EditProjectInfo extends React.Component {
  state = {
    visible: false,
  };
  onChangeShowModal = (status) => {
    this.setState({
      visible: !!status,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { project, form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        message.error('请填写完整的项目名称及项目描述信息');
        return;
      }
      dispatch({
        type: 'project/EditProject',
        payload: {
          name: project.name,
          namespace: project.namespace,
          display_name: values.display_name,
          desc: values.desc,
        },
      });
      this.onChangeShowModal(false);
      form.resetFields();
    });
  };

  render() {
    const { project, form } = this.props;
    const { visible } = this.state;
    const { getFieldDecorator } = form;
    return (
      <span>
        <a style={{ marginLeft: 5 }} onClick={() => this.onChangeShowModal(true)}>
          <Icon type="edit"/>
        </a>
        <Modal
          visible={visible}
          title="调整项目信息"
          onOk={this.onSubmit}
          onCancel={() => this.onChangeShowModal(false)}
          footer={[
            <Button key="back" onClick={() => this.onChangeShowModal(false)}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.onSubmit}>
              提交
            </Button>,
          ]}
        >
          <Form layout="vertical">
            <FormItem label="项目名称" {...formItemLayout}>
              {getFieldDecorator('display_name', {
                rules: [{ required: true, message: '请输入项目中文名称!' }],
                initialValue: project && project.display_name,
              })(
                <Input placeholder={`请填写项目中文名称`}/>,
              )}
            </FormItem>
            <FormItem label="项目描述" {...formItemLayout}>
              {getFieldDecorator('desc', {
                rules: [{ required: true, message: '请输入项目中文名称!' }],
                initialValue: project && project.desc,
              })(
                <Input.TextArea placeholder={`请填写项目描述信息`}/>,
              )}
            </FormItem>
          </Form>
        </Modal>
      </span>

    );
  }
}

export default connect(({}) => ({}))(EditProjectInfo);
