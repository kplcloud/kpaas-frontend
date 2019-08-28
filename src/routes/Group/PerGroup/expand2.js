import React, { PureComponent } from 'react';
import { Form, Table, Badge, Card } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';


@Form.create()
class expand2 extends PureComponent {
  _isMounted = false;
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
    this.columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    ];
  }



  componentDidMount() {
    this._isMounted = true;

    const { dispatch } = this.props;
    dispatch({
      type: 'group/grouponedata',
      groupId: this.props.re.id,
    });
  }

  componentWillMount() {
    console.log(this.props.re,"expand2")
    // this.fetchData()
    this._isMounted = false;
  }

  genSubData() {
    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: '2014-12-24 23:12:00',
        name: Math.random().toString(36).substr(2),
        upgradeNum: 'Upgraded: 56',
      });
    }
    return data;
  }

  fetchData() {

    setTimeout(() => {
      const data = this.genSubData();
      this.setState({ data })
    }, 1000);
  }

  render() {
    // const {
    //   re,
    // } = this.props;

    return (
      <div>
        <Table
          columns={this.columns}
          dataSource={this.state.data}
          pagination={false}
        />
        <Card title="成员">
          添加成员
        </Card>
      </div>
    );
  }

}

export default connect((group) => ({
  // grouponedata: group.grouponedatas,
}))(expand2);
