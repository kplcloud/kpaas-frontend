/**
 * Created by huyunting on 2018/10/18.
 */
import React, { PropTypes, Fragment } from 'react';
import { Modal, Form, Button, Select, Radio, message, Input } from 'antd';
const Option = Select.Option;

class CronjobBuildModal extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    gitVersion: '',
    gitBranch: 'tag',
    buildEnv: '',
  };

  componentDidMount() {
    const { tags } = this.props;
    if (tags && tags.length && tags[0]) {
      this.setState({ gitVersion: tags[0] });
    }
  }

  handleOk = () => {
    const { gitVersion } = this.state;
    const { onOk, projectId } = this.props;
    if (gitVersion == '') {
      message.error('请选择版本');
      return;
    }
    const params = {
      tag: gitVersion,
      project_id: projectId,
      build_env: this.state.buildEnv,
      git_type: this.state.gitBranch,
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

  changeGitBranch = e => {
    this.setState({ gitBranch: e.target.value, gitVersion: '' });
  };
  changeBuildEnv = e => {
    this.setState({ buildEnv: e.target.value });
  };

  render() {
    const { loading, visible, branches, tags, language, project } = this.props;
    // const {templates} = data.auditList.project
    const modalOpts = {
      title: 'Build',
      visible: visible,
      onCancel: this.handleCancel,
      wrapClassName: 'vertical-center-modal',
      footer: [
        <Button key="back" onClick={this.handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
          Build
        </Button>,
      ],
    };

    let branch = 'tag';
    let branchName = '';

    let options = [];
    let radioArr = [];
    // if (language == "Golang") {
    //   if (branch == "branch") {
    //     options.push(<Option value={branchName} key={0}>
    //       {branchName ? branchName.split(":")[1] : ""}
    //     </Option>);
    //     radioArr.push(<Radio value="branch" key="branch">Branch</Radio>);
    //   } else {
    //     radioArr.push(<Radio value="tag" key="tag">Tag</Radio>);
    //   }
    // } else {
    for (var i in branches) {
      options.push(
        <Option value={branches[i]} key={i}>
          {branches[i] ? branches[i].split(':')[1] : ''}
        </Option>
      );
    }
    radioArr.push(
      <Radio value="tag" key="tag">
        Tag
      </Radio>
    );
    radioArr.push(
      <Radio value="branch" key="branch">
        Branch
      </Radio>
    );
    // }

    return (
      <Modal {...modalOpts}>
        <div style={{ marginLeft: 50 }}>
          分支： &nbsp;
          <Radio.Group
            name="git_type"
            onChange={this.changeGitBranch}
            style={{ width: 240, marginBottom: 20 }}
            value={this.state.gitBranch}
          >
            {radioArr}
          </Radio.Group>
        </div>
        <span style={{ marginLeft: 50 }}>
          版本: &nbsp;
          <Select
            showSearch
            style={{ width: 240, marginBottom: 20 }}
            name="git_version"
            onChange={this.changeGitVersion}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={this.state.gitVersion}
          >
            {this.state.gitBranch == 'tag' &&
              tags &&
              tags.length &&
              tags.map((item, key) => (
                <Option value={item} key={key}>
                  {/*{item ? item.split(':')[1] : ''}*/}
                  {item}
                </Option>
              ))}
            {this.state.gitBranch == 'branch' && branches && branches.length && options}
          </Select>
        </span>
      </Modal>
    );
  }
}

CronjobBuildModal.propTypes = {};

export default Form.create()(CronjobBuildModal);
