import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

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
      id: "",
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

  changeposition() {
    this.setState({ position: 1 });
  }

  onSubmit(event) {
    event.preventDefault();

    axios
      .get("http://localhost:8080/users/checklogin", {
        headers: {
          email: this.state.email,
          password: this.state.password,
          type: this.state.acctype,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          if (response.data.found === false) {
            this.setState({ position: 2 });
          } else {
            this.setState({ id: response.data.user.collectionid });
            if (this.state.acctype === "Recruiter") {
              this.setState({ position: 3 });
            } else {
              this.setState({ position: 4 });
            }
          }
        }
      });
  }

  render() {
    if (this.state.position === 1) {
      return (
        <form onSubmit={this.onSubmit}>
          <h1> Login </h1>
          <p>
            Email:
            <input
              required
              type="text"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </p>
          <p>
            Password:
            <input
              required
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
    } else if (this.state.position === 2) {
      return (
        <div>
          <p>Incorrect email or password!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>
      );
    } else if (this.state.position === 3) {
      return (
        <Redirect
          push
          to={{
            pathname: "/recruiterpage",
            state: { email: this.state.email, id: this.state.id },
          }}
        />
      );
    } else if (this.state.position === 4) {
      return (
        <Redirect
          push
          to={{
            pathname: "/applicantpage",
            state: { email: this.state.email, id: this.state.id },
          }}
        />
      );
    }
  }
}

export default Login;
