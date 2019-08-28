import React, { Component, Fragment } from 'react';
// import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button,message } from 'antd';
import { connect } from 'dva';
import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class BaseView extends Component {

  constructor(props) {
    super(props);
    super(props);
    const { match, location, dispatch } = props;
    dispatch({
        type: 'binding/getUserInfo',
      });
  }

  handleOk = () => {
      const {form, dispatch} = this.props;
      const {validateFields, getFieldsValue, resetFields} = form;
      validateFields((errors) => {
        if (errors) {
          message.error("请填写完整信息~")
          return
        }
        const data = {
          ...getFieldsValue(),
        };
        dispatch({
          type: 'binding/updateBase',
          payload: {
            phone: data.phone,
            city: data.city,
            department: data.department,
          },
        });

        message.success("基本信息更新成功〜")
      });

      
  };

  render() {
    const { form: { getFieldDecorator },bindingInfo} = this.props; //console.log("xxxxx",this.props)
    const currentUser = bindingInfo.userInfo;
    const city = "北京市 朝阳区";
    let company = "";

    var arr = Object.keys(currentUser);
    if (arr.length !=0){
      company = "宜人财富—开普勒中心"
      //company = currentUser.attrs.canonicalName.replace('宜信公司/宜人金科/宜人财富技术部/', '').replace('/' + currentUser.username, '');
    }



    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                initialValue: currentUser.email,
              })(<Input disabled={true} />)}
            </FormItem>

            <FormItem label="姓名">
              {getFieldDecorator('username', {
                initialValue: currentUser.username,
              })(<Input disabled={true}/>)}
            </FormItem>

            <FormItem label="城市">
              {getFieldDecorator('city', {
                initialValue: currentUser.city,
              })(<Input disabled={false}/>)}
            </FormItem>

            <FormItem label="部门">
              {getFieldDecorator('department', {
                initialValue: currentUser.department,
              })(<Input disabled={false} />)}
            </FormItem>

            <FormItem label="手机">
              {getFieldDecorator('phone', {
                initialValue: currentUser.phone,
                rules: [{
                    pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
                    message:'请输入正确的手机号'
                },{
                  required: true, 
                  message: '请输入正确的手机号'
                }],
              })(<Input />)}
            </FormItem>
            <Button type="primary" onClick={this.handleOk} >更新基本信息</Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default BaseView;

