import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';


@Form.create()
class ownerUpdateGroup extends PureComponent {


  render() {
    const {
      visible, onCancel, onCreate, form,updateRecord,
    } = this.props;

    const { getFieldDecorator } = form;
    const hiddenStyle = {
      display: 'none',
    };

    return (
      <Modal
        visible={visible}
        title="修改组"
        okText="Update"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="horizontal">
          <Form.Item
            label="组别名"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('display_name', {
              rules: [{ required: true, message: '请输入组别名' }],
              initialValue: updateRecord.display_name,
            })(
              <Input  />
            )}
          </Form.Item>
          <Form.Item
            label="组名"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入组名(可字母下划线)' }],
              initialValue: updateRecord.name,
            })(<Input  />)}
          </Form.Item>

          <Form.Item
            label="id"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            style={hiddenStyle}
          >
            {getFieldDecorator('id', {
              initialValue: updateRecord.id,
            })(<Input type='hidden' />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default connect(() => ({
  // memberList: group.memberList,
}))(ownerUpdateGroup);
