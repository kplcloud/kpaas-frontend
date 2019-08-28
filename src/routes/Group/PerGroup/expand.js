import React, { PureComponent } from 'react';
import { Form, Card, Popconfirm, Icon } from 'antd';
import { connect } from 'dva';
import Cookie from 'js-cookie';
import { Link } from 'react-router-dom';


@Form.create()
class expand extends PureComponent {

  // state = {
  //   ns: 'default',
  //   addGroupMemberVisible: false,
  //   addGroupProjectVisible: false,
  //   addGroupMemberRecord: {},
  //   addGroupProjectRecord: {},
  // };
  //




  render() {
    const {
      visible, expandRecord, grouponedata,
    } = this.props;

    const gridStyle = {
      width: '33.3%',
      textAlign: 'center',
    };
    const email = Cookie.get('email');
    const cardStyle = {
      marginTop: '20px',
    };

    const myCardOfMember = (record) => {
      const options = [];
      if (Object.keys(record).length !== 0 &&  record.members &&  record.members.length ) {
        if (record.email === email) {
          record.members.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              {item.email.split("@")[0]} | {item.username} |
              <Popconfirm
                title="确定删除吗？不可逆,谨慎操作!"
                onConfirm={() => this.onDeleteMemberConfirm(record,item.id)}
                icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
              >
                <a href="#">删除</a>
              </Popconfirm>
            </Card.Grid>
          ))
        } else {
          record.members.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              {item.email.split("@")[0]} | {item.username}
            </Card.Grid>
          ))
        }

      }
      return options
    };
    const myCardOfProject = (record) => {
      const options = [];

      if (Object.keys(record).length !== 0 && record.projects && record.projects.length) {
        if (record.email === email) {
          record.projects.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              <Link to="#" onClick={()=>this.projectTo(item.namespace,item.nameEn)}>{item.name}</Link> | {item.language} |

              <Popconfirm
                title="确定删除吗？不可逆,谨慎操作!"
                onConfirm={() => this.onDeleteProjectConfirm(record,item.id)}
                icon={<Icon type="question-circle-o"  style={{ color: 'red' }} />}
              >
                <a href='#'> 删除</a>
              </Popconfirm>
            </Card.Grid>
          ))
        } else {
          record.projects.map((item) => options.push(
            <Card.Grid
              style={gridStyle}
              key={item.id}
            >
              <Link to="#" onClick={()=>this.projectTo(item.namespace,item.nameEn)}>{item.name}</Link> | {item.language}
            </Card.Grid>
          ))
        }

      }
      return options
    };


    return (
        expandRecord.owner.email !== email ?
        <div>
          <Card title="成员">
            {myCardOfMember(grouponedata[expandRecord.id])}
          </Card>
          <Card title="项目" style={cardStyle}>
            {myCardOfProject(grouponedata[expandRecord.id])}
          </Card>
          <Card title="定时任务" style={cardStyle}>
            {myCardOfProject(grouponedata[expandRecord.id])}
          </Card>
        </div>
        :
        <div>
          <Card title="成员"  extra={<a onClick={() => this.onOwnerAddMember(grouponedata[expandRecord.id])}>添加成员</a>}>
            {myCardOfMember(grouponedata[expandRecord.id])}
          </Card>
          <Card title="项目" style={cardStyle} extra={<a onClick={() => this.onOwnerAddProject(grouponedata[expandRecord.id])}>添加项目</a>}>
            {myCardOfProject(grouponedata[expandRecord.id])}
          </Card>
          <Card title="定时任务" style={cardStyle}>
            {myCardOfProject(grouponedata[expandRecord.id])}
          </Card>
        </div>
    );

  }
}

export default connect(() => ({
  // memberList: group.memberList,
}))(expand);
