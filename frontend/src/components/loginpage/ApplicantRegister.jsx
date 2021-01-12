import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class ApplicantRegister extends Component {
  constructor(props) {
    super(props);

    this.onChangeFN = this.onChangeFN.bind(this);
    this.onChangeMN = this.onChangeMN.bind(this);
    this.onChangeLN = this.onChangeLN.bind(this);
    this.onChangeInsti = this.onChangeInsti.bind(this);
    this.onChangeSY = this.onChangeSY.bind(this);
    this.onChangeEY = this.onChangeEY.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: this.props.location.state.email,
      password: this.props.location.state.password,
      first_name: "",
      middle_name: "",
      last_name: "",
      start_year: 2000,
      end_year: undefined,
      institute: "",
      id: "",
      position: 1
    };
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

  onChangeInsti(event) {
    this.setState({ institute: event.target.value });
  }

  onChangeSY(event) {
    this.setState({ start_year: event.target.value });
  }

  onChangeEY(event) {
    this.setState({ end_year: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    var args = {
      email: this.state.email,
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      institute_name: this.state.institute,
      start_year: this.state.start_year,
    };

    if (this.state.end_year !== undefined) {
      args["end_year"] = this.state.end_year;
    }

    axios
      .post("http://localhost:8080/applicant/addapplicant", args)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          this.setState({ id: response.data.applicant._id });
          console.log(response.data);
          axios
            .post("http://localhost:8080/users/newuser", {
              email: this.state.email,
              password: this.state.password,
              objId: this.state.id,
              type: "Applicant",
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
      });
  }

  render() {
      if(this.state.position === 1){
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
        <p>
          Institute Name:
          <input
            required
            type="text"
            value={this.state.institute}
            onChange={this.onChangeInsti}
          />
        </p>
        <p>
          Start Year:
          <input
            required
            type="number"
            value={this.state.start_year}
            onChange={this.onChangeSY}
          />
        </p>
        <p>
          End Year:
          <input
            type="number"
            value={this.state.end_year}
            onChange={this.onChangeEY}
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
          pathname: "/applicantpage",
          state: { email: this.state.email, id: this.state.id },
        }}
      />
    );
}
  }
}

export default ApplicantRegister;
