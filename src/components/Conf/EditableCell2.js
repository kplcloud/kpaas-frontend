/**
 * Created by huyunting on 2018/5/23.
 */
import React, {PropTypes} from 'react'
// import {Table,Form,  Input, Icon, Button, Popconfirm} from 'antd';

import {Table, Input, InputNumber, Popconfirm, Form} from 'antd';

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell2 extends React.Component {

  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber size="small"/>;
    }
    return <Input size="small"/>;
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                  <FormItem>
                    {getFieldDecorator(dataIndex, {
                      rules: [
                        {
                          required: true,
                          message: `Please Input ${title}!`,
                        },
                      ],
                      initialValue: record[dataIndex],
                    })(this.getInput())}
                  </FormItem>
                ) : (
                  restProps.children
                )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }


}

EditableCell2.propTypes = {};

export default Form.create()(EditableCell2)
