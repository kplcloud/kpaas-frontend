import React, { Fragment} from 'react';
import { connect } from 'dva';
import {routerRedux} from 'dva/router';
import { Form, Input, Button, Select, Divider,message, Radio,Icon } from 'antd';
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
class ViewProclaim extends React.PureComponent {
  componentDidMount() {
  	this.isLivinig = true
    // 3秒后更改编辑器内容
    setTimeout(this.setEditorContentAsync, 3000)

    const { dispatch } = this.props;
    dispatch({
      type: "proclaim/viewProclaim",
      payload:{
      	id:this.props.match.params.id
      }
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

  onList = () => {
    const {dispatch} = this.props

    //直接跳转，原为弹层，改为跳转新页打开
    dispatch(routerRedux.push('/system/proclaim'));
  };

  render() {
    const { form, dispatch,proclaimView } = this.props;  //console.log("viewProclaim",this.props)
    const { getFieldDecorator, validateFields } = form;

    //隐藏控件
    const excludeControls=['emoji']
    return (
		
      <Fragment>
      		<Button type="dashed" style={{width: "100%", marginBottom: 20}} onClick={this.onList}>
            <Icon type="plus"/>返回列表
          </Button>

        <Form layout="vertical"
          className={styles.stepForm}
          style={{background:"#fff"}}
        >
        <FormItem label="标题:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('title', {
            initialValue: "",
            rules: [
              {required: false, message: '请输入公告标题'}
            ],
          })(<span>{proclaimView.title?proclaimView.title:""}</span>)}
        </FormItem>
        <FormItem label="内容:" hasFeedback {...formItemLayout}>
          {getFieldDecorator('text', {
            initialValue: "",
            rules: [],
          })(<span dangerouslySetInnerHTML={{ __html:proclaimView.content?proclaimView.content:""}}></span>)}
        </FormItem>
        </Form>

        <Divider style={{ margin: '40px 0 10px' }} />
      </Fragment>
    );
  }
}

export default connect(({ proclaim }) => ({
	proclaimView: proclaim.proclaimView,
}))(ViewProclaim);
