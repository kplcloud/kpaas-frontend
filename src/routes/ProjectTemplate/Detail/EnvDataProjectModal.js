import React, {PureComponent, Fragment} from 'react';
import { Modal, Form, Input, Checkbox } from 'antd';
import {connect} from 'dva';
const FormItem = Form.Item;
const { TextArea } = Input;
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
class EnvDataProjectModal extends PureComponent {
   
    state = {
        isFile: false
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, match, envDataInfo,configMapInfo} = this.props; 
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (envDataInfo.id){
                dispatch({
                    type: 'project/updateConfigMapData',
                    payload: {
                    	name: match.params.name,
	        			namespace: match.params.namespace,
                        id:envDataInfo.id,
                        config_map_id:configMapInfo.id,
                        ...values,
                        
                    }
                });
            }else{
                dispatch({
                    type: 'project/addConfigMapData',
                    payload: {
                    	name: match.params.name,
	        			namespace: match.params.namespace,
                        config_map_id:configMapInfo.id,
                        ...values,
                        
                    }
                });
            }
            
            form.resetFields();
            onCancel();
        });
    };

    onChangeToFile = (val) => {
        this.setState({isFile: val.target.checked})
    };

    render() {
        const { visible, onCancel, form, title, envDataInfo, envDataType, validateFields} = this.props; //console.log(99999,this.props)
        const { getFieldDecorator } = form;
        const {isFile} = this.state;
        if (!visible) {
            return ('')
        }

        console.log("envDataInfo.path", envDataInfo.path)
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
                    <FormItem {...formItemLayout} label="Key" >
	                    {getFieldDecorator('key', {
	                        initialValue: envDataInfo.key?envDataInfo.key:"",
	                        rules: [{ required: true, message: '变量名不能为空!' }],
	                    })(
	                        <Input placeholder="key" disabled={envDataType=="edit"?true:false}/>
	                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Value">
	                    {getFieldDecorator('value', {
	                        initialValue: envDataInfo.value?envDataInfo.value:"",
	                        rules: [{ required: true, message: '变量值不能为空!' }],
	                    })(
	                        <TextArea rows={4} placeholder="value" />
	                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="挂载为文件">
	                    <Checkbox onChange={this.onChangeToFile} defaultChecked={envDataInfo && envDataInfo.path == undefined ? false : true}>挂载为文件</Checkbox>
                    </FormItem>
                    <FormItem {...formItemLayout} label="挂载路径">
	                    {getFieldDecorator('path', {
	                        initialValue: envDataInfo && envDataInfo.path ? envDataInfo.path : "",
	                        rules: [{ message: '挂载路径不能为空!' }],
	                    })(
	                        <Input placeholder="挂路径: /etc/app/app.cfg" disabled={envDataInfo && envDataInfo.path != undefined ? false : isFile?false:true}/>
	                    )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(EnvDataProjectModal);