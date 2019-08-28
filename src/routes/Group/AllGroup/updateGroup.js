import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';


@Form.create()
class updateGroup extends PureComponent {
  fetchUser = (value) => {
    const { dispatch,updateRecord } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': value,
        'ns': updateRecord.namespace.name,
      },
    });
  };

  // componentDidMount() {
  //   const { dispatch,updateRecord } = this.props;
  //   dispatch({
  //     type: 'group/memberlike',
  //     payload: {
  //       'ns': updateRecord.namespace,
  //     },
  //   })
  // }

  render() {
    const {
      visible, onCancel, onCreate,form,updateRecord,memberlike
    } = this.props;
    console.log(updateRecord.name);
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
        title="创建组"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="horizontal">
          <Form.Item
            label="DisplayName"
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
            label="Name"
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
          <Form.Item
            label="Namespace"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('namespace', {
              initialValue: updateRecord.namespace ? updateRecord.namespace.display_name: "",
            })(
              <Select
                disabled
              />
            )}
          </Form.Item>
          <Form.Item
            label="owner"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('memberId', {
              rules: [{ required: true, message: '请选择一个组长' }],
              initialValue: updateRecord.owner ?   updateRecord.owner.id   : "",
            })(
              <Select
                showSearch
                onSearch={this.fetchUser}
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
}))(updateGroup);
