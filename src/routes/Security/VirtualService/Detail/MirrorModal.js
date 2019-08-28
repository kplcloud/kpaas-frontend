import React, {PureComponent, Fragment} from 'react';
import { Modal, Form, Input, Select,InputNumber } from 'antd';
import {connect} from 'dva';
const { TextArea } = Input;
const Option = Select.Option;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  
@Form.create()
class MirrorModal extends PureComponent {
    state = {
        namespace: "",
        name: "",
        port: 8080
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel, match} = this.props;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            dispatch({
                type: 'virtualservice/mirror',
                payload: {
                    name: match.params.name,
                    namespace: match.params.namespace,
                    ...values
                }
            });
            form.resetFields();
            onCancel();
        });
    };
    componentWillMount(){
        const { dispatch, user, data, match} = this.props;
        const {namespaces} = user;
        if (namespaces.length < 1){
            dispatch({
                type: 'user/fetchNamespaces',
                payload: {},
            });
        }
        this.fetchProjectByNs(match.params.namespace)
    }

    fetchProjectByNs = (ns) => {
        const { dispatch} = this.props;
        dispatch({
            type: 'project/fetchProjectsByNs',
            payload: {
                namespace: ns
            }
        })
    };

    handleChangeNs = (val) => {
        this.fetchProjectByNs(val);
        this.setState({
            namespace: val
        });
    };

    handleChangeName = (val) => {
        this.setState({
            name: val
        });
    };

    onChangePort = (val) => {
        this.setState({
            port: val
        });
    };

    render() {
        const { visible, onCancel, form, data, user, match, project} = this.props;
        const { getFieldDecorator } = form;
        if (!visible) {
            return ('')
        }
        let hosts = (data.hosts).join("\n")

        const {namespaces} = user;
        const {projectList} = project;
        const {name} = this.state;       
        return (
            <Modal
                visible={visible}
                title="自己定义镜像流量"
                onCancel={onCancel}
                onOk={this.handleSubmit}
                // footer={false}
                destroyOnClose={true}
                confirmLoading={false}
            >
                <Form>
                    <Form.Item label="镜像地址"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('host', {
                        initialValue: hosts,
                    })(<TextArea disabled rows={2} />)}
                    </Form.Item>
                    <Form.Item label="镜像到业务空间"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('mirror_namespace', {
                        initialValue: match.params.namespace,
                        rules: [{required: true, message: '请选择镜像到业务空间' }],
                    })(
                        <Select style={{ width: 140 }} onChange={this.handleChangeNs}>
                            {namespaces.map((item ,key) => {
                                return <Option key={key} value={item.name_en}>{item.name}</Option>
                            })}
                        </Select>
                    )}
                    </Form.Item>
                    <Form.Item label="镜像到应用"
                    {...formItemLayout}
                    >
                    {getFieldDecorator('mirror_name', {
                        initialValue: name,
                        rules: [{required: true, message: '请选择镜像到应用' }],
                    })(
                        <span>
                            {projectList && <Select style={{ width: 140 }} onChange={this.handleChangeName}>
                                {projectList.map((item, key) => {
                                    return <Option key={key} value={item.NameEn}>{item.Name}</Option>
                                })}
                            </Select>}
                        </span>
                    )}
                    </Form.Item>
                    <Form.Item label="镜像到应用端口"
                        {...formItemLayout}
                    >
                    {getFieldDecorator('mirror_port', {
                        initialValue: 8080,
                        rules: [{required: true, message: '请输入镜像到应用端口' }],
                    })(<InputNumber min={80} max={60000} onChange={this.onChangePort} />)}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

export default connect(({user, project, virtualservice}) => ({
    user,
    project,
    virtualservice
  }))(MirrorModal);