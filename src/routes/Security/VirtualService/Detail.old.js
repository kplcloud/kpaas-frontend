/**
 * Created by huyunting on 2018/7/5.
 */
import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Row, Col, Card} from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ShowTags from '../../../components/Security/showTags';
import CardGrid from  '../../../components/Security/cardGrid';
const {Description} = DescriptionList;

class Detail extends PureComponent {
  state = {
    httpkey: 0,
  };

  componentWillMount() {
    const {dispatch, match} = this.props;
    if (!match.params.name || !match.params.namespace) {
      message.error("当前访问页面有误~");
      return
    }
    dispatch({
      type: "virtualservice/one",
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      }
    })

  }

  handleTabChange = (key) => {
    this.setState({httpkey: key});
  };

  showContent = (data) => {
    const items = [];
    data.map((item, index) => {
      items.push(<spsn key={index} style={{marginRight: 5}}>{item}</spsn>);
    });
    return items;
  };

  routeContent = (data) => {
    if(data.match) {
      console.log(data.match)
    }
    console.log(data)

    return

    const items = [];
    data.map((item, index) => {
      if (item.destination) {
        items.push(<CardGrid {...{
          title: "port",
          content: item.destination.port.number,
          detailKey: (index + 100),
          width: "30%"
        }}/>);
        items.push(<CardGrid {...{title: "host", content: item.destination.host, detailKey: index, width: "70%"}}/>);
      }
    });

    console.log(data)

    return <Card style={{marginBottom: 12}} title="route">{items}</Card>
  };
  redirectContent = (data) => {
    const items = [];
    if (data) {
      items.push(<CardGrid {...{title: "authority", content: data.authority}}/>);
      items.push(<CardGrid {...{title: "uri", content: data.uri}}/>);
    }
    return <Card style={{marginBottom: 12}} title="redirect">{items}</Card>
  };
  appendHeadersContent = (data) => {
    const items = [];
    if (data) {
      Object.keys(data).forEach(function (key) {
        items.push(<CardGrid {...{title: key, content: data[key], detailkey: "key", width: "100%"}}/>);
      });
    }
    return <Card style={{marginBottom: 12}} title="appendHeaders">{items}</Card>
  };
  faultContent = (data) => {
    const items = [];
    Object.keys(data).forEach(function (key) {
      if (key && data[key]) {
        var innerTitle = "";
        if (key == "abort") innerTitle = "终止状态(abort)";
        if (key == "delay") innerTitle = "延迟状态(delay)";
        const detailItems = [];
        const detail = data[key];
        Object.keys(detail).forEach(function (detailKey) {
          var detailTitle = "";
          if (detailKey == 'percent') detailTitle = "百分比(%)";
          if (detailKey == 'httpStatus') detailTitle = "http状态";
          if (detailKey == 'fixedDelay') detailTitle = "延迟时间";
          detailItems.push(<CardGrid {...{title: detailTitle, content: detail[detailKey]}}/>);
        });
        items.push(<Card title={innerTitle} type="inner" style={{marginBottom: 10}}>{detailItems}</Card>);
      }
    });
    return <Card style={{marginBottom: 12}} title="fault">{items}</Card>
  };
  policyContent = (data) => {
    const items = [];
    if (data) {
      items.push(
        <CardGrid {...{
          title: "是否允许发送cookie",
          content: data.allowCredentials ? "true" : "false",
          detailkey: "policy_1",
        }}/>);
      items.push(
        <CardGrid {...{
          title: "缓存时间",
          content: data.maxAge,
          detailkey: "policy_2",
        }}/>);
      items.push(<CardGrid {...{
        title: "HTTP请求",
        content: this.showContent(data.allowMethods),
        detailkey: "policy_3",
        width: "100%",
      }}/>);
      items.push(<CardGrid {...{
        title: "允许的header",
        content: this.showContent(data.allowHeaders),
        detailkey: "policy_header",
        width: "100%",
      }}/>);
      items.push(<CardGrid {...{
        title: "exposeHeaders",
        content: this.showContent(data.exposeHeaders),
        detailkey: "policy_expose_headers",
        width: "100%",
      }}/>);
      items.push(<CardGrid {...{
        title: "allowOrigin",
        content: this.showContent(data.allowOrigin),
        detailkey: "policy_allow_origin",
        width: "100%",
      }}/>);
    }
    return (
      <Card title="代理" style={{marginBottom: 12}}>{items}</Card>
    );
  };

  render() {
    const {virtualservice} = this.props;
    const {oneInfo, loading, httpLength} = virtualservice;
    console.log(oneInfo)
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="名称">{oneInfo ? oneInfo.name : "-"}</Description>
        <Description term="业务空间">{oneInfo ? oneInfo.namespace : "-"}</Description>
        <Description term="hosts">
          <ShowTags {...{content: oneInfo.hosts, color: "blue"}}/>
        </Description>
        <Description term="gateways">
          <ShowTags {...{content: oneInfo.gateways, color: "blue"}}/>
        </Description>
      </DescriptionList>
    );
    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div>更新时间</div>
          <div>{oneInfo ? moment(oneInfo.createdAt).format('YY/MM/DD HH:mm:ss') : ''}</div>
        </Col>
      </Row>
    );
    const tabList = [];
    if (httpLength >= 1 && oneInfo.http && oneInfo.http.length) {
      oneInfo.http.map((item, index) => {
        tabList.push({key: index, tab: "http_" + (index + 1)})
      })
    }
    if (oneInfo.http && oneInfo.http[this.state.httpkey]) {
      console.log(111, oneInfo.http[this.state.httpkey])
    }
    return (
      <PageHeaderLayout
        title={"虚拟服务" }
        logo={<img alt="" src="http://source.qiniu.cnd.nsini.com/kplcloud/kpl-logo-blue.png"/>}
        content={description}
        extraContent={extra}
        loading={loading}
        tabList={tabList ? tabList : ""}
        onTabChange={this.handleTabChange}
      >
        {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].route && this.routeContent(oneInfo.http[this.state.httpkey])}
        {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].corsPolicy && this.policyContent(oneInfo.http[this.state.httpkey].corsPolicy)}
        {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].redirect && this.redirectContent(oneInfo.http[this.state.httpkey].redirect)}
        {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].append_headers && this.appendHeadersContent(oneInfo.http[this.state.httpkey].append_headers)}
        {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].fault && this.faultContent(oneInfo.http[this.state.httpkey].fault)}
      </PageHeaderLayout>
    );
  }

}
export default connect(({virtualservice}) => ({
  virtualservice
}))(Detail);
