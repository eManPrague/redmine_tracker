// @flow
import moment from 'moment';

// Formats
export const DATE_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const DATE_FORMAT = 'DD.MM.YYYY';

/**
 * 
 * Format time to readable form.
 * 
 * @param {number} unix 
 * @returns Formatted time
 */
export const formatDateTime = (unix: number | void): string => {
  if (unix) {
    return moment.unix(unix).format(DATE_TIME_FORMAT);
  }

  return '';
};

/**
 * Parse date time to unix timestamp.
 * 
 * @param {string} dateTime Date time in human readable form.
 * @return {number} Unix timestamp
 */
export const parseDateTime = (dateTime: string | void): number => {
  if (dateTime) {
    return moment(dateTime, DATE_TIME_FORMAT).unix();
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
