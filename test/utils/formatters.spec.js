/* eslint-disable no-unused-expressions */
import * as formatters from '../../app/utils/Formatters';

describe('DateTime formatter', () => {
  it('return empty string', () => {
    expect(formatters.formatDateTime()).toEqual('');
  });

  it('return formatted string', () => {
    expect(formatters.formatDateTime(1080665289)).toEqual('30.03.2004 18:48');
  });
});

describe('Date formatter', () => {
  it('return empty string', () => {
    expect(formatters.formatDate()).toEqual('');
  });

  it('return formatted string', () => {
    expect(formatters.formatDate(1080665289)).toEqual('30.03.2004');
  });
});

describe('Diff formatter', () => {
  it('return 00:00 string', () => {
    expect(formatters.formatDiff()).toEqual('00:00');
  });

  it('return formatted string', () => {
    expect(formatters.formatDiff(12030)).toEqual('03:20');
  });
});
