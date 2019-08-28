import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Link, Route } from 'dva/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input } from 'antd';
import GridContent from '../../../components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import Projects from './Projects';

@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: false,
  project,
  projectLoading: false,
}))
class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    const { dispatch, project } = this.props;
    const { projects } = project;
    dispatch({
      type: 'project/fetchAll',
    });
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'articles':
        // router.push(`${match.url}/articles`);
        break;
      case 'applications':
        // router.push(`${match.url}/applications`);
        break;
      case 'projects':
        // router.push(`${match.url}/projects`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { projects },
      projectLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'projects',
        tab: (
          <span>
            项目 <span style={{ fontSize: 14 }}>({projects.list ? projects.list.length : 0})</span>
          </span>
        ),
      },
    ];
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src="https://www.yirendai.com/images/favicon.ico" />
                    <div className={styles.name}>{currentUser.username}</div>
                    <div>{currentUser.email}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      宜人财富
                    </p>
                    <p>
                      <i className={styles.group} />
                      开普勒
                    </p>
                    <p>
                      <i className={styles.address} />
                      北京市 朝阳区
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>角色</div>
                    {currentUser.roles.map((item, key) => {
                      return <Tag key={key}>{item.name}</Tag>;
                    })}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>业务空间</div>
                    <Spin spinning={projectLoading}>
                      <Row gutter={36}>
                        {currentUser.namespaces.map((item, key) => {
                          return (
                            <Col key={key} lg={24} xl={12}>
                              <a>
                                <Avatar
                                  size="small"
                                  src="https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png"
                                />
                                {item}
                              </a>
                            </Col>
                          );
                        })}
                      </Row>
                    </Spin>
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, '')}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              <Projects {...projects} />
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
