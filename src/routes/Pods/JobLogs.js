import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Tooltip,
  Divider,
  Select, Icon,
} from 'antd';
import { Terminal } from 'xterm';
import xtermStyle from 'xterm/dist/xterm.css';
import * as routerRedux from 'react-router-redux';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;

let term = new Terminal({
  cursorBlink: true,
  cols: Math.round(document.body.clientWidth / 12),
  rows: 40,
  cursorBlink: 5,
  // scrollback: 30,
  tabStopWidth: 4,
});

// term.textarea = false

class JobLogs extends PureComponent {
  state = {
    timeoutId: 0,
    container: '',
    style: {
      marginBottom: 24,
    },
    btnShrink: 'arrows-alt',
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    let { timeoutId } = this.state;
    dispatch({
      type: 'pods/getLogs',
      payload: {
        namespace: match.params.namespace,
        //name: match.params.name,
        name:match.params.svc,
        container: match.params.svc,
      },
    });
    if (timeoutId !== 0) {
      clearInterval(timeoutId);
    }
    term.clear();
    term.open(document.getElementById('xterm-container'));
    timeoutId = setInterval(this.getLogs, 5000);
    this.setState({
      timeoutId: timeoutId,
    });
    window.addEventListener('resize', this.updateDimensions);
  };

  componentWillUnmount() {
    let { timeoutId } = this.state;
    if (timeoutId != 0) {
      clearInterval(timeoutId);
    }
  }

  stopLogSend = (e) => {
    e.preventDefault();
    let { timeoutId } = this.state;
    if (timeoutId != 0) {
      clearInterval(timeoutId);
    }
  };

  getLogs = () => {
    const { dispatch, match } = this.props;
    const { container } = this.state;
    dispatch({
      type: 'pods/getLogs',
      payload: {
        namespace: match.params.namespace,
        //name: match.params.name,
        name:match.params.svc,
        container: container,
      },
    });
  };

  downloadLogs = (e) => {
    e.preventDefault();
    const { match } = this.props;
    window.open('/pods/' + match.params.namespace + '/project/' + match.params.name + '/pod/' + match.params.svc + '/log/download');
  };

  changePod = (value) => {
    const { dispatch, match: { params } } = this.props;
    dispatch(routerRedux.push('/pods/' + params.namespace + '/' + params.svc + '/detail/' + value));
  };
  changeContainer = (value) => {
    this.setState({ container: value });
    const { dispatch, match } = this.props;
    dispatch({
      type: 'pods/getLogs',
      payload: {
        namespace: match.params.namespace,
        //name: match.params.name,
        name:match.params.svc,
        container: value,
      },
    });
  };

  updateDimensions = () => {
    const { btnShrink } = this.state;
    if (btnShrink == 'shrink') {
      let cols = parseInt((window.innerWidth - (window.innerWidth / 8)) / 8);
      let rows = parseInt((window.innerHeight - 15) / (21 - 3.3333)); // 3.3333 = (CardHeaderHeight 70px / 21); 21 = line-height 1.5 * fontSize 14px
      term.resize(cols, rows);
    } else {
      let width = document.body.clientWidth - 305;
      let cols = parseInt((width - (width / 8)) / 8);
      term.resize(cols, 40);
    }
  };

  arrowsAlt = () => {
    const { btnShrink } = this.state;
    let style = {
      marginBottom: 24,
    };
    if (btnShrink != 'shrink') {
      style = {
        position: 'fixed', top: 0, left: 0, zIndex: 1000, width: '100%', height: window.innerHeight,
      };
      this.setState({
        style: style,
        btnShrink: 'shrink',
      });
      let cols = parseInt((window.innerWidth - (window.innerWidth / 8)) / 8);
      let rows = parseInt((window.innerHeight - 15) / (21 - 3.3333)); // 3.3333 = (CardHeaderHeight 70px / 21); 21 = line-height 1.5 * fontSize 14px
      term.resize(cols, rows);
    } else {
      this.setState({
        style: style,
        btnShrink: 'arrows-alt',
      });
      let width = document.body.clientWidth - 305;
      let cols = parseInt((width - (width / 8)) / 8);
      // let rows = parseInt((window.innerHeight - 15) / (21 - 3.3333)); // 3.3333 = (CardHeaderHeight 70px / 21); 21 = line-height 1.5 * fontSize 14px
      term.resize(cols, 40);
    }
  };

  render() {
    const { pods: { logs: { logs }, list, detail }, match, dispatch } = this.props;
    term.clear();
    if (logs && logs.length > 0) {
      for (var i in logs) {
        term.writeln(logs[i].content);
      }
    }
    const optionData = (data) => {
      if (!list) {
        return <Option value={match.params.name}>{match.params.name}</Option>;
      }
      const dataMap = [];
      for (var i in data) {
        dataMap.push(<Option key={i} value={data[i].name}>{data[i].name}</Option>);
      }
      return dataMap;
    };
    const titleContent = (
      <span>
        容器
        {detail && detail.pod && detail.pod.spec && detail.pod.spec.containers && (
          <Select
            style={{ marginRight: 20, marginLeft: 20, border: false }}
            defaultValue={match.params.svc}
            onChange={(value) => this.changeContainer(value)}
          >
            {optionData(detail.pod.spec.containers)}
          </Select>
        )}
        位于
        <Select
          style={{ marginLeft: 20, border: false }}
          defaultValue={match.params.name}
          onChange={(value) => this.changePod(value)}
        >
          {optionData(list)}
        </Select>
      </span>
    );

    const { style, btnShrink } = this.state;
    const onReturn = () => {
      dispatch(routerRedux.push(`/project/cornjob/detail/${match.params.namespace}/${match.params.name}`));
    };
    const detailService = (
      <span>
        <a onClick={onReturn}><Icon type="rollback"/> &nbsp;返回服务详情</a>
      </span>
    );
    return (
      <PageHeaderLayout
        title={`Pods详情${detail && detail.pod ? ' - ' + detail.pod.metadata.name : ''}`}
        content={detailService}
        loading={false}
      >
        <Card
          title={titleContent}
          style={style}
          bodyStyle={{ margin: 0, padding: 0 }}
          bordered={false}
          extra={
            <div>
              <Tooltip placement="topLeft" title="暂停日志推送">
                <Button icon="pause-circle" onClick={this.stopLogSend}/>
              </Tooltip>
              <Divider type="vertical"/>
              <Tooltip placement="topLeft" title="最大化／还原">
                <Button icon={btnShrink} onClick={this.arrowsAlt}/>
              </Tooltip>
              <Divider type="vertical"/>
              <Tooltip placement="topLeft" title="下载日志" onClick={this.downloadLogs}>
                <Button icon="download"/>
              </Tooltip>
            </div>
          }
        >
          <div id="xterm-container" className={xtermStyle.xterm}></div>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ pods }) => ({
  pods,
}))(JobLogs);
