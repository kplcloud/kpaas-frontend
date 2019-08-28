/**
 * Created by huyunting on 2018/6/4.
 */
import React, {Fragment} from 'react';
import {connect} from 'dva';
import {message, Form, Input, Button, Card, Select, Icon, Col, Row} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import {routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';
const InputGroup = Input.Group;
import CheckGit from '../../components/CronJob/checkGit';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddCronJob extends React.PureComponent {
  state = {
    id: 0,
    name: "创建定时任务",
    namespace: "",
    dataNum: 1,
    gitType: "",
    gitPath: "",
    editType: false,
  };

  componentWillMount() {
    const {dispatch, gitlabList, match} = this.props;
    const namespace = Cookie.get("namespace");
    this.setState({
      namespace: namespace
    });
    dispatch({
      type: 'conf/list',
      payload: {
        "namespace": namespace,
      }
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });

    if (match.params && match.params.name) {
      this.setState({editType: true});
      dispatch({
        type: 'cronjob/getOneCronjob',
        payload: {
          "namespace": namespace,
          "name": match.params.name,
        }
      });
    }
  };


  addData = () => {
    if (this.state.dataNum >= 5) {
      message.error("您添加的数据太多了~")
      return
    }
    this.setState({dataNum: this.state.dataNum + 1})
  };


  render() {
    const {form, namespaces, gitlabList, confMap, cronjobInfo, btnLoading} = this.props;
    const {editType} = this.state;
    const {validateFields, getFieldDecorator, resetFields} = form;
    var that = this;
    const checkGitComponent = {
      tapValue: cronjobInfo ? cronjobInfo.git_type : "tag",
      pathValue: cronjobInfo ? cronjobInfo.git_path : "",
      onOk(tap, gitlabPath){
        that.setState({
          gitType: tap,
          gitPath: gitlabPath,
        });
        if (tap == "branch") {
          that.props.dispatch({
            type: "gitlab/branchList",
            payload: {
              "git": gitlabPath,
            },
          });
        }
        if (tap == "tag") {
          that.props.dispatch({
            type: "gitlab/tagList",
            payload: {
              "git": gitlabPath,
            },
          });
        }
      }

    };
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (gitlabList.length <= 0) {
          message.error("请先选择项目地址");
          return
        }
        if (!err) {
          var params = [];
          var argsData = [];
          if (this.state.dataNum >= 1) {
            for (i = 1; i <= this.state.dataNum; i++) {
              if (values["args_" + i]) {
                argsData.push(values["args_" + i]);
              }
            }
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.schedule = values.schedule;
          params.args = argsData;
          params.confMap = values.confMap;
          params.image = values.image;
          params.gitPath = this.state.gitPath ? this.state.gitPath : (cronjobInfo ? cronjobInfo.git_path : "");
          params.gitType = this.state.gitType ? this.state.gitType : (cronjobInfo ? cronjobInfo.git_type : "");
          if (this.state.editType) {
            params.name = this.props.match.params.name;
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
          message.error("请填写完整参数")
          return
        }
        // resetFields();
      });
    };

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name_en}>{item.name}</Option>)
        });
      }
      return items
    };
    const confMapOption = () => {
      var items = [];
      if (confMap) {
        confMap.map((item, key) => {
          items.push(<Option key={key} value={item.name}>{item.name}</Option>)
        });
      }
      return items
    };

    const onReturn = () => {
      const {dispatch} = this.props;
      dispatch(routerRedux.push("/project/cornjob/list"))
    };

    var items = [];
    for (var i = 1; i <= this.state.dataNum; i++) {
      items.push(
        <div key={i}>
          {getFieldDecorator('args_' + i, {
            initialValue: '',
          })(<Input style={{width: 400}} placeholder="请输入Shell命令..."
                    addonAfter={<Icon onClick={() => this.addData()} type="plus"/>}/>)}
          &nbsp;
        </div>
      );
    }
    const selectImages = () => {
      var items = []
      if (gitlabList) {
        gitlabList.map((item, key) => {
          items.push(<Option key={key} value={item}>{item}</Option>)
        });
      }
      return items
    };

    return (
      <PageHeaderLayout>
        <a onClick={onReturn}>
          <Icon type="rollback"/>返回
        </a>
        <CheckGit {...checkGitComponent}/>
        <Card
          bordered={false}
          title={this.state.name}
          style={{marginTop: 16}}
        >
          <Form layout="horizontal" hideRequiredMark style={{maxWidth: 600, marginLeft: 200}}>
            <FormItem label="任务资源" hasFeedback {...formItemLayout}>
              {getFieldDecorator('image', {
                initialValue: cronjobInfo ? cronjobInfo.image : '',
                rules: [
                  {required: true, message: '请选择任务资源'}
                ],
              })(
                <Select placeholder="请先填写git项目地址">
                  {gitlabList && gitlabList.length > 0 && selectImages()}
                </Select>
              )}
            </FormItem>
            <FormItem label="任务名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: cronjobInfo ? cronjobInfo.name : "",
                rules: [
                  {required: true, message: '请输入任务名称'}
                ],
              })(editType ? (
                  <Input placeholder="请输入任务名称..." disabled={true}/>
                ) : (
                  <Input placeholder="请输入任务名称..."/>
                ))}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="命名空间 "
              hasFeedback
            >
              {getFieldDecorator('namespace', {
                initialValue: cronjobInfo ? cronjobInfo.namespace : this.state.namespace,
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
            <FormItem
              {...formItemLayout}
              label="选择配置 "
              hasFeedback
            >
              {getFieldDecorator('confMap', {
                initialValue: cronjobInfo ? cronjobInfo.conf_map_name : '',
              })(
                <Select placeholder="请选择所属配置...">
                  <Option key="" value="">--取消选择--</Option>
                  {confMap && confMapOption()}
                </Select>
              )}
            </FormItem>
            <FormItem label="任务计划 " hasFeedback {...formItemLayout}>
              {getFieldDecorator('schedule', {
                initialValue: cronjobInfo ? cronjobInfo.schedule : '',
                rules: [
                  {
                    required: true,
                    message: '请输入任务计划...',
                  },
                ],
              })(<Input rows={4} placeholder="分 时 日 月 周 (* * * * *)"/>)}
            </FormItem>
            <FormItem label="执行命令 " hasFeedback {...formItemLayout}>
              {items}
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

              <br/>
              <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>


      </PageHeaderLayout>
    );
  }
}

export default connect(({user, gitlab, conf, cronjob}) => ({
  namespaces: user.namespaces,
  gitlabList: gitlab.list,
  confMap: conf.list,
  cronjobInfo: cronjob.cronjobInfo,
  btnLoading: cronjob.btnLoading,
}))(AddCronJob);
