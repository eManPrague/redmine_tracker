// @flow
import React, { Component, Node } from 'react';

import styles from './ProjectOption.css';

type OptionProps = {
  children?: typeof Node,
  className: string,
  isDisabled?: boolean,
  isFocused: boolean,
  isSelected: boolean,
  onFocus: () => void,
  onSelect: () => void,
  option: any
};

export default class ProjectOption extends Component<OptionProps> {
  static defaultProps = {
    isDisabled: false,
    children: null
  };

  handleMouseDown = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSelect(this.props.option, event);
  }

  handleMouseEnter = (event: any) => {
    this.props.onFocus(this.props.option, event);
  }

  handleMouseMove = (event: any) => {
    if (this.props.isFocused) return;
    this.props.onFocus(this.props.option, event);
  }

  render() {
    let image = null;
    if (this.props.option.favorite) {
      image = (<div className={styles.favorite_icon}>&nbsp;</div>);
    }

    return (
      <div
        role="button"
        className={this.props.className}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        title={this.props.option.title}
        >
        {image}
        {this.props.children}
      </div>
    );
  }
}