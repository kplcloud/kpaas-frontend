/**
 * Created by huyunting on 2018/7/5.
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, message, Icon } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ShowTags from '../../../components/Security/showTags';
import CardGrid from '../../../components/Security/cardGrid';
import MatchUri from './Detail/MatchUri';
import RouteEdit from './Detail/RouteEdit';
import MirrorModal from "./Detail/MirrorModal"

const { Description } = DescriptionList;

class Detail extends PureComponent {
  state = {
    httpkey: 0,
    routes: [],
    mirrorVisible: false
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    if (!match.params.name || !match.params.namespace) {
      message.error('当前访问页面有误~');
      return;
    }
    dispatch({
      type: 'virtualservice/one',
      payload: {
        name: match.params.name,
        namespace: match.params.namespace,
      },
    });

    dispatch({
      type: 'virtualservice/changeEditPage',
      payload: {
        edit: '',
      },
    });

  }

  handleTabChange = (key) => {
    this.setState({ httpkey: key });
  };

  showContent = (data) => {
    const items = [];
    data.map((item, index) => {
      items.push(<spsn key={index} style={{ marginRight: 5 }}>{item}</spsn>);
    });
    return items;
  };

  showEdit = (data) => {
    this.props.dispatch({
      type: 'virtualservice/changeEditPage',
      payload: {
        edit: 'route',
      },
    });
    this.setState({ routes: data });
  };
  routeContent = (data) => {
    const items = [];
    data.map((item, index) => {
      if (item.destination) {
        items.push(<CardGrid key={index + 'port'} {...{
          title: 'port',
          content: item.destination.port.number,
          detailKey: (index + 100),
          width: '20%',
        }}/>);
        items.push(<CardGrid key={index + 'sunset'} {...{
          title: 'subset',
          content: item.destination.subset ? item.destination.subset : '',
          detailKey: index,
          width: '10%',
        }}/>);
        items.push(<CardGrid key={index + 'host'} {...{
          title: 'host',
          content: item.destination.host,
          detailKey: index,
          width: '50%',
        }}/>);
      }
      items.push(<CardGrid key={index + 'weight'} {...{
        title: 'weight',
        content: item.weight ? item.weight : 100,
        detailKey: index,
        width: '20%',
      }}/>);
    });
    return (
      <Card
        key="route"
        style={{ marginBottom: 12 }}
        title="route"
        extra={<a onClick={() => this.showEdit(data)}><Icon type="form"/> 编辑</a>}
      >
        {items}
      </Card>
    );
  };
  redirectContent = (data) => {
    const items = [];
    if (data) {
      items.push(<CardGrid key="authority" {...{ title: 'authority', content: data.authority }}/>);
      items.push(<CardGrid key="uri" {...{ title: 'uri', content: data.uri }}/>);
    }
    return <Card style={{ marginBottom: 12 }} title="redirect">{items}</Card>;
  };
  appendHeadersContent = (data) => {
    const items = [];
    if (data) {
      Object.keys(data).forEach(function(key) {
        items.push(<CardGrid key={key + 'key'} {...{
          title: key,
          content: data[key],
          detailkey: 'key',
          width: '100%',
        }}/>);
      });
    }
    return <Card style={{ marginBottom: 12 }} title="appendHeaders">{items}</Card>;
  };
  faultContent = (data) => {
    const items = [];
    Object.keys(data).forEach(function(key) {
      if (key && data[key]) {
        var innerTitle = '';
        if (key == 'abort') innerTitle = '终止状态(abort)';
        if (key == 'delay') innerTitle = '延迟状态(delay)';
        const detailItems = [];
        const detail = data[key];
        Object.keys(detail).forEach(function(detailKey) {
          var detailTitle = '';
          if (detailKey == 'percent') detailTitle = '百分比(%)';
          if (detailKey == 'httpStatus') detailTitle = 'http状态';
          if (detailKey == 'fixedDelay') detailTitle = '延迟时间';
          detailItems.push(<CardGrid key={detailKey} {...{ title: detailTitle, content: detail[detailKey] }}/>);
        });
        items.push(<Card key={key} title={innerTitle} type="inner" style={{ marginBottom: 10 }}>{detailItems}</Card>);
      }
    });
    return <Card style={{ marginBottom: 12 }} title="fault">{items}</Card>;
  };
  policyContent = (data) => {
    const items = [];
    if (data) {
      items.push(
        <CardGrid {...{
          key: '是否允许发送cookie',
          title: '是否允许发送cookie',
          content: data.allowCredentials ? 'true' : 'false',
          detailkey: 'policy_1',
        }}/>);
      items.push(
        <CardGrid {...{
          key: '缓存时间',
          title: '缓存时间',
          content: data.maxAge,
          detailkey: 'policy_2',
        }}/>);
      items.push(<CardGrid {...{
        key: 'HTTP请求',
        title: 'HTTP请求',
        content: this.showContent(data.allowMethods),
        detailkey: 'policy_3',
        width: '100%',
      }}/>);
      items.push(<CardGrid {...{
        key: '允许的header',
        title: '允许的header',
        content: this.showContent(data.allowHeaders),
        detailkey: 'policy_header',
        width: '100%',
      }}/>);
      items.push(<CardGrid {...{
        key: 'exposeHeaders',
        title: 'exposeHeaders',
        content: this.showContent(data.exposeHeaders),
        detailkey: 'policy_expose_headers',
        width: '100%',
      }}/>);
      items.push(<CardGrid {...{
        key: 'allowOrigin',
        title: 'allowOrigin',
        content: this.showContent(data.allowOrigin),
        detailkey: 'policy_allow_origin',
        width: '100%',
      }}/>);
    }
    return (
      <Card title="代理" style={{ marginBottom: 12 }}>{items}</Card>
    );
  };

  detailRoute = (data) => {
    let detail = [];
    if (data.route) {
      detail.push(this.routeContent(data.route));
    }
    if (!data['match']) {
      data['match'] = [];
      data['match'].push({
        uri: {
          prefix: '/',
        },
      });
    }
    detail.push(<Card extra={<a><Icon type="form"/> 编辑</a>} key="match" style={{ marginBottom: 12 }} title="match">
      <MatchUri data={data.match}/>
    </Card>);

    return detail;
  };

  mirrorModal = (e) => {
    const {mirrorVisible} = this.state;
    this.setState({
      mirrorVisible: !mirrorVisible
    });
  };

  mirror = (data) => {
    if (!data["mirror"] || data["mirror"].length < 1) {
      return (<Card extra={<a onClick={this.mirrorModal}><Icon type="form"/> 编辑</a>} key="match" style={{ marginBottom: 12 }} title="流量镜像">
    </Card>)
    };
    let hosts = (data["mirror"].host).split(".");
    return (<Card extra={<a onClick={this.mirrorModal}><Icon type="form"/> 编辑</a>} key="match" style={{ marginBottom: 12 }} title="流量镜像">
      <DescriptionList size="small" col="2">
        <Description term="镜像到应用">{hosts[0]}</Description>
        <Description term="镜像到业务空间">{hosts[1]}</Description>
        <Description term="镜像到端口">{data["mirror"].port.number}</Description>
        <Description term="查看该应用"><a href={`#/project/detail/${hosts[1]}/${hosts[0]}`}>{hosts[1]}/{hosts[0]}</a></Description>
      </DescriptionList>
    </Card>)
  };

  render() {
    const { virtualservice, match } = this.props;
    const { oneInfo, loading, httpLength, editPage } = virtualservice;
    const {mirrorVisible} = this.state;
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="名称">{oneInfo ? oneInfo.name : '-'}</Description>
        <Description term="业务空间">{oneInfo ? oneInfo.namespace : '-'}</Description>
        <Description term="domain">
          <ShowTags {...{ content: oneInfo.hosts, color: 'blue' }}/>
        </Description>
        <Description term="gateways">
          <ShowTags {...{ content: oneInfo.gateways, color: 'blue' }}/>
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
        tabList.push({ key: index, tab: 'http_' + (index + 1) });
      });
    }
    if (oneInfo.http && oneInfo.http[this.state.httpkey]) {
      // console.log(111, oneInfo.http[this.state.httpkey]);
    }
    let infoDetail = '';
    if (oneInfo.http && oneInfo.http[this.state.httpkey]) {
      infoDetail = this.detailRoute(oneInfo.http[this.state.httpkey]);
    }
    return (
      <PageHeaderLayout
        title={'虚拟服务'}
        logo={<img alt="" src="http://source.qiniu.cnd.nsini.com/kplcloud/kpl-logo-blue.png"/>}
        content={description}
        extraContent={extra}
        loading={loading}
        tabList={tabList ? tabList : ''}
        onTabChange={this.handleTabChange}
      >
        {oneInfo.http && oneInfo.http[this.state.httpkey] && this.mirror(oneInfo.http[this.state.httpkey])}
        {oneInfo && mirrorVisible && <MirrorModal visible={mirrorVisible} data={oneInfo} match={match} onCancel={this.mirrorModal} />}
        {editPage === '' && infoDetail}
        {editPage === 'route' && (
          <RouteEdit {...{ routes: this.state.routes, httpkey: this.state.httpkey, ...this.props }}/>)}
        {/* {oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].route && this.routeContent(oneInfo.http[this.state.httpkey].route)} */}
        {editPage === '' && oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].corsPolicy && this.policyContent(oneInfo.http[this.state.httpkey].corsPolicy)}
        {editPage === '' && oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].redirect && this.redirectContent(oneInfo.http[this.state.httpkey].redirect)}
        {editPage === '' && oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].append_headers && this.appendHeadersContent(oneInfo.http[this.state.httpkey].append_headers)}
        {editPage === '' && oneInfo.http && oneInfo.http[this.state.httpkey] && oneInfo.http[this.state.httpkey].fault && this.faultContent(oneInfo.http[this.state.httpkey].fault)}
      </PageHeaderLayout>
    );
  }

}

export default connect(({ virtualservice }) => ({
  virtualservice,
}))(Detail);
