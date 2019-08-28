import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Modal, Select, message, Card } from 'antd';
import { routerRedux } from 'dva/router';
import { Collapse } from 'antd';
import styles from './style.less';

import TableForm from './TableForm';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step3 extends React.PureComponent {
  state = {
    panelNum: 1,
  };
  newPanel = e => {
    const { panelNum } = this.state;
    if (panelNum >= 5) {
      Modal.warning({
        title: '项目配置提示',
        content: '您创建的配置太多了。。如有需要，请联系管理员~',
      });
      return;
    }
    this.setState({
      panelNum: panelNum + 1,
    });
  };

  render() {
    const Panel = Collapse.Panel;
    const { form, data, dispatch, submitting, match } = this.props;
    const { projectInfo, deploymentInfo } = data;
    let debug = false;
    if (window.location.host == 'localhost') {
      debug = true;
    }
    var ports = [];
    var nameEn = '';
    // if (JSON.stringify(projectInfo) !== '[]' && projectInfo.Fields) {
    //   ports = projectInfo.Fields.ports;
    //   nameEn = projectInfo.ProjectNameEn;
    // }
    if (JSON.stringify(deploymentInfo) !== '[]' && deploymentInfo.Fields) {
      ports = deploymentInfo.Fields.ports;
      nameEn = deploymentInfo.ProjectNameEn;
    }
    const tableData = [
      {
        key: '1',
        path: '/.*',
        serviceName: nameEn,
        port: ports ? (ports[0] ? Number(ports[0].port) : 8080) : 8080,
      },
    ];

    const { getFieldDecorator, validateFields } = form;
    const { panelNum } = this.state;
    const onPrev = () => {
      dispatch(routerRedux.push('/project/create/basic/' + match.params.projectId));
    };
    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        var conf = [];
        var params = [];
        var domain = [];
        for (var i = 1; i <= this.state.panelNum; i++) {
          var k = 'project_name_' + i;
          if (!values[k]) {
            message.error('项目配置--' + i + '  缺少必填项！');
            return;
          }
          var hostArr = values[k].split('.');
          if (hostArr.length <= 0 || !hostArr[0]) {
            message.error('项目配置--' + i + '错误，Host仅支持字母、数字和-');
            return;
          }
          var paths = [];
          for (var j = 0; j < values['members_' + i].length; j++) {
            var pathdata = {
              path: values['members_' + i][j]['path'],
              serviceName: values['members_' + i][j]['serviceName'],
              port: values['members_' + i][j]['port'],
            };
            paths.push(pathdata);
          }
          if (domain && domain.length) {
            if (domain.indexOf(values['project_name_' + i]) != -1) {
              message.error('配置项的host不允许重复!');
              return;
            }
          }
          domain.push(values['project_name_' + i]);
          var data = {
            domain: values['project_name_' + i],
            paths: paths,
          };
          conf.push(data);
        }
        params['id'] = match.params.projectId;
        params['step'] = 2;
        params['rules'] = conf;
        dispatch({
          type: 'project/projectRuleStep',
          payload: params,
        });
      });
    };
    var items = [];
    for (var i = 1; i <= panelNum; i++) {
      const headerName = '项目配置-' + i;
      items.push(
        <Panel header={headerName} key={i}>
          <Form.Item {...formItemLayout} label="Host">
            {getFieldDecorator('project_name_' + i, {
              initialValue: nameEn + '-' + ((projectInfo && projectInfo.ProjectNameSpace) ? projectInfo.ProjectNameSpace : deploymentInfo.ProjectNameSpace) + (debug ? '.kpl.nsini.com' : '.kpl.nsini.idc'),
              rules: [
                {
                  pattern: `^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$`,
                  message: 'host前缀仅支持字母、数字、-',
                },
              ],
            })(<Input placeholder="镜像地址: mobiletag" style={{ width: '80%' }}/>)}
          </Form.Item>
          <Card title="路由" bordered={false} style={{ width: '100%' }}>
            {getFieldDecorator('members_' + i, {
              initialValue: tableData,
            })(<TableForm {...{ Ports: ports, ServerName: nameEn }} />)}
          </Card>
        </Panel>,
      );
    }
    return (
      <Form layout="horizontal" className={styles.stepForm} style={{ maxWidth: '76%' }}>
        <Alert closable showIcon message="根据自己的需求填写。" style={{ marginBottom: 24 }}/>
        {/*<PanelList {...{panelNum: panelNum}}/>*/}
        <Collapse accordion defaultActiveKey={['1']}>
          {items}
        </Collapse>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          icon="plus"
          onClick={this.newPanel}
        >
          新增项目配置
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
          <Button onClick={onPrev}>上一步</Button>
          <Button
            type="primary"
            onClick={onValidateForm}
            style={{ marginLeft: 8 }}
            loading={submitting}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ project, loading }) => ({
  submitting: false,
  data: project,
}))(Step3);
