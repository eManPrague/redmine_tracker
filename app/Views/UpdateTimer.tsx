// @flow
import React, { Component } from 'react';
import moment from 'moment';

type Props = {
  startTime: moment
};

type State = {
  ms: number
};

export default class UpdateTimer extends Component<Props, State> {
  // Read explanation in TrackDialog class.
  static defaultProps = {
    ms: 0
  };

  state = {
    ms: 0
  };

  props: Props;

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
