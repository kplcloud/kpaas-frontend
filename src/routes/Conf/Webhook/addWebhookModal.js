/**
 * Created by huyunting on 2018/5/17.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Modal, Input, message, Form, Radio } from 'antd';
import TransferComment from '../../../components/Conf/Transfer';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

@Form.create()
class AddWebhookModal extends PureComponent {
  state = {
    events: [],
  };

  onCancel = () => {
    this.props.dispatch({
      type: 'webhook/changeModal',
      payload: {
        visible: false,
        editStatus: false,
      },
    });
    this.props.dispatch({
      type: 'webhook/saveDetail',
      payload: [],
    });
    this.props.form.resetFields();
  };

  render() {
    const { dispatch, webhook: { showModal, detail, editStatus }, form, namespace, appName } = this.props;
    const { getFieldDecorator, validateFields, resetFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (err) {
          message.error('请检查参数是否填写完整~');
          return;
        }
        if (this.state.events.length < 1) {
          message.error('请选择关注事件~');
          return;
        }
        const param = values;
        param.events = this.state.events;
        param.target = 'app';
        param.namespace = namespace;
        param.app_name = appName;
        param.type = 'modal';
        console.log("param", param)
        if (editStatus) {
          param.id = detail.id;
          dispatch({
            type: 'webhook/update',
            payload: {
              ...param,
            },
          });
        } else {
          dispatch({
            type: 'webhook/create',
            payload: {
              ...param,
            },
          });
        }
        resetFields();
      });
    };
    const changeEvents = (value) => {
      this.setState({ events: value });
    };

    return (
      <Modal
        title={editStatus ? '编辑Webhook' : '创建Webhook'}
        visible={showModal}
        onCancel={this.onCancel}
        onOk={onValidateForm}
      >
        <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 800 }}>
          <FormItem label="名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: detail && editStatus ? detail.name : '',
              rules: [
                { required: true, message: '请输入名称' },
              ],
            })(<Input placeholder="Webhook的名称"/>)}
          </FormItem>
          <FormItem label="URL" hasFeedback {...formItemLayout}>
            {getFieldDecorator('url', {
              initialValue: detail && editStatus ? detail.url : '',
              rules: [
                { required: true, message: '请输入调用URL地址' }, {
                  pattern: `^[a-zA-z]+:\\/\\/[^\\s]*$`,
                  message: '请填写正确的url',
                },
              ],
            })(<Input placeholder="调用URL地址"/>)}
          </FormItem>
          <FormItem label="激活状态" {...formItemLayout} >
            {getFieldDecorator('status', {
              initialValue: editStatus && detail ? detail.status : 0,
            })(
              <Radio.Group>
                <Radio value={0}>关闭</Radio>
                <Radio value={1}>激活</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="token:" hasFeedback {...formItemLayout}>
            {getFieldDecorator('token', {
              initialValue: detail && editStatus ? detail.token : '',
            })(<Input placeholder="用于验证请求是该平台发出的（可选）"/>)}
          </FormItem>
          <FormItem label="关注事件" hasFeedback {...formItemLayout} style={{ marginBottom: -5 }}>
            {showModal && <TransferComment {...{
              onOk(v) {
                changeEvents(v);
              },
              checkedEvents: detail && editStatus ? detail.events : [],
            }}
            />}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ webhook }) => ({
  webhook,
}))(AddWebhookModal);
