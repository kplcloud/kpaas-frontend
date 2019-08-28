import React, { Fragment } from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { message, Form, Input, Button, Card, Select, Radio, Divider, Tabs } from 'antd';

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

let uuid = 0;
let changeTabs = false;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddCjob extends React.PureComponent {
  state = {
    id: 0,
    name: '创建定时任务',
    namespace: '',
    gitType: 'tag',
    gitPath: '',
    editType: false,
    defaultTab: 'Script',
    radioType: 'Script',
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const namespace = Cookie.get('namespace');
    uuid = 0;
    changeTabs = false;
    this.setState({
      namespace: namespace,
    });
    dispatch({
      type: 'conf/list',
      payload: {
        'namespace': namespace,
      },
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });

    dispatch({
      type: 'global/config',
    });

    if (match.params && match.params.name) {
      this.setState({ editType: true });
      dispatch({
        type: 'cronjob/getOneCronjob',
        payload: {
          'namespace': namespace,
          'name': match.params.name,
        },
      });

    }
    for (var i = 0; i < 3; i++) {
      this.add();
    }

  };

  onChangeRadio = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      radioType: e.target.value,
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys') ? form.getFieldValue('keys') : [];
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  changeTabsDefaultVal = (val) => {
    if (!changeTabs && val) {
      changeTabs = true;
      this.setState({ defaultTab: val });
    }
  };

  fetchGitlab = e => {
    var val = e.target.value;
    if (val === '') {
      return;
    }
    this.setState({
      gitPath: val,
    });
    const { dispatch, gitAddrType } = this.props;
    const { gitType } = this.state;

    if (gitType === 'branch') {
      dispatch({
        type: 'gitlab/branchList',
        payload: {
          git: gitAddrType + val,
        },
      });
    } else if (gitType === 'tag') {
      dispatch({
        type: 'gitlab/tagList',
        payload: {
          git: gitAddrType + val,
        },
      });
    }
  };

  render() {
    const { form, namespaces, cronjobInfo, btnLoading, gitlab, gitAddrType } = this.props;
    const { editType } = this.state;
    const { validateFields, getFieldDecorator } = form;
    var that = this;
    var list = this.props;
    if (this.state.gitType === 'tag' && gitlab && gitlab.tags) {
      list = gitlab.tags;
    }
    if (this.state.gitType === 'branch' && gitlab && gitlab.branches) {
      list = gitlab.branches;
    }

    var curRadioType = this.state.radioType;
    if (cronjobInfo && cronjobInfo.add_type) {
      curRadioType = cronjobInfo.add_type;
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (values.add_type == 'Script' && list.length <= 0) {
          message.error('请先选择项目地址');
          return;
        }
        if (!err) {
          var params = [];
          var argsData = ['/bin/sh', '-c'];

          if (values.command.length < 1) {
            message.error('请填写执行命令');
            return;
          } else {
            argsData.push(values.command);
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.schedule = values.schedule;
          params.args = argsData;
          params.image = values.image;
          params.git_path = this.state.gitPath ? this.state.gitPath : (cronjobInfo ? cronjobInfo.git_path : '');
          params.git_type = this.state.gitType ? this.state.gitType : (cronjobInfo ? cronjobInfo.git_type : '');
          params.log_path = values.log_path;
          params.add_type = values.add_type;


          if (this.state.editType) {
            params.name = this.props.match.params.name;
            that.props.dispatch({
              type: 'cronjob/update',
              payload: params,
            });
          } else {
            that.props.dispatch({
              type: 'cronjob/add',
              payload: params,
            });
          }

        } else {
          message.error('请填写完整参数');
          return;
        }
        // resetFields();
      });
    };
    const description = (k) => {
      if (k === 0) {
        return '/bin/sh';
      }
      if (k === 1) {
        return '-c';
      }
      if (k === 2) {
        return './main';
      }
      return '更多参数请按照说明填写';
    };
    //getFieldDecorator('keys', { initialValue: [] });

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name_en}>{item.name}</Option>);
        });
      }
      return items;
    };

    const onReturn = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/project/cornjob/list'));
    };
    if (cronjobInfo && cronjobInfo.add_type && this.state.editType) {
      this.changeTabsDefaultVal(cronjobInfo.add_type);
    }
    return (
      <PageHeaderLayout title={this.state.name}>
        <Card
          bordered={false}
          style={{ marginTop: 16 }}
        >
          <Tabs size="large" defaultActiveKey={this.state.defaultTab}>
            <Tabs.TabPane tab="任务内容" key="Script">
              <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 600, marginLeft: 200, marginTop: 20 }}>
                <FormItem label="任务名称" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.name : '',
                    rules: [
                      {
                        required: true,
                        pattern: `^[a-z0-9]([-a-z0-9])?([a-z0-9]([-a-z0-9]*[a-z0-9])?)*$`,
                        message: '名称仅支持：0-9,a-z,-,_',
                      },
                    ],
                  })(editType ? (
                    <Input placeholder="名称仅支持：0-9,a-z,-,_" disabled={true}/>
                  ) : (
                    <Input placeholder="名称仅支持：0-9,a-z,-,_"/>
                  ))}
                </FormItem>
                <FormItem
                  style={{ display: 'none' }}
                  {...formItemLayout}
                  label="命名空间 "
                  hasFeedback
                >
                  {getFieldDecorator('namespace', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.namespace : this.state.namespace,
                    rules: [
                      { required: true, message: '请选择所属命名空间...' },
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
                    ),
                  )}
                </FormItem>
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
                <FormItem label="模式类型:" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('add_type', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.add_type : 'Script',
                    rules: [
                      {
                        required: true,
                        message: '请选择模式类型...',
                      },
                    ],
                  })(
                    editType ? (
                      <RadioGroup onChange={this.onChangeRadio} style={{ width: 300 }} disabled={true}>
                        <Radio value="Script">脚本模式</Radio>
                        <Radio value="Command">命令模式</Radio>
                      </RadioGroup>
                    ) : (
                      <RadioGroup onChange={this.onChangeRadio} style={{ width: 300 }}>
                        <Radio value="Script">脚本模式</Radio>
                        <Radio value="Command">命令模式</Radio>
                      </RadioGroup>
                    ),
                  )}
                </FormItem>
                {curRadioType == 'Script' ?
                  <FormItem {...formItemLayout} label="项目Git地址">
                    {getFieldDecorator('git_path', {
                      initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.git_path : '',
                      rules: [{ message: '请输入项目Git地址', required: true }],
                    })(
                      <Input
                        placeholder="Git地址(kplcloud/hello.git)"
                        name="git_addr"
                        addonBefore={gitAddrType}
                        onBlur={this.fetchGitlab}
                      />,
                    )}
                  </FormItem>
                  :
                  <FormItem {...formItemLayout} label="项目镜像地址" style={{ display: 'none' }}>
                    {getFieldDecorator('image', {
                      initialValue: 'alpine:v0.0.02',
                      rules: [{ message: '请选择版本', required: true }],
                    })(
                      <Select>
                        <Option value="alpine:v0.0.02">alpine:v0.0.02</Option>
                      </Select>,
                    )}
                  </FormItem>
                }
                {curRadioType == 'Script' ?
                  <FormItem {...formItemLayout} label="版本">
                    {getFieldDecorator('image', {
                      initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.image : '',
                      rules: [{ message: '请选择版本', required: true }],
                    })(
                      <Select name="image" showSearch
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                        {list &&
                        list.length &&
                        list.map((item, key) => (
                          <Option value={item} key={key}>
                            {/*{item ? item.split(':')[1] : ''}*/}
                            {item}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                  :
                  ''
                }
                <FormItem label="执行命令" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('command', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.Command : './main',
                    rules: [
                      {
                        required: true,
                        message: '请输入执行命令',
                      },
                    ],
                  })(editType ? (
                    <Input addonBefore="/bin/sh -c " placeholder="./main"/>
                  ) : (
                    <Input addonBefore="/bin/sh -c " placeholder="./main"/>
                  ))}
                </FormItem>

              </Form>
              <Button type="primary" ghost onClick={onReturn} style={{ marginLeft: 300, marginRight: 300 }}>取消</Button>
              <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
                提交
              </Button>
              <Divider style={{ margin: '20px 0 24px' }}/>
              <div>
                <h3>说明</h3>
                <h4>执行命令：请在表单中填入要执行的命令内容</h4>
                <p>例如要执行的命令为`/bin/sh -c ./main`, 系统默认会加上`/bin/sh -c`部分 ， 只需把`./main` 填入表单</p>
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>


      </PageHeaderLayout>
    );
  }
}

export default connect(({ user, gitlab, cronjob, global }) => ({
  namespaces: user.namespaces,
  list: gitlab.list,
  gitlab,
  cronjobInfo: cronjob.cronjobInfo,
  btnLoading: cronjob.btnLoading,
  gitAddrType: global.gitAddrType,
}))(AddCjob);
