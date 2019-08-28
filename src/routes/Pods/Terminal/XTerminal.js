import React, { Component, PropTypes } from 'react';
import { connect } from 'dva';
import { Terminal } from "xterm";
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks';
import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat';
import * as fit from 'xterm/lib/addons/fit/fit';
import SockJS from 'sockjs-client'
// import findDOMNode from 'react-dom'
import ReactDOM from "react-dom";


Terminal.applyAddon(fit);

const measureElement = element => {
  const DOMNode = ReactDOM.findDOMNode(element);
  return {
    width: DOMNode.offsetWidth,
    height: DOMNode.offsetHeight,
  };
}


class XTerminal extends Component {
  state = {
    socket: undefined,
    xterm: undefined,
  }
  xterm = undefined
  socket = undefined

  initTernimal () {
    var containerTerm = document.getElementById('terminal-container')
    var element = measureElement(this)
    let width = element.width;
    let height = element.height;
    if (height == 0) {
      height = this.props.bodyStyle.height;
    }
    let cols = parseInt((width - (width / 8 )) / 8);
    let rows = parseInt(height / 21);
    this.xterm = new Terminal({
        cursorBlink: true,
				cols: cols,
				rows: rows,
				scrollback: 400,
				tabStopWidth: 4
    });
    this.xterm.on('resize', (size) => {
      // wait for terminal initial
      this.timer = setInterval(() => {
        this.socket.send(JSON.stringify({'Op': 'stdin', 'Data': 'echo kplcloud-init\n'}));
      }, 1000*5);
    })
    this.xterm.on('key', (key, ev) => {
    });
    this.xterm.on('data', (data) => {
      this.socket.send(JSON.stringify({'Op': 'stdin', 'Data': data}));
    });
    this.xterm.open(containerTerm);
    this.connect();
  };

  connect() {
    // todo get sessionid
    let that = this;
    const {pods: {session}} = this.props

    var startData = {Op: 'bind', SessionID: session.session_id, Data: "{\"namespace\":\"operations\",\"container\":\""+session.container+"\",\"pod\":\""+session.pod+"\", \"token\": \""+session.token+"\"}"};
    let sessionId = session.session_id
    let termAddr = 'http://localhost:8080/ws/pods/console/exec?'+sessionId
    var options = {};
    let socket = new SockJS(termAddr, "", options);
    socket.onopen = function() {
      socket.send(JSON.stringify(startData));
      that.onConnectionOpen()
    }
    socket.onmessage = function (evt) {
      that.onConnectionMessage(evt);
    }
    socket.onclose = function (evt) {
      that.onConnectionClose(evt);
    }
    this.socket = socket;
    winptyCompat.winptyCompatInit(this.xterm);
    webLinks.webLinksInit(this.xterm);
    this.onTerminalResize();
    this.xterm.focus()
    // this.setState({xterm:xterm});
  };

  onConnectionMessage(evt){
    try {
      let msg = JSON.parse(evt.data);
      switch (msg['Op']) {
        case 'stdout':
          if (msg['Data'].toString().indexOf(`starting container process caused 'exec: \\'bash\\': executable file not found in $PATH'`) == -1) {
            if (msg['Data'].indexOf('wayne-init') > -1) {
              console.log('server ready.');
              clearInterval(this.timer);
              // when server ready for connection,send resize to server
              // send double time for bash and sh ,ensure the terminal can be resized.
              this.socket.send(JSON.stringify({'Op': 'resize', 'Cols': this.xterm.cols, 'Rows': this.xterm.rows}));
              this.socket.send(JSON.stringify({'Op': 'resize', 'Cols': this.xterm.cols, 'Rows': this.xterm.rows}));
            } else {
              this.xterm.write(msg['Data']);
            }

          }
          break;
        default:
          console.error('Unexpected message type:', msg);
      }
    } catch (e) {
      console.log('parse json error.', evt.data);
    }
  }

  onConnectionClose(evt){
    if (evt.reason !== '' && evt.code < 1000) {
      this.xterm.writeln(evt.reason);
    } else {
      this.xterm.writeln('Connection closed');
    }
  }

  // 连接建立成功后的挂载操作
  onConnectionOpen () {
    winptyCompat.winptyCompatInit(this.xterm);
    webLinks.webLinksInit(this.xterm);
    this.onTerminalResize();
    this.xterm.focus();
  };

  onTerminalResize(){
    var element = measureElement(this)
    let width = element.width;
    let height = element.height;
    if (height == 0) {
      height = this.props.style.height;
    }
    let cols = parseInt((width - (width / 8 )) / 8);
    let rows = parseInt(height / 21);
    this.xterm.resize(cols, rows);
  };

  componentWillUnmount(){
    if (this.xterm) {
      this.xterm.destroy();
    }
    if (this.socket) {
      this.socket.close();
    }
    clearInterval(this.timer);
  };

  // render 之前
  componentWillMount() {
    const {match} = this.props;
    this.props.dispatch({
      type: 'pods/getSessionId',
      payload: {
        namespace: match.params.namespace,
        container: match.params.svc,
        name: match.params.name
      }
    })
  }

  // render 之后
  componentDidMount() {
    this.initTernimal()
  }
  render() {
    const {pods: {session}} = this.props
    if(session.token) {
      this.connect();
    }
    return <div id="terminal-container" />;
  }
}

export default connect(({}) => ({}))(XTerminal);
