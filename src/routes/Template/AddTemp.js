/**
 * Created by huyunting on 2018/5/15.
 */
import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Card} from 'antd';
import styles from './TempList.css';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddTemp extends React.PureComponent {
  state = {
    id: 0,
    name: "新增模板",
    data: [],
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    if (match.params && match.params.id > 0) {
      dispatch({
        type: 'template/GetOneTemplate',
        payload: {
          "id": match.params.id,
        }
      });
    } else {
      this.setState({data: [], id: 0})
    }
    dispatch({
      type: 'user/fetchNamespaces',
    });
  }


  render() {
    const {form, dispatch, match, data} = this.props;
    const {params} = match;
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
            values.id = this.state.id
            dispatch({
              type: 'template/updateTemplate',
              payload: values,
            });
          } else {
            dispatch({
              type: 'template/createTemplate',
              payload: values,
            });
          }

        }
      });
    };
    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          title={this.state.name}
          style={{marginTop: 16}}
        >
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark style={{maxWidth: 700}}>
            <Form.Item {...formItemLayout} label="模板名称">
              {getFieldDecorator('name', {
                initialValue: this.state.data.length != 0 ? data.name : "",
                rules: [{required: true, message: '请输入模板名称'}],
              })(<Input placeholder="请输入模板名称"/>)}
            </Form.Item>
            {this.state.data.length != 0 && (
              <Form.Item {...formItemLayout} label="Kind">
                {getFieldDecorator('kind', {
                  initialValue: data.kind,
                  rules: [{required: true, message: '请输入模板Kind'}],
                })(<Input placeholder="请输入模板Kind" disabled={true}/>)}
              </Form.Item>
            )}
            {this.state.data.length == 0 && (
              <Form.Item {...formItemLayout} label="Kind">
                {getFieldDecorator('kind', {
                  initialValue: "",
                  rules: [{required: true, message: '请输入模板Kind'}],
                })(<Input placeholder="请输入模板Kind"/>)}
              </Form.Item>
            )}


            <Form.Item {...formItemLayout} label="模板内容">
              {getFieldDecorator('detail', {
                initialValue: this.state.data.length != 0 ? data.detail : "",
                rules: [{required: true, message: '请输入模板内容'}],
              })(<Input.TextArea rows={16} type="textarea" maxLength="10000" placeholder="请输入模板内容..."/>)}
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
              <Button type="primary" onClick={onValidateForm}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({template}) => ({
  data: template.oneTempData
}))(AddTemp);
