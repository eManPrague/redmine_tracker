// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import Select from 'react-select';
import { ipcRenderer as ipc } from 'electron';
import MaskedInput from 'react-text-mask';

// Actions
import { fetchProjects } from '../actions/projects';
import { fetchIssues } from '../actions/issues';
import { fetchActivities } from '../actions/activities';
import { updateEntry } from '../actions/entries';

// import {
//  electronAlert
// } from '../utils/ElectronHelper';

import {
  CLOSE_EDIT_ENTRY
} from '../constants/dialogs';

import { formatDateTime, parseDateTime } from '../utils/Formatters';

// Types
import type { Issue, Entry } from '../types/RedmineTypes';

// Styles
import styles from './EditDialog.css';

// Props
type Props = {
  projects: Immutable.List<Immutable.Map<string, string>>,
  loadProjects: () => void,
  issues: Immutable.Map<string, Immutable.List<Issue>>,
  loadIssues: (projectIdentifier: string) => void,
  activities: Immutable.Map<string, Immutable.Map<number, string>>,
  loadActivities: (project: string) => void,
  updateEntry: (index: number, entry: Entry) => void,
  entryIndex: number,
  currentEntry: Entry
};

class EditDialog extends Component<Props, Entry> {
  static defaultProps = {
    project: '',
    projectName: '',
    activity: 0,
    activityName: '',
    issue: 0,
    issueName: '',
    description: '',
    startTime: 0,
    endTime: 0
  };

  props: Props;

  /**
   * Creates an instance of EditDialog.
   *
   * @param {any} props React props
   *
   */
  constructor(props) {
    super(props);
    this.state = props.currentEntry;
  }

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
    this.updateData(newProps, this.state.project);
  }

  componentWillUpdate(nextProps: Props, nextState: Entry) {
    this.updateData(nextProps, nextState.project);
  }

  updateData(nextProps: Props, project: string) {
    // Don't remove this, we can force to refresh data
    // but in that case componentDidMount won't be called.
    if (nextProps.projects.size === 0) {
      this.props.loadProjects();
    }

    if (nextProps.projects.size > 0 && project.length > 0) {
      if (!nextProps.activities.has(project)) {
        this.props.loadActivities(project);
      }

      if (!nextProps.issues.has(project)) {
        this.props.loadIssues(project);
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

    this.setState(data);
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

    this.setState(data);
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

    this.setState(data);
  }

  descriptionChange = (evt: SyntheticInputEvent<>) => {
    this.setState({
      description: evt.target.value
    });
  }

  startTimeChange = (evt: SyntheticInputEvent<>) => {
    this.setState({
      startTime: parseDateTime(evt.target.value)
    });
  }

  endTimeChange = (evt: SyntheticInputEvent<>) => {
    this.setState({
      endTime: parseDateTime(evt.target.value)
    });
  }

  handleSave = () => {
    // TODO: Validate data
    this.props.updateEntry(
      this.props.entryIndex,
      this.state
    );
    this.closeWindow();
  }

  /**
   * Cancel current entry and return back to history window.
   */
  handleCancel = () => {
    this.closeWindow();
  };

  /* eslint-disable class-methods-use-this */
  closeWindow() {
    ipc.send(CLOSE_EDIT_ENTRY);
  }
  /* eslint-enable class-methods-use-this */

  render() {
    const projects: Array<{value: string, label: string}> = this.props.projects.toJSON();
    const issues: Array<{value: number, label: string}> = [];
    const activities: Array<{value: number, label: string}> = [];

    const {
      project,
      issue,
      activity,
      description
    } = this.state;

    if (this.props.issues.has(project)) {
      // Transform issues into usable object for select
      this.props.issues.get(project).forEach(item => {
        issues.push({ label: item.get('subject'), value: item.get('id') });
      });
    }

    if (this.props.activities.has(project)) {
      // Transform issues into usable object for select
      this.props.activities.get(project).forEach((label, value) => {
        activities.push({ label, value: parseInt(value, 10) });
      });
    }

    // Change formatting start & end date
    const startTime = formatDateTime(this.state.startTime);
    const endTime = formatDateTime(this.state.endTime);

    // Date regexp for masked input
    const dateRegexp = [
      /\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/,
      ' ',
      /\d/, /\d/, ':', /\d/, /\d/
    ];

    return (
      <div className={styles.editContainer}>
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

        <div className="input_field">
          <MaskedInput mask={dateRegexp} placeholder="Start time" value={startTime} onChange={this.startTimeChange} />
        </div>

        <div className="input_field">
          <MaskedInput mask={dateRegexp} placeholder="End time" value={endTime} onChange={this.endTimeChange} />
        </div>

        <div className={styles.actions}>
          <button className={'primary'} onClick={this.handleSave}>
            Save
          </button>
          <button className={'default'} onClick={this.handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const data = state.get('data');

  return {
    projects: data.get('projects'),
    issues: data.get('issues'),
    activities: data.get('activities')
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
  updateEntry: (index: number, entry: Entry): void => {
    dispatch(updateEntry(index, entry));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDialog);
