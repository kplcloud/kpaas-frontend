/**
 * Created by huyunting on 2018/5/22.
 */
import React, { PropTypes } from 'react';
import { Modal, Form, Input, Button, message, Select, Col } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

class AddConfMap extends React.Component {
  state = {
    dataNum: 1,
    defaultValueNum: 0,
    modalType: false,
  };

  constructor(props) {
    super(props);
  };

  componentDidMount() {
    const { modalType, confData } = this.props;
    if (modalType && confData) {
      this.setState({
        defaultValueNum: confData.length,
        modalType: modalType,
      });
    }

  };

  handleOk = () => {
    const { form, onOk, modalType, confData } = this.props;
    const { validateFields, getFieldsValue, resetFields } = form;
    validateFields((errors, values) => {
      if (!errors) {
        const data = {
          ...getFieldsValue(),
        };
        var params = [];
        var configData = [];
        var keydata = [];//所有的key

        for (var i = 1; i <= ((modalType && confData && confData.length) ? confData.length : this.state.dataNum); i++) {
          if (!values['key_' + i]) {
            message.error('请设置key...');
            return;
          }
          if (!values['value_' + i]) {
            message.error('请设置Value...');
            return;
          }
          var info = {
            key: values['key_' + i],
            value: values['value_' + i],
            id: values['id_' + i],
          };
          if (keydata && keydata.length > 0 && values['key_' + i]) {
            if (keydata.indexOf(values['key_' + i]) >= 0) {
              message.error('字典数据的Key有重复。。。');
              return;
            }
          }
          configData.push(info);
          keydata.push(values['key_' + i]);
        }
        params.data = configData;
        params.name = data.name;
        params.namespace = data.namespace;
        params.desc = data.desc;
        onOk(params);
      }
      resetFields();

    });

  };
  handleCancel = () => {
    const { form, onCancel } = this.props;
    onCancel();
    this.setState({ dataNum: 1 };
    form.resetFields();
  };
  addPorts = () => {
    const { dataNum } = this.state;
    if (dataNum >= 5) {
      Modal.warning({
        title: '温馨提示~',
        content: '您创建的数据太多了。。如有需要，请联系管理员~',
      });
      return;
    }
    this.setState({
      dataNum: dataNum + 1,
    });
  };

  render() {
    const { form, btnLoading, visible, namespaces, confMap, modalType, confData } = this.props;
    const { getFieldDecorator } = form;
    const modalOpts = {
      title: '添加字典',
      onOk: this.handleOk,
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key="back" onClick={this.handleCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>
          保存
        </Button>,
      ],
    };
    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name}>{item.display_name}</Option>);
        });
      }
      return items;
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    var items = [];
    for (var i = 1; i <= ((modalType && confData && confData.length) ? confData.length : this.state.dataNum); i++) {
      var defaultId = (modalType && confData && confData.length) ? confData[i - 1].id : 0;
      var defaultKey = (modalType && confData && confData.length) ? confData[i - 1].key : '';
      var defaultValue = (modalType && confData && confData.length) ? confData[i - 1].value : '';
      items.push(
        <div key={i}>
          <Col span={11}>
            <FormItem hasFeedback {...formItemLayout} style={{ marginBottom: 5 }}>
              {getFieldDecorator('key_' + i, {
                initialValue: defaultKey,
                rules: (i == 1) ? [{ required: true, message: '请设置字典数据...' }] : [],
              })(<Input placeholder="请输入Key..." style={{ width: '160px' }}/>)}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem {...formItemLayout} style={{ marginBottom: 5 }}>
              {getFieldDecorator('value_' + i, {
                initialValue: defaultValue,
                rules: (i == 1) ? [{ required: true, message: '请设置字典数据...' }] : [],
              })(<Input placeholder="请输入Value..." style={{ width: '160px' }}/>)}
            </FormItem>
          </Col>
          <Col span={2} style={{ marginBottom: 5 }}><Button onClick={this.addPorts} icon="file-add"/></Col>
          <Col span={1} hidden>
            <FormItem {...formItemLayout} style={{ marginBottom: 5 }}>
              {getFieldDecorator('id_' + i, {
                initialValue: defaultId,
              })(<Input placeholder="请输入Value..."/>)}
            </FormItem>
          </Col>
        </div>,
      );
    }
    // const ruleappid =
    return (<Modal width={600} {...modalOpts} >
      <Form layout="vertical" hideRequiredMark>
        <FormItem label="字典名称:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: (modalType && confMap) ? confMap.name : '',
            rules: [
              { required: true, message: '请输入角色名称' },
            ],
          })(<Input placeholder="请输入角色名称..."/>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="命名空间:"
          hasFeedback
        >
          {getFieldDecorator('namespace', {
            initialValue: (modalType && confMap) ? confMap.namespace : '',
            rules: [
              { required: true, message: '请选择所属命名空间...' },
            ],
          })(
            <Select placeholder="请选择所属命名空间...">
              {namespaces && optionData()}
            </Select>,
          )}
        </FormItem>

        <FormItem label="字典描述:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('desc', {
            initialValue: (modalType && confMap) ? confMap.desc : '',
            rules: [
              {
                required: true,
                message: '请输入字典描述...',
              },
            ],
          })(<TextArea rows={4} placeholder="请输入字典描述..."/>)}
        </FormItem>
        <Form.Item {...formItemLayout} label="字典数据:">
          {items}
        </Form.Item>
      </Form>
    </Modal>);
  }
}

AddConfMap.propTypes = {};

export default Form.create()(AddConfMap);
