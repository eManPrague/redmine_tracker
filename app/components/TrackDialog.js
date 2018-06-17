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
  electronAlert
} from '../utils/ElectronHelper';

import {
  closeEntry,
  updateCurrentEntry,
  resetCurrentEntry
} from '../actions/entries';

// Types
import type { Issue } from '../types/RedmineTypes';

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
  resetCurrentEntry: () => void,
  currentEntry: Immutable.Map<string, mixed>,
  userId: number
};

// State
type State = {
  filterMine: boolean,
  syncNow: boolean,
  descriptionText: string
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
    syncNow: true,
    descriptionText: ''
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

    // After click on "continue entry", we want to fill
    // textarea also!
    if (newProps.currentEntry) {
      const desc = newProps.currentEntry.get('description');
      if (desc && desc !== this.state.descriptionText) {
        this.setState({
          descriptionText: desc
        });
      }
    }
  }

  description: ?HTMLTextAreaElement;

  projectChange = (project: ?{ value: string, label: string }) => {
    let data;

    if (project) {
      data = {
        project: project.value,
        projectName: project.label
      };
    } else {
      // Project was removed
      data = {
        project: '',
        projectName: '',
        issue: 0,
        activity: 0
      };
    }

    this.props.updateCurrentEntry(
      data
    );
  }

  issueChange = (issue: ?{ value: number, label: string }) => {
    let data = {};

    if (issue) {
      data = {
        issue: issue.value,
        issueName: issue.label
      };
    } else {
      data = {
        issue: 0,
        issueName: ''
      };
    }

    this.props.updateCurrentEntry(data);
  };

  activityChange = (activity: ?{ value: number, label: string }) => {
    let data = {};

    if (activity) {
      data = {
        activity: activity.value,
        activityName: activity.label
      };
    } else {
      data = {
        activity: 0,
        activityName: ''
      };
    }

    this.props.updateCurrentEntry(data);
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
  }

  descriptionChange = (evt: SyntheticInputEvent<>) => {
    this.props.updateCurrentEntry({
      description: evt.target.value
    });
  }

  trackingInProgress = (): boolean => this.props.currentEntry && this.props.currentEntry.get('startTime') > 0

  handleTracking = () => {
    const currentTime = moment().unix();

    const {
      project,
      issue,
      activity,
      description
    } = this.props.currentEntry.toJS();

    // If state startTime is null
    if (this.trackingInProgress()) {
      if (project.length > 0 && issue > 0 && activity > 0 && description.length > 0) {
        this.props.stopCurrentEntry(this.props.currentEntry, currentTime, this.state.syncNow);
        this.resetDescription();
      } else {
        electronAlert('Please fill all fields (project, activity, issue, description)!');
      }
    } else {
      this.props.updateCurrentEntry({
        startTime: currentTime
      });
    }
  }

  /**
   * Cancel button.
   */
  resetCurrentEntry = () => {
    this.props.resetCurrentEntry();
    this.resetDescription();
  }

  resetDescription(): void {
    console.log('RESET DESCRIPTION');
    this.setState({
      descriptionText: ''
    });
  }

  handleEnter = (event) => {
    if (event.key === 'Enter') {
      this.handleTracking();
      return false;
    }

    return true;
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
          <textarea
            name="description"
            placeholder="Description"
            value={this.state.descriptionText}
            maxLength="255"
            onChange={this.descriptionChange}
            onKeyPress={this.handleEnter}
          />
        </div>

        <Checkbox label="Filter assigned to me" value={this.state.filterMine} id="assigned_to_id" onChange={this.assignedToChange} />

        <Checkbox label="Synchronize immediately" value={this.state.syncNow} id="sync_now" onChange={this.syncNowChange} />

        <div className={styles.tracking}>
          <div className={styles.tracking_time}>
            {timeText}
          </div>
          <button className={buttonClass} onClick={this.handleTracking}>
            {buttonText}
          </button>
          <button className={'default'} onClick={this.resetCurrentEntry}>
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
    dispatch(updateCurrentEntry(data));
  },
  stopCurrentEntry: (data: any, endTime: number, autoSync: boolean): void => {
    dispatch(closeEntry(data, endTime, autoSync));
  },

  resetCurrentEntry: (): void => {
    dispatch(resetCurrentEntry());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackDialog);
