import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class RecruiterRegister extends Component {
  constructor(props) {
    super(props);

    this.onChangeFN = this.onChangeFN.bind(this);
    this.onChangeMN = this.onChangeMN.bind(this);
    this.onChangeLN = this.onChangeLN.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: this.props.location.state.email,
      password: this.props.location.state.password,
      first_name: "",
      middle_name: "",
      last_name: "",
      id: "",
      position: 1,
    };
    console.log(this.state.email);
  }

  onChangeFN(event) {
    this.setState({ first_name: event.target.value });
  }

  onChangeMN(event) {
    this.setState({ middle_name: event.target.value });
  }

  onChangeLN(event) {
    this.setState({ last_name: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    axios
      .post("http://localhost:8080/recruiter/addrecruiter", {
        email: this.state.email,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        middle_name: this.state.middle_name,
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          this.setState({ id: response.data.recruiter._id });
          console.log(response.data.recruiter);
          axios
            .post("http://localhost:8080/users/newuser", {
              email: this.state.email,
              password: this.state.password,
              objId: this.state.id,
              type: "Recruiter",
            })
            .then((response) => {
              if (response.data.status === false) {
                console.log(response.data.err);
              } else {
                this.setState({ position: 2 });
                console.log(response.data.user);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(this.state._id);
  }

  render() {
    if (this.state.position === 1) {
      return (
        <form onSubmit={this.onSubmit}>
          <p>
            First Name:
            <input
              required
              type="text"
              value={this.state.first_name}
              onChange={this.onChangeFN}
            />
          </p>
          <p>
            Middle Name:
            <input
              type="text"
              value={this.state.middle_name}
              onChange={this.onChangeMN}
            />
          </p>
          <p>
            Last Name:
            <input
              required
              type="text"
              value={this.state.last_name}
              onChange={this.onChangeLN}
            />
          </p>
          <button>Submit</button>
        </form>
      );
    } else {
      return (
        <Redirect
          push
          to={{
            pathname: "/recruiterpage",
            state: { email: this.state.email, id: this.state.id },
          }}
        />
      );
    }
  }
}

export default RecruiterRegister;
