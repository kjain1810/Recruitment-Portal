import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Form, FormGroup, Input, Label, Button, Badge } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

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
        <Form onSubmit={this.onSubmit}>
          <h3>
            <Badge color="secondary">Sign Up</Badge>
          </h3>
          <FormGroup row>
            <Label for="email">Email</Label>
            <Input
              required
              type="email"
              name="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.onChangeemail}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="password">Password</Label>
            <Input
              required
              type="password"
              name="password"
              placeholder="Enter Password"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="conpassword">Confirm password</Label>
            <Input
              required
              type="password"
              name="conpassword"
              placeholder="Confirm Password"
              value={this.state.confirmpasword}
              onChange={this.onChangeConfirmPassword}
            />
          </FormGroup>
          <FormGroup row>
            <Label for="type">Type</Label>
            <Input
              required
              type="select"
              name="type"
              value={this.state.acctype}
              onChange={this.onChangeType}
            >
              <option key="Recruiter" value="Recruiter">
                Recruiter
              </option>
              <option key="Applicant" value="Applicant">
                Applicant
              </option>
            </Input>
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      );
    } else if (this.state.position === 2) {
      return (
        <div>
          <p>Passwords did not match!</p>
          <Button onClick={this.changeposition}>Okay, try again</Button>
        </div>
      );
    } else if (this.state.position === 3) {
      return (
        <div>
          <p>Email already registered!</p>
          <Button onClick={this.changeposition}>Okay, try again</Button>
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
