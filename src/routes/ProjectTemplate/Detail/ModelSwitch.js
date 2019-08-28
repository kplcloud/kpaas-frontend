/**
 * Created by huyunting on 2018/7/18.
 */
import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Modal, Form, Button, Alert, Radio, Tooltip, Icon, Divider } from 'antd';

@Form.create()
class ModelSwitch extends React.Component {
  onSubmit = (e) => {
    e.preventDefault();
    const { form, handleOk, project } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values.namespace = project.namespace;
      values.name = project.name;
      handleOk(values);
      form.resetFields();
    });
  };

  render() {
    const { visible, loading, handleCancel, form, project,templateProject } = this.props;
    const { getFieldDecorator } = form;
    var resource_model;
    let webFields;
    for (var i in templateProject) {
      if (templateProject[i].kind !== 'Deployment') {
        continue;
      }
      webFields = JSON.parse((templateProject[i].fields));
      break;
    }
    if (webFields.mesh !== 'mesh') {
      resource_model = 'normal';
    } else {
      resource_model = 'mesh';
    }

    return (
      <Modal
        visible={visible}
        title="修改服务的模式类型"
        onOk={this.onSubmit}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.onSubmit}>
            提交
          </Button>,
        ]}
      >
        <Alert
          message="当修改模式之后会对服务进行重启！"
          type="info"
          showIcon
          style={{ marginBottom: 30 }}
        />
        <Form layout="vertical">
          <Form.Item
            // {...formItemLayout}
            style={{ textAlign: 'center' }}
          >
            {getFieldDecorator('model', {
              initialValue: resource_model,
              rules: [{ required: true, message: '请选服务模式' }],
            })(
              <Radio.Group>
                <Radio value="mesh"><Tooltip title="服务网络模式，将会提供服务发现、流量管理、限流配额、灰度、熔断、金丝雀、链路追踪等零侵入性的功能"><Icon
                  type="info-circle-o"/>Service Mesh</Tooltip></Radio>
                <Radio value="normal"><Tooltip title="普通模式，ServiceMesh的功能需要自己去实现"><Icon
                  type="info-circle-o"/>Normal</Tooltip></Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }}/>
        <div>
          <h4>如有不清楚请联系管理员</h4>
          <p><b>ServiceMesh:</b> 服务网格模式，将会提供服务发现、流量管理、限流配额、灰度、熔断、金丝雀、链路追踪等零侵入性的功能</p>
          <p><b>Normal:</b> 普通模式，ServiceMesh的功能需要自己去实现</p>
        </div>
      </Modal>
    );
  }
}

// ModelSwitch.propTypes = {};

export default connect(({}) => ({}))(ModelSwitch);
