import React, {PureComponent, Fragment} from 'react';
import { Modal, Form, Input } from 'antd';
import {connect} from 'dva';
const { TextArea } = Input;
@Form.create()
class HostsModal extends PureComponent {
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, deployment} = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'project/onPutHosts',
                payload: {
                    name: deployment.metadata.name,
                    namespace: deployment.metadata.namespace,
                    ...values
                }
            });
            form.resetFields();
            onCancel();
        });
    };

    render() {
        const { visible, onCancel, form, deployment} = this.props;
        const { getFieldDecorator } = form;
        if (!visible) {
            return ('')
        }
        let hosts = "";
        for(var i in deployment.spec.template.spec.hostAliases) {
            let host = deployment.spec.template.spec.hostAliases[i];
            let names = ""
            for( var j in host.hostnames) {
                names += " " + host.hostnames[j]
            }
            hosts += host.ip + " " + names + "\n";
        }
        return (
            <Modal
                visible={visible}
                title="自定义Hosts"
                onCancel={onCancel}
                onOk={this.handleSubmit}
                // footer={false}
                destroyOnClose={true}
                confirmLoading={false}
            >
                <Form>
                    <Form.Item label="Hosts">
                    {getFieldDecorator('body', {
                        initialValue: hosts,
                    })(<TextArea type="textarea" rows={4} />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(HostsModal);