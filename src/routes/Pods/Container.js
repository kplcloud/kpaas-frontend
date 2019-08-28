import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Divider
} from 'antd';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;


class Container extends PureComponent {
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
        const {spec} = pod;
        return (
            <Card title="容器" style={{ marginBottom: 24 }} bordered={false}>
                {spec && spec.containers && spec.containers.map((item, key) => {
                    let env;
                    if (item.env){
                        env = (item.env).map((item, key) => {
                            return (<span key={`span-evn-${key}`}>
                                {item.name}: {item.valueFrom && item.valueFrom.configMapKeyRef && item.valueFrom.configMapKeyRef.key ? item.valueFrom.configMapKeyRef.key : item.valueFrom && item.valueFrom.fieldRef && item.valueFrom.fieldRef.fieldPath ? item.valueFrom.fieldRef.fieldPath : "-"} <br />
                            </span>)
                        });
                    }
                    let args;
                    if (item.args) {
                        args = (item.args).map((item, key) => {
                            return <div key={`args-${key}`}>{item}</div>                            
                        })
                    }
                    let command;
                    if (item.command) {
                        command = (item.command).map((item, key) => {
                            return <div key={`command-${key}`}>{item}</div>
                        })
                    }
                    return <span key={`span-container-${item.name}`}>
                        <DescriptionList style={{ marginBottom: 24, textAlign: "left" }} key={`container-${item.name}`}>
                            <Description term="名称"><b key={item.name}>{item.name}</b></Description>
                            <Description term="镜像">{item.image}</Description>
                            <Description term="环境变量">{env ? env : "-"}</Description>
                            <Description term="命令">{command ? command : "-"}</Description>
                            <Description term="参数">{args ? args : "-"}</Description>
                        </DescriptionList>
                        <Divider style={{ marginBottom: 32 }} />
                    </span>
                })}
            </Card>
        );
    }
}
export default connect(({}) => ({
    
}))(Container);
