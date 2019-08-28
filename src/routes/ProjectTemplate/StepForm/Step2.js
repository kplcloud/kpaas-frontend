import React from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Modal,
  Select,
  Radio,
  InputNumber,
  message,
  Tooltip,
  Icon,
  Divider,
} from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Option } = Select;
const confirm = Modal.confirm;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  state = {
    portNum: 1,
    gitType: 'tag',
    gitPath: '',
    gitVersioin: '',
    addPort: false,
    jarCommand: `"java"`,
    tomcatCommand: `"/bin/sh","/opt/soft/tomcat/bin/catalina.sh","run"`,
  };

  componentWillMount() {
    const { match: { params: { namespace, name } }, dispatch } = this.props;
    dispatch({
      type: 'project/projectInfo',
      payload: {
        namespace: namespace,
        name: name,
      },
    });
    dispatch({
      type: 'global/config',
    });
  }

  onChangeImage = val => {
    this.props.dispatch({
      type: 'project/changeProjectImage',
      payload: {
        image: val,
      },
    });
    this.props.dispatch({
      type: 'project/changeImageLanguage',
      payload: { image: val },
    });
  };


  onDownDockerfile = () => {
    this.props.dispatch(routerRedux.push('/markets/dockerfile/list'));
  };

  changeCpuType = (e) => {
    if (this.props.data.javaState) {
      const halfNum = parseInt(e.target.value.substring(2), 0) / 2;
      if (halfNum >= 1 && halfNum <= 20) {
        this.props.dispatch({
          type: 'project/changeCupInfo',
          payload: {
            cpuHalfNum: halfNum.toString() + 'g',
          },
        });
      } else if (halfNum === 0.5) {
        this.props.dispatch({
          type: 'project/changeCupInfo',
          payload: {
            cpuHalfNum: '512m',
          },
        });
      } else if (halfNum > 20) {
        this.props.dispatch({
          type: 'project/changeCupInfo',
          payload: {
            cpuHalfNum: halfNum.toString() + 'm',
          },
        });
      }
    }
  };

  changeGitType = e => {
    const { dispatch, gitAddrType } = this.props;
    var gitType = e.target.value;
    const { gitPath } = this.state;
    if (gitPath === '') {
      return;
    }
    this.setState({ gitType: gitType });
    if (gitType === 'branch') {
      dispatch({
        type: 'gitlab/branchList',
        payload: {
          git: gitAddrType + gitPath,
        },
      });
    } else if (gitType === 'tag') {
      dispatch({
        type: 'gitlab/tagList',
        payload: {
          git: gitAddrType + gitPath,
        },
      });
    }
  };

  changeGitVersion = val => {
    this.setState({ gitVersioin: val });
  };
  changeServiceStart = (e) => {
    this.props.dispatch({
      type: 'project/changeServiceStart',
      payload: {
        serviceStart: e.target.value,
      },
    });

  };

  fetchGitlab = e => {
    var val = e.target.value;
    if (val == '') {
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

  render() {
    const { form, data, dispatch, submitting, match, gitlab, gitAddrType } = this.props;
    const { deploymentInfo, language } = data;
    const { WebFields } = deploymentInfo;
    const { getFieldDecorator, validateFields } = form;
    var { list } = gitlab;
    if (this.state.gitType === 'tag' && gitlab && gitlab.tags) {
      list = gitlab.tags;
    }
    if (this.state.gitType === 'branch' && gitlab && gitlab.branches) {
      list = gitlab.branches;
    }
    const onPrev = () => {
      dispatch(routerRedux.push('/project/create/info'));
    };
    const addPorts = () => {
      const { portNum } = this.state;
      if (portNum >= 5) {
        Modal.warning({
          title: '温馨提示~',
          content: '您创建的端口太多了。。如有需要，请联系管理员~',
        });
        return;
      }
      this.setState({
        portNum: portNum + 1,
      });
      onValidateForm(true);
    };
    const onValidateForm = (auto) => {
      validateFields((err, values) => {
        var params = [];
        var routes = [];
        if (this.state.addPort) {
          for (var i = 1; i <= values.routes.length; i++) {
            if (values.routes[i] && values.routes[i]['port'] && values.routes[i]['name'] && values.routes[i]['protocol']) {
              routes.push(values.routes[i]);
            }
          }
        }

        if (values['git_addr'].indexOf('git@git') !== -1) {
          message.error('项目地址填写有误，请填写项目除域名外的部分');
          return;
        }
        var commandData = [];
        var argsData = [];
        if (data.javaState) {
          if (data.serviceStart === '2') {
            this.state.tomcatCommand.split(',').map((value) => {
              if (value !== '') {
                commandData.push(value);
              }
            });
          } else {
            this.state.jarCommand.split(',').map((value) => {
              if (value !== '') {
                commandData.push(value);
              }
            });
          }
        }
        // if (values && values['command'] && values['command'].length > 0) {
        //   values['command'].split(',').map((value) => {
        //     if (value) {
        //       commandData.push(value);
        //     }
        //   });
        // }
        if (values && values['args'] && values['args'].length > 0) {
          values['args'].split(',').map((value) => {
            if (value) {
              argsData.push(value);
            }
          });
        }
        // params.id = match.params.projectId;
        params.name = match.params.name;
        params.namespace = match.params.namespace;
        params.step = 1;
        params.ports = routes;
        params.replicas = values.replicas ? values.replicas : 1; // 副本数
        params.resource_type = '1'; // 服务类型: 1集群内部访问，2内外均可访问
        params.resources = values.resources; // 容器规格
        // params.other_resources = values["other_resources"]; //自定义容器规格
        params.mountPath = values.mountPath ? values.mountPath : ''; // 日志宿主机路径
        params.image = values.image; // 基础镜像
        params.git_addr = values.git_addr;
        params.git_type = values.git_type;
        params.git_version = values.git_version;
        params.args = argsData;
        params.command = commandData;
        params.resource_model = values.mesh ? values.mesh : 'normal';
        params.double_service = doubleService;
        params.service_start = values.service_start;
        params.env = values.env;
        params.git_pomfile = values.git_pomfile;
        params.language = language ? language : 'Golang';
        params.git_buildpath = values.git_buildpath;
        params.buildmore = '1';
        if (!params.git_version) {
          params.git_version = this.state.gitVersioin;
        }
        if (!params.git_type) {
          params.git_type = 'tag';
        }


        let addPorts = true;
        let doubleService = values.doubleService;
        let portsData = [];
        for (var i = 0; i < params.ports.length; i++) {
          if (portsData && portsData.indexOf(params.ports[i]['port']) !== -1) {
            message.error('端口号' + params.ports[i]['port'] + ' 有重复！');
            return;
          }
          portsData.push(params.ports[i]['port']);
          if (params.ports[i]['port'] === 9123) {
            addPorts = false;
          }
          if (params.ports[i]['port'] === 20880) {
            doubleService = false;
          }
        }
        if (!this.state.addPort) {
          params.ports.push({ port: 8080, protocol: 'TCP', name: 'http-8080' });
        }

        if (data.javaState && addPorts) {
          params.ports.push({ port: 9123, protocol: 'TCP', name: 'http-9123' });
        }
        if (data.javaState && doubleService) {
          params.ports.push({ port: 20880, protocol: 'TCP', name: 'dubbo-port' });
        }
        // if (auto === true) {
        //   dispatch({
        //     type: 'project/projectBasicAutoSave',
        //     payload: params,
        //   });
        //   return;
        // }
        if (!err) {
          // if (params.resource_type == '1') {
          confirm({
            title: '请确认提交审核?',
            content: '审核通过后会通知您的邮箱，请注意查收！',
            onOk() {
              return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 300);
                dispatch({
                  type: 'project/projectBasicStep',
                  payload: params,
                });
              }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {
            },
          });
          // } else {
          //   dispatch({
          //     type: 'project/projectBasicStep',
          //     payload: params,
          //   });
          // }
        } else {
          message.error('参数不全~');
        }
        // dispatch(routerRedux.push("/project/create/rule/" + match.params.projectId));
      });
    };

    var items = [];
    const portsLength = this.state.portNum + (WebFields ? WebFields.ports.length : 0);
    for (var i = 1; i <= portsLength; i++) {
      if (i === 1) {
        items.push(
          <div key={i}>
            {getFieldDecorator(`routes[${i}]["port"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['port'] : '8080') : data.image === 'nginx' || data.image === 'static' ? 80 : 8080,
              // rules: [{required: false, message: "请设置端口在80到65535之间" }],
            })(
              <InputNumber
                style={{ width: '150px' }}
                placeholder="端口: 80 ~ 65535之间"
                min={80}
                max={65535}
              />,
            )}
            &nbsp;
            {getFieldDecorator(`routes[${i}]["protocol"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['protocol'] : 'TCP') : 'TCP',
            })(
              <Select placeholder="TCP" style={{ width: '80px' }}>
                <Option value="TCP">TCP</Option>
                <Option value="UDP">UDP</Option>
              </Select>,
            )}
            &nbsp;
            {getFieldDecorator(`routes[${i}]["name"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['name'] : 'http-8080') : data.image === 'nginx' || data.image === 'static' ? 'http-80' : 'http-80',
            })(
              <Input placeholder="端口名称: http/grpc" style={{ width: '120px' }} onBlur={() => onValidateForm(true)}/>,
            )}
            &nbsp;&nbsp;
            <Button onClick={addPorts} icon="file-add"/>
          </div>,
        );
      } else {
        items.push(
          <div key={i}>
            {getFieldDecorator(`routes[${i}]["port"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['port'] : '') : '',
              // rules: [{required: false, message: "请设置端口在80到65535之间" }],
            })(
              <InputNumber
                style={{ width: '150px' }}
                placeholder="端口: 80 ~ 65535之间"
                min={80}
                max={65535}
              />,
            )}
            &nbsp;
            {getFieldDecorator(`routes[${i}]["protocol"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['protocol'] : '') : '',
            })(
              <Select placeholder="TCP" style={{ width: '80px' }}>
                <Option value="TCP">TCP</Option>
                <Option value="UDP">UDP</Option>
              </Select>,
            )}
            &nbsp;
            {getFieldDecorator(`routes[${i}]["name"]`, {
              initialValue: WebFields ? (WebFields.ports[i - 1] ? WebFields.ports[i - 1]['name'] : '') : '',
            })(
              <Input placeholder="端口名称: http/grpc" style={{ width: '120px' }} onBlur={() => onValidateForm(true)}/>,
            )}
            &nbsp;&nbsp;
            <Button onClick={addPorts} icon="file-add"/>
          </div>,
        );
      }
    }

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="项目语言">
          {getFieldDecorator('image', {
            initialValue: (data && data.image) ? data.image : 'golang',
            rules: [{ message: '请选择基础镜像', required: true }],
          })(
            <span>
            <Select
              placeholder="golang"
              style={{ width: 320 }}
              name="image"
              value={data.image ? data.image : 'golang'}
              onChange={this.onChangeImage}
            >
              {/*<Option value="alpine:v0.0.02">Golang: alpine:v0.0.02</Option>*/}
              <Option value="golang">
                Golang
              </Option>
              <Option value="java">Java</Option>
              <Option value="nodejs">
                NodeJs
              </Option>
              <Option value="python">
                Python
              </Option>
              <Option value="nginx">
                Nginx
              </Option>
              <Option value="static">
                Static
              </Option>
            </Select>
              &nbsp;&nbsp;
              <Tooltip placement="topLeft" title={language ? language : 'Golang'} arrowPointAtCenter>
                <Button>{language ? language : 'Golang'}</Button>
              </Tooltip>
              &nbsp;&nbsp;
              <Tooltip placement="topLeft" title="点击去下载Dockerfile" arrowPointAtCenter>
            <Button icon="cloud-download" onClick={this.onDownDockerfile}/>
            </Tooltip>
            </span>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="项目Git地址">
          {getFieldDecorator('git_addr', {
            initialValue: WebFields ? WebFields.git_addr : '',
            rules: [{ message: '请输入项目Git地址', required: true }],
          })(
            <Input
              placeholder={`项目地址(kplcloud/hello.git)`}
              name="git_addr"
              addonBefore={gitAddrType}
              onBlur={this.fetchGitlab}
            />,
          )}
          分支: &nbsp;
          {getFieldDecorator('git_type', {
            initialValue: WebFields ? WebFields.git_type : 'tag',
          })(
            <Radio.Group onChange={this.changeGitType} name="git_type">
              <Radio value="tag">Tag</Radio>
              {/* <Radio value="branch">Branch</Radio> */}
            </Radio.Group>,
          )}
          版本: &nbsp;
          {getFieldDecorator('git_version', {
            initialValue: WebFields ? WebFields.git_version : '',
            rules: [{ message: '请选择版本', required: true }],
          })(
            <Select style={{ width: 240 }} name="git_version" onChange={this.changeGitVersion} showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {list &&
              list.length &&
              list.map((item, key) => (
                <Option value={item} key={key}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
          {data.javaState && (
            <span>
                POMFILE: &nbsp;
              {getFieldDecorator('git_pomfile', {
                initialValue: WebFields ? WebFields.git_pomfile : 'pom.xml',
              })(
                <Input
                  placeholder="pomfile:pom.xml"
                  name="git_addr"
                  onBlur={this.fetchGitlab}
                  style={{ width: '85%' }}
                />,
              )}
              </span>
          )}
          <div>
            <Tooltip title="填写构Dockerfile路径 如: ./ 或 ./docker/ 在项目根目录可以不填">
              <Icon type="info-circle-o"/>构建路径：&nbsp;
            </Tooltip>
            {getFieldDecorator('git_buildpath', {
              initialValue: WebFields ? WebFields.git_buildpath : '',
            })(
              <Input
                placeholder="Dockerfile路径 如: ./ 或 ./docker 在项目根目录可以不填"
                name="git_buildpath"
                style={{ width: '80%' }}
                onBlur={() => onValidateForm(true)}
              />,
            )}
          </div>

        </Form.Item>
        {/*{(!language || language === 'Golang') && (*/}
        {/*<Form.Item {...formItemLayout} label={*/}
        {/*<Tooltip title="两种选择对应的dockerfile不一致，请注意选择">*/}
        {/*<Icon type="info-circle-o"/>多阶构建*/}
        {/*</Tooltip>*/}
        {/*}>*/}
        {/*{getFieldDecorator('buildmore', {*/}
        {/*initialValue: WebFields ? WebFields.buildmore : '1',*/}
        {/*})(*/}
        {/*<Radio.Group>*/}
        {/*<Radio value="2"><Tooltip title="使用Golang1.10版本普通构建"><Icon*/}
        {/*type="info-circle-o"/>否</Tooltip></Radio>*/}
        {/*<Radio value="1"><Tooltip title="使用Golang1.11.1版本多阶构建"><Icon*/}
        {/*type="info-circle-o"/>是</Tooltip></Radio>*/}
        {/*</Radio.Group>,*/}
        {/*)}*/}
        {/*</Form.Item>*/}
        {/*)}*/}
        {data.image !== 'nginx' && data.image !== 'static' && (
          <Form.Item {...formItemLayout} label="容器数量" help="启动的容器数量">
            {getFieldDecorator('replicas', {
              initialValue: WebFields ? WebFields.replicas : 1,
              rules: [{ required: true, message: '请选择容器数量' }],
            })(
              <Select placeholder={1}>
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
                <Option value={3}>3</Option>
                <Option value={4}>4</Option>
                <Option value={5}>5</Option>
                <Option value={6}>6</Option>
                <Option value={7}>7</Option>
                <Option value={8}>8</Option>
              </Select>,
            )}
          </Form.Item>)}

        <Form.Item
          {...formItemLayout}
          label="容器规格"
          help="根据自己需求配置 (CPU:200m/500m/1/2,内存:256Mi/512Mi/2Gi)"
        >
          <div>
            {data.javaState ? getFieldDecorator('resources', {
              initialValue: WebFields ? ((parseInt(WebFields.resources.substring(2)) / 2) < 1 ? '' : WebFields.resources) : '',
              rules: [{ required: true, message: '请选择容器规格' }],
            })(
              <Radio.Group onChange={this.changeCpuType}>
                <Radio value="1/512Mi">512M内存</Radio>
                <Radio value="1/1Gi">1G内存</Radio>
                <Radio value="2/2Gi">2G内存</Radio>
                <Radio value="2/4Gi">4G内存</Radio>
                <Radio value="2/6Gi">6G内存</Radio>
                <Radio value="2/8Gi">8G内存</Radio>
                <Radio value="2/10Gi">10G内存</Radio>
              </Radio.Group>,
            ) : getFieldDecorator('resources', {
              initialValue: WebFields ? WebFields.resources : '',
              rules: [{ required: true, message: '请选择容器规格' }],
            })(
              <Radio.Group onChange={this.changeCpuType}>
                <Radio value="100m/64Mi">64M内存</Radio>
                <Radio value="100m/128Mi">128M内存</Radio>
                <Radio value="200m/256Mi">256M内存</Radio>
                <Radio value="500m/512Mi">512M内存</Radio>
                <Radio value="1/1Gi">1G内存</Radio>
                <Radio value="2/2Gi">2G内存</Radio>
                <Radio value="2/4Gi">4G内存</Radio>
                <Radio value="2/6Gi">6G内存</Radio>
                <Radio value="2/8Gi">8G内存</Radio>
              </Radio.Group>,
            )}
            {/*<Form.Item {...formItemLayout} label="其他">*/}
            {/*{getFieldDecorator("other_resources", {*/}
            {/*initialValue: data.project_name,*/}
            {/*rules: [*/}
            {/*{*/}
            {/*pattern: `^([1-9]{1}[0-9]{2}[m]{1}|[0-9]{1})/{1}[1-9]{1}([0-9]{2}Mi|Gi)$`,*/}
            {/*message: "请设置正确的容器规格，类似:200m/500Mi 或 1/2Gi",*/}
            {/*},*/}
            {/*],*/}
            {/*})(<Input placeholder="其他: 200m/500Mi 或 1/2Gi"/>)}*/}
            {/*</Form.Item>*/}
          </div>
        </Form.Item>

        {/*<Form.Item*/}
        {/*{...formItemLayout}*/}
        {/*label={*/}
        {/*<Tooltip title="当选择对外可访问后会生成 xxx.idc 域名并且需要配置规则">*/}
        {/*<Icon type="info-circle-o"/>服务类型*/}
        {/*</Tooltip>*/}
        {/*}*/}
        {/*help=""*/}
        {/*>*/}
        {/*{getFieldDecorator('resource_type', {*/}
        {/*initialValue: WebFields ? WebFields.resource_type : '2',*/}
        {/*rules: [{ required: true, message: '请选服务类型' }],*/}
        {/*})(*/}
        {/*<Radio.Group onChange={() => onValidateForm(true)}>*/}
        {/*<Radio value="1"><Tooltip*/}
        {/*title="集群公内部访问: 只提供内部访问地址（例:hello.operations:8080）集群外部无法调用，如果选择了这项，将不会进行第三步中的域名及路由配置"><Icon*/}
        {/*type="info-circle-o"/>仅集群内部访问</Tooltip></Radio>*/}
        {/*<Radio value="2"><Tooltip title="集群内外均可访问：会对外提供入口，进行第三步进行域名及路由的配置"><Icon*/}
        {/*type="info-circle-o"/>集群内外均可访问</Tooltip></Radio>*/}
        {/*</Radio.Group>,*/}
        {/*)}*/}
        {/*</Form.Item>*/}

        {/* <Form.Item
          {...formItemLayout}
          label="模式"
        >
          {getFieldDecorator('resource_model', {
            initialValue: WebFields ? WebFields.resource_model : '2',
            rules: [{ required: true, message: '请选服务模式' }],
          })(
            <Radio.Group onChange={() => onValidateForm(true)}>
              <Radio value="1"><Tooltip title="服务网格模式，将会提供服务发现、流量管理、限流配额、灰度、熔断、金丝雀、链路追踪等零侵入性的功能"><Icon
                type="info-circle-o"/>Service Mesh</Tooltip></Radio>
              <Radio value="2"><Tooltip title="普通模式，ServiceMesh的功能需要自己去实现"><Icon
                type="info-circle-o"/>Normal</Tooltip></Radio>
            </Radio.Group>,
          )}
        </Form.Item> */}

        {data.javaState && (<Form.Item
          {...formItemLayout}
          label="启动方式"
        >
          {getFieldDecorator('service_start', {
            initialValue: WebFields ? WebFields.service_start : '1',
            rules: [{ required: true, message: '请选服务启动方式' }],
          })(
            <Radio.Group onChange={this.changeServiceStart}>
              <Radio value="1"><Tooltip title="jar启动方式"><Icon
                type="info-circle-o"/>Jar</Tooltip></Radio>
              <Radio value="2"><Tooltip title="Tomcat启动方式"><Icon
                type="info-circle-o"/>Tomcat</Tooltip></Radio>
            </Radio.Group>,
          )}
        </Form.Item>)}

        {/*{data.javaState && (*/}
        {/*<Form.Item*/}
        {/*{...formItemLayout}*/}
        {/*label={*/}
        {/*<Tooltip title="多个command需要用逗号隔开">*/}
        {/*<Icon type="info-circle-o"/>command*/}
        {/*</Tooltip>*/}
        {/*}*/}
        {/*>*/}
        {/*{getFieldDecorator('command', {*/}
        {/*initialValue: data.serviceStart === '1' ? `"java"` : `"/bin/sh","/opt/soft/tomcat/bin/catalina.sh","run"`,*/}
        {/*})(<Input placeholder="多个command需要用逗号隔开" onBlur={() => onValidateForm(true)}/>)}*/}
        {/*</Form.Item>*/}
        {/*)}*/}

        {data.javaState && data.serviceStart !== '1' && (
          <Form.Item
            {...formItemLayout}
            label={
              <Tooltip
                title="多个env需要用空格隔开">
                <Icon type="info-circle-o"/>env
              </Tooltip>
            }
            help="根据自己的需求配置，多个参数请用空格 隔开"
          >
            {getFieldDecorator('env', {
              initialValue: `-server -Xms1G -Xmx1G -Xmn128m -Xss1024K -XX:PermSize=256m -XX:MaxPermSize=512m -XX:ParallelGCThreads=4 -XX:+UseConcMarkSweepGC -XX:+UseParNewGC -XX:+UseCMSCompactAtFullCollection -XX:SurvivorRatio=6 -XX:MaxTenuringThreshold=10 -XX:CMSInitiatingOccupancyFraction=80 -Djava.security.egd=file:/dev/./urandom -Djava.util.prefs.systemRoot=/home/tomcat/.java -Djava.util.prefs.userRoot=/home/tomcat/.java/.userPrefs`,
            })(<Input.TextArea placeholder="多个env需要用空格隔开" style={{ height: 100 }}
                               onBlur={() => onValidateForm(true)}/>)}
          </Form.Item>
        )}

        {data.javaState && data.serviceStart === '1' && (
          <Form.Item
            {...formItemLayout}
            label={
              <Tooltip
                title='多个args需要用逗号隔开,例如："-jar", "/usr/local/eureka.jar","--server.port=8000"'>
                <Icon type="info-circle-o"/>args
              </Tooltip>
            }
            help="根据自己的需求配置，多个参数请用逗号,隔开"
          >
            {getFieldDecorator('args', {
              initialValue: `"-jar","-Xms${data.cpuHalfNum}","-Xmx${data.cpuHalfNum}","-XX:MaxGCPauseMillis=50","-XX:MetaspaceSize=128m","-XX:MaxMetaspaceSize=256m","-XX:+UseG1GC","-XX:+UseStringDeduplication","-XX:StringDeduplicationAgeThreshold=8","-javaagent:/usr/local/jmx_prometheus_javaagent-0.3.0.jar=9123:/usr/local/tomcat.yml",`,
              rules: [{
                pattern: '^[^\u4e00-\u9fa5]+$',
                message: '不能含有中文字符',
              }],
            })(<Input.TextArea placeholder="多个args需要用逗号隔开" style={{ height: 100 }}
                               onBlur={() => onValidateForm(true)}/>)}
          </Form.Item>
        )}

        {data.javaState && (
          <Form.Item
            {...formItemLayout}
            label="dubbo服务"
          >
            {getFieldDecorator('doubleService', {
              initialValue: false,
              rules: [{ required: true, message: '请选服务类型' }],
            })(
              <Checkbox>是</Checkbox>,
            )}
          </Form.Item>
        )}
        {!this.state.addPort && (
          <Divider>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                this.setState({ addPort: true });
              }}
              ghost
              icon="plus-circle"
            >增加端口</Button>
          </Divider>
        )}
        {this.state.addPort && (
          <Form.Item
            {...formItemLayout}
            label={
              <Tooltip title="不填写端口将不创建Service，无法直接访问">
                <Icon type="info-circle-o"/>端口及协议
              </Tooltip>
            }
            help="无端口将不创建服务，外部无法直接访问，跑脚本或任务的容器可不填写；"
          >
            {items}
          </Form.Item>
        )}

        {/* <Form.Item
          {...formItemLayout}
          label={
            <Tooltip title="填写了日志路径，平台将自动把该目录下的所有.log结尾的文件根据日志规则收集到ES">
              <Icon type="info-circle-o"/>日志路径
            </Tooltip>
          }
          help="填写项目的日志目录，不需要加上文件名只需要在.log结尾的目录就行。。。 默认：/var/log/"
        >
          {getFieldDecorator('mountPath', {
            initialValue: data.project_name,
            rules: [{ message: '请输入日志映射容器内路径' }],
          })(<Input placeholder="请输入日志映射容器内路径: /var/log" onBlur={() => onValidateForm(true)}/>)}
        </Form.Item> */}

        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button onClick={onPrev}>上一步</Button>
          <Button
            type="primary"
            onClick={() => onValidateForm(false)}
            loading={submitting}
            style={{ marginLeft: 8 }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ project, loading, gitlab, global }) => ({
  submitting: loading.effects['form/submitStepForm'],
  data: project,
  gitlab,
  gitAddrType: global.gitAddrType,
}))(Step2);
