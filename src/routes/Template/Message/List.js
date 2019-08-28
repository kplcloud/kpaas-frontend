/**
 * Created by huyunting on 2018/10/12.
 */
import React, {PureComponent} from 'react';
import moment from 'moment';
import {routerRedux} from 'dva/router';
import {connect} from 'dva';
import {List, Card, Avatar, Button, Modal, Icon, Pagination} from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {tomorrowNight} from 'react-syntax-highlighter/styles/hljs';

class MessageList extends PureComponent {

  render() {
    const {dispatch} = this.props;
    
    const onAdd = () => {
      dispatch(routerRedux.push('/template/message/create'));
    };

    const extraContent = (
      <Button type="primary" ghost style={{width: '120px', marginRight: "30px"}} onClick={onAdd}>
        <Icon type="plus"/> 创建模板
      </Button>
    );
    return (
      <PageHeaderLayout>
        <Card
          bordered={false}
          title="消息模版列表"
          style={{marginTop: 16}}
          extra={extraContent}
        >

        </Card>

      </PageHeaderLayout>
    );
  }
}
export default connect(({}) => ({}))(MessageList);
