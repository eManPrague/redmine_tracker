// @flow
import React, { Component } from 'react';
import moment from 'moment';

export default class UpdateTimer extends Component {
  state: {
    seconds: number
  };

  props: {
    startTime: moment
  };

  // Set interval result
  interval: any;

  constructor(props: any) {
    super(props);

    this.state = {
      seconds: 0
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick = () => {
    this.setState({
      seconds: moment().diff(this.props.startTime)
    });
  }

  render() {
    return (
      <div>
        {moment.utc(this.state.seconds).format('HH:mm:ss')}
      </div>
    );
  }
}
