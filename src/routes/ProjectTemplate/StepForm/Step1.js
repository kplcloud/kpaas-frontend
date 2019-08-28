import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Divider, message } from 'antd';
import Cookie from 'js-cookie';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step1 extends React.PureComponent {
  state = {
    defaultNamespace: '',
  };

  componentWillMount() {
    const ns = Cookie.get('namespace');
    this.setState({
      defaultNamespace: ns,
    });
  }

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'user/fetchNamespaces',
  //   });
  //
  // }

  // changeNamespace = val => {
  //   Cookie.set('namespace', val);
  // const { dispatch } = this.props;
  // dispatch({
  //   type: 'project/setNamespace',
  //   payload: {
  //     namespace: val
  //   }
  // });
  // };

  render() {
    const { form, dispatch, data } = this.props;
    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const nameEn = values.project_name_en.toLowerCase();
          if (this.state.defaultNamespace === '') {
            message.error('请重选业务空间~');
            return;
          }
          const params = {
            name: nameEn,
            display_name: nameEn,
            namespace: this.state.defaultNamespace,
            desc: values.desc,
          };
          dispatch({
            type: 'project/createProject',
            payload: params,
          });
        }
      });
    };
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          style={{ width: 500 }}
        >
          <Form.Item {...formItemLayout} label="业务空间">
            {getFieldDecorator('namespace', {
              initialValue: this.state.defaultNamespace,
            })(
              <Input disabled={true}/>,
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="项目英文名"
            help="名称不能纯数字，不能有大写，不能有'_'"
          >
            {getFieldDecorator('project_name_en', {
              initialValue: data.project_name_en,
              rules: [{ required: true, message: '请输入项目名称英文名' }],
            })(<Input placeholder="仅支持英文小写字母 数字 - "/>)}
          </Form.Item>

          <Form.Item {...formItemLayout} label="项目描述" style={{ marginTop: 20 }}>
            {getFieldDecorator('desc', {
              initialValue: data.project_name_en,
            })(<Input.TextArea type="textarea" maxLength="1000" placeholder="请填写项目描述..."/>)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }}/>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如有不清楚请联系管理员</h4>
          <p>请根据自己的需求设置合适的参数。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ project, user }) => ({
  data: project,
  namespaces: user.namespaces,
}))(Step1);
