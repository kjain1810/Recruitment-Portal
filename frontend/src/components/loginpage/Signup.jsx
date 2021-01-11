import React, { Component } from "react";

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
      currentposition: 1,
    };
  }

  changeposition() {
      this.setState({ currentposition: 1 });
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
        this.setState({ currentposition: 2 });
      return;
    }

    const newUser = {
      email: this.state.email,
      password: this.state.password,
      type: this.state.acctype,
    };

    console.log(newUser);
  }

  render() {
    if (this.state.currentposition === 1) {
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
    } else if (this.state.currentposition === 2) {
      return (
        <div>
          <p>Passwords did not match!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>
      );
    } else if (this.state.currentposition === 3) {
      return (
        <div>
          <p>Email already registered!</p>
          <button onClick={this.changeposition}>Okay, try again</button>
        </div>
      );
    }
  }
}

export default SignUp;
