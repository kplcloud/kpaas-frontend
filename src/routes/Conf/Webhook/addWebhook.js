/**
 * Created by huyunting on 2018/5/17.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Radio, Input, message, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../../components/Security/namespaceSelect';
import TransferComment from '../../../components/Conf/Transfer';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddWebhook extends PureComponent {
  state = {
    target: 'global',
    events: [],
    checkNamespace: '',
    clearCache: false,
  };

  componentDidMount() {
    const { match: { params }, dispatch } = this.props;
    this.setState({ clearCache: true });
    if (params && params.id > 0) {
      dispatch({
        type: 'webhook/detailNoApp',
        payload: {
          id: params.id,
        },
      });
      dispatch({
        type: 'webhook/changeReload',
        payload: {
          reload: true,
          editStatus: true,
        },
      });
    } else {
      dispatch({
        type: 'webhook/changeReload',
        payload: {
          reload: true,
          editStatus: false,
        },
      });
    }

  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'webhook/changeReload',
      payload: {
        reload: false,
        editStatus: false,
      },
    });
    this.props.dispatch({
      type: 'webhook/saveDetail',
      payload: [],
    });
  }

  onReturn = () => {
    this.props.dispatch(routerRedux.push('/conf/webhook/list'));
  };

  changeTarget = (e) => {
    this.setState({ target: e.target.value });
  };

  render() {
    const { dispatch, webhook: { detail, editStatus, reload }, form } = this.props;
    const { getFieldDecorator, validateFields, resetFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (err) {
          message.error('请检查参数是否填写完整~');
          return;
        }
        if (this.state.events.length < 1) {
          message.error('请选择关注事件~');
          return;
        }
        if (!this.state.checkNamespace && values.target !== 'global') {
          message.error('请选择命名空间');
          return;
        }
        const param = values;
        param.events = this.state.events;
        if (values.target !== 'global') {
          param.namespace = this.state.checkNamespace;
        }
        param.type = '';
        param.status = values.status;
        if (editStatus) {
          dispatch({
            type: 'webhook/update',
            payload: {
              ...param,
              id: detail.id,
            },
          });
        } else {
          dispatch({
            type: 'webhook/create',
            payload: {
              ...param,
            },
          });
        }

        resetFields();
      });
    };
    const changeEvents = (value) => {
      this.setState({ events: value });
    };
    const selectNamespace = (value) => {
      this.setState({ checkNamespace: value });
    };
    const namespaceSelectPros = {
      disabledStatus: false,
      defaultNamespace: editStatus && detail ? detail.namespace : '',
      onOk(value) {
        selectNamespace(value);
      },
    };
    const pageContent = (
      <span>
        <p>Webhook，也就是人们常说的钩子,是一个很有用的工具，通过定制 Webhook 来监测你在 Kplcloud 上的各种事件，最常见的莫过于 Build 事件。<br/>
        如果设置了一个监测 Build 事件的 Webhook，那么每当你的这个项目有了构建操作，这个 Webhook 都会被触发，这时 Kplcloud 就会发送一个 HTTP POST 请求到你配置好的地址。
        </p>
      </span>
    );

    return (
      <PageHeaderLayout title="Webhooks" content={pageContent}>
        <Card title={editStatus ? '编辑 Webhook' : '创建 Webhook'}>
          <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 600, marginLeft: 100 }}>
            <FormItem label="名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: editStatus && detail ? detail.name : '',
                rules: [
                  { required: true, message: '请输入名称' },
                ],
              })(<Input placeholder="Webhook的名称"/>)}
            </FormItem>
            <FormItem label="URL" hasFeedback {...formItemLayout}>
              {getFieldDecorator('url', {
                initialValue: editStatus && detail ? detail.url : '',
                rules: [
                  { required: true, message: '请输入调用URL地址' }, {
                    pattern: `^[a-zA-z]+:\\/\\/[^\\s]*$`,
                    message: '请填写正确的url',
                  },
                ],
              })(<Input placeholder="调用URL地址"/>)}
            </FormItem>
            <FormItem label="token:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('token', {
                initialValue: editStatus && detail ? detail.token : '',
              })(<Input placeholder="用于验证请求是该平台发出的（可选）"/>)}
            </FormItem>
            <FormItem label="钩子类型" {...formItemLayout} help="global接收全局数据，app仅接收设置应用的数据">
              {getFieldDecorator('target', {
                initialValue: editStatus && detail ? detail.target : this.state.target,
              })(
                <Radio.Group onChange={this.changeTarget}>
                  <Radio value="global">global</Radio>
                  <Radio value="app">app</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem label="激活状态" {...formItemLayout} >
              {getFieldDecorator('status', {
                initialValue: editStatus && detail ? detail.status : 0,
              })(
                <Radio.Group>
                  <Radio value={0}>关闭</Radio>
                  <Radio value={1}>激活</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            {(this.state.target === 'app' || editStatus && detail && detail.target === 'app') && reload &&
            <FormItem label="应用名称及业务空间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('app_name', {
                initialValue: editStatus && detail ? detail.app_name : '',
                rules: [
                  { required: true, message: '请填写完整应用名称' },
                ],
              })(<Input placeholder="应用名称" addonBefore={(<NamespaceSelect {...namespaceSelectPros} />)}/>)}
            </FormItem>
            }
            <FormItem label="关注事件" hasFeedback {...formItemLayout}>
              {reload &&
              <TransferComment {...{
                onOk(v) {
                  changeEvents(v);
                },
                checkedEvents: detail && editStatus ? detail.events : [],
              }}
              />}
            </FormItem>

            <Form.Item style={{ marginTop: 20 }}>
              <Button type="default" onClick={this.onReturn} style={{ marginLeft: 100, marginRight: 100 }}>取消</Button>
              <Button type="primary" onClick={onValidateForm}>提交</Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ webhook }) => ({
  webhook,
}))(AddWebhook);
