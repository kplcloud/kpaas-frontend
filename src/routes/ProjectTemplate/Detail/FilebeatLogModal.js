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
class FilebeatLogModal extends PureComponent {
   
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, namespace, name} = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let paths = [];
            paths.push(values.path)
            dispatch({
                type: 'project/onChangeFilebeat',
                payload: {
                    projectName: name,
                    namespace: namespace,
                    ...values,
                    paths: paths
                }
            });
            form.resetFields();
            onCancel();
        });
    };

    render() {
        const { visible, onCancel, form, title, filebeat} = this.props;
        const { getFieldDecorator } = form;
        if (!visible) {
            return ('')
        }

        let path = "" 
        if (filebeat && filebeat["filebeat.prospectors"][0].paths) {
            path = filebeat["filebeat.prospectors"][0].paths[0];
            path = path.replace("*.log", "");
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
                        initialValue: filebeat && path || "/var/log/",
                        rules: [{ required: true, message: '收集日志的文件路径不能为空!' }],
                    })(
                        <Input addonAfter="*.log"/>
                    )}
                    </FormItem>
                    <FormItem 
                    label={<Tooltip title="收集日志的正则规则: ^20[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}"> 
                    <Icon type="info-circle-o"/>日志的规则</Tooltip>}
                    
                    {...formItemLayout}
                    >
                    {getFieldDecorator('pattern', {
                        initialValue: filebeat && filebeat["filebeat.prospectors"][0].multiline.pattern || "^20[0-9]{2}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}",
                        rules: [{ required: true, message: '正则规则不能为空!' }],
                    })(
                        <Input />
                    )}
                    </FormItem>
                    {/* <FormItem 
                    label={<Tooltip title="文件后缀: *.log"> 
                    <Icon type="info-circle-o"/>文件后缀。</Tooltip>}
                    {...formItemLayout}
                    >
                    {getFieldDecorator('suffix', {
                        initialValue: "*.log",
                        rules: [{ required: true, message: '文件后缀。不能为空!' }],
                    })(
                        <InputNumber min={1} placeholder={1} max={360} />
                    )} 秒
                    </FormItem> */}
                </Form>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(FilebeatLogModal);