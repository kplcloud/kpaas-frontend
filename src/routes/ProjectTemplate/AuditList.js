/**
 * Created by huyunting on 2018/5/2.
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { List, Card, Row, Col, Radio, Input, Progress, Pagination, Select, Dropdown, Menu, Avatar } from 'antd';
import { routerRedux } from 'dva/router';
import Cookie from 'js-cookie';
import styles from './BasicList.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const Search = Input.Search;

class AuditList extends PureComponent {
  state = {
    namespace: '',
    name: '',
    status: 0,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    var namespace = Cookie.get('namespace');
    this.setState({ namespace: namespace });
    dispatch({
      type: 'project/getAuditList',
      payload: {},
    });
    dispatch({
      type: 'user/fetchNamespaces',
      payload: {},
    });

  }

  auditListParam(key, value) {
    const { dispatch } = this.props;
    var namespace = this.state.namespace;
    var name = this.state.name;
    var status = this.state.status;
    if (key === 'namespace') namespace = value;
    if (key === 'name') name = value;
    if (key === 'status') status = value;
    Cookie.set('namespace', namespace);
    dispatch({
      type: 'project/getAuditList',
      payload: {
        'name': name,
        'status': status,
      },
    });
  }

  render() {
    const { dispatch, data: { auditList, loading }, namespaces } = this.props;
    const optionChange = (value) => {
      this.setState({
        namespace: value,
      });
      this.auditListParam('namespace', value);
    };
    const searchChange = (value) => {
      this.setState({
        name: value,
      });
      this.auditListParam('name', value);
    };
    const radioChange = (e) => {
      this.setState({
        status: e.target.value,
      });
      this.auditListParam('status', e.target.value);
    };
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em/>}
      </div>
    );
    const onDetail = (name, namespace) => {
      dispatch(routerRedux.push(`/project/detail/${namespace}/${name}`));
    };
    const renderOption = () => {
      const options = [];
      if (namespaces.length) {
        namespaces.map((item, key) => options.push(<Option value={item.name}
                                                           key={key}>{item.display_name}</Option>));
      }
      return options;
    };
    const extraContent = (
      <div className={styles.extraContent}>
        <RadioGroup defaultValue="0" onChange={radioChange}>
          <RadioButton value="0">全部</RadioButton>
          <RadioButton value="1">未审核</RadioButton>
          <RadioButton value="2">未完成</RadioButton>
          <RadioButton value="3">已完成</RadioButton>
        </RadioGroup>
        <Select
          className={styles.extraContentSearch}
          defaultValue={this.state.namespace}
          showSearch
          style={{ width: 150 }}
          placeholder="请选择业务空间"
          optionFilterProp="children"
          onChange={optionChange}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {namespaces && renderOption()}
        </Select>

        <Search
          className={styles.extraContentSearch}
          placeholder="项目英文名称..."
          onSearch={value => searchChange(value)}
          enterButton
        />
      </div>
    );

    const onShowSizeChange = (current) => {
      const { dispatch } = this.props;
      Cookie.set('namespace', this.state.namespace);
      dispatch({
        type: 'project/getAuditList',
        payload: {
          'p': current,
          'namespace': this.state.namespace,
          'name': this.state.name,
          'status': this.state.status,
        },
      });
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      page: auditList ? (auditList.page ? auditList.page.page : 1) : 1,
      pageSize: auditList ? (auditList.page ? auditList.page.pageSize : 0) : 0,
      total: auditList ? (auditList.page ? auditList.page.total : 0) : 0,
    };
    const percentNum = (audit_state, publish_state) => {
      if (audit_state == 1) {
        return 0;
      } else if (audit_state == 2) {
        return 0;
      } else if (audit_state == 3) {
        if (publish_state == 1) {
          return 100;
        } else if (publish_state == 2) {
          return 70;
        } else if (publish_state == 0) {
          return 35;
        }
      }
    };
    const stepStatus = (audit_state, publish_state) => {
      if (publish_state == 2) {
        return 'exception';
      }
      if (publish_state == 1) {
        return 'success';
      }
      return 'active';
    };
    const ListContent = ({ data: { owner, member_name, updated_at, audit_state, publish_state, status } }) => (
      <div className={styles.listContent}>
        <div>
          <span>创建者</span>
          <p>{member_name}</p>
        </div>
        <div>
          <span>更改时间</span>
          <p>{moment(updated_at).format('YYYY-MM-DD HH:mm')}</p>
        </div>
        <div>
          <Progress width={40} percent={percentNum(audit_state, publish_state)}
                    status={stepStatus(audit_state, publish_state)}
                    strokeWidth={6}/>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout title="服务审核">
        <div className={styles.standardList}>

          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="未审核" value={(auditList ? (auditList.total ? auditList.total.todoTotal : 0) : 0) + '个任务'}
                      bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="发布失败" value={(auditList ? (auditList.total ? auditList.total.errTotal : 0) : 0) + '个任务'}
                      bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="已完成" value={(auditList ? (auditList.total ? auditList.total.doneTotal : 0) : 0) + '个任务'}
                      bordered/>
              </Col>
            </Row>
          </Card>

          <Card
            bordered={false}
            title="服务审核列表"
            style={{ marginTop: 16 }}
            extra={extraContent}
          >
            {auditList && auditList.list &&
            <List
              rowKey="id"
              loading={loading}
              dataSource={auditList.list}
              renderItem={item => (
                <List.Item
                  actions={[<a onClick={() => onDetail(item.name_en, item.namespace)}>详情</a>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="http://source.qiniu.cnd.nsini.com/kplcloud/kpl-logo-blue.png" shape="square"
                                    size="large"/>}
                    title={<a onClick={() => onDetail(item.name_en, item.namespace)}>{item.name}</a>}
                    description={item.name_en}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
            />}
            {auditList && !auditList.list && (
              <div style={{ textAlign: 'center', width: '100%', padding: '20px 0', height: '50px' }}>暂无数据</div>)}
            <Pagination current={paginationProps.page} defaultCurrent={paginationProps.page}
                        total={paginationProps.total}
                        pageSize={paginationProps.pageSize}
                        showTotal={total => `共 ${paginationProps.total} 条数据`}
                        onChange={onShowSizeChange}/>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ project, loading, user }) => ({
  data: project,
  namespaces: user.namespaces,
}))(AuditList);

// export default connect()(BasicList);
