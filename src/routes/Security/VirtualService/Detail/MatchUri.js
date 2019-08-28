/**
 * Created by huyunting on 2018/7/5.
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Table } from 'antd';

const Column = Table.Column;

export default class MatchUri extends PureComponent {

  render() {

    const { data } = this.props;
    return (
      <Table bordered dataSource={data}>
        <Column
          title="路径"
          dataIndex="uri"
          key="uri"
          render={function(text) {
            for (var i in text) {
              return text[i];
            }
          }}
        />

        <Column
          title="规则"
          dataIndex="uri"
          key="match"
          render={function(text) {
            for (var i in text) {
              return i;
            }
          }}
        />

        <Column
          title="操作"
          dataIndex="uri"
          key="operation"
          render={function() {
            return (<a href="javascript:;">编辑</a>);
          }}
        />

      </Table>
    );
  }
}
// export default connect(({}) => ({}))(MatchUri);
