import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tag,
  Modal,
  Button
} from 'antd';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;


class Info extends PureComponent {
    state = {
        visible: false,
        title: "",
        content: ""
    };
    showModal = (e, title, content) => {
        e.preventDefault();
        this.setState({
            visible: true,
            title: title,
            content: content,
        });
    };
    handleCancel = () => {
        this.setState({ visible: false, title: '', content: '' });
      };
    render() {
        const {pod} = this.props;
        const {metadata, spec, status} = pod;
        var labels = [];
        if (metadata && metadata.labels) {
            for (var i in metadata.labels) {
                labels.push(<Tag key={`labels-${i}`}>{i}: {metadata.labels[i]}</Tag>)
            }
        }
        var annotations = [];
        if (metadata && metadata.annotations) {
            for (var i in metadata.annotations) {
                var tag;
                if ((metadata.annotations[i]).length > 40) {
                let n = i;
                let v = metadata.annotations[i]
                tag = <Tag key={`annotations-${i}`} color="blue" onClick={(e) => this.showModal(e, n, v)}>{i}</Tag>
                } else {
                tag = <Tag key={`annotations-${i}`}>{i}: {metadata.annotations[i]}</Tag>
                }
                annotations.push(tag)
            }
        }
        return (
            <Card title="详情" style={{ marginBottom: 24 }} bordered={false}>
                <Modal
                    visible={this.state.visible}
                    title={this.state.title}
                    width={500}
                    onOk={this.handleCancel}
                    footer={[
                        <Button key="back" type="primary" onClick={this.handleCancel}>
                        OK
                        </Button>,
                    ]}
                    onCancel={this.handleCancel}
                    bodyStyle={{ background: '#EFEFEF', overflow: 'auto', height: '400px' }}
                >
                    {this.state.content}
                </Modal>
                <DescriptionList style={{ marginBottom: 24, textAlign: "left" }}>
                    <Description term="名称">{metadata ? metadata.name : "-"}</Description>
                    <Description term="命名空间">{metadata ? metadata.namespace : "-"}</Description>
                    <Description term="标签">{labels}</Description>
                    <Description term="注释">{annotations}</Description>
                    <Description term="创建时间">{metadata ? metadata.creationTimestamp : "-"}</Description>
                    <Description term="状态">{status ? status.phase : "-"}</Description>
                    <Description term="QoS 等级">{status ? status.qosClass : "-"}</Description>
                    <Description term="节点">{spec ? spec.nodeName : "-"}</Description>
                    <Description term="IP">{status ? status.podIP : "-"}</Description>
                </DescriptionList>
            </Card>
        );
    }
}
export default connect(({}) => ({
    
}))(Info);
