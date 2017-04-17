// @flow
import request from 'request';
import Immutable from 'immutable';

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
  async getUser() {
    const response = await this.request('GET', '/users/current.json', {});
    this.constructor.assertResponse(response, [200], 'Invalid credentials!');
    return response.json.get('user');
  }

  /**
   * Fetch all activities.
   * @param {string} projectIdentifier project identifier
   * @returns {Immutable.Map<number, string>} activity map
   */
  async getActivities(projectIdentifier: string): Immutable.Map<number, string> {
    const data = await this.request('GET', `/projects/${projectIdentifier}.json?include=time_entry_activities`);
    this.constructor.assertResponse(data);
    let response = new Immutable.Map();
    data.json.get('project').get('time_entry_activities').forEach((item) => {
      response = response.set(item.get('id'), item.get('name'));
    });

    return response;
  }

  /**
   * Return all issues for project identifier.
   *
   * @param {string} projectIdentifier Project id
   * @returns {Immutable.Map<number, string>} issues
   *
   */
  async getIssues(projectIdentifier: string): Immutable.Map<number, string> {
    const responses = await this.loadFullResource(`/projects/${projectIdentifier}/issues.json`, 'name:asc');

    // Flat array and create full response
    let response: Immutable.Map<number, string> = new Immutable.Map();
    responses.map((val) => val.json.get('issues')).forEach((list) => {
      list.forEach((issue) => {
        const id = parseInt(issue.get('id'), 10);

        response = response.set(
          id,
          `#${id} - ${issue.get('subject')}`
        );
      });
    });

    return response;
  }

  /**
   * Return all projects for user.
   * @return {Immutable.List<Immutable.Map<string, string>>} project map
   */
  async getProjects(): Immutable.List<Immutable.Map<string, string>> {
    const responses = await this.loadFullResource('/projects.json', 'name:asc');

    // Flat array, iterate over and create response.
    const response = [];
    responses.map((val) => val.json.get('projects')).forEach((list) => {
      list.forEach((prj) => {
        response.push({
          value: prj.get('identifier'), label: prj.get('name')
        });
      });
    });

    return Immutable.fromJS(response);
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
    const totalCount = 20; // initialResponse.json.get('total_count');
    const limit = 40;

    // Create promise with limit + offset accoring
    // to total count.
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
  request(method: string, path: string, params: any) {
    // Generate options
    const options = {
      baseUrl: this.server,
      uri: path,
      headers: {
        'X-Redmine-API-Key': this.token
      },
      method
    };

    // Add query string
    if (params && method === 'GET') {
      // $FlowFixMe
      options.qs = params;
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
