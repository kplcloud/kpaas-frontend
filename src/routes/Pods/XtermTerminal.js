import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card, Select,
} from 'antd';
import * as routerRedux from 'react-router-redux';
const Option = Select.Option;

class XtermTerminal extends PureComponent {
  state = {
    container: '',
  };
  onRedirect = (e) => {
    e.preventDefault();
    const { match } = this.props;
    window.open(`/terminal/${match.params.namespace}/index/${match.params.svc}/pod/${match.params.name}/container/${this.state.container ? this.state.container : match.params.svc}`)
    //window.open(`/terminal/${match.params.namespace}/service/${this.state.container ? this.state.container : match.params.svc}/pods/${match.params.name}?window=new`);
  };

  changePod = (value) => {
    const { dispatch, match: { params } } = this.props;
    const svc = this.state.container ? this.state.container : params.svc;
    dispatch(routerRedux.push('/pods/' + params.namespace + '/' + svc + '/detail/' + value));
  };
  changeContainer = (value) => {
    this.setState({ container: value });
    console.log('change containers:', value);
  };

  render() {
    const { match, pods: { list, detail } } = this.props;
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
        命令行 {detail && detail.pod && detail.pod.spec && detail.pod.spec.containers && (
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
          onChange={(value) => this.changePod(value)}>
          {optionData(list)}
        </Select>
      </span>
    );
    // var xterm = new Terminal();  // Instantiate the terminal
    // xterm.fit();                 // Use the `fit` method, provided by the `fit` addon
    return (
      <Card title={titleContent} bodyStyle={{ margin: 0, padding: 0 }}
            extra={<a href="javascript:;" onClick={this.onRedirect}>新窗口打开</a>}>
        <iframe frameBorder="no" border="0" marginWidth="0" marginHeight="0" scrolling="no" allowtransparency="yes"
                title="终端控制台"
                src={`/terminal/${match.params.namespace}/index/${match.params.svc}/pod/${match.params.name}/container/${this.state.container ? this.state.container : match.params.svc}`}
                width="100%" height="600px"></iframe>
      </Card>
    );
  }
}

export default connect(({}) => ({}))(XtermTerminal);
