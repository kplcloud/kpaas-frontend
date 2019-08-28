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
class EnvvarModal extends PureComponent {
   
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, match, envInfo} = this.props;   
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (envInfo.id){
                dispatch({
                    type: 'cronjob/updateConfigEnv',
                    payload: {
                        name: match.params.name,
                        namespace: match.params.namespace,
                        id:envInfo.id,
                        ...values,
                        
                    }
                });
            }else{
                dispatch({
                    type: 'cronjob/addConfigEnv',
                    payload: {
                        name: match.params.name,
                        namespace: match.params.namespace,
                        ...values,
                        
                    }
                });
            }
            
            form.resetFields();
            onCancel();
        });
    };

    render() {
        const { visible, onCancel, form, title, envInfo, envType} = this.props; //console.log(99999,this.props)
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
                    <FormItem {...formItemLayout} label="变量名" >
	                    {getFieldDecorator('env_key', {
	                        initialValue: envInfo.env_key?envInfo.env_key:"",
	                        rules: [{ required: true, message: '变量名不能为空!' }],
	                    })(
	                        <Input placeholder="ENV_KEY" disabled={envType=="edit"?true:false}/>
	                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="变量值">
	                    {getFieldDecorator('env_var', {
	                        initialValue: envInfo.env_var?envInfo.env_var:"",
	                        rules: [{ required: true, message: '变量值不能为空!' }],
	                    })(
	                        <Input placeholder="ENV_VAR"/>
	                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="说明">
	                    {getFieldDecorator('env_desc', {
	                        initialValue: envInfo.env_desc?envInfo.env_desc:"",
	                        rules: [{ required: true, message: '说明不能为空!' }],
	                    })(
	                        <Input placeholder="ENV_DESC"/>
	                    )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(EnvvarModal);
