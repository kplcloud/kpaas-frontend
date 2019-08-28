/**
 * Created by yuntinghu on 2019/5/14.
 */

import React from 'react';
import { connect } from 'dva';
import { Card, Tag } from 'antd';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;

class UnAuditOverview extends React.Component {

  ports = (ports) => {
    var data = [];
    if (ports && ports.length > 0) {
      ports.map((item) => {
        if (item && item.port) {
          data.push(<Tag>{item.protocol}-{item.port}</Tag>);
        }
      });
    }
    return data;
  };
  argsData = (args) => {
    var data = [];
    if (args && args.length > 0) {
      args.map((item, key) => {
        if (item && key > 0) {
          data.push(`,${item}`);
        } else {
          data.push(item);
        }
      });
    }
    return data;
  };


  render() {
    const { webFiles, project } = this.props;

    return (
      <Card title="项目信息" style={{ marginBottom: 24 }}>
        <DescriptionList style={{ marginBottom: 24 }}>
          <Description term="申请人">{project && project.member && project.member.username}</Description>
          <Description term="业务空间">{project && project.namespace}</Description>
          <Description term="英文名称">{project && project.name}</Description>
          <Description term="中文名称">{project && project.name}</Description>
          <Description term="项目语言">{project && project.language}</Description>
          <Description term="创建时间">{project && project.created_at}</Description>
        </DescriptionList>
        <DescriptionList title="详细信息" style={{ marginBottom: 24 }}>
          <Description term="Git地址">{webFiles && webFiles.git_addr}</Description>
          <Description term="分支类型">{webFiles && webFiles.git_type}</Description>
          <Description term="Git版本号">{webFiles && webFiles.git_version}</Description>
          <Description term="Docker地址">
            {webFiles && webFiles.git_buildpath && webFiles.git_buildpath.indexOf('Dockerfile') !== -1 ? webFiles.git_buildpath : './Dockerfile'}
          </Description>
          <Description term="容器数量及规格">
            <Tag>{webFiles && webFiles.replicas} 个</Tag>
            <Tag>{webFiles && webFiles.resources && webFiles.resources.substring(webFiles.resources.indexOf('/') + 1)} 内存</Tag>
          </Description>
          <Description term="服务类型">
            {webFiles && webFiles.resource_type === '1' && '集群内部访问'}
            {webFiles && webFiles.resource_type === '2' && '集群外部访问'}
          </Description>
          <Description term="端口信息">
            {webFiles && webFiles.ports && this.ports(webFiles.ports)}
          </Description>

        </DescriptionList>

        <DescriptionList
          title="更多信息"
          style={{ marginBottom: 24 }}
          hidden={project && project.language !== 'Java' ? true : false}
        >
          <Description term="启动方式">
            <Tag>{webFiles && webFiles.service_start === '1' ? 'Jar' : 'Tomcat'} 启动</Tag>
          </Description>
          <Description term="dubbo服务"> {webFiles && webFiles.doubleService === true ? '是' : '否'}</Description>
          <Description term="Command">
            {this.argsData(webFiles && webFiles.command)}
          </Description>
          <Description
            term="Args"
            hidden={webFiles && webFiles.args && webFiles.args.length ? false : true}
          >
            {this.argsData(webFiles && webFiles.args)}
          </Description>
          <Description
            term="Env"
            hidden={webFiles && webFiles.env ? false : true}
          >
            {webFiles.env}
          </Description>
        </DescriptionList>
      </Card>
    );
  }
}

export default connect(({ jenkins }) => ({ jenkins }))(UnAuditOverview);
