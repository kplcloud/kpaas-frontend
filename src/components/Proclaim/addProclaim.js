import React, {PropTypes} from 'react'
import {Modal, Form, Input, Button, message, Select} from 'antd'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

class AddProclaim extends React.Component {

  constructor(props) {
    super(props);
  };

  state = {
    editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'), // 设置编辑器初始内容
    outputHTML: '<p></p>'
  }

  componentDidMount () {
    this.isLivinig = true
    // 3秒后更改编辑器内容
    setTimeout(this.setEditorContentAsync, 3000)
  }

  componentWillUnmount () {
    this.isLivinig = false
  }

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
  }

  setEditorContentAsync = () => {
    this.isLivinig && this.setState({
      editorState: BraftEditor.createEditorState('<p>你好，<b>世界!</b><p>')
    })
  }

  handleOk = () => {
    const {form, onOk} = this.props;
    const {validateFields, getFieldsValue, resetFields} = form;
    validateFields((errors) => {
      if (errors) {
        message.error("请填写完整信息~")
        return
      }
      const data = {
        ...getFieldsValue(),
      };
      onOk(data);
    });
    resetFields();
  };
  handleCancel = () => {
    const {form, onCancel} = this.props;
    onCancel();
    form.resetFields();
  };

  optionData = (data) => {
    var items = []
    if (data && data.length) {
      data.map((item, key) => {
        items.push(<Option key={key} value={data[key]["id"]}>{data[key]["name"]}</Option>)

      });
    }
    return items
  }
  selectChildren = (data) => {
    const children = [];
    if (data && data.length) {
      data.map((item, key) => {
        children.push(<Option key={key} value={data[key]["id"]}>{data[key]["name"]}</Option>)
      })
    }
    return children
  }

  selectUserChildren = (data) => {
    const children = [];
    if (data && data.length) {
      data.map((item, key) => {
        children.push(<Option key={key} value={data[key]["id"]}>{data[key]["username"]}</Option>)
      })
    }
    return children
  }



  render() {
    const {form, btnLoading, visible, modalType, oneMember, roleList, namespaceList,userList} = this.props;
    const {getFieldDecorator} = form;
    const namespaces = () => {
      const items = []
      if (oneMember && oneMember.namespaces) {
        oneMember.namespaces.map((item, key) => {
          items.push(oneMember.namespaces[key]["name_en"])
        })
      }
      return items
    }
 
    const modalOpts = {
      title: '添加公告',
      onOk: this.handleOk,
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key="back" onClick={this.handleCancel}>取消</Button>,
        <Button key="submit" type="primary" loading={btnLoading} onClick={this.handleOk}>
          保存
        </Button>,
      ]
    };
    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    return (<Modal {...modalOpts}>
      <Form layout="vertical" hideRequiredMark>
        <FormItem label="标题:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: modalType ? curProclaim.title : "",
            rules: [
              {required: true, message: '请输入公告标题'}
            ],
          })(<Input placeholder="请输入公告标题"/>)}
        </FormItem>
        <FormItem label="内容:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('content', {
            initialValue: modalType ? curProclaim.content : "",
            rules: [
              {
                required: true,
                message: '请输入公告内容',
              },
            ],
          })(<TextArea placeholder="请输入公告内容" rows={4}/>)}
        </FormItem>
        <FormItem label="类型:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('proclaim_type', {
            initialValue: modalType ? curProclaim.proclaim_type : "all",
            rules: [
              {
                required: true,
                message: '请选择用户状态...',
              },
            ],
          })(<Select placeholder="请选择用户状态...">
            <Option key="all" value="all">全部</Option>
            <Option key="namespace" value="namespace">业务空间</Option>
            <Option key="user" value="user">指定用户</Option>
          </Select>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="指定业务空间"
          hasFeedback
        >
          {getFieldDecorator('namespace', {
            initialValue: [],
            rules: [
              {required: false, message: '请选择所属业务空间'},
            ],
          })(
            <Select
              mode="multiple"
              style={{width: '100%'}}
              placeholder="请选择所属业务空间"
            >
              {namespaceList && this.selectChildren(namespaceList)}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="指定用户"
          hasFeedback
        >
          {getFieldDecorator('userlist', {
            initialValue: [],
            rules: [
              {required: false, message: '请选择用户'},
            ],
          })(
            <Select
              mode="multiple"
              style={{width: '100%'}}
              placeholder="请选择所用户"
            >
              {userList && this.selectUserChildren(userList)}
            </Select>
          )}
        </FormItem>
        <div>
        <div className="editor-wrapper">
          <BraftEditor
            value={this.state.editorState}
            onChange={this.handleChange}
          />
        </div>
        <h5>输出内容</h5>
        <div className="output-content">{this.state.outputHTML}</div>
      </div>
      </Form>
    </Modal>)
  }
}

AddProclaim.propTypes = {};

export default Form.create()(AddProclaim)
