/**
 * Created by huyunting on 2018/8/24.
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CreateCommand from './CreateCommand';
import { message, Form, Input, Button, Card, Select, Icon, Radio, Divider, Tabs } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

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
class Add extends React.PureComponent {
  state = {
    id: 0,
    name: '创建定时任务',
    namespace: '',
    gitType: 'tag',
    gitPath: '',
    editType: false,
    defaultTab: 'Script',
  };

  componentWillMount() {
    const { dispatch, list, match } = this.props;
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

  changeTabsDefaultVal = (val) => {
    if (!changeTabs && val) {
      changeTabs = true;
      this.setState({ defaultTab: val });
    }
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
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys') ? form.getFieldValue('keys') : [];
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  fetchGitlab = e => {
    var val = e.target.value;
    if (val === '') {
      return;
    }
    if (val.indexOf('git@git') !== -1) {
      message.error('项目地址填写有误，仅支持项目除域名外的部分');
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

  changeGitType = e => {
    this.setState({ gitType: e.target.value });
  };

  render() {
    const { form, namespaces, cronjobInfo, btnLoading, gitlab, gitAddrType } = this.props;
    const { editType } = this.state;
    const { validateFields, getFieldDecorator, getFieldValue } = form;
    var that = this;
    var list = this.props;
    if (this.state.gitType === 'tag' && gitlab && gitlab.tags) {
      list = gitlab.tags;
    }
    if (this.state.gitType === 'branch' && gitlab && gitlab.branches) {
      list = gitlab.branches;
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (list.length <= 0) {
          message.error('请先选择项目地址');
          return;
        }
        if (!err) {
          var params = [];
          var argsData = [];
          values['args'].map((items, key) => {
            if (items) argsData.push(items);
          });
          if (argsData.length < 1) {
            message.error('请填写执行命令');
            return;
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.schedule = values.schedule;
          params.args = argsData;
          params.image = values.image;
          params.gitPath = this.state.gitPath ? this.state.gitPath : (cronjobInfo ? cronjobInfo.git_path : '');
          params.gitType = this.state.gitType ? this.state.gitType : (cronjobInfo ? cronjobInfo.git_type : '');
          params.log_path = values.log_path;
          params.add_type = 'Script';

          if (this.state.editType) {
            if (this.state.defaultTab != params.add_type) {
              message.error('当前定时任务为命令模式，不允以脚本模式提交！');
              return;
            }
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <span key={k}>
          <Form.Item>
            {getFieldDecorator(`args[${k}]`, {
              initialValue: (this.state.editType && cronjobInfo && cronjobInfo.args) ? cronjobInfo.args[k] : '',
              rules: [{ required: true, message: '请输入命令参数' }, {
                message: '请输入命令参数',
              }],
            })(<Input style={{ width: '80%', marginRight: 20 }} placeholder={description(k)}/>)}
            <Icon
              className="dynamic-delete-button"
              type="plus-circle-o"
              onClick={() => this.add(k)}
              style={{ marginRight: 20 }}
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
            <Tabs.TabPane tab="脚本模式" key="Script">
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
                <Form.Item {...formItemLayout} label="项目Git地址">
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
                  分支: &nbsp;
                  {getFieldDecorator('git_type', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.git_type : 'tag',
                  })(
                    <Radio.Group onChange={this.changeGitType} name="git_type">
                      <Radio value="tag">Tag</Radio>
                      <Radio value="branch">Branch</Radio>
                    </Radio.Group>,
                  )}
                  版本: &nbsp;
                  {getFieldDecorator('image', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.image : '',
                    rules: [{ message: '请选择版本', required: true }],
                  })(
                    <Select style={{ width: 240 }} name="image" showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                      {list &&
                      list.length &&
                      list.map((item, key) => (
                        <Option value={item} key={key}>
                          {item ? item.split(':')[1] : ''}
                        </Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
                <FormItem label="日志路径" hasFeedback {...formItemLayout} help="根据需要填写日志路径(日志会自动收集到填写目录中)。默认为空(不收集日志)">
                  {getFieldDecorator('log_path', {
                    initialValue: (this.state.editType && cronjobInfo) ? cronjobInfo.log_path : '',
                  })(
                    <Input placeholder="默认为空(不收集日志)"/>,
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
                <FormItem label="执行命令 " hasFeedback {...formItemLayout}>
                  {formItems}
                </FormItem>
                <Form.Item
                  wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: {
                      span: formItemLayout.wrapperCol.span,
                      offset: formItemLayout.labelCol.span,
                    },
                  }}
                  label=""
                >
                </Form.Item>
              </Form>
              <Button type="primary" ghost onClick={onReturn} style={{ marginLeft: 300, marginRight: 300 }}>取消</Button>
              <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
                提交
              </Button>
              <Divider style={{ margin: '20px 0 24px' }}/>
              <div>
                <h3>说明</h3>
                <h4>执行命令：请按照命令参数进行拆分，分别写入命令表单中</h4>
                <p>例如要执行的命令为`/bin/sh -c ./main`, 将命令拆分为三部分`/bin/sh` ， `-c` 和 `./main` 分别写入表单</p>
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="命令模式" key="Command">
              <CreateCommand {...{ editType: this.state.editType, defaultTab: this.state.defaultTab }}/>
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
}))(Add);
