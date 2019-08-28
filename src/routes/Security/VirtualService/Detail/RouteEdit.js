/**
 * Created by huyunting on 2018/7/5.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Icon, Form, Input, InputNumber, Card, Divider, message } from 'antd';
import styles from '../StepForm/style.less';


let uuid = 0;
let addRouteState = false;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

@Form.create()
export default class RouteEdit extends PureComponent {

  componentWillMount() {
    uuid = 0;
    addRouteState = false;
  }

  componentDidMount() {
    if (uuid === 0) {
      this.add();
    }
  }

  componentWillReceiveProps() {

  }

  onChanel = () => {
    this.props.dispatch({
      type: 'virtualservice/changeEditPage',
      payload: {
        edit: '',
      },
    });
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  addDataKeys = (data) => {
    const { form } = this.props;
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
    const { form, match, dispatch, routes, httpkey } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    if (routes && routes.length > 0) {
      this.addDataKeys(routes);
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          const params = [];
          const params2 = [];
          let weightCount = 0;
          values['routes'].map((item, key) => {
            item.host = item.host.split('.svc.cluster.local')[0] + '.svc.cluster.local';
            if (item.uri_type && !item.uri_value) {
              message.error('请填写完整的URI信息');
              return;
            }
            if (!item.uri_type && item.uri_value) {
              message.error('您已填写URI信息，请重新选择URI类型');
              return;
            }
            if (item.uri_type && item.uri_value) {
              item.uri_value = item.uri_value.split(',');
              params.push(item);
            } else {
              params2.push(item);
            }

            weightCount += item.weight;

          });
          if (values['routes'].length > 1 && weightCount != 100) {
            console.error('权重设置不合法，总和为：', weightCount);
            message.error('请设置权重总和为100%');
            return;
          }
          const param = params.concat(params2);
          const payload = {
            key: httpkey,
            routes: param,
          };
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
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <span key={k}>
          <Form.Item {...formItemLayout} label={'host'} help="host前缀仅支持字母、数字、- .">
            {getFieldDecorator(`routes[${k}]['host']`, {
              initialValue: routes && routes[k] && routes[k].destination && routes[k].destination.host ? routes[k].destination.host.split('.svc.cluster.local')[0] : '',
              rules: [{ required: true, message: 'host前缀仅支持字母、数字、-' }, {
                pattern: `^[a-zA-Z0-9][-a-zA-Z0-9]{0,30}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,30})+$`,
                message: 'host前缀仅支持字母、数字、-',
              }],
            })(<Input addonAfter=".svc.cluster.local" placeholder="请输入host(kpl.default)"/>)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="端口">
            {getFieldDecorator(`routes[${k}]['number']`, {
              initialValue: routes && routes[k] && routes[k].destination && routes[k].destination.port && routes[k].destination.port.number ? routes[k].destination.port.number : '',
              rules: [{ required: true, message: '请填写端口号：80 ~ 65535之间' }],
            })(<InputNumber
              style={{ width: '100%' }}
              placeholder="端口: 80 ~ 65535之间"
              min={80}
              max={65535}
            />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="权重/超时/分组" help="请根据需要设置权重eg:100%, 分组eg:v1">
            {getFieldDecorator(`routes[${k}]['weight']`, {
              initialValue: routes && routes[k] && routes[k].weight ? routes[k].weight : '',
              rules: [{ required: true, message: '权重' }],
            })(
              <InputNumber
                placeholder="权重：100%"
                min={0}
                max={100}
                formatter={value => `${value}%`}
                parser={value => value.replace('%', '')}
              />)}
            {getFieldDecorator(`routes[${k}]['subset']`, {
              initialValue: routes && routes[k] && routes[k].destination && routes[k].destination.subset ? routes[k].destination.subset : '',
            })(<Input style={{ width: '30%', margin: '0 5%' }} placeholder="分组：v1"/>)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
          <Divider style={{ margin: '40px 0 24px' }}/>
        </span>
      );
    });
    return (
      <Card title="Route Edit">
        <Form
          layout="horizontal"
          className={styles.stepForm}
          hideRequiredMark
          style={{ width: '100%' }}
        >
          {formItems}
          <div><Button type="dashed" style={{ width: '80%', marginBottom: 20 }} onClick={() => this.add()}><Icon
            type="plus"/> Add Route</Button></div>
          <Button type="default" onClick={() => this.onChanel()} style={{ width: '40', marginRight: 40 }}>
            取消
          </Button>
          <Button type="primary" onClick={onValidateForm} style={{ width: '40' }}>
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}
// export default connect(({}) => ({}))(RouteEdit);
