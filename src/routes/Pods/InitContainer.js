import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Divider
} from 'antd';
import DescriptionList from 'components/DescriptionList';
const { Description } = DescriptionList;


class InitContainer extends PureComponent {
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
            <Card title="初始化容器" style={{ marginBottom: 24 }} bordered={false} key="initcontainercard">
                {spec && spec.initContainers && (spec.initContainers).map((item, key) => {
                    let env;
                    if (item.env) {
                      env = (item.env).map((item, key) => {
                          return (<span key={`init-span-evn-${key}`}>
                              {item.name}: "-" <br />
                          </span>)
                      });
                    }
                    let args;
                    if (item.args) {
                        args = (item.args).map((item, key) => {
                            return <div key={`init-args-${key}`}>{item}</div>                            
                        })
                    }
                    let command;
                    if (item.command) {
                        command = (item.command).map((item, key) => {
                            return <div key={`inti-command-${key}`}>{item}</div>
                        })
                    }
                    return <span key={`span-init-description-${item.name}`}>
                        <DescriptionList style={{ marginBottom: 24, textAlign: "left" }} key={`init-description-${item.name}`}>
                            <Description term="名称"><b key={`init-${item.name}`}>{item.name}</b></Description>
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
    
}))(InitContainer);
