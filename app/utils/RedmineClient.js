// @flow
import request from 'request';
import Immutable from 'immutable';
import moment from 'moment';

// Types
import type { User, Issue, Entry } from '../types/UserType';

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
    const response = await this.request('GET', '/users/current.json', {});
    this.constructor.assertResponse(response, [200], 'Invalid credentials!');
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
  async getActivities(projectIdentifier: string): { [string]: string } {
    const data = await this.request('GET', `/projects/${projectIdentifier}.json?include=time_entry_activities`);
    this.constructor.assertResponse(data);
    const response = {};

    data.json.get('project').get('time_entry_activities').forEach((item) => {
      response[item.get('id')] = item.get('name');
    });

    return response;
  }

  /**
   * Return all issues for project identifier.
   *
   * @param {string} projectIdentifier Project id
   * @returns {Object{ [string]: string }} issues
   *
   */
  async getIssues(projectIdentifier: string): Promise<Array<Issue>> {
    const responses = await this.loadFullResource(`/projects/${projectIdentifier}/issues.json`, 'name:asc');

    // Flat array and create full response
    const response: Array<Issue> = [];

    responses.map((val) => val.json.get('issues')).forEach((list) => {
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

    return Promise.resolve(response);
  }

  /**
   * Return all projects for user.
   * @return {Object<string, string>} project map
   */
  async getProjects(): Promise<Array<{ value: string, label: string }>> {
    // Flat array, iterate over and create response.
    const response: Array<{ value: string, label: string }> = [];

    let resources = await this.loadFullResource('/projects.json', 'name:asc');
    resources = resources.map((val) => val.json.get('projects'));
    resources.forEach((list) => {
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
    // Convert entry to hours
    const hours = ((entry.endTime - entry.startTime) / 60) / 60;

    // Convert to time entry field
    const timeEntry = {
      // time_from: entry.startTime,
      // time_to: entry.endTime,
      hours,
      spent_on: moment.unix(entry.endTime).format('YYYY-MM-DD'),
      comments: entry.description,
      activity_id: entry.activity
    };

    const response = await this.request('POST', `/issues/${entry.issueId}/time_entries?format=json`, { time_entry: timeEntry });
    this.constructor.assertResponse(response, [201], 'Invalid data!');
    const data = response.json.get('time_entry');

    return Promise.resolve(parseInt(data.get('id'), 10));
  }

  /**
   * Test if response fits.
   *
   * @param {{ json: any, status: integer }} response response object
   * @param {array<integer>} [acceptableStates=[ 200, 201 ]] default acceptable states
   * @param {string} defaultError string
   */
  static assertResponse(response: { json: any, status: number }, acceptableStates: Array<number> = [200, 201], defaultError: string = 'Invalid response!') {
    if (acceptableStates.indexOf(response.status) < 0) {
      throw new Error(defaultError);
    }
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
    const initialResponse = await this.request('GET', url, { limit: 1, status_id: 'open' });
    this.constructor.assertResponse(initialResponse);

    // Get total count
    const totalCount = initialResponse.json.get('total_count');
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

    // $FlowFixMe
    return Promise.all(promises);
  }

  /**
   * Call request with proper method, path and params.
   *
   * @param {String} method URL method
   * @param {String} path URL
   * @param {Object} params options
   * @return {Promise} Promise with response.
   */
  request(method: string, path: string, params: any): Promise<{json: any, status: number}> {
    // Generate options
    const options = {
      baseUrl: this.server,
      uri: path,
      headers: {
        'X-Redmine-API-Key': this.token,
        'Content-Type': 'application/json'
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

    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        // Parse body
        let parsedBody = null;

        // error?
        let error = err;

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
        }

        if (error) {
          console.log('[Redmine] Error: ');
          console.log(error);
          reject(error);
        } else {
          // Response
          console.log('[Redmine] Response OK');
          console.log(parsedBody);

          // Parse body & create immutable
          parsedBody = Immutable.fromJS(parsedBody);

          // Prepare resolve object
          resolve({
            json: parsedBody,
            status: res.statusCode
          });
        }
      });
    });
  }
}

/* Create instance */
const instance = new RedmineClient();
export default instance;
