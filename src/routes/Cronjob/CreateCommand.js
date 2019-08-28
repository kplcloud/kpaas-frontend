/**
 * Created by huyunting on 2018/8/24.
 */
import React, {Fragment} from 'react';
import {connect} from 'dva';
import {message, Form, Input, Button, Select, Icon, Divider} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import {routerRedux} from 'dva/router';
import Cookie from 'js-cookie';
let uuid = 0;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class CreateCommand extends React.PureComponent {
  state = {
    id: 0,
    name: "创建定时任务",
    namespace: "",
    dataNum: 1,
    editType: false,
    defaultTab: "",
  };

  componentWillMount() {
    const namespace = Cookie.get("namespace");
    uuid = 0;
    this.setState({
      namespace: namespace,
      editType: this.props.editType,
      defaultTab: this.props.defaultTab,
    });
    for (var i = 0; i < 3; i++) {
      this.add();
    }
  };

  remove = (k) => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  add = () => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys') ? form.getFieldValue('keys') : [];
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  render() {
    const {form, namespaces, cronjobInfo, btnLoading} = this.props;
    const {editType} = this.state;
    const {validateFields, getFieldDecorator, getFieldValue} = form;
    var that = this;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          var params = [];
          var argsData = [];
          values["args"].map((items, key) => {
            if (items) argsData.push(items);
          });
          if (argsData.length < 1) {
            message.error("请填写执行命令");
            return
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.schedule = values.schedule;
          params.args = argsData;
          params.image = values.image;
          params.add_type = "Command";
          if (this.state.editType) {
            if (this.state.defaultTab != params.image) {
              message.error("当前定时任务为脚本模式，不允以命令模式提交！");
              return
            }
            that.props.dispatch({
              type: 'cronjob/update',
              payload: params,
            })
          } else {
            that.props.dispatch({
              type: 'cronjob/add',
              payload: params,
            })
          }
        } else {
          message.error("请填写完整参数");
          return
        }
        // resetFields();
      });
    };
    const description = (k) => {
      if (k == 0) {
        return "/bin/sh"
      }
      if (k == 1) {
        return "-c"
      }
      if (k == 2) {
        return "./main"
      }
      return "更多参数请按照说明填写"
    };
    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <span key={k}>
          <Form.Item>
            {getFieldDecorator(`args[${k}]`, {
              initialValue: (this.state.editType && cronjobInfo && cronjobInfo.args) ? cronjobInfo.args[k] : "",
              rules: [{required: true, message: '请输入命令参数'}, {
                message: '请输入命令参数',
              }],
            })(<Input style={{width: "80%", marginRight: 20}} placeholder={description(k)}/>)}
            <Icon
              className="dynamic-delete-button"
              type="plus-circle-o"
              onClick={() => this.add(k)}
              style={{marginRight: 20}}
            />
            {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              ) : null}
          </Form.Item>
        </span>
      );
    });

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name_en}>{item.name}</Option>)
        });
      }
      return items
    };

    const onReturn = () => {
      const {dispatch} = this.props;
      dispatch(routerRedux.push("/project/cornjob/list"))
    };


    return (
      <span>
        <Form layout="horizontal" hideRequiredMark style={{maxWidth: 600, marginLeft: 200, marginTop: 20}}>
          <FormItem label="任务名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.name : "",
              rules: [
                {
                  required: true,
                  pattern: `^[a-z0-9]([-a-z0-9])?([a-z0-9]([-a-z0-9]*[a-z0-9])?)*$`,
                  message: '名称仅支持：0-9,a-z,-,_'
                }
              ],
            })(editType ? (
                <Input placeholder="名称仅支持：0-9,a-z,-,_" disabled={true}/>
              ) : (
                <Input placeholder="名称仅支持：0-9,a-z,-,_"/>
              ))}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="命名空间 "
            hasFeedback
          >
            {getFieldDecorator('namespace', {
              initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.namespace : this.state.namespace,
              rules: [
                {required: true, message: '请选择所属命名空间...'},
              ],
            })(
              editType ? (
                  <Select placeholder="请选择所属命名空间..." disabled>
                    {namespaces && optionData()}
                  </Select>
                ) : (
                  <Select placeholder="请选择所属命名空间...">
                    {namespaces && optionData()}
                  </Select>
                )
            )}
          </FormItem>
          <Form.Item {...formItemLayout} label="项目镜像地址">
            {getFieldDecorator('image', {
              initialValue: "alpine:v0.0.02",
              rules: [{message: '请选择版本', required: true}],
            })(
              <Select>
                <Option value="alpine:v0.0.02">alpine:v0.0.02</Option>
              </Select>
            )}
          </Form.Item>
          <FormItem label="任务计划 " hasFeedback {...formItemLayout} help="分 时 日 月 周 (* * * * *)">
            {getFieldDecorator('schedule', {
              initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.schedule : '',
              rules: [
                {
                  required: true,
                  message: '请输入任务计划...',
                },
              ],
            })(<Input rows={4} placeholder="分 时 日 月 周 (* * * * *)"/>)}
          </FormItem>
          <FormItem label="执行命令 " hasFeedback {...formItemLayout}>
            {formItems}
          </FormItem>
          <Form.Item
            wrapperCol={{
              xs: {span: 24, offset: 0},
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
          </Form.Item>
        </Form>
          <Button type="primary" ghost onClick={onReturn} style={{marginLeft: 300, marginRight: 300}}>取消</Button>
          <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
            提交
          </Button>
          <Divider style={{margin: '20px 0 24px'}}/>
          <div>
            <h3>说明</h3>
            <h4>执行命令：请按照命令参数进行拆分，分别写入命令表单中</h4>
            <p>例如要执行的命令为`/bin/sh -c ./main`, 将命令拆分为三部分`/bin/sh` ， `-c` 和 `./main` 分别写入表单</p>
          </div>
      </span>
    );
  }
}

export default connect(({user, cronjob}) => ({
  namespaces: user.namespaces,
  cronjobInfo: cronjob.cronjobInfo,
  btnLoading: cronjob.btnLoading,
}))(CreateCommand);
