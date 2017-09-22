// @flow
import React, { Component } from 'react';

// Styles
import styles from './Checkbox.css';

// Props
type Props = {
  value: boolean,
  onChange: (newValue: boolean) => void,
  label: string,
  id: string
};

// State
type State ={
  value: boolean
};

export default class Checkbox extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  handleOnChange = () => {
    const newValue: boolean = !this.state.value;

    this.setState({
      value: newValue
    });

    this.props.onChange(newValue);
  }

  render() {
    const { label, id } = this.props;

    return (
      <div>
        <div className={styles.checkbox}>
          <input type="checkbox" value="1" id={id} name="check" checked={this.state.value} onChange={this.handleOnChange} />
          <label htmlFor={id} />
        </div>
        <label htmlFor={id} className={styles.checkboxLabel}>{label}</label>
      </div>
    );
  }
}
