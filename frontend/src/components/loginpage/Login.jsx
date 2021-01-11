import React, { Component } from "react";

class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.changeposition = this.changeposition.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.state = {
      email: "",
      password: "",
      acctype: "Recruiter",
      position: 1,
    };
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeType(event) {
    this.setState({ acctype: event.target.value });
  }

  changeposition(event) {
      this.setState({position: 1});
  }

  onSubmit(event) {
      const user = {
          email: this.state.email,
          password: this.state.password,
          type: this.state.type
      }
      this.setState({position: 2});
      console.log(user);
  }

  render() {
    if (this.state.position === 1) {
      return (
        <form onSubmit={this.onSubmit}>
          <h1> Login </h1>
          <p>
            Email:
            <input
              type="text"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </p>
          <p>
            Password:
            <input
              type="text"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </p>
          <p>
            Type:
            <select
              required
              value={this.state.acctype}
              onChange={this.onChangeType}
            >
              <option key="Recruiter" value="Recruiter">
                Recruiter
              </option>
              <option key="Applicant" value="Applicant">
                Applicant
              </option>
            </select>
          </p>
          <button>Submit</button>
        </form>
      );
    }
    else {
        return(
        <div>
          <p>Incorrect email or password!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>);
    }
  }
}

export default Login;
