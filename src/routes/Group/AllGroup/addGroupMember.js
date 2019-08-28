import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';


@Form.create()
class addGroupMember extends PureComponent {
  fetchUser = (value,ns) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': value,
        'ns': ns,
      },
    });
  };

  render() {
    const {
      visible, onCancel, onCreate, form,memberlike,addGroupMemberRecord,
    } = this.props;

    const ns = this.props.constructor.ns === undefined ? Cookie.get('namespace') : ns;

    const { getFieldDecorator } = form;
    const hiddenStyle = {
      display: 'none',
    };
    const renderOption = () => {
      const options = [];
      if (memberlike && memberlike.length) {
        memberlike.map((item) => options.push(
          <Select.Option
            value={item.id}
            key={item.id}
          >{item.email} | {item.username}
          </Select.Option>
        ))
      }
      return options
    };

    return (
      <Modal
        visible={visible}
        title="添加成员"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="horizontal">
          <Form.Item
            label="group_id"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
            style={hiddenStyle}
          >
            {getFieldDecorator('group_id', {
              initialValue: addGroupMemberRecord.id,
            })(<Input type='hidden' />)}
          </Form.Item>
          <Form.Item
            label="成员"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('member_id', {
              rules: [{ required: true, message: '请选择一个组员' }],
            })(
              <Select
                showSearch
                onSearch={value => this.fetchUser(value,ns)}
                optionFilterProp="children"
                placeholder=""
                style={{ width: '100%' }}
              >
                {renderOption()}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default connect(() => ({
  // memberList: group.memberList,
}))(addGroupMember);
