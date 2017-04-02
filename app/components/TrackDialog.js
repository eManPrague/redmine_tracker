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
import { startEntry, stopEntry } from '../actions/entries';

// Styles
import styles from './TrackDialog.css';

class TrackDialog extends Component {
  state: {
    currentProject: string,
    currentIssue: number,
    currentActivity: number,
    currentDescription: string,
    startTime: ?moment
  };

  props: {
    projects: Immutable.List<Immutable.Map<string, string>>,
    loadProjects: () => void,
    issues: Immutable.Map<string, Immutable.Map<number, string>>,
    loadIssues: (projectIdentifier: string) => void,
    activities: Immutable.Map<number, string>,
    loadActivities: () => void,
    startNewEntry: (project: string, issue: number, activity: number,
      description: string, startTime: number) => void,
    stopNewEntry: (endTime: number) => void
    // currentEntry: ?Immutable.Map<string, mixed>
  };

  constructor(props) {
    super(props);

    this.state = {
      currentProject: '',
      currentIssue: 0,
      currentActivity: 0,
      currentDescription: '',
      startTime: null
    };
  }

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

  projectChange = (project: ?{ value: string, label: string }) => {
    if (project) {
      this.setState({
        currentProject: project.value
      });
    } else {
      // Project was removed
      this.setState({
        currentProject: '',
        currentIssue: 0,
        currentActivity: 0
      });
    }
  }

  issueChange = (issue: ?{ value: number, label: string }) => {
    this.setState({
      currentIssue: issue ? issue.value : 0
    });
  };

  activityChange = (activity: ?{ value: number, label: string }) => {
    this.setState({
      currentActivity: activity ? activity.value : 0
    });
  }

  descriptionChange = (evt: any) => {
    this.setState({
      currentDescription: evt.target.value
    });
  }

  handleTracking = () => {
    // If state startTime is null
    if (this.state.startTime) {
      // Stop tracking
      this.setState({
        startTime: null
      });

      this.props.stopNewEntry(
        moment().unix()
      );
    } else {
      // Start tracking
      const startTime = moment();

      this.setState({
        startTime
      });

      this.props.startNewEntry(
        this.state.currentProject,
        this.state.currentIssue,
        this.state.currentActivity,
        this.state.currentDescription,
        startTime.unix()
      );
    }
  }

  render() {
    const projects: Array<{value: string, label: string}> = this.props.projects.toJSON();
    const issues: Array<{value: number, label: string}> = [];
    const activities: Array<{value: string, label: string}> = [];

    const {
      currentProject,
      currentIssue,
      currentActivity,
      currentDescription,
      startTime
    } = this.state;

    const btnEnabled = (
      currentProject.length > 0 &&
      currentIssue > 0 &&
      currentActivity > 0 &&
      currentDescription.length > 0
    );

    const tracking = startTime != null;

    if (currentProject.length > 0 && !this.props.issues.has(currentProject)) {
      this.props.loadIssues(currentProject);
    } else if (this.props.issues.has(currentProject)) {
      // Transform issues into usable object for select
      this.props.issues.get(currentProject).forEach((label, value) => {
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
          value={currentProject}
          options={projects}
          onChange={this.projectChange}
          placeholder="Select project"
        />

        <Select
          name="issue"
          className={styles.detail_select}
          value={currentIssue}
          options={issues}
          onChange={this.issueChange}
          placeholder="Select issue"
        />

        <Select
          name="activity"
          className={styles.detail_select}
          value={currentActivity}
          options={activities}
          onChange={this.activityChange}
          placeholder="Select activity"
        />

        <div className="input_field">
          <textarea name="description" placeholder="Description" value={currentDescription} onChange={this.descriptionChange} />
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
  // const entries = state.get('entries');

  return {
    projects: data.get('projects'),
    issues: data.get('issues'),
    activities: data.get('activities')
    // currentEntry: entries.get('current')
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
  startNewEntry: (project: string, issue: number, activity: number,
    description: string, startTime: number) => {
    dispatch(startEntry(project, issue, description, activity, startTime));
  },
  stopNewEntry: (endTime: number) => {
    dispatch(stopEntry(endTime));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackDialog);
