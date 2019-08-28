import React from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, Form } from 'antd';

const FormItem = Form.Item;


@Form.create()
class OverviewPomModal extends React.PureComponent {

  onSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form;
    const handleOk = this.props.handleOk;
    const project = this.props.project;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      handleOk(project, values);
      form.resetFields();
    });
  };

  render() {
    const { visible, loading, handleCancel, form, deployment } = this.props;
    const { getFieldDecorator } = form;
    const { git_pomfile } = deployment;
    return (
      <Modal
        visible={visible}
        title="修改PomFile路径"
        onOk={this.onSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.onSubmit}>
            提交
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="pom.xml地址">
            {getFieldDecorator('path', {
              rules: [{ required: true, message: '请填写 pom.xml 路径!' }],
              initialValue: git_pomfile,
            })(
              <Input placeholder={`例如：pom.xml`} helper={'例如：pom.xml'}/>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default (OverviewPomModal);


