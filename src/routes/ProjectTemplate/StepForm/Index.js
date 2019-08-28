import React, {PureComponent, Fragment} from 'react';
import {Route, Redirect, Switch} from 'dva/router';
import {Card, Steps} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import NotFound from '../../Exception/404';
import {getRoutes} from '../../../utils/utils';
import styles from '../style.less';

const {Step} = Steps;

export default class StepForm extends PureComponent {
  getCurrentStep() {
    const {location} = this.props;
    const {pathname} = location;
    // const pathList = pathname.split('/');
    // switch (pathList[pathList.length - 1]) {
    //   case 'info':
    //     return 0;
    //   case 'basic':
    //     return 1;
    //   case 'rule':
    //     return 2;
    //   case 'success':
    //     return 3;
    //   default:
    //     return 0;
    // }
    if (pathname.indexOf('/project/create/info') != -1) {
      return 0;
    }
    if (pathname.indexOf('/basic/') != -1) {
      return 1;
    }
    if (pathname.indexOf('/project/create/rule') != -1) {
      return 1;
    }
    if (pathname.indexOf('/project/create/success') != -1) {
      return 4;
    }
    return 0;
  }

  render() {
    const {match, routerData} = this.props;
    console.log(routerData);
    return (
      <PageHeaderLayout title="创建项目" content="请仔细核对每一项内容和参数。">
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写项目基本信息"/>
              <Step title="填写项目配置信息"/>
              {/* <Step title="填写项目其他信息"/> */}
              {/*<Step title="提交审核"/>*/}

            </Steps>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/project/create" to="/project/create/info"/>
              <Route render={NotFound}/>
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
