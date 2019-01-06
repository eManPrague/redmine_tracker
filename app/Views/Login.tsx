import React, { Component } from 'react';

import styles from './Login.css';

interface LoginState {
	server: string;
	token: string;
}

// Login component
export default class Login extends Component<{}, LoginState> {
  static versionInfo(): string {
    return `Redmine Tracker ${CONFIG.version}`;
	}

  state = {
    server: '',
    token: ''
  };

  loginBtn = () => {
    this.props.userLogIn(
      this.state.server,
      this.state.token
    );
  }

  handleInput = (event) => {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleKey = (event) => {
    if (event.key === 'Enter') {
      this.loginBtn();
    }
  }

  render() {
    return (
      <div className={styles.login_container}>
        <div className={styles.logo}>
          <div className={styles.image} />
        </div>
        <div className={styles.login_fields}>
          <div className={styles.fields}>
            <div className="input_field">
              <label htmlFor="server">Server</label>
              <input type="text" id="server" value={this.state.server} name="server" onChange={this.handleInput} onKeyPress={this.handleKey} />
            </div>
            <div className="input_field">
              <label htmlFor="token">Token</label>
              <input type="password" id="token" value={this.state.token} name="token" onChange={this.handleInput} onKeyPress={this.handleKey} />
            </div>
            <div className="form_button">
              <div className={styles.versionInfo}>
                {Login.versionInfo()}
              </div>
              <button onClick={this.loginBtn} className="primary wide">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
