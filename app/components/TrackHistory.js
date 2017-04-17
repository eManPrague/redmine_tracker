// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

// Types
import type { EntryType } from '../types/EntryType';

// Styles
import styles from './TrackHistory.css';

class TrackHistory extends Component {
  props: {
    entries: Immutable.List<EntryType>,
    title: string
  };

  render() {
    const itemCount = this.props.entries.size;

    return (
      <div>
        <div className={styles.small_caption}>
          {this.props.title} ({itemCount})
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  entries: state.get('entries').get('history')
});

export default connect(mapStateToProps)(TrackHistory);