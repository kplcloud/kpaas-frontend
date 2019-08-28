/**
 * Created by dudulu on 2018/6/28.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Popconfirm, Row, Col, List, Avatar, message, Spin } from 'antd';
import { Terminal } from 'xterm';
import xtermStyle from 'xterm/dist/xterm.css';

let term = new Terminal({
  cursorBlink: true,
  cols: Math.round(document.body.clientWidth / 16),
  rows: 50,
  cursorBlink: 5,
  // scrollback: 100,
  tabStopWidth: 4,
  flat: 0,
});

class BuildLogs extends PureComponent {
  state = {
    buildNumber: 0,
    timeoutId: 0,
    intervalNum: 0,
    start: 0,
    types: "project",
  };


  componentWillMount() {
    const { dispatch, name, namespace, checkProject, types} = this.props;
    let type = types === "cronjob" ? types : "project";
    this.setState({types:type});
    if (name && namespace) {
      dispatch({
        type: 'jenkins/buildHistory',
        payload: {
          namespace: namespace,
          name: name,
          checkProject: checkProject,
          types: type,
        },
      });
    }
  }

  componentDidMount() {
    term.clear();
    term.open(document.getElementById('xterm-build-logs'));
  }

  componentWillUnmount() {
    const { timeoutId } = this.state;
    if (timeoutId !== 0) {
      clearInterval(timeoutId);
    }
  }

  getLogs = () => {
    const { namespace, name, dispatch, buildLogs, checkProject } = this.props;
    const { end } = buildLogs;
    if (buildLogs && buildLogs.output && buildLogs.output.indexOf('Finished:') !== -1) {
      clearInterval(this.state.timeoutId);
      if (this.state.intervalNum > 0) {
        dispatch({
          type: 'jenkins/buildHistory',
          payload: {
            namespace: namespace,
            name: name,
            number: this.state.buildNumber,
            checkProject: checkProject,
            types: this.state.types,
          },
        });
        dispatch({ type: 'jenkins/hideBuildLogsLoading' });
      }
    } else if (buildLogs && buildLogs.output && buildLogs.output.indexOf('Finished:') === -1) {
      // dispatch({ type: 'jenkins/showBuildLogsLoading' });
      if (name && namespace) {
        dispatch({
          type: 'jenkins/buildLogs',
          payload: {
            namespace: namespace,
            name: name,
            number: this.state.buildNumber,
            start: end,
            types: this.state.types,
          },
        });
        this.setState({ intervalNum: this.state.intervalNum + 1 });
      }
    } else {
      clearInterval(this.state.timeoutId);
    }
  };

  checkBuild = number => {
    const { dispatch, name, namespace, checkProject } = this.props;
    let { timeoutId } = this.state;
    this.setState({ buildNumber: number });
    if (timeoutId !== 0) {
      clearInterval(timeoutId);
    }
    timeoutId = setInterval(this.getLogs, 3000);
    this.setState({
      timeoutId: timeoutId,
    });
    if (name && namespace && number > 0) {
      dispatch({
        type: 'jenkins/buildLogs',
        payload: {
          namespace: namespace,
          name: name,
          number: number,
          checkProject: checkProject,
          types: this.state.types,
        },
      });
    } else {
      message.error('页面信息有误~');
    }
  };

  showResult = (state, name, number, id) => {
    let icon = 'info';
    let color = '#D0CECD';
    if (state === 'SUCCESS') {
      icon = 'check';
      color = '#16cc14';
    } else if (state === 'FAILURE') {
      icon = 'close';
      color = '#cc4549';
    } else if (state === 'ABORTED') {
      icon = 'exclamation';
    } else if (state === 'NOBUILD') {
      icon = 'pause';
    } else {
      icon = 'loading';
    }
    return (
      <span>
        <Avatar size="small" icon={icon} style={{ backgroundColor: color }}/>
        {this.showStop(name, number, state, id)}
      </span>
    );
  };
  showBackground = id => {
    if (id === this.state.buildNumber) {
      return '#d5e7ef';
    } else {
      return '#ffffff';
    }
  };

  confirmStop = (name, number, id) => {
    if (!name || !id) {
      message.error('build 终止失败~');
      return;
    }
    this.props.dispatch({
      type: 'jenkins/stopBuild',
      payload: {
        id: id,
        name: this.props.name,
        namespace: this.props.namespace,
      },
    });
  };
  showStop = (name, numberId, state, id) => {
    if (state === 'BUILDING' || state === 'NOBUILD') {
      return (
        <Popconfirm
          title="确定要终止build？"
          okText="Yes"
          cancelText="No"
          onConfirm={() => this.confirmStop(name, numberId, id)}
        >
          <Avatar size="small" icon="pause" style={{ backgroundColor: '#cc4549', marginLeft: 3 }}/>
        </Popconfirm>
      );
    }
  };

  flag = (v) => {
    const { start } = this.state;
    if (v == 0) {
      return true;
    }
    if (v == start) {
      return false;
    }
    this.setState({ start: v });
    return true;
  };

  render() {
    const { buildHistorys, buildLogs, name, loading } = this.props;
    const { output, start } = buildLogs;
    if (start === 0) {
      term.clear();
    }

    if (this.state.buildNumber === 0) {
      term.clear();
      term.writeln('请选择左侧版本，查看Build控制台输出');
    } else if (output && output.length > 1) {
      if (this.flag(start)) {
        const lines = output.split('\n');
        for (var i in lines) {
          term.writeln(lines[i]);
        }
      }
    }
    
    return (
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span={6}>
            <Card
              title="Build history"
              bordered={false}
              bodyStyle={{ margin: 0, padding: 0 }}
              type="inner"
            >
              {buildHistorys && (
                <List
                  dataSource={buildHistorys.list}
                  renderItem={item => (
                    <List.Item
                      key={item.id}
                      style={{ backgroundColor: this.showBackground(item.number), paddingLeft: 10 }}
                    >
                      <List.Item.Meta
                        avatar={this.showResult(
                          item.status,
                          item.version,
                          item.build_id,
                          item.id,
                        )}
                        title={
                          <a onClick={() => this.checkBuild(item.id)}>
                            {item.member.username + ' ' + item.version}
                          </a>
                        }
                        description={item.result === 'NOBUILD' ? ('定时：' + moment(new Date(item.build_time)).format('YYYY/MM/DD HH:mm')) : moment(new Date(item.build_time)).format('YYYY/MM/DD HH:mm')}
                      />
                    </List.Item>
                  )}
                />
              )}
              {
                !buildHistorys && (
                  <span style={{ height: 100 }}><p style={{ marginTop: 20, marginLeft: 40 }}>暂无build数据</p></span>)
              }
            </Card>
          </Col>

          <Col span={18}>
            <Card
              title={`项目 【${name}】 控制台输出`}
              bodyStyle={{ margin: 0, padding: 0 }}
              bordered
            >
              <div id="xterm-build-logs" className={xtermStyle.xterm}/>
            </Card>
          </Col>
        </Row>
      </Spin>
    );
  }
}

export default connect(({ jenkins }) => ({
  buildLogs: jenkins.buildLogs,
  buildHistorys: jenkins.buildHistory,
  loading: jenkins.loading,
  buildLogsLoading: jenkins.buildLogsLoading,
}))(BuildLogs);
