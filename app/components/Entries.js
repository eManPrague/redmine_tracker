// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import shortid from 'shortid';

// Others
import { formatDate } from '../utils/Formatters';

// Local components & actions
import EntryRow from './EntryRow';
import TotalRow from './TotalRow';
import * as entryActions from '../actions/entries';

// Types
import type { Entry } from '../types/RedmineTypes';

// Styles
import styles from './Entries.css';

// Actions
import { fetchProjects } from '../actions/projects';

type Props = {
  entries: Immutable.List<Entry>,
  currentEntry: any,
  syncEntry: (index: number) => void,
  deleteEntry: (index: number) => void,
  continueEntry: (entry: any) => void,
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
      currentEntry,
      syncEntry,
      deleteEntry,
      continueEntry,
      projects,
      activities
    } = this.props;

    let index = 0;
    const sortedEntries = entries
      .map((x) => x.set('index', index++))
      .sort((a, b) => b.get('startTime') - a.get('startTime'));

    let entryTable = null;

    if (entries.size === 0) {
      entryTable = (
        <div className={styles.no_data}>
          No data ...
        </div>
      );
    } else {
      const entryData = [];

      let lastDay: string = '';
      let total: number = 0;

      sortedEntries.forEach((entry) => {
        const date = formatDate(entry.get('startTime'));

        if ((lastDay === '') || (lastDay !== date)) {
          if (lastDay !== '') {
            entryData.push(
              <TotalRow date={lastDay} total={total} key={`total_row_${shortid.generate()}`} />
            );
          }

          total = 0;
          lastDay = date;
        }

        total += entry.get('endTime') - entry.get('startTime');

        const row = (
          <EntryRow
            index={entry.get('index')}
            projects={projects}
            activities={activities}
            entry={entry.toJS()}
            currentEntry={currentEntry.toJS()}
            syncEntry={syncEntry}
            deleteEntry={deleteEntry}
            continueEntry={continueEntry}
            key={`entry_${shortid.generate()}`}
          />
        );
        entryData.push(row);
      });

      entryData.push(
        <TotalRow date={lastDay} total={total} key={`total_row_${shortid.generate()}`} />
      );

      entryTable = (
        <div className={styles.entriesContainer}>
          <table className={styles.entryTable}>
            <thead>
              <tr>
                <th className="date">Start time</th>
                <th className="date">End time</th>
                <th className="hours">Hours</th>
                <th className="project">Project</th>
                <th className="issue">Issue</th>
                <th className="activity">Activity</th>
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
  const entries = state.get('entries');

  return {
    entries: entries.get('history'),
    projects: data.get('projects'),
    activities: data.get('activities'),
    currentEntry: entries.get('current')
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
  },
  continueEntry: (entry: any): void => {
    dispatch(entryActions.continueEntry(entry));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Entries);
