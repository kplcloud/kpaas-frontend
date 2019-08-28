import React, { PropTypes } from 'react';
import { Input, Button, Card, Divider, Form, message, Modal } from 'antd';

const confirm = Modal.confirm;

@Form.create()
class ConsulEdit extends React.Component {

  constructor(props) {
    super(props);
  };

  confirmDeleteDir = (value) => {
    const { onDeleteFilder } = this.props;
    confirm({
      title: `您确定要删除 ${value} 目录吗`,
      content: `删除目录 ${value} 之后，会导致项目读取配置失败，您确定要删除吗？`,
      onOk() {
        onDeleteFilder();
      },
    });
  };

  confirmDelete = (value) => {
    const { onDelete } = this.props;
    confirm({
      title: `您确定要删除 ${value} 键值吗`,
      content: `删除 ${value} 之后，会导致项目读取配置失败，您确定要删除吗？`,
      onOk() {
        onDelete();
      },
    });
  };

  handleSubmit = (e) => {
    const { onSubmit, prefix, form: { validateFields, resetFields } } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        onSubmit(prefix + values.prefix, values.value);
        console.log('Received values of form: ', values);
      } else {
        message.error('键值填写不完整~');
        return;
      }
      resetFields();
    });
  };

  handleSubmitUpdate = (e) => {
    const { onOk, form: { validateFields, resetFields } } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        onOk(values.value);
        resetFields();
      } else if (err.value && err.value.errors && err.value.errors[0] && err.value.errors[0].message) {
        message.error(err.value.errors[0].message);
      }
    });
  };

  render() {
    const { title, value, prefix, onCancel, showPrefix, deleteKey } = this.props;
    const { getFieldDecorator } = this.props.form;
    if (showPrefix === '') {
      return (
        <Card
          title="Create Key"
          bordered={false}
          bodyStyle={{ padding: '10 10 0 0' }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item help={`如果要创建目录，请以 / 结尾`}>
              {getFieldDecorator('prefix', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  addonBefore={prefix}
                />,
              )}
            </Form.Item>
            <Form.Item help={`值可以是任何格式,长度为10000字符以内`}>
              {getFieldDecorator('value', {
                initialValue: '',
                rules: [
                  { required: true, message: '请填写完整值...' },
                  {
                    max: 10000,
                    message: '值的长度请保持在10000字符以内',
                  }],
              })(
                <Input.TextArea
                  rows={4}
                  style={{ marginTop: 20 }}
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Divider/>
              <Button type="primary" ghost htmlType="submit">创建</Button>
              <Button
                type="danger"
                ghost
                style={{ float: 'right' }}
                onClick={() => this.confirmDeleteDir(deleteKey)}
              >
                删除目录
              </Button>
            </Form.Item>
          </Form>

        </Card>
      );
    } else {
      return (
        <Card title={title ? title : prefix} bordered={false}>
          <Form onSubmit={this.handleSubmitUpdate}>
            <Form.Item help="值可以是任何格式,长度为10000字符以内">
              {getFieldDecorator('value', {
                initialValue: value,
                rules: [
                  {
                    required: true,
                    message: '请填写完整值...',
                  },
                  {
                    max: 10000,
                    message: '值的长度请保持在10000字符以内',
                  }],
              })(
                <Input.TextArea rows={6}/>,
              )}
            </Form.Item>
            <Form.Item>
              <Divider/>
              <Button type="primary" ghost htmlType="submit">更新</Button>
              <Button style={{ marginLeft: 20 }} onClick={() => onCancel()}>取消</Button>
              <Button type="danger" style={{ float: 'right' }} ghost
                      onClick={() => this.confirmDelete(deleteKey)}>删除</Button>
            </Form.Item>
          </Form>
        </Card>
      );
    }

  };

}


ConsulEdit.propTypes = {};

export default (ConsulEdit);
