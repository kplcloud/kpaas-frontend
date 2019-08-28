import React, { Component, Fragment } from 'react';
//import { formatMessage, FormattedMessage } from 'umi/locale';
import { Icon, List,Button, message } from 'antd';
import {routerRedux} from 'dva/router'
import ShowQr from '../../../components/Binding/showQr';

class BindingView extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      wechatQRTimeId :0
    };

  }

  //绑定列表
  getData = () => {
    const { dispatch, bindingInfo} = this.props;   //console.log("getData",this.props)
    const { bindListData } = bindingInfo;

    return [
        {
          title: bindListData.wechatTitle,
          description: bindListData.wechatDesc,
          actions: [
            <a >
              <Button size="small" type="primary" style={{display:bindListData.wechatBindButton}} onClick={this.onShowQR} >绑定</Button>
              <Button size="small" type="primary" style={{display:bindListData.wechatUnBindButton,marginRight:20}} onClick={this.onUnBind} >解绑</Button>
              <Button size="small" type="primary" style={{display:bindListData.wechatTestButton}} onClick={this.onTestWx} >测试</Button>
            </a>,
    
          ],
          avatar: <Icon type="wechat" className={bindListData.wechatClass} />,
        },
        {
          title: bindListData.emailTitle, 
          description: bindListData.emailDesc,
          actions: [
            <a>
              <button size="smaill" type="primary" style={{display:bindListData.emailBindButton}} onClick={this.onShowQR} >绑定</button>
            </a>,
          ],
          avatar: <Icon type="mail" className={bindListData.emailClass} />,
        },
        // {
        //   title: bindListData.beeTitle,
        //   description: bindListData.beeDesc,
        //   actions: [
        //     <a >
        //       待实现
        //     </a>,
    
        //   ],
        //   avatar: <Icon type="message" className={bindListData.beeClass} />,
        // },

    ];

  };

  //显示弹层二维码
  onShowQR = () => {
    const { dispatch,currentUser } = this.props;
    const {email} = currentUser;
    dispatch({
      type: 'binding/wechatInfo',
      payload: {
        email: email,
      },
    });

    //定时拉取绑定状态
    let { wechatQRTimeId } = this.state;
      wechatQRTimeId = setInterval(this.getUserInfo, 1000);
      this.setState({
        wechatQRTimeId: wechatQRTimeId,
    });

  };

  //发送测试消息
  onTestWx = () => {
    const { dispatch,currentUser } = this.props;
    const {id} = currentUser;
    dispatch({
      type: 'binding/testSendWechat',
      payload: {
        id: id,
      },
    });

    message.success("已发送，请查收微信消息〜")

  };

  //解绑
  onUnBind = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'binding/unBinding',
    });

    message.success("微信解绑成功〜")
  };

  //获取用户信息
  getUserInfo = () => {
    const { dispatch, bindingInfo} = this.props;   //console.log("getUserInfo",this.props)
    const {userInfo} = bindingInfo;
    const {openid} = userInfo;
    //console.log("openid:",openid)
    
    if(typeof openid !="undefined" && openid !=''){
      dispatch({ 
          type: 'binding/hideModal',
      });

      clearInterval(this.state.wechatQRTimeId);

    }else{

      dispatch({
        type: 'binding/getUserInfo',
      });
    }

  };

  render() {
    const {currentUser,dispatch,bindingInfo} = this.props;
    const {modalVisible} = bindingInfo;
    const {wechatQRTimeId} = this.state;

    const ShowQrProps = {
      bindingInfo:bindingInfo,
      onCloseCancel() {
        dispatch({
          type: 'binding/hideModal',
        });
        clearInterval(wechatQRTimeId);
      },
    };
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData()}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                avatar={item.avatar}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
        <ShowQr {...ShowQrProps}/>
      </Fragment>
    );
  }
}

export default BindingView;
