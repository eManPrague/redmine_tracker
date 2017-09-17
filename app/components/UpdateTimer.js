// @flow
import React, { Component } from 'react';
import moment from 'moment';

type Props = {
  startTime: moment
};

export default class UpdateTimer extends Component {
  state: {
    ms: number
  };

  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      ms: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Set interval result
  interval: number;

  tick = () => {
    this.setState({
      ms: moment().diff(this.props.startTime)
    });
  }

  formatDiff(): string {
    const ms = this.state.ms;
    const d = moment.duration(ms);
    return Math.floor(d.asHours()) + moment.utc(ms).format(':mm:ss');
  }

  render() {
    return (
      <div>
        {this.formatDiff()}
      </div>
    );
  }
}
