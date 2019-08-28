import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Form, Input, Radio, Modal, Select} from 'antd';
const FormItem = Form.Item;
const Option = Select;
const modalTitle = [];
modalTitle['1'] = '同级创建';
modalTitle['2'] = '下级创建';
modalTitle['3'] = '删除';
modalTitle['4'] = '修改';

@Form.create()
class AddPerm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const {onCreate, form, item, keyType} = this.props;
    form.validateFields((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);
        return;
      }
      values.id = item.key;
      onCreate(keyType, {
        ...values,
      });
    });
    //删除表单内容
    form.resetFields();
  };

  render() {
    const {visible, onCancel, form, item, keyType, loading} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Modal
        visible={visible}
        title={`${modalTitle[keyType]} 路由`}
        okText={modalTitle[keyType]}
        onCancel={onCancel}
        onOk={this.handleSubmit}
        confirmLoading={loading}
      >
        <Form layout="vertical">
          <FormItem label="路由名称">
            {getFieldDecorator('name', {
              initialValue: item ? item.name : '',
              rules: [{required: true, message: '请输入名称!'}],
            })(<Input />)}
          </FormItem>
          <FormItem label="路由路径">
            {getFieldDecorator('path', {
              initialValue: item ? item.path : '',
              rules: [{required: true, message: '请输入路径!'}],
            })(<Input />)}
          </FormItem>
          <FormItem label="Icon">
            {getFieldDecorator('icon', {
              initialValue: item ? item.icon : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="Method">
            {getFieldDecorator('method', {
              initialValue: item ? item.method : '',
            })(
              <Select style={{width: 120}}>
                <Option value="GET">GET</Option>
                <Option value="POST">POST</Option>
                <Option value="PUT">PUT</Option>
                <Option value="PATCH">PATCH</Option>
                <Option value="DELETE">DELETE</Option>
                <Option value="COPY">COPY</Option>
                <Option value="HEAD">HEAD</Option>
              </Select>
            )}
          </FormItem>
          <FormItem className="collection-create-form_last-form-item">
            {getFieldDecorator('menu', {
              initialValue: item ? item.menu : false,
            })(
              <Radio.Group>
                <Radio value={true}>是菜单</Radio>
                <Radio value={false}>不是菜单</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
export default connect(({system}) => ({
  system: system,
}))(AddPerm);
