import React, {PureComponent, Fragment} from 'react';
import { Modal, Tooltip, InputNumber, Form, Input, Radio, Icon } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    },
};

@Form.create()
class CornjobLogModal extends PureComponent {
   
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, namespace, name,logPath} = this.props;   
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'cronjob/updateLogPath',
                payload: {
                    name: name,
                    namespace: namespace,
                    log_path:values.path,
                }
            });
            form.resetFields();
            onCancel();
        });
    };

    render() {
        const { visible, onCancel, form, title, logPath} = this.props;
        const { getFieldDecorator } = form;
        if (!visible) {
            return ('')
        }

        return (
            <Modal
                visible={visible}
                title={title}
                onCancel={onCancel}
                onOk={this.handleSubmit}
                // footer={false}
                destroyOnClose={true}
                confirmLoading={false}
                width={650}
            >
                <Form>
                    <FormItem
                    {...formItemLayout}
                    label={<Tooltip title="收集日志的文件路径: /var/log/"> 
                    <Icon type="info-circle-o"/>文件路径</Tooltip>}
                    >
                    {getFieldDecorator('path', {
                        initialValue: logPath || "",
                        rules: [{ required: true, message: '收集日志的文件路径不能为空!' }],
                    })(
                        <Input placeholder="/var/log" addonAfter="*.log"/>
                    )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(CornjobLogModal);