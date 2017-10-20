// @flow
import moment from 'moment';

/**
 * 
 * Format time to readable form.
 * 
 * @param {number} unix 
 * @returns Formatted time
 */
export const formatDateTime = (unix: number | void): string => {
  if (unix) {
    return moment.unix(unix).format('DD.MM.YYYY HH:mm');
  }

  return '';
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
