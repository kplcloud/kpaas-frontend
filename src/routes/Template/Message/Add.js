/**
 * Created by huyunting on 2018/10/12.
 */
import React, {Fragment} from "react";
import {routerRedux} from "dva/router";
import {connect} from "dva";
import {Form, Input, Button, Card} from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "../TempList.css";
import SketchExample from "../../../components/ReactColor/ReactColor";

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddMessage extends React.PureComponent {
  state = {
    id: 0,
    name: "新增模板",
    data: [],
    temp_content_color: "#F5A623",
    temp_title_color: "#0c7acc",
    temp_desc_color: "#cc4549",
  };

  componentDidMount() {
    const {dispatch, match} = this.props;
    if (match.params && match.params.id > 0) {
      dispatch({
        type: "msgtemp/GetOneMsgTemplate",
        payload: {
          "id": match.params.id,
        }
      });
    } else {
      this.setState({data: [], id: 0})
    }
    dispatch({
      type: "user/fetchNamespaces",
    });
  }

  render() {
    const {form, dispatch, match, data} = this.props;
    const {params} = match;
    const that = this;
    if (params && params.id > 0) {
      this.setState({
        id: params.id,
        name: "修改模板",
        data: data,
      })
    }
    const {getFieldDecorator, validateFields} = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          if (this.state.id > 0) {
            values.id = this.state.id;
            dispatch({
              type: "msgtemp/updateMsgTemplate",
              payload: values,
            });
          } else {
            dispatch({
              type: "msgtemp/createMsgTemplate",
              payload: values,
            });
          }

        }
      });
    };

    const onReturn = () => {
      dispatch(routerRedux.push("/template/message/list"));
    };

    const messageColorProps = {
      color: this.state.temp_content_color,
      onOk(value){
        that.setState({temp_content_color: value.hex});
      },
    };
    const checkColor = (
      <SketchExample {...messageColorProps}/>
    );

    const titleColorProps = {
      color: this.state.temp_title_color,
      onOk(value){
        that.setState({temp_title_color: value.hex});
      },
    };
    const checkTitleColor = (
      <SketchExample {...titleColorProps}/>
    );

    const DescColorProps = {
      color: this.state.temp_desc_color,
      onOk(value){
        that.setState({temp_desc_color: value.hex});
      },
    };
    const checkDescColor = (
      <SketchExample {...DescColorProps}/>
    );

    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          title={this.state.name}
          style={{marginTop: 16}}
        >
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark style={{maxWidth: 700}}>
            <Form.Item {...formItemLayout} label="模板名称" help="发放通知时选择对应模板，仅支持英文数字">
              {getFieldDecorator("name", {
                initialValue: this.state.data.length !== 0 ? data.name : "",
                rules: [{required: true, message: "请输入模板名称"}],
              })(<Input placeholder="请输入模板名称"/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="模板ID">
              {getFieldDecorator("code", {
                initialValue: "",
                rules: [{required: true, message: "请输入模板ID"}],
              })(<Input placeholder="请输入模板ID"/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息文字颜色">
              {getFieldDecorator("content_color", {
                initialValue: this.state.temp_content_color,
              })(
                <Input addonBefore={checkColor} disabled={true}/>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息连接地址" help="点击这个通知时跳转的链接，如果为空，则进入系统默认的链接">
              {getFieldDecorator("content_link", {
                initialValue: "",
                rules: [{required: true, message: "消息连接地址"}],
              })(<Input placeholder="消息连接地址"/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息标题" help="通知消息的头部信息，用于说明通知消息的主要内容">
              {getFieldDecorator("title", {
                initialValue: "",
                rules: [{required: true, message: "消息标题"}],
              })(<Input placeholder="消息标题"/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息标题颜色">
              {getFieldDecorator("title_color", {
                initialValue: this.state.temp_title_color,
                rules: [{required: true, message: "消息标题颜色"}],
              })(<Input addonBefore={checkTitleColor} disabled={true}/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息备注" help="通知消息的结束部分，用于补充说明">
              {getFieldDecorator("description", {
                initialValue: "",
                rules: [{required: true, message: "消息备注"}],
              })(<Input placeholder="消息备注"/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="消息备注颜色">
              {getFieldDecorator("desc_color", {
                initialValue: this.state.temp_desc_color,
                rules: [{required: true, message: "消息备注颜色"}],
              })(<Input addonBefore={checkDescColor} disabled={true}/>)}
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: {span: 24, offset: 0},
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button onClick={onReturn}>返回</Button>
              <Button type="primary" onClick={onValidateForm} style={{marginLeft: "200px"}}>提交</Button>
            </Form.Item>
          </Form>
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({msgtemp}) => ({
  data: msgtemp
}))(AddMessage);
