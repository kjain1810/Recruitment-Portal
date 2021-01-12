import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.changeposition = this.changeposition.bind(this);
    this.onChangeemail = this.onChangeemail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      confirmpasword: "",
      acctype: "Recruiter",
      position: 1,
    };
  }

  changeposition() {
    this.setState({ position: 1 });
  }

  onChangeemail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onChangeConfirmPassword(event) {
    this.setState({ confirmpasword: event.target.value });
  }

  onChangeType(event) {
    this.setState({ acctype: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    if (this.state.password !== this.state.confirmpasword) {
      console.log("Passwords must match!");
      this.setState({ position: 2 });
      return;
    }

    axios
      .get("http://localhost:8080/users/checkuser", {
        headers: {
          email: this.state.email,
          type: this.state.acctype,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.err);
        } else {
          if (response.data.exists === false) {
            if (this.state.acctype === "Recruiter") {
              this.setState({ position: 4 });
            } else {
              this.setState({ position: 5 });
            }
          } else {
            this.setState({ position: 3 });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.position === 1) {
      return (
        <form onSubmit={this.onSubmit}>
          <h1> Sign Up </h1>
          <p>
            Email:
            <input
              required
              type="text"
              value={this.state.email}
              onChange={this.onChangeemail}
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
            Confirm password:
            <input
              required
              type="text"
              value={this.state.confirmpasword}
              onChange={this.onChangeConfirmPassword}
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
          <p>Passwords did not match!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>
      );
    } else if (this.state.position === 3) {
      return (
        <div>
          <p>Email already registered!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>
      );
    } else if (this.state.position === 4) {
      return (
        <Redirect
          push
          to={{
            pathname: "/recruiterregister",
            state: { email: this.state.email, password: this.state.password },
          }}
        />
      );
    } else if (this.state.position === 5) {
      return (
        <Redirect
          push
          to={{
            pathname: "/applicantregister",
            state: { email: this.state.email, password: this.state.password },
          }}
        />
      );
    }
  }
}

export default SignUp;
