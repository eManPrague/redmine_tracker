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

    const entries = this.props.entries.map((value) => {
      return (<tr><td>{value.get('item')}</td></tr>);
    });

    return (
      <div>
        <div className={styles.small_caption}>
          {this.props.title} ({itemCount})
        </div>
        <table>
          {entries}
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  entries: state.get('entries').get('history')
});

export default connect(mapStateToProps)(TrackHistory);
