import React, { Fragment} from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Form, Input, Button, Select, Divider,message, Radio } from 'antd';
import styles from './style.less';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class CreateProclaim extends React.PureComponent {
  componentDidMount() {
  	this.isLivinig = true
    // 3秒后更改编辑器内容
    setTimeout(this.setEditorContentAsync, 3000)

    const { dispatch } = this.props;
    dispatch({
      type: "proclaim/userList"
    })
    dispatch({
      type: "proclaim/namespacesList"
    })
    dispatch({
      type: "proclaim/addProclaimStatus"
    })
  }


  state = {
    editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
    outputHTML: '',
    radioValue: "all",
  }


  componentWillUnmount () {
    this.isLivinig = false
  }

  onChangeRadio = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: editorState.toHTML()
    })
  }

  setEditorContentAsync = () => {
    this.isLivinig && this.setState({
      editorState: BraftEditor.createEditorState('')
    })
  }

  selectChildren = (data) => {
    const children = [];
    if (data && data.length) {
      data.map((item, key) => {
        children.push(<Option key={key} value={data[key]["name"]}>{data[key]["display_name"]}</Option>)
      })
    }
    return children
  }

  selectUserChildren = (data) => {
    const children = [];
    if (data && data.length) {
      data.map((item, key) => {
        children.push(<Option key={key} value={data[key]["email"]}>{data[key]["username"]}</Option>)
      })
    }
    return children
  }
  //

  render() {
    const { form, dispatch, userList, namespaceList,addProclaimStatus } = this.props;  //console.log("createProclaim",this.props)
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          values.content=this.state.outputHTML
          //console.log("post",values)
 		      dispatch({
            type: 'proclaim/addProclaim',
            payload: values,
          })

          //直接跳转，原为弹层，改为跳转新页打开
          //dispatch(routerRedux.push('/system/proclaim'));
        }
      });
    };

    //隐藏控件
    const excludeControls=['emoji']
    return (
      <Fragment>
        <Form layout="vertical"
          className={styles.stepForm}
          style={{background:"#fff"}}
        >
        <FormItem label="标题:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: "",
            rules: [
              {required: true, message: '请输入公告标题'}
            ],
          })(<Input placeholder="请输入公告标题"/>)}
        </FormItem>
        <FormItem label="内容:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('text', {
            initialValue: "",
            rules: [],
          })(<div>
		        <div className="editor-wrapper" style={{border:"1px solid #eee"}}>
		          <BraftEditor
                excludeControls={excludeControls}
		            value={this.state.editorState}
		            onChange={this.handleChange}
		          />
		        </div>
	    	</div>)}
        </FormItem>
		<FormItem label="类型:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('proclaim_type', {
            initialValue: "all",
            rules: [
              {
                required: true,
                message: '请选择用户状态...',
              },
            ],
          })(<RadioGroup onChange={this.onChangeRadio} style={{width:300}}>
		        <Radio value="all">全部</Radio>
		        <Radio value="namespace">业务空间</Radio>
		        <Radio value="user">指定用户</Radio>
      		</RadioGroup>
      		)}
        </FormItem>


       {this.state.value == "namespace" ?
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
                showSearch
	              mode="multiple"
	              style={{width: '100%'}}
	              placeholder="请选择所属业务空间"
	            >
	              {namespaceList && this.selectChildren(namespaceList)}
	            </Select>
	          )}
	        </FormItem>
	    :null}

		{this.state.value == "user" ?
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
                showSearch
	            >
	              {userList && this.selectUserChildren(userList)}
	            </Select>
	          )}
	        </FormItem>
	    :null}

	    <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button
            type="primary"
            onClick={onValidateForm}
            style={{ marginLeft: 8 }}
          >
            提交
          </Button>
        </Form.Item>
        
      </Form>

        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如有不清楚请联系管理员</h4>
          <p>请根据自己的需求设置合适的参数。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ proclaim }) => ({
  userList: proclaim.userList,
  namespaceList: proclaim.allNamespacesList,
}))(CreateProclaim);
