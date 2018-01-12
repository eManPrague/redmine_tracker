// @flow
import request from 'request';
import Immutable from 'immutable';
import moment from 'moment';
import log from 'electron-log';

// Types
import type { User } from '../types/UserType';
import type { Issue, Entry } from '../types/RedmineTypes';

log.transports.console.level = 'debug';
log.transports.file.level = 'debug';

/**
 * Redmine Client is singleton class.
 */
class RedmineClient {
  /** Static instance */
  static instance: RedmineClient;

  /** Attributes */
  server: string;
  token: string;

  /**
   * Create Redmine Client instance (return singleton).
   */
  constructor() {
    let inst;

    if (this.instance) {
      inst = this.instance;
    } else {
      // $FlowFixMe
      this.instance = this;
      inst = this;
    }

    return inst;
  }

  /**
   * Set credentials.
   *
   * @param {String} server
   * @param {String} token
   *
   */
  setCredentials(server: string, token: string) {
    this.server = server;
    this.token = token;
  }

  /**
   * Return user object from redmine.
   *
   * @return {Promise} User data
   */
  async getUser(): Promise<User> {
    const { error, response } = await this.request('GET', '/users/current.json', {});

    if (error || this.constructor.invalidResponse(response, [200])) {
      return Promise.reject({
        error: 'Invalid credentials!'
      });
    }

    const data = response.json.get('user');

    return Promise.resolve({
      id: parseInt(data.get('id'), 10),
      firstname: data.get('firstname'),
      lastname: data.get('lastname'),
      mail: data.get('mail'),
      api_key: data.get('api_key')
    });
  }

  /**
   * Fetch all activities.
   * @param {string} projectIdentifier project identifier
   * @returns {Object{ [string]: string }} activity map
   */
  async getActivities(projectIdentifier: string): Promise<{ [string]: string }> {
    const { error, response } = await this.request('GET', `/projects/${projectIdentifier}.json?include=time_entry_activities`);

    if (error || this.constructor.invalidResponse(response)) {
      return Promise.reject({
        error: error || 'Invalid response!'
      });
    }

    const data = {};

    response.json.get('project').get('time_entry_activities').forEach((item) => {
      data[item.get('id')] = item.get('name');
    });

    return Promise.resolve(data);
  }

  /**
   * Return all issues for project identifier.
   *
   * @param {string} projectIdentifier Project id
   * @returns {Object{ [string]: string }} issues
   *
   */
  async getIssues(projectIdentifier: string): Promise<Array<Issue>> {
    const { error, resources } = await this.loadFullResource(`/projects/${projectIdentifier}/issues.json`, 'name:asc');

    if (error) {
      return Promise.reject(error);
    }

    // Flat array and create full response
    const response: Array<Issue> = [];

    if (resources !== undefined) {
      resources
        .map((val) => val.get('issues'))
        .forEach((list) => {
          list.forEach((issue) => {
            const id = issue.get('id');
            let userId = 0;

            if (issue.has('assigned_to')) {
              userId = parseInt(issue.get('assigned_to').get('id'), 10);
            }

            response.push({
              id: parseInt(id, 10),
              subject: `#${id} - ${issue.get('subject')}`,
              userId
            });
          });
        });
    }

    return Promise.resolve(response);
  }

  /**
   * Return all projects for user.
   * @return {Object<string, string>} project map
   */
  async getProjects(): Promise<Array<{ value: string, label: string }>> {
    // Flat array, iterate over and create response.
    const response: Array<{ value: string, label: string }> = [];

    const { error, resources } = await this.loadFullResource('/projects.json', 'name:asc');

    if (error) {
      return Promise.reject(error);
    }

    resources
      .map((val) => val.get('projects'))
      .forEach((list) => {
        list.forEach((prj) => {
          response.push({
            value: prj.get('identifier'), label: prj.get('name')
          });
        });
      });

    // Return response
    return Promise.resolve(response);
  }

  /**
   * Create entry on RM endpoint.
   * @param {Entry} entry
   * @returns {Promise<number>} Entry id
   */
  async createEntry(entry: Entry): Promise<number> {
    log.info('Test creating entry!');
    log.info(entry);
    log.info(JSON.stringify(entry));

    // Convert entry to hours
    let hours = ((entry.endTime - entry.startTime) / 60) / 60;
    hours = Math.round(hours * 100) / 100;

    log.info(`Hours: ${hours}`);

    const timeEntry = {
      time_from_hours: moment.unix(entry.startTime).format('HH:mm'),
      time_to_hours: moment.unix(entry.endTime).format('HH:mm'),
      hours,
      spent_on: moment.unix(entry.endTime).format('YYYY-MM-DD'),
      comments: entry.description,
      activity_id: entry.activity
    };
    log.info(`Final entry: ${JSON.stringify(timeEntry)}`);

    const { error, response } = await this.request('POST', `/issues/${entry.issue}/time_entries?format=json`, { time_entry: timeEntry });

    log.info('Response:');
    log.info(JSON.stringify(error));
    log.info(JSON.stringify(response));

    if (error || this.constructor.invalidResponse(response, [201])) {
      return Promise.reject(error || 'Invalid response!');
    }

    const data = response.json.get('time_entry');
    return Promise.resolve(parseInt(data.get('id'), 10));
  }

  /**
   * Test if response fits.
   *
   * @param {{ json: any, status: integer }} response response object
   * @param {array<integer>} [acceptableStates=[ 200, 201 ]] default acceptable states
   * @param {string} defaultError string
   * @param {boolean} showError
   */
  static invalidResponse(response: { json: any, status: number }, acceptableStates: Array<number> = [200, 201]): boolean { // eslint-disable-line
    return acceptableStates.indexOf(response.status) < 0;
  }

  /**
   * Load full resource from provided endpoint.
   *
   * @param {string} url URL for resource
   * @param {string} sort Sort condition
   * @returns {Promise} Promise all result
   *
   */
  async loadFullResource(url: string, sort: string): Promise<*> {
    const { error, response } = await this.request('GET', url, { limit: 1, status_id: 'open' });

    if (error || this.constructor.invalidResponse(response)) {
      return Promise.resolve({
        error
      });
    }

    // Get total count
    const totalCount = response.json.get('total_count');
    const limit = 40;

    // Create promise with limit + offset according to total.
    const promises: Array<Promise<*>> = [];
    let offset = 0;

    while (offset <= totalCount) {
      promises.push(
        this.request('GET', url, { limit, offset, sort, status_id: 'open' })
      );
      offset += limit;
    }

    return new Promise((resolve, reject) => {
      const promise = Promise.all(promises);

      promise.then((responses) => {
        const responseArray = [];

        responses.forEach((obj) => {
          if (obj.error) {
            return resolve({
              error: obj.error
            });
          }

          responseArray.push(obj.response.json);
        });

        return resolve({
          error: false,
          resources: responseArray
        });
      }).catch(err => reject(err));
    });
  }

  /**
   * Call request with proper method, path and params.
   *
   * @param {String} method URL method
   * @param {String} path URL
   * @param {Object} params options
   * @return {Promise} Promise with response.
   */
  request(method: string, path: string, params: any): Promise<{error: boolean | string, response: { json: any, status: number }}> { // eslint-disable-line
    // Generate options
    const options = {
      baseUrl: this.server,
      uri: path,
      headers: {
        'X-Redmine-API-Key': encodeURI(this.token),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Connection: 'keep-alive'
      },
      method
    };

    // Add query string
    if (params && method === 'GET') {
      // $FlowFixMe
      options.qs = params;
    } else if (params && method === 'POST') {
      // $FlowFixMe
      options.body = JSON.stringify(params);
    }

    // Generate server
    console.log(`[Redmine] [${method}] ${this.server}${path}`);

    return new Promise((resolve) => {
      request(options, (err, res, body) => {
        let parsedBody = null;
        let error = err;

        if (error && Object.prototype.hasOwnProperty.call(error, 'code')) {
          if (error.code === 'ENOTFOUND') {
            error = 'Invalid url address';
          }
        }

        try {
          if (body.trim().length > 0) {
            parsedBody = JSON.parse(body);
          } else {
            parsedBody = body;
          }
        } catch (e) {
          if (!error) {
            error = e;
          }
        }

        if (parsedBody != null && Object.prototype.hasOwnProperty.call(parsedBody, 'errors')) {
          error = parsedBody.errors;
          if (Object.prototype.toString.call(error) === '[object Array]') {
            error = error[0];
          }
        }

        if (error) {
          console.log('[Redmine] Response ERROR');
          console.log(error);
          resolve({
            error
          });
        } else {
          // Response
          console.log('[Redmine] Response OK');

          // Set default empty body as {}
          if (!parsedBody || /^\s*$/.test(parsedBody)) {
            parsedBody = {};
          }

          // Parse body & create immutable
          parsedBody = Immutable.fromJS(parsedBody);

          // Prepare resolve object
          resolve({
            error: false,
            response: {
              json: parsedBody,
              status: res.statusCode
            }
          });
        }
      });
    });
  }
}

/* Create instance */
const instance = new RedmineClient();
export default instance;
