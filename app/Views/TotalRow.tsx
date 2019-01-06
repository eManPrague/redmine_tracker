// @flow
import React, { Component } from 'react';
import moment from 'moment';

// Local imports
import { formatDiff } from '../utils/Formatters';

// Styles
import styles from './TotalRow.css';

type Props = {
  date: string,
  total: number
};

class TotalRow extends Component<Props> {
  static defaultProps = {
    date: '',
    total: 0
  };

  props: Props;

  /**
   * Render row.
   * @returns
   */
  render() {
    const { date, total } = this.props;

    return (
      <tr className={styles.totalRow}>
        <td>
          Day summary
        </td>
        <td>
          {date}
        </td>
        <td>
          {formatDiff(total)}
        </td>
        <td />
        <td />
        <td />
        <td />
      </tr>
    );
  }
}

export default TotalRow;