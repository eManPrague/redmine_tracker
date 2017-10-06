// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { shell } from 'electron';

// Types
import type { Entry } from '../types/RedmineTypes';

// Styles
import styles from './TrackInfo.css';

type Props = {
  entries: Immutable.List<Entry>
};

class TrackInfo extends Component<Props> {
  props: Props;

  openIssue = () => {
    /* eslint-disable flowtype-errors/show-errors */ 
    /* eslint-disable no-undef */ 
    shell.openExternal(CONFIG.bugs.url);
    /* eslint-enable flowtype-errors/show-errors */ 
    /* eslint-enable no-undef */ 
  };

  render() {
    let itemCount = 0;

    this.props.entries.forEach((item) => {
      if (!item.get('id')) {
        itemCount += 1;
      }
    });

    let itemError = null;

    if (itemCount === 0) {
      /* eslint-disable react/no-unescaped-entities */ 
      itemError = (
        <div className={styles.itemError}>
          You don't have <strong>{itemCount}</strong> synchronized entries!
        </div>
      );
      /* eslint-enable react/no-unescaped-entities */ 
    } else {
      /* eslint-disable flowtype-errors/show-errors */ 
      /* eslint-disable no-undef */ 
      itemError = (
        <div className={styles.itemInfo}>
          Redmine Tracker {CONFIG.version}, <span role="presentation" className={styles.openIssue} onClick={this.openIssue}>Open Issue</span>
        </div>
      );
      /* eslint-enable flowtype-errors/show-error */ 
      /* eslint-enable no-undef */ 
    }

    return (
      <div>
        {itemError}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  entries: state.get('entries').get('history')
});

export default connect(mapStateToProps)(TrackInfo);
