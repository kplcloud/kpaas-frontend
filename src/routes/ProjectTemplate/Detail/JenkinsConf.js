/**
 * Created by yuntinghu on 2019/5/17.
 */

import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;

class JenkinsConf extends React.Component {
  componentWillMount() {
    const { dispatch, name_en, namespace, match: { params } } = this.props;
    dispatch({
      type: 'jenkins/JenkinsConf',
      payload: {
        namespace: params && params.namespace,
        name: params && params.name,
      },
    });
  }

  render() {
    const { jenkins: { jenkinsConf } } = this.props;
    const component = (codeString) => {
      return <SyntaxHighlighter language='shell' style={tomorrowNight}>{codeString}</SyntaxHighlighter>;
    };
    return (
      <Fragment>
        <Card style={{ marginBottom: 24 }}>
          <DescriptionList
            style={{ marginBottom: 24 }}
          >
            <Description term="项目名称">
              {jenkinsConf ? jenkinsConf.name + '.' + jenkinsConf.namespace : '-'}
            </Description>
            <Description term="Git 地址">
              {jenkinsConf ? jenkinsConf.git_addr : '-'}
            </Description>
            <Description term="Git 类型">
              {jenkinsConf ? jenkinsConf.git_type : '-'}
            </Description>
          </DescriptionList>
        </Card>
        <Card title="Command" className="language-bash" bodyStyle={{ padding: 0 }}>
          {jenkinsConf && jenkinsConf.command && component(jenkinsConf.command)}
        </Card>
      </Fragment>
    );
  }
}

export default connect(({ jenkins }) => ({ jenkins }))(JenkinsConf);
