import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';


@Form.create()
class addGroup extends PureComponent {

  state = {
    ns: "default",
  };

  fetchUser = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': value,
        'ns': this.state.ns,
      },
    });
  };

  handleNsChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/memberlike',
      payload: {
        'email': 'cn',
        'ns': value,
      },
    });
    this.setState({ns:value})
  };

  displayNameChange = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/groupDisplayNameExists',
      payload: {
        'display_name': value,
      },
    }).then((res) => {
      if (res === true) {
        callback()
      } else {
        callback("别名已存在")
      }
    });
  };

  nameChange = (rule, value, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/groupNameExists',
      payload: {
        'name': value,
      },
    }).then((res) => {
      if (res === true) {
        callback()
      } else {
        callback("已存在,建议使用业务空间名.组英文名")
      }
    });
  };

  render() {
    const {
      visible, onCancel, onCreate, form,ownNamespacesList,memberlike,
    } = this.props;
    const { getFieldDecorator } = form;
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
    const renderNamespaceOption = () => {
      const options = [];
      if (ownNamespacesList && ownNamespacesList.length) {
        ownNamespacesList.map((item) => options.push(
          <Select.Option
            value={item.name}
            key={item.name}
          >{item.display_name}
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
              rules: [{ validator: this.displayNameChange },{ required: true, message: '请输入组别名' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item
            label="Name"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('name', {
              rules: [ { validator: this.nameChange },{ required: true, message: '请输入组名(可字母下划线)' }],
            })(<Input type="textarea" />)}
          </Form.Item>

          <Form.Item
            label="Namespace"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('namespace', {
              rules: [{ required: true, message: '请选择namespace' }],
              initialValue: 'default',
            })(
              <Select
                showSearch
                placeholder=""
                optionFilterProp="children"
                onChange={this.handleNsChange}
              >
                {renderNamespaceOption()}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label="Owner"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('memberId', {
              rules: [{ required: true, message: '请选择一个组长' }],
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
  // memberList: group.memberList,
}))(addGroup);
