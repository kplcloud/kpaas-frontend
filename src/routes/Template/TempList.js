/**
 * Created by huyunting on 2018/5/11.
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { List, Card, Avatar, Button, Modal, Icon, Pagination, Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TempList.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';

const { Search } = Input;

class TempList extends PureComponent {
  state = {
    loading: true,
    visible: false,
    kind: '',
    detail: '',
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/GetTempList',
      payload: {
        sortby: 'id',
        order: 'desc',
      },
    });

  }

  showModal = (detail, kind) => {
    this.setState({
      visible: true,
      detail: detail,
      kind: kind,
    });
  };
  handleCancel = () => {
    this.setState({ addVisible: false, visible: false, kind: '', detail: '' });
  };

  render() {
    const { list, loading, dispatch, page } = this.props;
    const { visible } = this.state;

    const onAdd = () => {
      dispatch(routerRedux.push('/template/create'));
    };
    const onEdit = (id) => {
      dispatch(routerRedux.push('/template/eidt/' + id));
    };
    const onShowSizeChange = (page) => {
      dispatch({
        type: 'template/GetTempList',
        payload: {
          sortby: 'id',
          order: 'desc',
          p: page,
        },
      });
    };
    const searchChange = (value) => {
      dispatch({
        type: 'template/GetTempList',
        payload: {
          name: value,
        },
      });
    };


    const ListContent = ({ data: { kind, name, updated_at } }) => (
      <div className={styles.listContent}>
        <div>
          <span>kind</span>
          <p>{kind}</p>
        </div>
        <div>
          <span>name</span>
          <p>{name}</p>
        </div>
        <div>
          <span>更改时间</span>
          <p>{moment(updated_at).format('YYYY-MM-DD HH:mm')}</p>
        </div>
      </div>
    );


    const extraContent = (
      <span>
        <Button type="primary" ghost style={{ width: '120px' }} onClick={onAdd}>
        <Icon type="plus"/> 创建模板
      </Button>
      <Search
        style={{ width: '200px', marginLeft: '20px' }}
        placeholder="搜索名称..."
        onSearch={value => searchChange(value)}
        enterButton
      />
      </span>
    );

    const component = (codeString) => {
      return <SyntaxHighlighter language='yaml' style={tomorrowNight}>{codeString}</SyntaxHighlighter>;
    };
    return (
      <PageHeaderLayout>
        <Modal
          visible={visible}
          title={this.state.kind}
          width={500}
          onOk={this.handleOk}
          footer={[
            <Button key="back" type="primary" onClick={this.handleCancel}>OK</Button>,
          ]}
          onCancel={this.handleCancel}
          bodyStyle={{ overflow: 'auto', height: 'auto', margin: 0, padding: 0 }}
        >
          <div className="language-bash">
            {component(this.state.detail)}
          </div>
        </Modal>
        <Card
          bordered={false}
          title="模版列表"
          style={{ marginTop: 16 }}
          extra={extraContent}>
          <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={list}
            renderItem={item => (
              <List.Item actions={[<a onClick={() => onEdit(item.id)}>编辑</a>]}>
                <List.Item.Meta
                  avatar={<Avatar src="https://niu.yirendai.com/kplcloud-2.png"/>}
                  title={<a onClick={() => this.showModal(item.detail, item.kind)}>{item.kind}</a>}
                  description={<p onClick={() => this.showModal(item.detail, item.kind)}>
                    点击查看详情...</p>}
                />
                <ListContent data={item}/>
              </List.Item>
            )}
          />
          <Pagination
            style={{ marginTop: 20, float: 'right' }}
            title=""
            current={page ? page.page : 1}
            defaultCurrent={page.page}
            total={page.total}
            pageSize={page.pageSize}
            showTotal={total => `共 ${page.total} 条数据`}
            onChange={onShowSizeChange}
          />
        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({ template }) => ({
  list: template.list,
  page: template.page,
  loading: template.loading,
}))(TempList);
