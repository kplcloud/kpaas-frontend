import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getRoutes } from '../../../utils/utils';


export default class Add extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    if (pathname.indexOf('/security/virtual/service/create/editInfo') !== -1) {
      return 0;
    }
    if (pathname.indexOf('/security/virtual/service/create/info') !== -1) {
      return 0;
    }
    return 0;
  }

  render() {
    const { match, routerData } = this.props;
    return (
      <PageHeaderLayout title="创建虚拟服务" content="请仔细核对每一项内容和参数。">
        <Card bordered={false}>
          <Fragment>
            <Steps style={{ width: '60%', margin: '0 auto' }} current={this.getCurrentStep()}/>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/security/virtual/service/create" to="/security/virtual/service/create/info"/>
            </Switch>
          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
