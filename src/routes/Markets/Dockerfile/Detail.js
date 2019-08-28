import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { Tag, Badge, Card } from 'antd';
import DescriptionList from '../../../components/DescriptionList';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';

const { Description } = DescriptionList;
const colorList = {
  Python: '#f0bb12',
  Golang: '#69c4dc',
  Java: '#205aae',
  NodeJs: '#7cc239',
};

@connect(({ dockerfile }) => ({
  detailInfo: dockerfile.detailInfo,
  loading: dockerfile.loading,
  uploader: dockerfile.uploader,
}))
export default class Detail extends PureComponent {
  componentWillMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    if (params.id > 0) {
      dispatch({
        type: 'dockerfile/detail',
        payload: { id: params.id },
      });
    }
  };

  languageTags = language => {
    for (const k in  colorList) {
      if (k === language && colorList[k]) {
        return (<Tag color={colorList[k]}>{language}</Tag>);
      }
    }
    return (<Tag color="#386EAE">{language}</Tag>);
  };

  checkStatus = status => {
    if (status === 0) {
      return (<Badge status='default' text="待审核"/>);
    } else if (status === 1) {
      return (<Badge status="success" text="通过"/>);
    } else if (status === 2) {
      return (<Badge status="error" text="驳回"/>);
    }
  };
  component = (codeString) => {
    return <SyntaxHighlighter language='yaml' style={tomorrowNight}>{codeString}</SyntaxHighlighter>;
  };

  render() {
    const { detailInfo, loading, uploader } = this.props;
    const description = (
      <DescriptionList size="small" col="2">
        <Description term="版本">{detailInfo ? detailInfo.version : '-'}</Description>
        <Description term="状态">{detailInfo ? this.checkStatus(detailInfo.status) : '-'}</Description>
        <Description term="下载次数">{detailInfo ? (detailInfo.download + ' 次') : '-'}</Description>
        <Description term="全路径">{detailInfo ? detailInfo.full_path : '-'}</Description>
        <Description term="发布时间">{detailInfo ? detailInfo.created_at : '-'}</Description>
        <Description term="描述">{detailInfo ? detailInfo.desc : '-'}</Description>
        <Description term="Sha256">{detailInfo ? detailInfo.sha_256 : '-'}</Description>
      </DescriptionList>
    );
    const detailTitle = (
      <span>{this.languageTags(detailInfo.language)} {detailInfo.name}</span>
    );
    const noDetailTitle = (
      <span>{this.languageTags('Dockerfile 市场')}</span>
    );
    return (
      <PageHeaderLayout
        title={detailInfo ? detailTitle : noDetailTitle}
        content={description}
      >
        <Card title="详情" style={{ marginBottom: 24 }} bordered={false} loading={loading}>
          <DescriptionList style={{ marginBottom: 24 }} title="Dockerfile：">
            {this.component(detailInfo && detailInfo.dockerfile ? detailInfo.dockerfile : '-')}
          </DescriptionList>
          <DescriptionList style={{ marginBottom: 24 }} title="示例：">
            {this.component(detailInfo && detailInfo.detail ? detailInfo.detail : '-')}
          </DescriptionList>

          <DescriptionList style={{ marginTop: 48 }} title="联系作者：">
            <Description term="姓名">{uploader ? uploader.username : '~~'}</Description>
            <Description term="邮箱">{uploader ? uploader.email : '~~'}</Description>
          </DescriptionList>
        </Card>

      </PageHeaderLayout>
    );
  }
}
