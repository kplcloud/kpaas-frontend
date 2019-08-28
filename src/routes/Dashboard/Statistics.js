import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Pie } from 'components/Charts';
import { Card, Table, DatePicker, Select, Input, Divider, Icon, Pagination, Tag } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import moment from 'moment';
import { Link } from 'react-router-dom';
import Cookie from 'js-cookie';

const { RangePicker } = DatePicker;
const Search = Input.Search;
const {Option, OptGroup} = Select;


class Statistics extends PureComponent {

  state = {
    ns: "",
    group: 0,
    startTime: undefined,
    endTime: undefined,
    name: "",
  };



  componentWillMount() {
    const { dispatch } = this.props;
    const namespace = Cookie.get('namespace');
    this.setState({ ns: namespace});
    dispatch({
      type: 'statistics/nsList',
    });
    dispatch({
      type: 'statistics/buildList',
      ns: namespace,
    });
    dispatch({
      type: 'group/ownergrouplist',
      payload: {
        'ns': namespace,
      },
    });
  };


  handleNsChanges = (value) => {
    const { dispatch } = this.props;
    const v = value===undefined ? "" : value;
    dispatch({
      type: 'statistics/buildList',
      ns: v,
    });

    dispatch({
      type: 'group/ownergrouplist',
      payload: {
        'ns': v,
      },
    });


    this.setState({
      ns:v,
      group:0,
      startTime:undefined,
      endTime:undefined,
      name: "",
    });
  };


  dataChange = (dates, dateStrings) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'statistics/buildList',
      ns: this.state.ns,
      payload: {
        'groupId': this.state.group,
        'sTime': dateStrings[0],
        'eTime': dateStrings[1],
        'nameEn': this.state.name,
      },
    });
    this.setState({
      startTime:dateStrings[0],
      endTime:dateStrings[1],
    })
  };

  clickProject = (ns,projectName) => {
    this.props.history.push({ pathname : `/project/detail/${ns}/${projectName}`})
  };

  render() {
    const {
      nsList,
      ownergrouplist,
      buildList,
      buildListPaginate,
    } = this.props;

    const TableColumnsStyle = {
      fontWeight: 'bold',
      // color: 'black',
    };

    const suStyle = {
      color:'#36c966',
    };
    const faStyle = {
      color:'#f2526f',
    };
    const abStyle = {
      color:'#cbceb5bd',
    };
    const roStyle = {
      color:'#d08993bd',
    };
    const buStyle = {
      color:'#fad214',
    };

    const columns = [{
      title: '项目名',
      dataIndex: 'name',
      key: 'name',
      render:  (text, record) => (
        <a onClick={() => this.clickProject(record.ns,text)}>{text}</a>
      ),
    }, {
      title: '业务空间',
      dataIndex: 'namespace',
      key: 'namespace',
    }, {
      title: <span style={suStyle}>成功数</span>,
      dataIndex: 'success',
      key: 'success',
      render: (text, record) => (
        text === 0 ? 0 : (
          <span style={TableColumnsStyle} >
            {text}
          </span>
        )
      ),
    }, {
      title: <span style={faStyle}>失败数</span>,
      dataIndex: 'failure',
      key: 'failure',
      render: (text, record) => (
        text === 0 ? 0 : (
          <span style={TableColumnsStyle} >
            {text}
          </span>
        )
      ),
    }, {
      title: <span style={abStyle}>中断数</span>,
      dataIndex: 'aborted',
      key: 'aborted',
      render: (text, record) => (
        text === 0 ? 0 : (
          <span style={TableColumnsStyle} >
            {text}
          </span>
        )
      ),
    }, {
      title: <span style={roStyle}>回滚数</span>,
      key: 'rollback',
      dataIndex: 'rollback',
      render: (text, record) => (
        text === 0 ? 0 : (
          <span style={TableColumnsStyle} >
            {text}
          </span>
        )
      ),
    }, {
      title: <span style={buStyle}>正在构建数</span>,
      key: 'building',
      dataIndex: 'building',
      render: (text, record) => (
        text === 0 ? 0 : (
          <span style={TableColumnsStyle} >
            {text}
          </span>
        )
      ),
    }];


    const groupChange = (value) => {
      const { dispatch } = this.props;
      const g = value===undefined ? "" : value;

      dispatch({
        type: 'statistics/buildList',
        ns: this.state.ns,
        payload: {
          'groupId': g,
        },
      });
      this.setState({
        group: g ,
        startTime:undefined,
        endTime:undefined,
        name: "",
      });
    };

    const groupOption = () => {
      const options = [];
      if (ownergrouplist.length) {
        ownergrouplist.map((item, key) => options.push(
          <Option
            value={`${item.id}`}
            key={`${item.id}`}
          >{item.name}
          </Option>));
      }
      options.push(
        <OptGroup label="add Group" key="add Group">
          <Option value={0} key="add Group">
            <div>
              <Link to={{ pathname : '/group/list' ,query : { addGroup: 1} }} >
                <div style={{  cursor: 'pointer' }}>
                  <Icon type="plus" /> 点击添加组
                </div>
              </Link>
            </div>
          </Option>
        </OptGroup>
      );
      return options;
    };

    function onChange(pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter);
    }

    const onShowSizeChange = (value) => {
      const {dispatch} = this.props;
      const sTime = this.state.startTime === undefined ? "" : this.state.startTime;
      const eTime = this.state.endTime === undefined ? "" : this.state.endTime;

      dispatch({
        type: 'statistics/buildList',
        ns: this.state.ns,
        payload: {
          'groupId': this.state.group,
          'sTime': sTime,
          'eTime': eTime,
          "p": value,
          "nameEn": this.state.name,
        },
      });
    };

    const dateFormat = 'YYYY-MM-DD'||undefined;

    const colorNice = () => {
      const a = buildList.all;
      const res = [];
      if (a && a.length > 0) {
        a.map((item) => res.push(item.color));
      }
      return res;
    };


    const searchSearch = (value) => {
      const {dispatch} = this.props;
      const sTime = this.state.startTime === undefined ? "" : this.state.startTime;
      const eTime = this.state.endTime === undefined ? "" : this.state.endTime;

      dispatch({
        type: 'statistics/buildList',
        ns: this.state.ns,
        payload: {
          'groupId': this.state.group,
          'sTime': sTime,
          'eTime': eTime,
          'nameEn':value,
        },
      });
      this.setState({
        name: value,
      });
    };

    const searchChange = (e) => {
      const { value } = e.target;
      this.setState({
        name: value,
      });
    };

    return (
      <PageHeaderLayout title="上线统计">
        <Card
          title="上线统计"
          bordered={false}
          extra={
            <span>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="可以选择业务空间"
                optionFilterProp="children"
                onChange={this.handleNsChanges}
                defaultValue={this.state.ns}
              >
                {nsList.map(item => <Select.Option key={item.name}>{item.display_name}</Select.Option>)}
              </Select>
              &nbsp;&nbsp;
              <Select
                value={`${this.state.group ? this.state.group : "请选择组"}`}
                showSearch
                style={{ width: 150 }}
                placeholder="请选择组"
                onChange={groupChange}
                allowClear
                notFoundContent={
                  <div>
                    <Divider style={{ margin: '4px 0' }} />
                    <Link to={{ pathname : '/group/list' ,query : { addGroup: 1} }} >
                      <div style={{ padding: '8px', cursor: 'pointer' }}>
                        <Icon type="plus" /> 点击添加组
                      </div>
                    </Link>
                  </div>
                }
              >
                {ownergrouplist && groupOption()}
              </Select>

              &nbsp;&nbsp;
              <Search
                style={{width: 200}}
                placeholder="项目英文名称..."
                onSearch={value => searchSearch(value)}
                onChange={value => searchChange(value)}
                value={this.state.name === "" ? null : this.state.name}
                enterButton
              />
              &nbsp;&nbsp;

              <RangePicker
                placeholder={['开始时间','结束时间']}
                ranges={{ Today: [moment(), moment()], 'This Month': [moment().startOf('month'), moment().endOf('month')] }}
                showTime
                format="YYYY-MM-DD"
                onChange={this.dataChange}
                allowClear
                className="rangePicker"
                value={this.state.startTime===undefined||this.state.endTime===undefined||this.state.startTime===""||this.state.endTime===""?null:[moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]}
              />
              &nbsp;&nbsp;
            </span>

        }
        >
          <Table
            columns={columns}
            dataSource={buildList.list}
            rowKey={record => record.id}
            onChange={onChange}
            pagination={false}
          />
          <Pagination
            style={{marginTop: 20, float: "right"}}
            title=""
            current={buildListPaginate ? buildListPaginate.page : 0}
            defaultCurrent={buildListPaginate.page}
            total={buildListPaginate.total}
            showTotal={total => `共 ${buildListPaginate.total} 条数据`}
            onChange={onShowSizeChange}
          />
          &nbsp;&nbsp;
          <div  style={{marginTop: 20}}>
            <Pie
              hasLegend
              title="总数占比"
              colors={colorNice()}
              // colors={[ '#d08993bd',  '#fad214','#f2526f', '#36c966' ,'#179aff']}
              animate
              data={buildList.all}
              valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val }} />}
              height={294}
            />
          </div>

        </Card>

      </PageHeaderLayout>
    );
  }
}

export default connect(({statistics,group}) => ({
  nsList: statistics.nsList,
  ownergrouplist: group.ownergrouplist,
  buildList: statistics.buildList,
  buildListPaginate: statistics.buildListPaginate,
}))(Statistics);
