const { Table, Badge } = antd;

const genSubData = function() {
  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      date: '2014-12-24 23:12:00',
      name: Math.random(),
      upgradeNum: 'Upgraded: 56',
    });
  }
  return data;
}

class SubTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
    this.columns = [
      { title: 'Date', dataIndex: 'date', key: 'date' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Status', key: 'state', render: () => <span><Badge status="success" />Finished</span> },
      { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    ];
  }

  componentWillMount() {
    console.log(this.props.record)
    this.fetchData()
  }

  fetchData() {
    setTimeout(() => {
      const data = genSubData()
      this.setState({ data })
    }, 1000);
  }

  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.state.data}
        pagination={false}
      />
    );
  }
}

function NestedTable() {
  const expandedRowRender = (record) => {
    return <SubTable record={record} />
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Platform', dataIndex: 'platform', key: 'platform' },
    { title: 'Version', dataIndex: 'version', key: 'version' },
    { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'Action', key: 'operation', render: () => <a href="#">Publish</a> },
  ];

  const data = [];
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      name: 'Screem',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
    });
  }

  return (
    <Table
      className="components-table-demo-nested"
      columns={columns}
      expandedRowRender={expandedRowRender}
      dataSource={data}
    />
  );
}


ReactDOM.render(
  <NestedTable />
  , document.getElementById('container'));
