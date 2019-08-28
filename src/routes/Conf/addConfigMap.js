/**
 * Created by huyunting on 2018/5/23.
 */
import { message, Form, Input, Button, Card, Select, Icon } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
let uuid = 0;
let uuidAddStatus = false;

@Form.create()
class AddConfigMap extends React.PureComponent {
  state = {
    name: '创建',
    editType: false,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const that = this;
    if (params && ('name' in params) && params.name !== '' && params.namespace !== '') {
      that.setState({ editType: true, name: '修改' });
      dispatch({
        type: 'conf/OneConf',
        payload: {
          'name': params.name,
          'namespace': params.namespace,
        },
      });
    }
    dispatch({
      type: 'user/fetchNamespaces',
    });
    this.add();
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'conf/clearConfData' });
    uuid = 0;
    uuidAddStatus = false;
  }

  add = data => {
    if (data && uuidAddStatus) return;
    const { form } = this.props;
    var keys = form.getFieldValue('keys');
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    let nextKeys = [];
    if (data) {
      data.map((k) => {
        nextKeys = keys.concat(uuid);
        keys = nextKeys;
        uuid++;
      });
      uuidAddStatus = true;
    } else {
      nextKeys = keys.concat(uuid);
      uuid++;
    }
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  remove = k => {
    const { form } = this.props;
    var keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    if (!keys || (keys && keys.length < 1)) {
      keys = [];
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  checkParams = (data) => {
    if (!data || data.length <= 0) {
      return '请填写字典数据';
    }
    var keydata = [];//所有的key
    for (var i = 0; i < data.length; i++) {
      if (keydata && keydata.length > 0 && data[i] && data[i].key) {
        if (keydata.indexOf(data[i].key) >= 0) {
          return '字典数据的Key有重复。。。';
        }
      }
      if (data[i]) {
        keydata.push(data[i].key);
      }

    }
    return false;

  };


  render() {
    const { form, dispatch, namespaces, confMap, confData } = this.props;
    const { editType } = this.state;
    const { validateFields, getFieldDecorator, resetFields, getFieldValue } = form;
    if (editType && confMap && confMap.id > 0 && confData) {
      this.add(confData);
    }
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          var params = [];
          var data = [];
          const checkRes = this.checkParams(values.data);
          if (checkRes) {
            message.error(checkRes);
            return;
          }
          for (var i = 0; i < values.data.length; i++) {
            if (values.data[i] && values.data[i].key !== '') {
              data.push(values.data[i]);
            }
          }
          params.data = data;
          params.name = values.name;
          params.namespace = values.namespace;
          params.desc = values.desc;
          if (editType) {
            dispatch({
              type: 'conf/updateConfMap',
              payload: {
                ...params,
                'name': this.props.confMap.name,
                'namespace': this.props.confMap.namespace,
              },
            });
          } else {
            dispatch({
              type: 'conf/addConfMap',
              payload: params,
            });
          }
          dispatch({
            type: 'conf/clearConfData',
          });
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
          items.push(<Option key={key} value={item.name}>{item.display_name}</Option>);
        });
      }
      return items;
    };

    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formAddressItems = keys.map((k, index) => {
      return (
        <span key={'data-' + k}>
          <Form.Item {...formItemLayout} label="key-values" key={k}>
            {getFieldDecorator(`data[${k}]['key']`, {
              initialValue: editType && confData && confData[k] ? confData[k].key : '',
              rules: [{ required: true, message: '请填写key...' }],
            })(<Input.TextArea placeholder="key" style={{ width: '40%', marginRight: '10px' }}/>)}
            {getFieldDecorator(`data[${k}]['value']`, {
              initialValue: editType && confData && confData[k] ? confData[k].value : '',
              rules: [{ required: true, message: '请填写value...' }],
            })(
              <Input.TextArea
                style={{ width: '40%', marginRight: '10px' }}
                placeholder="value"
              />,
            )}
            <Icon
              type="plus-circle-o"
              onClick={() => this.add()}
              style={{ marginRight: '10px' }}
            />
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </Form.Item>
        </span>
      );
    });

    const onReturn = () => {
      const { dispatch } = this.props;
      dispatch(routerRedux.push('/conf/configMap'));
    };

    return (
      <PageHeaderLayout title={'配置字典'}>
        <Card
          bordered={false}
        >
          <a onClick={onReturn}>
            <Icon type="rollback"/>返回
          </a>
          <Form layout="horizontal" hideRequiredMark style={{ maxWidth: 800, marginLeft: 100 }}>
            <Card title={this.state.name + '-基础信息'} style={{ marginBottom: 20, marginTop: 10 }}>
              <FormItem label="字典名称:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: (editType && confMap) ? confMap.name : '',
                  rules: [
                    { required: true, message: '请输入角色名称' },
                  ],
                })(editType ? (
                  <Input placeholder="请输入角色名称..." disabled={true}/>
                ) : (
                  <Input placeholder="请输入角色名称..."/>
                ))}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="命名空间:"
                hasFeedback
              >
                {getFieldDecorator('namespace', {
                  initialValue: (editType && confMap) ? confMap.namespace : '',
                  rules: [
                    { required: true, message: '请选择所属命名空间...' },
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
                  ),
                )}
              </FormItem>

              <FormItem label="字典描述:" hasFeedback {...formItemLayout}>
                {getFieldDecorator('desc', {
                  initialValue: (editType && confMap) ? confMap.desc : '',
                  rules: [
                    {
                      required: true,
                      message: '请输入字典描述...',
                    },
                  ],
                })(<TextArea rows={4} placeholder="请输入字典描述..."/>)}
              </FormItem>
            </Card>
            <Card title={this.state.name + '-数据信息'}>
              {formAddressItems}
            </Card>
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

export default connect(({ conf, user }) => ({
  confData: conf.confData,
  confMap: conf.confMap,
  namespaces: user.namespaces,
}))(AddConfigMap);
