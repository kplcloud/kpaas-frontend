import React, { Component, Fragment } from 'react';
// import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button,message, Checkbox, Row, Col, Table, List,Avatar } from 'antd';
import { connect } from 'dva';
import styles from './NoticeView.less';

const CheckboxGroup = Checkbox.Group;

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class NoticeView extends Component {

  constructor(props) {
    super(props);
    const { match, location, dispatch } = props;
    dispatch({
        type: 'binding/getNoticeReceive',
      });
  }


  onChange = (checkedValues) => {
    const {dispatch} = this.props;
	  console.log('checked = ', checkedValues);

    var action = checkedValues[0];
    var site = 0;
    var wechat = 0;
    var email = 0;
    var sms = 0;
    var bee = 0;
    for (var i = 0; i < checkedValues.length; i++) {
        switch(checkedValues[i]){
          case action+"_site":
              site = 1;
              break;
          case action+"_wechat":
              wechat = 1;
              break;
          case action+"_email":
              email = 1;
              break;
          case action+"_sms":
              sms = 1;
              break;
          case action+"_bee":
              bee = 1;
              break;
        }
    }

    var data ={
       notice_action:action,
       site:site,
       wechat:wechat,
       email:email,
       sms:sms,
       bee:bee
    };

    console.log("curdata",data)

    dispatch({
      type: 'binding/updateNoticeReceive',
      payload: {
        ...data,
      },
    });
	}

  render() {
    const { form: { getFieldDecorator },bindingInfo } = this.props; //console.log("xxxxx",this.props)
    const nr = bindingInfo.noticeReceive

    var data =[];


    if (nr && nr.length) {

      for (var i = 0; i < nr.length; i++) {
        switch(nr[i].action){
            case "Proclaim":
              var dfv = [nr[i].action,'Proclaim_site','Proclaim_email']; //默认选中
              //if(nr[i].site==1) {dfv.push(nr[i].action+"_site")}
              if(nr[i].wechat==1) {dfv.push(nr[i].action+"_wechat")}
              //if(nr[i].email==1) {dfv.push(nr[i].action+"_email")}
              if(nr[i].sms==1) {dfv.push(nr[i].action+"_sms")}
              if(nr[i].bee==1) {dfv.push(nr[i].action+"_bee")}

              var keySiteDisabled = true; //是否禁用
              var keyWechatDisabled = true;
              var keyEmailDisabled = true;
              var keySmsDisabled = false;
              var keyBeeDisabled = false;
              break;
            case "Alarm":
              var dfv = [nr[i].action,'Alarm_site']; //默认选中
              //if(nr[i].site==1) {dfv.push(nr[i].action+"_site")}
              if(nr[i].wechat==1) {dfv.push(nr[i].action+"_wechat")}
              if(nr[i].email==1) {dfv.push(nr[i].action+"_email")}
              if(nr[i].sms==1) {dfv.push(nr[i].action+"_sms")}
              if(nr[i].bee==1) {dfv.push(nr[i].action+"_bee")}

              var keySiteDisabled = true; //是否禁用
              var keyWechatDisabled = false;
              var keyEmailDisabled = false;
              var keySmsDisabled = false;
              var keyBeeDisabled = false;
              break;

            case "Build":
              var dfv = [nr[i].action,'Build_site','Build_email']; //默认选中
              //if(nr[i].site==1) {dfv.push(nr[i].action+"_site")}
              if(nr[i].wechat==1) {dfv.push(nr[i].action+"_wechat")}
              //if(nr[i].email==1) {dfv.push(nr[i].action+"_email")}
              if(nr[i].sms==1) {dfv.push(nr[i].action+"_sms")}
              if(nr[i].bee==1) {dfv.push(nr[i].action+"_bee")}

              var keySiteDisabled = true; //是否禁用
              var keyWechatDisabled = false;
              var keyEmailDisabled = true;
              var keySmsDisabled = false;
              var keyBeeDisabled = false;
              break;  
            case "Delete":
              var dfv = [nr[i].action,'Delete_site','Delete_email','Delete_wechat']; //默认选中
              //if(nr[i].site==1) {dfv.push(nr[i].action+"_site")}
              //if(nr[i].wechat==1) {dfv.push(nr[i].action+"_wechat")}
              //if(nr[i].email==1) {dfv.push(nr[i].action+"_email")}
              if(nr[i].sms==1) {dfv.push(nr[i].action+"_sms")}
              if(nr[i].bee==1) {dfv.push(nr[i].action+"_bee")}

              var keySiteDisabled = true; //是否禁用
              var keyWechatDisabled = true;
              var keyEmailDisabled = true;
              var keySmsDisabled = false;
              var keyBeeDisabled = false;
              break;  
            default:
              var dfv = [nr[i].action];
              if(nr[i].site==1) {dfv.push(nr[i].action+"_site")}
              if(nr[i].wechat==1) {dfv.push(nr[i].action+"_wechat")}
              if(nr[i].email==1) {dfv.push(nr[i].action+"_email")}
              if(nr[i].sms==1) {dfv.push(nr[i].action+"_sms")}
              if(nr[i].bee==1) {dfv.push(nr[i].action+"_bee")}

              var keySiteDisabled = false;
              var keyWechatDisabled = false;
              var keyEmailDisabled = false;
              var keySmsDisabled = false;
              var keyBeeDisabled = false;
              break;
        }
        var obj ={ 
          title: nr[i].action_desc,
          key: nr[i].action,
          defaultValue: dfv,
          keySite: nr[i].action + '_site',
          keySiteDisabled: keySiteDisabled,
          keyWechat: nr[i].action + '_wechat',
          keyWechatDisabled: keyWechatDisabled,
          keyEmail: nr[i].action + '_email',
          keyEmailDisabled: keyEmailDisabled,
          keySms: nr[i].action + '_sms',
          keySmsDisabled: keySmsDisabled,
          keyBee:  nr[i].action + '_bee',
          keyBeeDisabled: keyBeeDisabled,
        };
            data.push(obj);
      };
            
    }

    //console.log("xxxxxx",nr,data)

    return (
      <Fragment>
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={data}
        header={<Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                    <Row>
                    <Col span={4}>消息类型</Col>
                      <Col span={4}><Checkbox value="" defaultChecked={true} disabled></Checkbox>站内信</Col>
                      <Col span={4}><Checkbox value="" defaultChecked={true} disabled></Checkbox>微信</Col>
                      <Col span={4}><Checkbox value="" defaultChecked={true} disabled></Checkbox>邮箱</Col>
                      <Col span={4}><Checkbox value="" defaultChecked={true} disabled></Checkbox>短信</Col>
                      {/* <Col span={4}><Checkbox value="" defaultChecked={true} disabled></Checkbox>IM</Col> */}
                    </Row>
                  </Checkbox.Group>
                }
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange} name={item.title} defaultValue={item.defaultValue}>
                    <Row>
                    <Col span={4}>{item.title}<Checkbox value={item.key} disabled={true} style={{display:"none"}} /></Col>
                      <Col span={4}><Checkbox value={item.keySite} disabled={item.keySiteDisabled} /></Col>
                      <Col span={4}><Checkbox value={item.keyWechat} disabled={item.keyWechatDisabled} ></Checkbox></Col>
                      <Col span={4}><Checkbox value={item.keyEmail} disabled={item.keyEmailDisabled}></Checkbox></Col>
                      <Col span={4}><Checkbox value={item.keySms} disabled={true}></Checkbox></Col>
                      {/* <Col span={4}><Checkbox value={item.keyBee} disabled={true}></Checkbox></Col> */}
                    </Row>
                  </Checkbox.Group>
                }
            />
          </List.Item>
        )}
      />
      </Fragment>
    );
  }
}

export default NoticeView;

