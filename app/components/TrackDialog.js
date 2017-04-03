// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Select from 'react-select';
import moment from 'moment';

// Local components
import UpdateTimer from './UpdateTimer';

// Actions
import { fetchProjects } from '../actions/projects';
import { fetchIssues } from '../actions/issues';
import { fetchActivities } from '../actions/activities';

import {
  startEntry,
  closeEntry,
  updateEntry
} from '../actions/entries';

// Styles
import styles from './TrackDialog.css';

class TrackDialog extends Component {
  props: {
    projects: Immutable.List<Immutable.Map<string, string>>,
    loadProjects: () => void,
    issues: Immutable.Map<string, Immutable.Map<number, string>>,
    loadIssues: (projectIdentifier: string) => void,
    activities: Immutable.Map<number, string>,
    loadActivities: () => void,
    startCurrentEntry: (project: string, issue: number, activity: number,
      description: string, startTime: number) => void,
    updateCurrentEntry: (data: any) => void,
    stopCurrentEntry: (endTime: number) => void,
    currentEntry: Immutable.Map<string, mixed>
  };

  componentDidMount() {
    const {
      projects,
      loadProjects,
      activities,
      loadActivities
    } = this.props;

    if (activities.size === 0) {
      loadActivities();
    }

    if (projects.size === 0) {
      loadProjects();
    }
  }

  componentWillReceiveProps(newProps: any) {
    const current = newProps.currentEntry;
    const currentProject = current.get('project');

    if (newProps.projects.size > 0 &&
      currentProject.length > 0 &&
      !newProps.issues.has(currentProject)) {
      this.props.loadIssues(currentProject);
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

  descriptionChange = (evt: any) => {
    this.props.updateCurrentEntry({
      description: evt.target.value
    });
  }

  handleTracking = () => {
    // If state startTime is null
    if (this.props.currentEntry && this.props.currentEntry.get('startTime') > 0) {
      this.props.updateCurrentEntry({
        stopTime: 0
      });
    } else {
      // Start tracking
      const startTime = moment();

      this.props.updateCurrentEntry({
        startTime: startTime.unix()
      });
    }
  }

  render() {
    const projects: Array<{value: string, label: string}> = this.props.projects.toJSON();
    const issues: Array<{value: number, label: string}> = [];
    const activities: Array<{value: string, label: string}> = [];

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

    const tracking = startTime != null;

    // if (currentProject.length > 0 && !this.props.issues.has(currentProject)) {
    //   this.props.loadIssues(currentProject);
    if (this.props.issues.has(project)) {
      // Transform issues into usable object for select
      this.props.issues.get(project).forEach((label, value) => {
        issues.push({ label, value });
      });
    }

    if (this.props.activities.size > 0) {
      // Transform issues into usable object for select
      this.props.activities.forEach((label, value) => {
        activities.push({ label, value });
      });
    }

    // Button actions
    const buttonText = tracking ? 'STOP' : 'START';
    const buttonClass = tracking ? 'error' : 'primary';

    // Time
    let timeText = 'Not tracking...';
    if (tracking) {
      timeText = (
        <UpdateTimer startTime={moment(startTime)} />
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
          <textarea name="description" placeholder="Description" value={description} onChange={this.descriptionChange} />
        </div>

        <div className={styles.tracking}>
          <div className={styles.tracking_time}>
            {timeText}
          </div>
          <button className={buttonClass} disabled={!btnEnabled} onClick={this.handleTracking}>
            {buttonText}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.get('data');
  const entries = state.get('entries');

  return {
    projects: data.get('projects'),
    issues: data.get('issues'),
    activities: data.get('activities'),
    currentEntry: entries.get('current')
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  loadProjects: () => {
    dispatch(fetchProjects());
  },
  loadIssues: (projectIdentifier: string) => {
    dispatch(fetchIssues(projectIdentifier));
  },
  loadActivities: () => {
    dispatch(fetchActivities());
  },
  startCurrentEntry: (startTime: number) => {
    dispatch(startEntry(startTime));
  },
  updateCurrentEntry: (data: any) => {
    dispatch(updateEntry(data));
  },
  stopCurrentEntry: (endTime: number, autoSync: boolean) => {
    dispatch(closeEntry(endTime, autoSync));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackDialog);
