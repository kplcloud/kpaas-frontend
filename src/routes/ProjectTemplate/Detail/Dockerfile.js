/**
 * Created by huyunting on 2018/6/22.
 */
import React from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNight } from 'react-syntax-highlighter/styles/hljs';

class Dockerfile extends React.PureComponent {
  componentWillMount() {
    const { match: { params } } = this.props;
    this.props.dispatch({
      type: 'gitlab/getDockerfiles',
      payload: {
        name: params && params.name,
        namespace: params && params.namespace,
      },
    });
  }

  render() {
    const { gitlab: { dockerfileContent, loading } } = this.props;
    // var field;
    // for (var i in templates) {
    //   if (templates[i].kind == 'Deployment' && templates[i].web_fields) {
    //     field = JSON.parse(templates[i].web_fields);
    //     break;
    //   }
    // }
    const component = (codeString) => {
      return <SyntaxHighlighter language='yaml' style={tomorrowNight}>{codeString}</SyntaxHighlighter>;
    };
    return (
      <Card style={{ marginBottom: 24 }} bodyStyle={{ padding: 0 }} loading={loading} title="Dockerfile">
        <div className="language-bash">
          {component(dockerfileContent)}
        </div>
      </Card>
    );
  }
}

export default connect(({ gitlab }) => ({ gitlab }))(Dockerfile);
