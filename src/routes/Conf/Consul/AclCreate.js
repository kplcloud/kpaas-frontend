/**
 * Created by huyunting on 2018/5/23.
 */
import { message, Form, Input, Button, Card, Select, Icon, Collapse, Divider } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Cookie from 'js-cookie';

const FormItem = Form.Item;
const Panel = Collapse.Panel;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
let addStatus = {
  'key': {
    uuid: 0,
    uuidAddStatus: false,
  },
  'query': {
    uuid: 0,
    uuidAddStatus: false,
  },
  'service': {
    uuid: 0,
    uuidAddStatus: false,
  },
  'event': {
    uuid: 0,
    uuidAddStatus: false,
  },
};

@Form.create()
class AclCreate extends React.PureComponent {
  state = {
    name: '创建',
    editType: false,
    defaultNamespace: '',
    checkedName: '',
    autoKey: '',
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const that = this;
    if (params && ('name' in params) && params.name !== '' && params.namespace !== '') {
      that.setState({ editType: true, name: '修改' });
      dispatch({
        type: 'consul/AclDetail',
        payload: {
          'name': params.name,
          'namespace': params.namespace,
        },
      });
    }
    dispatch({
      type: 'user/fetchNamespaces',
    });
    this.setState({ defaultNamespace: Cookie.get('namespace') });
    this.add('key');
    this.add('query');
    this.add('service');
    this.add('event');
  }

  componentWillUnmount() {
    addStatus = {
      'key': {
        uuid: 0,
        uuidAddStatus: false,
      },
      'query': {
        uuid: 0,
        uuidAddStatus: false,
      },
      'service': {
        uuid: 0,
        uuidAddStatus: false,
      },
      'event': {
        uuid: 0,
        uuidAddStatus: false,
      },
    };
  }

  add = (key, data) => {
    if (data && addStatus[key].uuidAddStatus) return;
    const { form } = this.props;
    let uuid = addStatus[key].uuid;
    var keys = form.getFieldValue(key);
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    let nextKeys = [];
    if (data) {
      data.map(() => {
        nextKeys = keys.concat(uuid);
        keys = nextKeys;
        addStatus[key].uuid = uuid + 1;
      });
      addStatus[key].uuidAddStatus = true;
    } else {
      nextKeys = keys.concat(uuid);
      addStatus[key].uuid = uuid + 1;
    }
    if (key === 'key') {
      form.setFieldsValue({
        key: nextKeys,
      });
    } else if (key === 'query') {
      form.setFieldsValue({
        query: nextKeys,
      });
    } else if (key === 'service') {
      form.setFieldsValue({
        service: nextKeys,
      });
    } else if (key === 'event') {
      form.setFieldsValue({
        event: nextKeys,
      });
    }

  };

  remove = (k, keyStr) => {
    const { form } = this.props;
    var keys = form.getFieldValue(keyStr);
    if (keys.length === 1) {
      return;
    }
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }

    if (keyStr === 'key') {
      form.setFieldsValue({
        key: keys.filter(key => key !== k),
      });
    } else if (keyStr === 'query') {
      form.setFieldsValue({
        query: keys.filter(key => key !== k),
      });
    } else if (keyStr === 'service') {
      form.setFieldsValue({
        service: keys.filter(key => key !== k),
      });
    } else if (keyStr === 'event') {
      form.setFieldsValue({
        event: keys.filter(key => key !== k),
      });
    }
  };

  checkParams = (key, data) => {
    if (!data || data.length <= 0) {
      return '请填写字典数据';
    }
    var keydata = [];//所有的key
    for (var i = 0; i < data.length; i++) {
      if (keydata && keydata.length > 0 && data[i].name) {
        if (keydata.indexOf(data[i].name) >= 0) {
          message.error(key + `数据有重复`);
          return false;
        }
      }
      keydata.push(data[i].name);
    }
    return false;

  };
  checkName = (e) => {
    this.setState({ checkedName: e.target.value });
    if (!this.state.editType && this.state.defaultNamespace) {
      this.setState({ autoKey: this.state.defaultNamespace + '.' + e.target.value + '/' });
    }
  };

  changeNamespace = (value) => {
    this.setState({ defaultNamespace: value });
    if (!this.state.editType && this.state.checkedName) {
      this.setState({ autoKey: value + '.' + this.state.checkedName + '/' });
    }
  };

  render() {
    const { form, dispatch, namespaces, consul: { detail } } = this.props;
    const { consulRule } = detail;
    const { editType, autoKey } = this.state;
    const { validateFields, getFieldDecorator, resetFields, getFieldValue } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          var params = [];
          params.rules = values.rules;
          params.name = values.name;
          params.namespace = values.namespace;
          params.type = values.type;
          this.checkParams('key', values.rules.key);
          if (editType) {
            dispatch({
              type: 'consul/ACLUpdate',
              payload: {
                ...params,
                'name': detail.name,
              },
            });
          } else {
            dispatch({
              type: 'consul/ACLCreate',
              payload: params,
            });
          }
          resetFields();
        } else {
          message.error('填写数据有空缺');
        }

      });
    };

    const optionData = () => {
      var items = [];
      if (namespaces) {
        namespaces.map((item, key) => {
          items.push(<Select.Option key={key} value={item.name_en}>{item.name}</Select.Option>);
        });
      }
      return items;
    };

    getFieldDecorator('key', { initialValue: [] });
    getFieldDecorator('query', { initialValue: [] });
    getFieldDecorator('service', { initialValue: [] });
    getFieldDecorator('event', { initialValue: [] });
    const keys = getFieldValue('key');
    const querys = getFieldValue('query');
    const services = getFieldValue('service');
    const events = getFieldValue('event');
    const keyItems = keys.map((k) => {
      var name = '';
      var type = '';
      if (consulRule && consulRule['key'] && consulRule['key'][k]) {
        for (var i in consulRule['key'][k]) {
          name = i;
          type = consulRule['key'][k][i]['policy'];
        }
      }
      return (
        <span key={'data-' + k}>
          <Form.Item {...formItemLayout} label="Key" key={k} help="必填项（K/V权限），建议 write权限">
            {getFieldDecorator(`rules['key'][${k}]['name']`, {
              initialValue: editType && name ? name : autoKey,
              rules: [{ required: true, message: '请输入key...' }],
            })(<Input placeholder="例如：name/" style={{ width: '40%', marginRight: '10px' }}/>)}
            {getFieldDecorator(`rules['key'][${k}]['policy']`, {
              initialValue: editType && type ? type : 'write',
              rules: [{ required: true, message: '请选择类型...' }],
            })(
              <Select style={{ width: '40%', marginRight: '10px' }}>
                <Select.Option key='read' value='read'>read</Select.Option>
                <Select.Option key='write' value='write'>write</Select.Option>
              </Select>,
            )}
            <Icon
              type="plus-circle-o"
              onClick={() => this.add('key')}
              style={{ marginRight: '10px' }}
            />
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k, 'key')}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const queryItems = querys.map((k) => {
      var name = '';
      var type = '';
      if (editType && consulRule && consulRule['query'] && consulRule['query'][k]) {
        for (var i in consulRule['query'][k]) {
          name = i;
          type = consulRule['query'][k][i]['query'];
        }
      }
      return (
        <span key={'query-' + k}>
          <Form.Item {...formItemLayout} label="Query" key={k} help="必填项，建议 read权限">
            {getFieldDecorator(`rules['query'][${k}]['name']`, {
              initialValue: editType && name ? name : autoKey,
              rules: [{ required: true, message: '请输入key...' }],
            })(<Input placeholder="例如：name/" style={{ width: '40%', marginRight: '10px' }}/>)}
            {getFieldDecorator(`rules['query'][${k}]['policy']`, {
              initialValue: editType && type ? type : 'read',
              rules: [{ required: true, message: '请选择类型...' }],
            })(
              <Select style={{ width: '40%', marginRight: '10px' }}>
                <Select.Option key='read' value='read'>read</Select.Option>
                <Select.Option key='write' value='write'>write</Select.Option>
                <Select.Option key='deny' value='deny'>deny</Select.Option>
              </Select>,
            )}
            <Icon
              type="plus-circle-o"
              onClick={() => this.add('query')}
              style={{ marginRight: '10px' }}
            />
            {querys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={querys.length === 1}
                onClick={() => this.remove(k, 'query')}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const serviceItems = services.map((k) => {
      var name = '';
      var type = '';
      if (editType && consulRule && consulRule['service'] && consulRule['service'][k]) {
        for (var i in consulRule['service'][k]) {
          name = i;
          type = consulRule['service'][k][i]['service'];
        }
      }
      return (
        <span key={'service-' + k}>
          <Form.Item {...formItemLayout} label="Service" key={k} help="非必填项，可忽略">
            {getFieldDecorator(`rules['service'][${k}]['name']`, {
              initialValue: editType && name ? name : '',
            })(<Input placeholder="例如：name/" style={{ width: '40%', marginRight: '10px' }}/>)}
            {getFieldDecorator(`rules['service'][${k}]['policy']`, {
              initialValue: editType && type ? type : 'read',
            })(
              <Select style={{ width: '40%', marginRight: '10px' }}>
                <Select.Option key='read' value='read'>read</Select.Option>
                <Select.Option key='write' value='write'>write</Select.Option>
              </Select>,
            )}
            <Icon
              type="plus-circle-o"
              onClick={() => this.add('service')}
              style={{ marginRight: '10px' }}
            />
            {services.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={services.length === 1}
                onClick={() => this.remove(k, 'service')}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const eventItems = events.map((k) => {
      var name = '';
      var type = '';
      if (editType && consulRule && consulRule['event'] && consulRule['event'][k]) {
        for (var i in consulRule['event'][k]) {
          name = i;
          type = consulRule['event'][k][i]['event'];
        }
      }
      return (
        <span key={'event-' + k}>
          <Form.Item {...formItemLayout} label="Event" key={k} help="非必填项，可忽略">
            {getFieldDecorator(`rules['event'][${k}]['name']`, {
              initialValue: editType && name ? name : '',
            })(<Input placeholder=" 例如：name/" style={{ width: '40%', marginRight: '10px' }}/>)}
            {getFieldDecorator(`rules['event'][${k}]['policy']`, {
              initialValue: editType && type ? type : 'read',
            })(
              <Select style={{ width: '40%', marginRight: '10px' }}>
                <Select.Option key='read' value='read'>read</Select.Option>
                <Select.Option key='write' value='write'>write</Select.Option>
              </Select>,
            )}
            <Icon
              type="plus-circle-o"
              onClick={() => this.add('event')}
              style={{ marginRight: '10px' }}
            />
            {events.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={events.length === 1}
                onClick={() => this.remove(k, 'event')}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });
    const onReturn = () => {
      dispatch(routerRedux.push('/conf/consul/acl/list'));
    };

    return (
      <PageHeaderLayout title={'Consul ACL'}>
        <Card
          bordered={false}
        >
          <a onClick={onReturn}>
            <Icon type="rollback"/>返回
          </a>
          <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 600, marginLeft: 150, marginRight: 100 }}>
            <FormItem label="名称:" hasFeedback {...formItemLayout} help="注：必须与项目名称保持一致">
              {getFieldDecorator('name', {
                initialValue: (editType && detail) ? detail.name : '',
                rules: [
                  { required: true, message: '请填写项目英文名称...' },
                ],
              })(editType ? (
                <Input placeholder="请填写项目英文名称..." disabled={true}/>
              ) : (
                <Input placeholder="请填写项目英文名称..." onBlur={(value) => this.checkName(value)}/>
              ))}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="命名空间:"
              hasFeedback
            >
              {getFieldDecorator('namespace', {
                initialValue: (editType && detail) ? detail.namespace : this.state.defaultNamespace,
                rules: [
                  { required: true, message: '请选择所属命名空间...' },
                ],
              })(
                editType ? (
                  <Select placeholder="请选择所属命名空间..." disabled>
                    {namespaces && optionData()}
                  </Select>
                ) : (
                  <Select placeholder="请选择所属命名空间..." onChange={(value) => this.changeNamespace(value)}>
                    {namespaces && optionData()}
                  </Select>
                ),
              )}
            </FormItem>

            {editType && detail && (
              <FormItem
                {...formItemLayout}
                label="token:"
                hasFeedback
              >
                {getFieldDecorator('token', {
                  initialValue: (editType && detail) ? detail.token : '',
                  rules: [
                    { required: true, message: '请选择所属命名空间...' },
                  ],
                })(
                  <Input disabled={true}/>,
                )}
              </FormItem>
            )}

            <FormItem label="类型:" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: (editType && detail) ? detail.type : 'client',
                rules: [
                  {
                    required: true,
                    message: '请选择类型....',
                  },
                ],
              })(
                <Select rows={4} placeholder="请选择类型...">
                  <Select.Option key="client" value="client">client</Select.Option>
                  <Select.Option key="management" value="management">management</Select.Option>
                </Select>,
              )}
            </FormItem>
            <Divider>Rules</Divider>
            {keyItems}
            {queryItems}
            {serviceItems}
            {eventItems}
            <Form.Item
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: {
                  span: formItemLayout.wrapperCol.span,
                  offset: formItemLayout.labelCol.span,
                },
              }}
              label=""
            >
              <Button type="primary" onClick={onValidateForm}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>

      </PageHeaderLayout>
    )
      ;
  }
}

export default connect(({ user, consul }) => ({
  consul,
  namespaces: user.namespaces,
}))(AclCreate);
