import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Form, Input, Button, Divider, Icon, message, InputNumber, Select, Radio} from 'antd';
import styles from './style.less';
let uuid = 0;
let addRouteState = false;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 4},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 20},
  },
};

@Form.create()
class Step2 extends React.PureComponent {

  state = {
    uriBeforVal: "exact",
  };

  componentWillMount() {
    uuid = 0;
    addRouteState = false;
  }

  componentDidMount() {
    const {dispatch, match} = this.props;
    const {params} = match;
    if (params && params.namespace && params.name) {
      dispatch({
        type: "virtualservice/one",
        payload: {
          ...params,
        }
      });
    }
    dispatch({
      type: 'user/fetchNamespaces',
    });
    if (uuid === 0) {
      this.add();
    }
  }

  remove = (k) => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const {form} = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  addDataKeys = (data) => {
    const {form} = this.props;
    if (data && !addRouteState) {
      data.map((item, key) => {
        const keys = form.getFieldValue('keys');
        if (keys) {
          const nextKeys = keys.concat(uuid);
          uuid++;
          form.setFieldsValue({
            keys: nextKeys,
          });
          addRouteState = true;
        }
      });
    }
  };


  render() {
    const {form, dispatch, match, virtualservice} = this.props;
    const {oneInfo} = virtualservice;
    const {getFieldDecorator, validateFields, getFieldValue} = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const params = [];
          const params2 = [];
          let weightCount = 0;
          values['routes'].map((item, key) => {
            item.host = item.host.split(".svc.cluster.local")[0];
            if (item.uri_type && !item.uri_value) {
              message.error("请填写完整的URI信息");
              return
            }
            if (!item.uri_type && item.uri_value) {
              message.error("您已填写URI信息，请重新选择URI类型");
              return
            }
            if (item.uri_type && item.uri_value) {
              item.uri_value = item.uri_value.split(",");
              params.push(item);
            } else {
              params2.push(item);
            }

            weightCount += item.weight;

          });
          if (values['routes'].length > 1 && weightCount != 100) {
            console.error("权重设置不合法，总和为：", weightCount);
            message.error("请设置权重总和为100%");
            return
          }
          const param = params.concat(params2);
          dispatch({
            type: 'virtualservice/addRoute',
            payload: {
              name: match.params.name,
              namespace: match.params.namespace,
              routes: param,
            },
          });
        }
      });
    };

    const editUriVal = (data, tab) => {
      var str = "";
      var uriKey = "";
      if (data && data.length) {
        data.map((item, index) => {
          for (var key in item.uri) {
            uriKey = key;
            str += item.uri[key] + ",";
          }
        })
      }
      str = str.trim(",");
      if (tab == "key") return uriKey;
      return str
    };

    if (oneInfo && oneInfo.http && oneInfo.http[0] && oneInfo.http[0].route) {
      this.addDataKeys(oneInfo.http[0].route);
    }

    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const routes = (oneInfo.http && oneInfo.http[k] && oneInfo.http[k].route) ? oneInfo.http[k].route : [];
      const match = (oneInfo.http && oneInfo.http[k] && oneInfo.http[k].match) ? oneInfo.http[k].match : [];
      return (
        <span key={k}>
          <Form.Item {...formItemLayout} label={"host"}>
            {getFieldDecorator(`routes[${k}]['host']`, {
              initialValue: (routes && routes.length && routes[0].destination && routes[0].destination.host) ? routes[0].destination.host.split(".svc.cluster.local")[0] : "",
              rules: [{required: true, message: 'host前缀仅支持字母、数字、-'}, {
                pattern: `^[a-zA-Z0-9][-a-zA-Z0-9]{0,30}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,30})+$`,
                message: 'host前缀仅支持字母、数字、-',
              }],
            })(<Input addonAfter=".svc.cluster.local" placeholder="请输入host(kpl.default)"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="端口">
            {getFieldDecorator(`routes[${k}]['number']`, {
              initialValue: (routes && routes.length && routes[0].destination && routes[0].destination.port && routes[0].destination.port.number) ? routes[0].destination.port.number : "",
              rules: [{required: true, message: '请填写端口号：80 ~ 65535之间'}],
            })(<InputNumber
              style={{width: '100%'}}
              placeholder="端口: 80 ~ 65535之间"
              min={80}
              max={65535}
            />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="URI" help="">
            {getFieldDecorator(`routes[${k}]['uri_type']`, {
              initialValue: (match && match.length) ? editUriVal(match, "key") : "",
            })(
              <Radio.Group>
                <Radio value="">不填写</Radio>
                <Radio value="exact">exact</Radio>
                <Radio value="prefix">prefix</Radio>
                <Radio value="regex">regex</Radio>
              </Radio.Group>)}
            {this.state.uriBeforVal && getFieldDecorator(`routes[${k}]['uri_value']`, {
              initialValue: (match && match.length) ? editUriVal(match, "val") : "",
            })(
              <Input.TextArea placeholder="填写的URI多个值请用逗号隔开eg: /app/welcome,/app/hello"/>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="权重/超时/分组" help="请根据需要设置权重eg:100%, 超时时间设置eg:60s, 分组eg:v1">
            {getFieldDecorator(`routes[${k}]['weight']`, {
              initialValue: (routes && routes.length && routes[0].weight) ? routes[0].weight : "",
              rules: [{required: true, message: '权重'}],
            })(
              <InputNumber
                placeholder="权重：100%"
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />)}
            {getFieldDecorator(`routes[${k}]['timeout']`, {
              initialValue: (routes && routes.length && routes[0].timeout) ? routes[0].timeout : 60,
            })(<InputNumber
              style={{width: '20%', marginLeft: "5%"}}
              min={0}
              max={1000}
              formatter={value => `${value}s`}
              parser={value => value.replace('s', '')}
            />)}
            {getFieldDecorator(`routes[${k}]['subset']`, {
              initialValue: (routes && routes.length && routes[0].destination && routes[0].destination.subset) ? routes[0].destination.subset : "",
            })(<Input style={{width: '30%', margin: "0 5%"}} placeholder="分组：v1"/>)}
            {keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.remove(k)}
                />
              ) : null}
          </Form.Item>
          <Divider style={{margin: '40px 0 24px'}}/>
        </span>
      );
    });
    //
    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          style={{width: "100%"}}
        >
          {formItems}
          <div><Button type="dashed" style={{width: "80%", marginBottom: 20}} onClick={() => this.add()}><Icon
            type="plus"/> Add Route</Button></div>
          <Button type="primary" onClick={onValidateForm} style={{width: "40"}}>
            提交
          </Button>
        </Form>
        <Divider style={{margin: '40px 0 24px'}}/>
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>如有不清楚请联系管理员</h4>
          <p>请根据自己的需求设置合适的参数。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({gateway, user, virtualservice}) => ({
  gateway: gateway.list,
  virtualservice,
  namespaces: user.namespaces,
}))(Step2);
