import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';


@Form.create()
class addGroupCronjob extends PureComponent {
  state = {
    ns: "",
  };
  componentWillMount() {
    this.fetchUser = this.fetchUser.bind(this);
    this.setState({ns: ""})
  }
  fetchUser = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'group/namespaceCronjobList',
      ns: this.state.ns.name,
      payload: {
        'name': value,
      },
    });
  };

  render() {
    const {
      visible, onCancel, onCreate, form,addGroupCronjobRecord,nsCronjobList,
    } = this.props;

    this.setState({ns: addGroupCronjobRecord.ns});

    const { getFieldDecorator } = form;
    const hiddenStyle = {
      display: 'none',
    };
    const renderOption = () => {

      const options = [];
      if (nsCronjobList && nsCronjobList.length) {
        nsCronjobList.map((item) => options.push(
          <Select.Option
            value={item.id}
            key={item.id}
          >{item.name}
          </Select.Option>
        ))
      }
      return options
    };
    return (
      <Modal
        visible={visible}
        title="添加定时任务"
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
              initialValue: addGroupCronjobRecord.id,
            })(<Input type='hidden' />)}
          </Form.Item>
          <Form.Item
            label="定时任务"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('cronjob_id', {
              rules: [{ required: true, message: '请选择一个定时任务' }],
            })(
              <Select
                showSearch
                onSearch={this.fetchUser.bind(this)}
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
}))(addGroupCronjob);
