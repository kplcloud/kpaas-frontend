import React from 'react';
import { connect } from 'dva';
import util from 'util';
import { Form, Input, Button, message, Card, Icon, Row, Col, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NamespaceSelect from '../../components/Security/namespaceSelect';
import ProjectSelect from '../../components/Security/projectSelect';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};
let uuid = 0;
let addRouteState = false;

@Form.create()
class AddIngress extends React.PureComponent {
  state = {
    namespace: '',
    name: '',
    debug: true,  // false生产环境， true非生产环境
    rulePath: [], // 每个路由下的path相关内容
    editStatus: false, // false编辑，true添加
  };

  componentWillMount() {
    const { match: { params }, dispatch } = this.props;
    uuid = 0;
    addRouteState = false;
    if (JSON.stringify(this.props.match.params) !== '{}') {
      this.setState({
        namespace: params.namespace,
        name: params.name,
        editStatus: true,
      });
      dispatch({
        type: 'ingress/detail',
        payload: {
          name: params.name,
          namespace: params.namespace,
        },
      });
      if (window.location.host === 'localhost') {
        this.setState({
          debug: true,
        });
      }
    }
    dispatch({ type: 'global/config' });

  }

  componentWillUnmount() {
    this.setState({ rulePath: [] });
    addRouteState = false;
    this.props.dispatch({
      type: 'ingress/clearDtail',
    });
  }

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

    form.setFieldsValue({
      keys: nextKeys,
    });
    this.addPaths(uuid, []);
    uuid++;
  };

  addDataKeys = (data) => {
    const { form } = this.props;
    if (data && !addRouteState) {
      data.map((item, key) => {
        if (item && item.http && item.http.paths) {
          this.addPaths(key, item.http.paths);
        }
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

  // 组装path内容
  addPaths = (key, data) => {
    var rulepaths = this.state.rulePath;
    var pathData = [];
    if (this.state.rulePath) {
      this.state.rulePath.map((detail, k) => {
        if (k === key)
          pathData = detail;
      });
    }
    if (data && data.length > 0) {
      data.map((path) => {
        pathData.push(path);
      });
    } else {
      const path = { backend: { serviceName: this.state.name, servicePort: 80 } };
      pathData.push(path);
    }
    rulepaths[key] = pathData;
    this.setState({ rulePath: rulepaths });
    this.props.form.setFieldsValue({
      h: 0,
    });
  };

  delPath = (key, pathKey) => {
    var rulePaths = this.state.rulePath;
    rulePaths.map((rules, rulesKey) => {
      if (rulesKey === key) {
        var data = [];
        rules.map((paths, pathsKey) => {
          if (pathsKey !== pathKey) {
            data.push(paths);
          }
        });
        rulePaths[rulesKey] = data;
      }
    });
    this.setState({ rulePath: rulePaths });
    this.props.form.setFieldsValue({
      h: 0,
    });
  };

  render() {
    const { form, dispatch, submitting, projectList, ingress: { detail }, config } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const { namespace, name, debug, editStatus, rulePath } = this.state;
    var rules = [];
    const that = this;
    const namespaceSelectPros = {
      disabledStatus: that.state.editStatus,
      onOk(value) {
        if (that.state.editStatus) {
          that.setState({ namespace: value });
        } else {
          that.setState({ namespace: value, name: '' });
        }
        dispatch({
          type: 'ingress/getProjectListByNamespace',
          payload: {
            namespace: value,
          },
        });
      },
    };
    const projectSelectPros = {
      projectList,
      checkProject: that.state.name,
      disabledStatus: that.state.editStatus,
      onOk(id, value) {
        that.setState({ name: value });
      },
    };

    // 添加表单数据
    if (editStatus && detail && detail.spec && detail.spec.rules) {
      this.addDataKeys(detail.spec.rules);
      rules = detail.spec.rules;
    }

    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        var params = [];
        var rules = values.rules;
        rules.map((rule, k) => {
          if (rule && rule.paths && rule.paths.length > 0) {
            params.push(rule);
            var data = [];
            rule.paths.map((path, key) => {
              if (path.port && path.port > 0) {
                data.push(path);
              }
            });
            if (data.length <= 0) {
              message.error(`项目配置-${k + 1} 中端口为必填项！！！`);
              return;
            }
            params[k].paths = data;
          }
        });
        dispatch({
          type: 'ingress/UpdateIngress',
          payload: {
            name: this.state.name,
            namespace: this.state.namespace,
            rules,
          },
        });
      });
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      const path = (data) => {
        var res = [];
        if (data && data.length > 0) {
          data.map((detail, detailkey) => {
            res.push(
              <Form.Item {...formItemLayout} label="路径及端口" help="/.* 表示全部" key={`path${detailkey}`}>
                {getFieldDecorator(`rules[${k}]['paths'][${detailkey}]['path']`, {
                  initialValue: '/.*',
                })(<Input style={{ width: '20%' }} placeholder="示例：/project 或 /.*"/>)}
                {getFieldDecorator(`rules[${k}]['paths'][${detailkey}]['port']`, {
                  initialValue: detail && detail.backend && detail.backend.servicePort ? detail.backend.servicePort : 80,
                  rules: [{ required: true, message: '请填写端口号' }],
                })(
                  <InputNumber
                    style={{ width: '25%', margin: '0 2%' }}
                    placeholder="端口号(80-65535)"
                    min={80}
                    max={65535}
                  />)}
                {getFieldDecorator(`rules[${k}]['paths'][${detailkey}]['serviceName']`, {
                  initialValue: name,
                  rules: [{ required: true, message: '服务名称不能为空' }],
                })(<Input style={{ width: '30%' }} placeholder="" disabled={true}/>)}

                <Icon
                  style={{ marginLeft: 10 }}
                  className="dynamic-delete-button"
                  type="plus-circle-o"
                  disabled={keys.length === 1}
                  onClick={() => this.addPaths(k, [])}
                />
                {data.length > 1 && (
                  <Icon
                    style={{ marginLeft: 10 }}
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={() => this.delPath(k, detailkey)}
                  />
                )}

              </Form.Item>);
          });
        }
        return res;
      };
      return (
        <Card
          type={'inner'}
          key={k}
          title={`项目配置-${k + 1}`}
          style={{ marginBottom: 10 }}
          extra={keys.length > 1 ? (
            <a><Icon className="dynamic-delete-button" type="delete" disabled={keys.length === 1}
                     onClick={() => this.remove(k)}/></a>) : null}
        >
          <Form.Item {...formItemLayout} label={'host'}>
            {getFieldDecorator(`rules[${k}]['domain']`, {
              initialValue: editStatus && rules && rules[k] ? rules[k].host : util.format(config && config.domain ? config.domain : '%s.%s.nsini.com', name, namespace),
              rules: [{ required: true, message: '请输入镜像地址' }],
            })(<Input style={{ width: '80%' }} placeholder="请输入镜像地址"/>)}
          </Form.Item>
          {path(rulePath[k])}
        </Card>
      );
    });

    return (
      <PageHeaderLayout title={editStatus ? '编辑 Ingress' : '创建 Ingress'}>
        <Card style={{ marginBottom: 10 }}>
          <Row>
            <Col span={8} offset={3}>请选择业务空间：<NamespaceSelect {...namespaceSelectPros}/></Col>
            <Col span={8} offset={3}>请选择项目：<ProjectSelect {...projectSelectPros}/></Col>
          </Row>
        </Card>
        <Card>
          <Form
            layout="horizontal"
            className={styles.stepForm}
            hideRequiredMark
            style={{ maxWidth: '70%' }}
          >
            {formItems}

            <Button type="dashed" style={{ width: '100%', marginTop: 16, marginBottom: 16 }} onClick={() => this.add()}>
              <Icon type="plus"/> 新增项目配置
            </Button>
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
              <Button onClick={() => this.props.dispatch(routerRedux.push('/security/ingress/list'))}>
                返回
              </Button>
              <Button type="primary" onClick={onValidateForm} style={{ marginLeft: 18 }} loading={submitting}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ project, ingress, global }) => ({
  submitting: false,
  data: project,
  projectList: ingress.projectList,
  ingress,
  config: global.config,
}))(AddIngress);
