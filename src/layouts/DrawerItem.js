import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';

const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
};

const DescriptionItem = ({ title, content }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: '22px',
        marginBottom: 7,
        color: 'rgba(0,0,0,0.65)',
      }}
    >
      <p
        style={{
          marginRight: 8,
          display: 'inline-block',
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        {title}:
      </p>
      {content}
    </div>
);

class DrawerItem extends React.PureComponent {
    render() {
      const {visible, onClose, detail} = this.props;  //console.log("draweritem",detail)
      if(!detail) {
        return (<span></span>)
      }
      let content;
      if (detail.action == "Alarm" && detail.content!='') {
        content = JSON.parse(detail.content)
      }
        return (
            <Drawer
              key={detail.id}
              width={640}
              placement="bottom"
              closable={false}
              onClose={onClose}
              visible={visible}
              destroyOnClose={true}
            >
              <p style={{ ...pStyle, marginBottom: 24 }}>{detail.title}</p>
            
              {content && content.alerts ? (content.alerts).map((item, key) => {
                return (<span>
                  <p style={pStyle} key={`p-${key}`}>{item.labels.alertname}</p>
                  <Row key={key}>
                    <Col span={12}>
                      <DescriptionItem title="名称" content={item.labels.deployment||item.labels.container||item.labels.container_name} />{' '}
                    </Col>
                    <Col span={12}>
                      <DescriptionItem title="容器" content={item.labels.pod||item.labels.k8s_app||item.labels.job} />
                    </Col>
                    {item.annotations && item.annotations.from ? 
                    <Col span={12}>
                      <DescriptionItem title="来源" content={item.annotations.from} />
                    </Col> : ""}
                    {item.annotations && item.annotations.to ? 
                    <Col span={12}>
                      <DescriptionItem title="目标" content={item.annotations.to} />
                    </Col> : ""}
                    <Col span={12}>
                      <DescriptionItem title="状态" content={item.status} />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem title="详情链接" content={<a href={item.generatorURL} target="_blank">Prometheus</a>} />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem title="开始时间" content={item.startsAt} />
                    </Col>
                    <Col span={12}>
                      <DescriptionItem title="结束时间" content={item.endsAt} />
                    </Col>
                    <Col span={24}>
                      <DescriptionItem
                        title="详情"
                        content={item.annotations && item.annotations.description}
                      />
                    </Col>
                  </Row>
                  <Divider /></span>
                )
              }): <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="详情"
                    content={ detail.type ==1 ? <p dangerouslySetInnerHTML={{ __html: detail.content}} /> : <pre>{detail.content}</pre>}
                  />
                </Col>
            </Row>}
            </Drawer>
        );
    }
}

export default connect()(DrawerItem);