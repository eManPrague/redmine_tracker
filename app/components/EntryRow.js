// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { remote } from 'electron';

// Types
import type { Entry } from '../types/RedmineTypes';

// Styles
import styles from './EntryRow.css';

type Props = {
  entry: Entry,
  index: number,
  syncEntry: (index: number) => void,
  deleteEntry: (index: number) => void,
  continueEntry: (entry: any) => void,
  currentEntry: any
};

type State = {
  focused: boolean
};

// Menu items
const { Menu, MenuItem } = remote;

class EntryRow extends Component<Props, State> {
  /**
   * 
   * Format time to readable form.
   * 
   * @static
   * @param {number} unix 
   * @returns Formatted time
   */
  static formatTime(unix: number | void): string {
    if (unix) {
      return moment.unix(unix).format('D.MM.YYYY HH:mm');
    }

    return '';
  }

  /**
   * Format miliseconds diff to readable form.
   * 
   * @param {number} unix 
   * @returns String Formatted diff
   */
  static formatDiff(unix: number): string {
    let hours = Math.floor(unix / 3600);
    let minutes = Math.floor((unix - (hours * 3600)) / 60);

    if (hours < 10) {
      hours = `0${hours}`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }

  static defaultProps = {
    focused: false
  };

  state = {
    focused: false
  };

  props: Props;

  componentDidMount() {
    if (this.row) {
      this.row.addEventListener('contextmenu', this.openContextMenu, false);
    }
    this.mounted = true;
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    if (this.row) {
      this.row.removeEventListener('contextmenu', this.openContextMenu, false);
    }

    this.mounted = false;
  }

  row: ?HTMLTableRowElement;

  /**
   * Test if component is mounted!
   */
  mounted: ?boolean;

  /**
   * Open context menu for table row.
   * 
   * @param {any} e 
   */
  /* eslint-disable class-methods-use-this */
  openContextMenu = (e: any) => {
    this.setState({
      focused: true
    });

    const menu = new Menu();

    if (!(this.props.currentEntry.startTime && this.props.entry.startTime > 0)) {
      menu.append(new MenuItem({
        label: 'Continue',
        click: this.startAgain
      }));
    }

    if (!this.props.entry.id) {
      menu.append(new MenuItem({
        label: 'Synchronize entry',
        click: this.synchronizeEntry
      }));

      menu.append(new MenuItem({
        label: 'Edit entry',
        click: this.editEntry
      }));
    }

    menu.append(new MenuItem({
      label: 'Delete entry here',
      click: this.deleteEntry
    }));

    e.preventDefault();
    menu.popup(remote.getCurrentWindow(), { async: true });

    // Menu.pop is async & blocking, it means we can easily hide focused event.
    setTimeout(() => {
      if (this.mounted === true) {
        this.setState({ focused: false });
      }
    }, 1500);
  }
  /* eslint-enable class-methods-use-this */

  /**
   * Start again with entry now.
   */
  startAgain = () => {
    const {
      entry,
      continueEntry
    } = this.props;

    // Prepare entry
    const newEntry = {
      ...entry,
      startTime: moment().unix(),
    };

    // Reset object persistent settings
    delete newEntry.id;
    newEntry.endTime = 0;

    // Change currently in progress issue
    continueEntry(newEntry);
  }

  /**
   * Open edit window.
   */
  editEntry = () => {

  }

  /**
   * Synchronize not synchronized entries.
   */
  synchronizeEntry = () => {
    this.props.syncEntry(this.props.index);
  }

  /**
   * Delete entry from history.
   */
  deleteEntry = () => {
    this.props.deleteEntry(this.props.index);
  }

  /**
   * Set row reference.
   */
  setRow = (row: ?HTMLTableRowElement) => {
    this.row = row;
  }

  /**
   * Render row.
   * @returns 
   */
  render() {
    const entry = this.props.entry;

    let rowStyle = null;

    if (!entry.id) {
      rowStyle = styles.notSyncedRow;
    }

    if (this.state.focused) {
      rowStyle = styles.clicked;
    }

    return (
      <tr ref={this.setRow} className={rowStyle}>
        <td className="date">
          {EntryRow.formatTime(entry.startTime)}
        </td>
        <td className="date">
          {EntryRow.formatTime(entry.endTime)}
        </td>
        <td className="hours">
          {EntryRow.formatDiff(entry.endTime - entry.startTime)}
        </td>
        <td className="project">
          {entry.projectName}
        </td>
        <td title={entry.issueName} className="issue">
          #{entry.issue}
        </td>
        <td title={entry.activityName} className="activity">
          {entry.activityName}
        </td>
        <td title={entry.description}>
          {entry.description}
        </td>
      </tr>
    );
  }
}

export default EntryRow;
