// @flow
import moment from 'moment';

// Formats
export const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const DATE_TIME_INPUT_FORMAT = 'YYYY-MM-DDTHH:mm';
export const DATE_FORMAT = 'DD.MM.YYYY';

/**
 *
 * Format time to readable form.
 *
 * @param {number} unix
 * @param {string} format
 * @returns Formatted time
 */
export const formatDateTime = (unix: number | void, format: string = DATE_TIME_FORMAT): string => {
  if (unix) {
    return moment.unix(unix).format(format);
  }

  return '';
};

/**
 * Parse date time to unix timestamp.
 *
 * @param {string} dateTime Date time in human readable form.
 * @param {string} format
 * @return {number} Unix timestamp
 */
export const parseDateTime = (dateTime: string | void, format: string = DATE_TIME_FORMAT): number => { // eslint-disable-line max-len
  if (dateTime) {
    return moment(dateTime, format).unix();
  }

  return moment().unix();
};

/**
 * Format date to readable form.
 *
 * @param {number} unix
 * @return Formatted date
 */
export const formatDate = (unix: number | void): string => {
  if (unix) {
    return moment.unix(unix).format('DD.MM.YYYY');
  }

  return '';
};

/**
 * Parse date to unix timestamp.
 *
 * @param {string} date Date in human readable form.
 * @return {number} Unix timestamp
 */
export const parseDate = (date: string | void): number => {
  if (date) {
    return moment(date, DATE_FORMAT).unix();
  }

  return moment().unix();
};

/**
 * Format miliseconds diff to readable form.
 *
 * @param {number} unix
 * @returns String Formatted diff
 */
export const formatDiff = (unix: number): string => {
  let hours = 0;
  let minutes = 0;

  if (unix) {
    hours = Math.floor(unix / 3600);
    minutes = Math.floor((unix - (hours * 3600)) / 60);
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
};
