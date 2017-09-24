// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';

// Types
import type { EntryType } from '../types/EntryType';

// Styles
import styles from './TrackHistory.css';

type Props = {
  entries: Immutable.List<EntryType>,
  title: string
};

class TrackHistory extends Component<Props> {
  props: Props;

  render() {
    const itemCount = this.props.entries.size;
    let index = 0;
    const entries = this.props.entries.map((value) => {
      index += 1;

      return (
        <tr key={index}>
          <td>{value.get('project')}</td>
          <td>{value.get('description')}</td>
        </tr>
      );
    });

    return (
      <div>
        <div className={styles.small_caption}>
          {this.props.title} ({itemCount})
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  entries: state.get('entries').get('history')
});

export default connect(mapStateToProps)(TrackHistory);
