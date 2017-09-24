// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

// JS imports
import { userLogIn } from '../actions/user';

// Styles
import styles from './Login.css';

type Props = {
  userLogIn: (server: string, token: string) => void
};

type State = {
  server: string,
  token: string
};

// Login component
class Login extends Component<Props, State> {
  static defaultProps = {
    server: '',
    token: ''
  };

  state = {
    server: '',
    token: ''
  };

  props: Props;

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
              <input type="text" id="server" value={this.state.server} name="server" onChange={this.handleInput} />
            </div>
            <div className="input_field">
              <label htmlFor="token">Token</label>
              <input type="password" id="token" value={this.state.token} name="token" onChange={this.handleInput} />
            </div>
            <div className="form_button">
              <button onClick={this.loginBtn} className="primary">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  userLogIn: (server, token) => {
    dispatch(userLogIn(server, token));
  }
});

export default connect(undefined, mapDispatchToProps)(Login);
