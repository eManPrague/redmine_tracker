// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

// JS imports
import { userLogIn } from '../actions/user';

// Styles
import styles from './Login.css';

// Login component
class Login extends Component {
  state: {
    server: string,
    token: string
  };

  props: {
    userLogIn: () => void
  };

  constructor(props) {
    super(props);

    this.state = {
      server: '',
      token: ''
    };
  }

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
              <input type="text" id="token" value={this.state.token} name="token" onChange={this.handleInput} />
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

const mapDispatchToProps = (dispatch: Dispatch) => ({
  userLogIn: (server, token) => {
    dispatch(userLogIn(server, token));
  }
});

export default connect(undefined, mapDispatchToProps)(Login);
