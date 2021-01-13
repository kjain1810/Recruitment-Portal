import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Form, FormGroup, Input, Label, Button, Badge } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.changeposition = this.changeposition.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      password: "",
      acctype: "",
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
            this.setState( {acctype: response.data.user.collectionname});
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
        <Form onSubmit={this.onSubmit}>
          <h3>
            <Badge color="secondary"> Login </Badge>
          </h3>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              required
              type="email"
              name="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.onChangeEmail}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              required
              type="password"
              name="password"
              placeholder="Enter your password"
              value={this.state.password}
              onChange={this.onChangePassword}
            />
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      );
    } else if (this.state.position === 2) {
      return (
        <div>
          <p>Incorrect email or password!</p>
          <Button onClick={this.changeposition}>Okay, try again</Button>
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
