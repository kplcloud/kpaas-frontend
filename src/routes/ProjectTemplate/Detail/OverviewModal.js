import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, Form} from 'antd';
const FormItem = Form.Item;
const {TextArea} = Input;

// const formItemLayout = {
//     labelCol: {
//       xs: { span: 24 },
//       sm: { span: 7 },
//     },
//     wrapperCol: {
//       xs: { span: 24 },
//       sm: { span: 12 },
//       md: { span: 10 },
//     },
//   };

@Form.create()
class OverviewModal extends React.PureComponent {

    onSubmit = (e) => {
        e.preventDefault();
        const form = this.props.form;
        const handleOk = this.props.handleOk;
        // const deployment = this.props.deployment;
        const project = this.props.project;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log('Received values of form: ', values);
            handleOk(project, values)
            form.resetFields();
        });
    }

  render() {
    const { visible, loading, handleCancel, form, deployment} = this.props;
    const { getFieldDecorator } = form;

    if (!deployment) {
      return ('')
    }
    const {command, args} = deployment;
    
    return (
        <Modal
            visible={visible}
            title="调整命令及参数"
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
            <FormItem label="命令">
              {getFieldDecorator('command', {
                rules: [{ required: false, message: '请输入执行的命令!' }],
                initialValue: command,
              })(
                <Input addonBefore="command" placeholder={`多个命令以","分割。`} />
              )}
            </FormItem>
            <FormItem label="参数">
              {getFieldDecorator('args', {
                  rules: [{ required: false, message: '请输入执行的参数!' }],
                  initialValue: args,
              })(<TextArea rows={8} style={{ minHeight: 42 }} placeholder={`多个参数以","分割。`} />)}
            </FormItem>
          </Form>
      </Modal>
    );
  }
}

export default connect(({}) => ({

}))(OverviewModal);


