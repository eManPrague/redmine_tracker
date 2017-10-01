// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Select from 'react-select';
import moment from 'moment';

// Local components
import UpdateTimer from './UpdateTimer';
import Checkbox from '../inputs/Checkbox';

// Actions
import { fetchProjects } from '../actions/projects';
import { fetchIssues } from '../actions/issues';
import { fetchActivities } from '../actions/activities';

import {
  closeEntry,
  updateEntry
} from '../actions/entries';

// Types
import type { Issue } from '../types/UserType';

// Styles
import styles from './TrackDialog.css';

// Props
type Props = {
  projects: Immutable.List<Immutable.Map<string, string>>,
  loadProjects: () => void,
  issues: Immutable.Map<string, Immutable.List<Issue>>,
  loadIssues: (projectIdentifier: string) => void,
  activities: Immutable.Map<string, Immutable.Map<number, string>>,
  loadActivities: (project: string) => void,
  updateCurrentEntry: (data: any) => void,
  stopCurrentEntry: (data: any, endTime: number, autoSync: boolean) => void,
  currentEntry: Immutable.Map<string, mixed>,
  userId: number
};

// State
type State = {
  filterMine: boolean,
  syncNow: boolean
};

class TrackDialog extends Component<Props, State> {
  // Actually don't know why to use that, but Flow complains
  // to `expect boolean for filterMine, but void given`
  // default state / override constructor is not enough.
  // The same thing is in UpdateTimer for ms property.
  static defaultProps = {
    filterMine: true,
    syncNow: true
  };

  state = {
    filterMine: true,
    syncNow: true
  };

  props: Props;

  componentDidMount() {
    const {
      projects,
      loadProjects
    } = this.props;

    if (projects.size === 0) {
      loadProjects();
    }
  }

  componentWillReceiveProps(newProps: Props) {
    const current = newProps.currentEntry;
    const currentProject = current.get('project');

    // Don't remove this, we can force to refresh data
    // but in that case componentDidMount won't be called.
    if (newProps.projects.size === 0) {
      this.props.loadProjects();
    }

    if (newProps.projects.size > 0 && currentProject.length > 0) {
      if (!newProps.activities.has(currentProject)) {
        this.props.loadActivities(currentProject);
      }

      if (!newProps.issues.has(currentProject)) {
        this.props.loadIssues(currentProject);
      }
    }
  }

  projectChange = (project: ?{ value: string, label: string }) => {
    if (project) {
      this.props.updateCurrentEntry({
        project: project.value
      });
    } else {
      // Project was removed
      this.props.updateCurrentEntry({
        project: '',
        issue: 0,
        activity: 0
      });
    }
  }

  issueChange = (issue: ?{ value: number, label: string }) => {
    this.props.updateCurrentEntry({
      issue: issue ? issue.value : 0
    });
  };

  activityChange = (activity: ?{ value: number, label: string }) => {
    this.props.updateCurrentEntry({
      activity: activity ? activity.value : 0
    });
  }

  assignedToChange = (value: boolean) => {
    this.setState({
      filterMine: value
    });
  }

  syncNowChange = (value: boolean) => {
    this.setState({
      syncNow: value
    });
    this.activityChange.bind(this);
  }

  descriptionChange = (evt: SyntheticInputEvent<>) => {
    this.props.updateCurrentEntry({
      description: evt.target.value
    });
  }

  trackingInProgress = (): boolean => this.props.currentEntry && this.props.currentEntry.get('startTime') > 0

  handleTracking = () => {
    const currentTime = moment().unix();

    // If state startTime is null
    if (this.trackingInProgress()) {
      this.props.stopCurrentEntry(this.props.currentEntry, currentTime, true);
    } else {
      this.props.updateCurrentEntry({
        startTime: currentTime
      });
    }
  }

  render() {
    const projects: Array<{value: string, label: string}> = this.props.projects.toJSON();
    const issues: Array<{value: number, label: string}> = [];
    const activities: Array<{value: number, label: string}> = [];

    const filterMine = this.state.filterMine;
    const userId = this.props.userId;

    const {
      project,
      issue,
      activity,
      description,
      startTime
    } = this.props.currentEntry.toJS();

    const btnEnabled = (
      project.length > 0 &&
      issue > 0 &&
      activity > 0 &&
      description.length > 0
    );

    const tracking = startTime > 0;

    if (this.props.issues.has(project)) {
      // Transform issues into usable object for select
      this.props.issues.get(project).forEach(item => {
        if ((filterMine === false) || (item.get('userId') === userId)) {
          issues.push({ label: item.get('subject'), value: item.get('id') });
        }
      });
    }

    if (this.props.activities.has(project)) {
      // Transform issues into usable object for select
      this.props.activities.get(project).forEach((label, value) => {
        activities.push({ label, value: parseInt(value, 10) });
      });
    }

    // Button actions
    const buttonText = tracking ? 'STOP' : 'START';
    const buttonClass = tracking ? 'error' : 'primary';

    // Time
    let timeText = 'Not tracking...';
    if (tracking) {
      timeText = (
        <UpdateTimer startTime={moment.unix(startTime)} />
      );
    }

    return (
      <div>
        <Select
          name="project"
          className={styles.detail_select}
          value={project}
          options={projects}
          onChange={this.projectChange}
          placeholder="Select project"
        />

        <Select
          name="issue"
          className={styles.detail_select}
          value={issue}
          options={issues}
          onChange={this.issueChange}
          placeholder="Select issue"
        />

        <Select
          name="activity"
          className={styles.detail_select}
          value={activity}
          options={activities}
          onChange={this.activityChange}
          placeholder="Select activity"
        />

        <div className="input_field">
          <textarea name="description" placeholder="Description" defaultValue={description} maxLength="255" onChange={this.descriptionChange} />
        </div>

        <Checkbox label="Filter assigned to me" value={this.state.filterMine} id="assigned_to_id" onChange={this.assignedToChange} />

        <Checkbox label="Sync immediately" value={this.state.syncNow} id="sync_now" onChange={this.syncNowChange} />

        <div className={styles.tracking}>
          <div className={styles.tracking_time}>
            {timeText}
          </div>
          <button className={buttonClass} disabled={!btnEnabled} onClick={this.handleTracking}>
            {buttonText}
          </button>
          <button className={'default'} disabled={btnEnabled}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.get('data');
  const entries = state.get('entries');
  let userId = 0;
  let user = state.get('user');

  /* eslint-disable no-cond-assign */
  if (user && (user = user.get('user'))) {
    userId = user.get('id');
  }
  /* eslint-enable no-cond-assign */

  return {
    projects: data.get('projects'),
    issues: data.get('issues'),
    activities: data.get('activities'),
    currentEntry: entries.get('current'),
    userId
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  loadProjects: (): void => {
    dispatch(fetchProjects());
  },
  loadIssues: (projectIdentifier: string): void => {
    dispatch(fetchIssues(projectIdentifier));
  },
  loadActivities: (projectIdentifier: string): void => {
    dispatch(fetchActivities(projectIdentifier));
  },
  updateCurrentEntry: (data: any): void => {
    dispatch(updateEntry(data));
  },
  stopCurrentEntry: (data: any, endTime: number, autoSync: boolean): void => {
    dispatch(closeEntry(data, endTime, autoSync));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackDialog);
