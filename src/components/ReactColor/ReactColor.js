/**
 * Created by huyunting on 2018/10/16.
 */
// 'use strict'

import React from 'react'
import reactCSS from 'reactcss'
import {SketchPicker} from 'react-color'

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    color: "",
    // color: {
    //   r: '241',
    //   g: '112',
    //   b: '19',
    //   a: '1',
    // },
  };

  componentDidMount() {
    const {color} = this.props;
    if (color) {
      this.setState({color: color});
    } else {
      this.setState({color: "#F5A623"});
    }
  };


  render() {
    const {onOk, color} = this.props;
    const styles = reactCSS({
      'default': {
        color: {
          width: '56px',
          height: '18px',
          borderRadius: '2px',
          background: (color ? color : this.state.color),
          // background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          // padding: '5px',
          background: '#fff',
          // borderRadius: '1px',
          // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    const handleClick = () => {
      this.setState({displayColorPicker: !this.state.displayColorPicker})
    };

    const handleClose = () => {
      this.setState({displayColorPicker: false})
    };

    const handleChange = (color) => {
      onOk(color);
      // this.setState({color: color.rgb})
    };

    return (
      <div>
        <div style={ styles.swatch } onClick={ handleClick }>
          <div style={ styles.color }/>
        </div>
        { this.state.displayColorPicker ? <div style={ styles.popover }>
            <div style={ styles.cover } onClick={ handleClose }/>
            <SketchPicker color={ this.state.color } onChange={ handleChange }/>
          </div> : null }

      </div>
    )
  }
}

export default SketchExample
