// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import shortid from 'shortid';

// Local components & actions
import EntryRow from './EntryRow';
import * as entryActions from '../actions/entries';

// Types
import type { Entry } from '../types/RedmineTypes';

// Styles
import styles from './Entries.css';

// Actions
import { fetchProjects } from '../actions/projects';

type Props = {
  entries: Immutable.List<Entry>,
  syncEntry: (index: number) => void,
  deleteEntry: (index: number) => void,
  projects: Immutable.List<Immutable.Map<string, string>>,
  activities: Immutable.Map<string, Immutable.Map<number, string>>,
  loadProjects: () => void
};

class Entries extends Component<Props> {
  props: Props;

  componentWillReceiveProps(newProps: Props) {
    if (newProps.projects.size === 0) {
      this.props.loadProjects();
    }
  }

  render() {
    const {
      entries,
      syncEntry,
      deleteEntry,
      projects,
      activities
    } = this.props;

    let entryTable = null;

    if (entries.size === 0) {
      entryTable = (
        <div className={styles.no_data}>
          No data ...
        </div>
      );
    } else {
      const entryData = entries.map((entry, index) => (
        <EntryRow
          index={index}
          projects={projects}
          activities={activities}
          entry={entry.toJS()}
          syncEntry={syncEntry}
          deleteEntry={deleteEntry}
          key={`entry_${shortid.generate()}`}
        />
      ));

      entryTable = (
        <div className={styles.entriesContainer}>
          <table className={styles.entryTable}>
            <thead>
              <tr>
                <th>Start time</th>
                <th>End time</th>
                <th>Project</th>
                <th>Issue</th>
                <th>Activity</th>
                <th>Description</th>
              </tr>
            </thead>
          </table>
          <div className={styles.tableContainer}>
            <table className={styles.entryTableItems}>
              <tbody>
                {entryData}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.bodyContainer}>
        <div className={styles.header}>
          <div className={styles.entries_title}>
            Entries
          </div>
        </div>
        {entryTable}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.get('data');

  return {
    entries: state.get('entries').get('history'),
    projects: data.get('projects'),
    activities: data.get('activities')
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  syncEntry: (index: number): void => {
    dispatch(entryActions.syncEntry(index));
  },
  deleteEntry: (index: number): void => {
    dispatch(entryActions.deleteEntry(index));
  },
  loadProjects: (): void => {
    dispatch(fetchProjects());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Entries);
