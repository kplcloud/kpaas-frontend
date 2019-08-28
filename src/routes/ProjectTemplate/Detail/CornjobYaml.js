import React, {PureComponent, Fragment} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightEighties } from 'react-syntax-highlighter/styles/hljs';
import { Modal, Tooltip, InputNumber, Form, Input, Radio, Icon, Button } from 'antd';
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
class CornjobYaml extends PureComponent {
   
    handleSubmit = (e) => {
        e.preventDefault();
        const {form, dispatch, onCancel} = this.props;   
    };

    render() {
        const { visible, onCancel, form,content} = this.props; console.log("tttttt",content)
        const { getFieldDecorator } = form;
        if (!visible) {
            return ('')
        }

        return (
        	<Modal
		          visible={visible}
		          closable={false}
		          title="CornJob"
		          width={600}
		          onOk={onCancel}
		          footer={[
		            <Button key="back" type="primary" onClick={onCancel}>
		              OK
		            </Button>,
		          ]}
		          onCancel={this.handleCancel}
		          bodyStyle={{ background: '#EFEFEF', overflow: 'auto', maxHeight: '500px', margin: 0, padding: 0 }}
		        >
		          <SyntaxHighlighter language='yaml' style={tomorrowNightEighties}>{content}</SyntaxHighlighter>
            </Modal>
        );
    }
}

export default connect(({}) => ({

  }))(CornjobYaml);