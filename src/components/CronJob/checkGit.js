/**
 * Created by huyunting on 2018/6/5.
 */
import React from 'react';
import { Row, Form, Input, Card, Select, Col } from 'antd';

const FormItem = Form.Item;

class CheckGit extends React.Component {

  constructor(props) {
    super(props);
  };

  state = {
    gitPath: '',
  };

  render() {
    const { form, onOk, tapValue, pathValue } = this.props;
    const { getFieldDecorator } = form;

    const onchange = (value) => {
      if (this.state.gitPath) {
        onOk(value, this.state.gitPath);
      }
    };

    const submitGitPath = (e) => {
      if (e.target.value) {
        that.setState({ gitPath: e.target.value });
        onOk(that.state.tap, e.target.value);
      }
    };
    var that = this;
    return (
      <Card style={{ 'maxWidth': '100%', margin: '10px auto' }} bordered={true}>
        <Form layout="inline">
          <Row>
            <Col span={6}>
              <FormItem
                label="项目类型："
                validateStatus={''}
                help={''}
              >
                {getFieldDecorator('tap', {
                  initialValue: tapValue ? tapValue : 'tag',
                  rules: [{ required: true, message: '请选择项目类型!' }],
                })(
                  <Select style={{ width: 90 }} onChange={onchange}>
                    <Select.Option value="branch">branch</Select.Option>
                    <Select.Option value="tag">tag</Select.Option>
                  </Select>,
                )}
              </FormItem>
            </Col>

            <Col span={12}>

              <FormItem
                label="项目git地址："
                validateStatus={''}
                help={''}
              >
                {getFieldDecorator('project', {
                  initialValue: pathValue,
                  rules: [{ required: true, message: '请填写项目gitlab地址!' }],
                })(
                  <Input
                    style={{ width: 350 }}
                    onKeyUp={submitGitPath}
                    placeholder="src/kpl-backend.git"
                  />,
                )}
              </FormItem>

            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

}


CheckGit.propTypes = {};

export default Form.create()(CheckGit);
