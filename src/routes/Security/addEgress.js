/**
 * Created by huyunting on 2018/6/4.
 */
import React, {Fragment} from 'react';
import {connect} from 'dva';
import {message, Form, Input, Button, Card, Select, Icon, Col, InputNumber} from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
import {routerRedux} from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';
const InputGroup = Input.Group;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class AddEgress extends React.PureComponent {
  state = {
    id: 0,
    name: "添加 Egress",
    namespace: "",
    dataNum: 1,
    editType: false,
    onShow: false,
  };

  componentWillMount() {
    const {dispatch, match} = this.props;
    const namespace = Cookie.get("namespace");
    if (match.params && match.params.namespace && match.params.name) {
      this.setState({editType: true, name: "修改 Egress"});
      dispatch({
        type: "egress/one",
        payload: {
          "namespace": match.params.namespace,
          "name": match.params.name,
        }
      })
    }
    this.setState({
      namespace: namespace
    });
    dispatch({
      type: 'conf/list',
      payload: {
        "namespace": namespace,
      }
    });
    dispatch({
      type: 'user/fetchNamespaces',
    });

  };


  addData = () => {
    if (this.state.dataNum >= 15) {
      message.error("您添加的数据太多了~");
      return
    }
    this.setState({dataNum: this.state.dataNum + 1})
  };

  onShowCondition = () => {
    if (this.state.onShow) {
      this.setState({onShow: false})
    } else {
      this.setState({onShow: true});
    }
  };

  render() {
    const {form, namespaces, btnLoading, egressData} = this.props;
    const {editType} = this.state;
    const {ports, name, namespace, destination} = egressData;
    const {validateFields, getFieldDecorator, resetFields} = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          var params = [];
          var portsData = [];
          var ports = [];
          for (i = 0; i < values.ports.length; i++) {
            if (values.ports[i] && values.ports[i]["port"] && values.ports[i]["protocol"]) {
              if (ports.indexOf(values.ports[i]["port"]) != -1) {
                message.error(values.ports[i]["port"] + "端口号重复!");
                return
              }
              ports.push(values.ports[i]["port"]);
              portsData.push(values.ports[i]);
            }
          }
          params.name = values.name;
          params.namespace = values.namespace;
          params.domain = values.service;
          params.ports = portsData;
          params.timeout = values.timeout ? values.timeout : 30;
          params.retries = values.retries ? values.retries : 12;
          params.pretimeout = values.pretimeout ? values.pretimeout : 5;

          if (editType) {
            this.props.dispatch({
              type: 'egress/update',
              payload: params,
            })
          } else {
            this.props.dispatch({
              type: 'egress/add',
              payload: params,
            });
          }
        } else {
          message.error("请填写完整参数");
        }
        // resetFields();
      });
    };

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Option key={key} value={item.name_en}>{item.name}</Option>)
        });
      }
      return items
    };

    const onReturn = () => {
      const {dispatch} = this.props;
      dispatch(routerRedux.push("/security/egress/list"))
    };

    var items = [];
    var itemsLength = editType ? (ports ? (ports.length + this.state.dataNum) : this.state.dataNum) : this.state.dataNum;
    for (var i = 1; i <= itemsLength; i++) {
      items.push(
        <div key={i}>
          <InputGroup>
            <Col span={8}>
              {getFieldDecorator(`ports[${i}]['port']`, {
                initialValue: (ports && editType) ? (ports[i - 1] ? ports[i - 1]["port"] : "") : "",
                rule: [{required: true, message: '请输入端口'}],
              })(
                <InputNumber
                  placeholder="端口: 0 ~ 65535之间"
                  max={65535}
                />)}
            </Col>
            <Col span={12}>
              {getFieldDecorator(`ports[${i}]['protocol']`, {
                initialValue: (ports && editType) ? (ports[i - 1] ? ports[i - 1]["protocol"] : "") : "",
                rule: [{required: true, message: '请输入端口名称'}],
              })(
                <Input placeholder="端口名称: http/grpc"/>
              )}
            </Col>
            <Col span={4}>
              <Button onClick={() => this.addData()}><Icon type="plus"/></Button>
            </Col>
          </InputGroup>
          &nbsp;
        </div>
      );
    }

    return (
      <PageHeaderLayout>
        <a onClick={onReturn}>
          <Icon type="rollback"/>返回
        </a>
        <Card
          bordered={false}
          title={this.state.name}
          style={{marginTop: 16}}
        >
          <Form layout="horizontal" hideRequiredMark style={{maxWidth: 600, marginLeft: 200}}>

            <FormItem
              {...formItemLayout}
              label="命名空间 "
              hasFeedback
            >
              {getFieldDecorator('namespace', {
                initialValue: editType ? (egressData ? namespace : "") : this.state.namespace,
                rules: [
                  {required: true, message: '请选择所属命名空间...'},
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
                  )
              )}
            </FormItem>
            <FormItem label="name" hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: (editType && egressData) ? name : "",
                rules: [
                  {required: true, message: '请输入名称'}
                ],
              })(editType ? (
                  <Input placeholder="请输入名称..." disabled={true}/>
                ) : (
                  <Input placeholder="请输入名称..."/>
                ))}
            </FormItem>
            <FormItem label="service " hasFeedback {...formItemLayout}>
              {getFieldDecorator('service', {
                initialValue: destination ? destination.service : "",
                rules: [
                  {
                    required: true,
                    message: '请输入service...',
                  },
                ],
              })(<Input rows={4} placeholder="请输入service..."/>)}
            </FormItem>
            <FormItem label="端口及协议 " hasFeedback {...formItemLayout}>
              {items}
            </FormItem>
            <a onClick={() => this.onShowCondition()}>更多配置<Icon type={this.state.onShow ? "up" : "down"}/></a>
            {this.state.onShow && (<FormItem label="请求超时时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('timeout', {
                initialValue: 30,
              })(<InputNumber rows={4} placeholder="超时时间: 5~1000" min={5} max={1000} formatter={value => `${value}s`}
                              parser={value => value.replace('s', '')}/>)}
            </FormItem>)}
            {this.state.onShow && (<FormItem label="重试次数" hasFeedback {...formItemLayout}>
              {getFieldDecorator('retries', {
                initialValue: 12,
              })(<InputNumber rows={4} placeholder="超时时间: 5~1000" min={5} max={1000} formatter={value => `${value}次`}
                              parser={value => value.replace('次', '')}/>)}
            </FormItem>)}
            {this.state.onShow && (<FormItem label="重试超时时间" hasFeedback {...formItemLayout}>
              {getFieldDecorator('pretimeout', {
                initialValue: 5,
              })(<InputNumber rows={8} placeholder="超时时间: 5~1000" min={5} max={1000} formatter={value => `${value}s/次`}
                              parser={value => value.replace('s/次', '')}/>)}
            </FormItem>)}
            <Form.Item
              wrapperCol={{
                xs: {span: 24, offset: 0},
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >

              <br/>
              <Button type="primary" onClick={onValidateForm} loading={btnLoading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>


      </PageHeaderLayout>
    );
  }
}

export default connect(({user, conf, egress}) => ({
  namespaces: user.namespaces,
  confMap: conf.list,
  egressData: egress.egressData,
}))(AddEgress);
