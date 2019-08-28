/**
 * Created by huyunting on 2018/7/18.
 */
import React from 'react';
import { Modal, Form, Button, Select, Radio, message, Input, DatePicker, Icon, Tooltip, Popconfirm, Alert } from 'antd';

const Option = Select.Option;

class BuildModal extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    gitVersion: '',
    gitBranch: 'tag',
    buildEnv: '',
    buildTime: '',
    buildEnvDesc: '',
    buildEnvSelect: '',
    checkTimeBuild: false,
    addEnv: false,
  };

  componentDidMount() {
    const { tags } = this.props;
    const that = this;
    if (tags && tags.length && tags[0]) {
      that.setState({ gitVersion: tags[0] });
    }
  }

  componentWillUnmount() {
    this.setState({ gitVersion: '' });
  }

  handleOk = () => {
    const { gitVersion } = this.state;
    const { onOk, project } = this.props;
    if (gitVersion === '') {
      message.error('请选择版本');
      return;
    }
    const params = {
      version: gitVersion,
      build_env: this.state.addEnv ? this.state.buildEnv : this.state.buildEnvSelect,
      build_env_description: this.state.addEnv ? this.state.buildEnvDesc : '',
      git_type: this.state.gitBranch,
      build_time: this.state.checkTimeBuild ? this.state.buildTime : '',
      name: project.name,
      namespace: project.namespace,
    };
    onOk(params);
  };
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  changeGitVersion = val => {
    this.setState({ gitVersion: val });
  };
  changeSelectBuildEnv = val => {
    this.setState({ buildEnvSelect: val });
  };

  changeGitBranch = e => {
    this.setState({ gitBranch: e.target.value, gitVersion: '' });
  };
  changeBuildEnv = e => {
    this.setState({ buildEnv: e.target.value });
  };
  changeBuildEnvDescription = e => {
    this.setState({ buildEnvDesc: e.target.value });
  };
  onDateChange = (value, dateString) => {
    if (dateString !== '') {
      this.setState({ buildTime: dateString });
    }
  };
  onDateOk = (value, dateString) => {
    console.log('onOk: ', value, dateString);
  };
  changecheckTimeBuild = e => {
    this.setState({ checkTimeBuild: e.target.value });
  };

  handleAddEnv = (status) => {
    this.setState({ addEnv: !!status });
  };

  render() {
    const { loading, visible, branches, tags, language, project, jenkins } = this.props;
    const { lastBuilds: { build_env_list } } = jenkins;
    const modalOpts = {
      title: 'Build',
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key='back' onClick={this.handleCancel}>
          取消
        </Button>,
        <span style={{ marginLeft: 10 }}>
            <Popconfirm title='您正在执行生产环境，确定要操作吗？' onConfirm={this.handleOk}>
              <Button key='submit2' type='primary' loading={loading}>
                Build
              </Button>
            </Popconfirm>
        </span>,
      ],
    };

    let branch = 'tag';
    let branchName = '';
    for (var i in project.templates) {
      var tpl = project.templates[i];
      if (tpl.kind === 'Deployment') {
        var fields = JSON.parse(tpl.fields);
        branch = fields.git_type;
        branchName = fields.git_version;
        break;
      }
    }
    const options = [];
    const radioArr = [];
    if (language === 'Golang') {
      if (branch === 'branch') {
        options.push(
          <Option value={branchName} key={0}>
            {branchName ? branchName.split(':')[1] : ''}
          </Option>,
        );
        radioArr.push(<Radio value='branch' key="branch">Branch</Radio>);
      } else {
        radioArr.push(<Radio value='tag' key="tag">Tag</Radio>);
      }
    } else {
      for (var i in branches) {
        options.push(
          <Option value={branches[i]} key={i}>
            {branches[i] ? branches[i].split(':')[1] : ''}
          </Option>,
        );
      }
      radioArr.push(<Radio value='tag' key="tag">Tag</Radio>);
      radioArr.push(<Radio value='branch' key="branch">Branch</Radio>);
    }

    return (
      <Modal {...modalOpts}>
          <Alert
            message="温馨提示：您当前正在操作的是生产环境"
            type="warning"
            style={{ marginBottom: 10, marginTop: -15 }}
            banner
            closable
          />
        {/* <div style={{ marginLeft: 60 }}>
          分支： &nbsp;
          <Radio.Group
            name='git_type'
            onChange={this.changeGitBranch}
            style={{ width: 240, marginBottom: 20 }}
            value={this.state.gitBranch}
          >
            {radioArr}
          </Radio.Group>
        </div> */}
        <span style={{ marginLeft: 60 }}>
          版本: &nbsp;
          <Select
            showSearch
            style={{ width: 240, marginBottom: 20 }}
            name='git_version'
            onChange={this.changeGitVersion}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={this.state.gitVersion}
            loading={loading}
          >
            {this.state.gitBranch === 'tag' &&
            tags &&
            tags.length &&
            tags.map((item, key) => (
              <Option value={item} key={key}>
                {item}
              </Option>
            ))}
            {this.state.gitBranch === 'branch' && branches && branches.length && options}
          </Select>
        </span>
        {/* {language === 'Java' && !this.state.addEnv && (
          <div>
            <Tooltip title='填写内容例如：online/pre/dev，默认值为上次填写内容'>
              <Icon type='info-circle-o'/>BUILD_ENV：
            </Tooltip>
            <Select
              showSearch
              style={{ width: 240, marginBottom: 20 }}
              name='build_env'
              onChange={this.changeSelectBuildEnv}
              value={this.state.buildEnvSelect}
            >
              {build_env_list &&
              build_env_list.length &&
              build_env_list.map((item, key) => (
                <Option value={item.env} key={key}>
                  {item.env}{item.decription !== '' ? `（` + item.decription + `）` : ''}
                </Option>
              ))}
            </Select>
            <a onClick={() => this.handleAddEnv(true)}><Icon type="plus" style={{ marginLeft: 10 }}/> 添加参数</a>
          </div>
        )} */}

        {/* {language === 'Java' && this.state.addEnv && (
          <div>
            <Tooltip title='填写内容例如：online/pre/dev，默认值为上次填写内容'>
              <Icon type='info-circle-o'/>BUILD_ENV：
            </Tooltip>
            <Input
              name='build_env'
              style={{ width: 240, marginBottom: 20 }}
              placeholder='例如：online/pre/dev'
              onKeyUp={this.changeBuildEnv}
            />
            <Input
              name='build_env_description'
              style={{ width: 240, marginLeft: 100, marginBottom: 20 }}
              placeholder='build_env描述信息'
              onKeyUp={this.changeBuildEnvDescription}
            />
            <a onClick={() => this.handleAddEnv(false)}><Icon type="close" style={{ marginLeft: 10 }}/> 取消</a>
          </div>
        )} */}

        {/* <div style={{ marginLeft: 20 }}>
          <Tooltip title='设置定时发布时间后，将会定时执行build任务。如不需要定时发布，请务选择发布时间。'>
            <Icon type='info-circle-o'/>定时发布：&nbsp;
          </Tooltip>
          <Radio.Group onChange={this.changecheckTimeBuild} value={this.state.checkTimeBuild}>
            <Radio key={0} value={false}>否</Radio>
            <Radio key={1} value={true}>是</Radio>
          </Radio.Group>
          <br/>
          {this.state.checkTimeBuild === true && (
            <DatePicker
              showTime
              name='build_time'
              format='YYYY-MM-DD HH:mm:ss'
              placeholder='设置定时发布时间'
              onChange={this.onDateChange}
              onOk={this.onDateOk}
              style={{ width: 240, marginTop: 20, marginLeft: 85 }}
            />
          )}
        </div> */}
      </Modal>
    );
  }
}

BuildModal.propTypes = {};

export default Form.create()(BuildModal);
