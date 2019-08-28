import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
    Card,
    Row
} from 'antd';
import Metrics from './Metrics'
import Info from './Info'
import Container from './Container'
import InitContainer from './InitContainer'

class Overview extends PureComponent {
    state = {
    };
    componentDidMount() {
        const { dispatch, match } = this.props;
        console.log(match)
        dispatch({
            type: 'pods/detail',
            payload: {
                name: match.params.svc,
                podName: match.params.name,
                namespace: match.params.namespace
            }
        });
    };
    render() {
        const {pods} = this.props
        const {detail} = pods;
        return (
            <Row>
                {detail && detail.metrics && <Metrics {...{detail}} /> }
      
                {detail && detail.pod && <Info {...detail}/>}

                {detail && detail.pod && <Container {...detail} /> }

                {detail && detail.pod && <InitContainer {...detail} />}
            </Row>
        );
    }
}
export default connect(({pods}) => ({
    pods
}))(Overview);
