import React, { PureComponent } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';


@Form.create()
class addGroupProject extends PureComponent {
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
      type: 'group/namespaceProjectList',
      ns: this.state.ns.name,
      payload: {
        'name': value,
      },
    });
  };

  render() {
    const {
      visible, onCancel, onCreate, form,addGroupProjectRecord,nsProjectList,
    } = this.props;

    const { getFieldDecorator } = form;
    const hiddenStyle = {
      display: 'none',
    };
    const renderOption = () => {

      this.setState({ns: addGroupProjectRecord.ns});
      const options = [];
      if (nsProjectList && nsProjectList.length) {
        nsProjectList.map((item) => options.push(
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
        title="添加项目"
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
              initialValue: addGroupProjectRecord.id,
            })(<Input type='hidden' />)}
          </Form.Item>
          <Form.Item
            label="项目"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 12 }}
          >
            {getFieldDecorator('project_id', {
              rules: [{ required: true, message: '请选择一个项目' }],
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
}))(addGroupProject);
