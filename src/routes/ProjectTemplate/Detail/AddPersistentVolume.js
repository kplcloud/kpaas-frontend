/**
 * Created by huyunting on 2018/7/18.
 */
import React, { PropTypes } from 'react';
import {connect} from 'dva';
import { Modal, Form, Button, Alert, Select, Input, Tooltip, Icon, Divider } from 'antd';
const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class AddPersistentVolume extends React.Component {
    onSubmit = (e) => {
        e.preventDefault();
        const form = this.props.form;
        const handleOk = this.props.handleOk;
        // const deployment = this.props.deployment;
        const deployment = this.props.deployment;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.namespace = deployment.metadata.namespace;
            values.name = deployment.metadata.name;
            handleOk(values)
            form.resetFields();
        });
    }
    handleSelectChange = (value) => {
        this.props.form.setFieldsValue({
            claim_name: value,
        });
    }

  render() {
    const { visible, loading, handleCancel, form, storage} = this.props;
    const {pvcList} = storage;

    return (
        <Modal
            visible={visible}
            title="添加存储绑定"
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
                message={'增加了存储绑定后会对服务进行重启！'}
                type="info"
                showIcon
                style={{ marginBottom: 30 }}
            />
          <Form layout="vertical"
          >
            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="持久化存储的路径">
                {form.getFieldDecorator('path', {
                rules: [{ required: true, message: '请输入持久化存储的路径...' }],
                })(<Input placeholder="请输入持久化存储的路径" />)}
            </FormItem>

            <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 15 }} label="持久化存储卷声明">
                {form.getFieldDecorator('claim_name', {
                rules: [{ required: true, message: '请选择持久化存储卷声明' }],
                })(<div>
                <Select style={{ width: 180 }} onChange={this.handleSelectChange}>
                    {pvcList && pvcList.map((item, key) => {
                        return <Option value={item.metadata.name} key={key}>{item.metadata.name}</Option>
                    })}
                </Select>
                </div>)}
            </FormItem>
        </Form>
          <Divider style={{ margin: '40px 0 24px' }} />
            <div>
                <h4>如有不清楚请联系管理员</h4>
                <p><b>持久化存储的路径:</b> 容器所挂载的存储路径例如: /opt/data/</p>
                <p><b>持久化存储卷声明:</b> 如果需要持久化存储需要先创建持久化卷声明，如果没有请联系管理员创建</p>
            </div>
      </Modal>
    );
  }
}

// ModelSwitch.propTypes = {};

export default connect(({}) => ({

}))(AddPersistentVolume);
