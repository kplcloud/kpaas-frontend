import React, {PropTypes} from 'react'
import {Modal, Form, Input, Button, message} from 'antd'
const FormItem = Form.Item;

class ShowQr extends React.Component {

  constructor(props) {
    super(props);
  };

  handleOk = () => {
    const {form, onOk} = this.props;
  };
  handleCancel = () => {
    const {form, onCancel} = this.props;
    onCancel();
  };

  render() {
    const {bindingInfo, handleOk, onCloseCancel} = this.props;   console.log("showQr.js",this.props)
    const {modalVisible,wechatInfo} = bindingInfo;
    const {qr_url} = wechatInfo;
    const modalOpts = {
      title: '请用微信扫码',
      onOk: this.handleOk,
      visible: modalVisible,
      onCancel: onCloseCancel,
      qr_url:qr_url,
      footer: [
        <Button key="back" onClick={onCloseCancel}>取消</Button>,
      ]
    };

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };

    return (<Modal {...modalOpts}> 
    	<img style={{ width: 240, height: 240, margin:'0 0 0 100px'}} src={qr_url} />
    </Modal>)
  }
}

ShowQr.propTypes = {};

export default Form.create()(ShowQr)
