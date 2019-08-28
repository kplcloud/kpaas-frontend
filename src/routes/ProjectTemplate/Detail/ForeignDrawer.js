import React, { Component } from 'react';
import { Drawer, Form, Button, Tooltip, Select, Divider, Alert, Radio, Icon, Modal } from 'antd';

const { Option } = Select;

@Form.create()
class ForeignDrawer extends Component {
  onSubmit = e => {
    e.preventDefault();

    const form = this.props.form;
    // const deployment = this.props.deployment;
    const project = this.props.data.project;
    const { onSaveResourceType } = this.props;
    Modal.confirm({
      title: '您确认要修改访问模式？',
      content: '修改成功后，服务不会重启动，如果选择了 "仅集群内访问" 将会删除域名！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        form.validateFields((err, values) => {
          console.log(values);
          if (err) {
            return;
          }
          values.namespace = project.namespace;
          values.name = project.name;
          onSaveResourceType(values);
          form.resetFields();
        });
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, onClose, data } = this.props;
    let hosts = [];
    let deploy = {};
    for (var i in data.project.templates) {
      if (data.project.templates[i].kind === 'Deployment') {
        deploy = JSON.parse(data.project.templates[i].fields);
        break;
      }
    }
    if (deploy && deploy.resource_type === '2' && data.VirtualService && data.VirtualService.hosts) {
      hosts = data.VirtualService.hosts.map((item, key) => {
        return item;
      });
    }

    return (
      <Drawer
        title="服务模式"
        width={720}
        placement="top"
        onClose={onClose}
        maskClosable={false}
        visible={visible}
        destroyOnClose={true}
        style={{
          height: 'calc(100% - 55px)',
          overflow: 'auto',
          paddingBottom: 53,
        }}
      >
        <Alert
          message={`当前服务模式为 【${
            deploy.resource_type === '1' ? '仅集群内部访问' : '集群内外均可访问'
            }】！${hosts.join(',')}`}
          type="success"
          // showIcon
          style={{ marginBottom: 30 }}
        />
        <Form layout="vertical">
          <Form.Item
            // {...formItemLayout}
            style={{ textAlign: 'center' }}
          >
            {getFieldDecorator('resource_type', {
              initialValue: deploy.resource_type,
              rules: [{ required: true, message: '请选择访问模式' }],
            })(
              <Radio.Group>
                <Radio value="1">
                  <Tooltip title="仅集群内部访问: 只提供内部访问地址（例:hello.operations:8080）集群外部无法调用，如果选择了这项，将不会创建域名及路由配置。">
                    <Icon type="info-circle-o"/>仅集群内部访问
                  </Tooltip>
                </Radio>
                <Radio value="2">
                  <Tooltip title="集群内外均可访问：如果没有配置需要在 “虚拟服务” 菜单创建虚拟服务及域名才能对外访问。">
                    <Icon type="info-circle-o"/>集群内外均可访问
                  </Tooltip>
                </Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }}/>
        <div style={{ marginBottom: 10 }}>
          <h4>如有不清楚请联系管理员</h4>

          <Alert
            message="仅集群内部访问"
            description="仅集群内部访问: 只提供内部访问地址（例:hello.operations:8080）集群外部无法调用，如果选择了这项，将不会创建域名及路由配置。"
            type="info"
            style={{ marginBottom: 10 }}
          />

          <Alert
            message="集群内外均可访问"
            description="集群内外均可访问：如果没有配置需要在 “虚拟服务” 菜单创建虚拟服务及域名才能对外访问。请联系<solacowa@gmail.com>创建。"
            type="warning"
            showIcon
          />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={onClose}
          >
            取消
          </Button>
          <Button onClick={this.onSubmit} type="primary">
            确认
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default ForeignDrawer;
