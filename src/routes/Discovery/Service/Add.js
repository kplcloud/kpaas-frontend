import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button, Tabs } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import CreateForm from './CreateForm';
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

@connect(({ services }) => ({
  list: services.list,
  loading: services.loading,
}))
@Form.create()
export default class Add extends PureComponent {
  state = {
    editState: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    if (params && params.name && params.namespace) {
      this.setState({ editState: true });
      dispatch({
        type: 'services/detail',
        payload: {
          name: params.name,
          namespace: params.namespace,
        },
      });
    }
  }

  subYaml = e => {
    e.preventDefault();
    const { dispatch } = this.props;

    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'services/createYaml',
          payload: {
            detail: values.yamldetail,
          },
        });
      }
    });
  };

  render() {
    const { list, loading, dispatch, form, detail } = this.props;
    const { getFieldDecorator } = form;
    const that = this;

    return (
      <PageHeaderLayout title="创建Service">
        <Card bordered={false}>
          <div className="card-container">
            <Tabs size="large">
              <TabPane tab="新建" key="1">
                <CreateForm
                  {...{ editState: this.state.editState, params: this.props.match.params }}
                />
              </TabPane>
              <TabPane tab="从Yaml创建" key="2">
                <Form onSubmit={this.subYaml}>
                  <FormItem>
                    {getFieldDecorator('yamldetail', {
                      rules: [
                        {
                          required: true,
                          message: '请输入yaml代码',
                        },
                      ],
                    })(
                      <TextArea
                        placeholder="请输入yaml代码"
                        autosize={{ minRows: 16, maxRows: 16 }}
                      />
                    )}
                  </FormItem>

                  <FormItem {...formTailLayout}>
                    <Button type="primary" htmlType="submit">
                      提交
                    </Button>
                  </FormItem>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
