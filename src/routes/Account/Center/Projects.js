import React, { PureComponent } from 'react';
import { List, Card, Avatar } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
//import AvatarList from '../../../components/AvatarList';
import stylesProjects from './Projects.less';

@connect(({}) => ({}))
class Projects extends PureComponent {
  onClick = (e, item) => {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/project/detail/${item.namespace}/${item.name}`));
  };

  render() {
    const { list } = this.props;

    if (!list) {
      return '';
    }
    return (
      <List
        className={stylesProjects.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item.id}>
            <Card
              className={stylesProjects.card}
              // hoverable
              // cover={item.name.substring(0, 1)}
              description={item.desc}
              hoverable
              bodyStyle={{ paddingBottom: 20 }}
            >
              <Card.Meta
                    avatar={<Avatar style={{ backgroundColor: "#69c4dc" }}>{item.name.substring(0, 1)}</Avatar>}
                    title={item.name}
                    description={item.desc}
                    onClick={(e) => this.onClick(e, item)}
                  />
              <div className={stylesProjects.cardItemContent}>
                <span>{moment(item.created_at).fromNow()}</span>
                <div className={stylesProjects.avatarList}>
                  {/* <AvatarList size="mini"> */}
                  {/* {item.members.map(member => (
                      <AvatarList.Item
                        key={`${item.id}-avatar-${member.id}`}
                        src={member.avatar}
                        tips={member.name}
                      />
                    ))} */}
                  {/* </AvatarList> */}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default Projects;
