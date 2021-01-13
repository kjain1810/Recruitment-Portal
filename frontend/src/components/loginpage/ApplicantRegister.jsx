import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Navbar, Form, FormGroup, Button, Label, Input, NavbarBrand} from 'reactstrap';

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
      <div className="LoginPage">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand>LinkedIn Lite</NavbarBrand>
        </Navbar>
        <br></br>
        <Form onSubmit={this.onSubmit}>
          <FormGroup>
            <Label for="firstname">First Name</Label>
            <Input
              required
              name="firstname"
              placeholder="First Name"
              value={this.state.first_name}
              onChange={this.onChangeFN}
            />
          </FormGroup>
          <FormGroup>
            <Label for="middlename">Middle Name</Label>
            <Input
              name="middlename"
              placeholder="Middle Name"
              value={this.state.middle_name}
              onChange={this.onChangeMN}
            />
          </FormGroup>
          <FormGroup>
            <Label for="lastname">Last Name</Label>
            <Input
              required
              name="lastname"
              placeholder="Last Name"
              value={this.state.last_name}
              onChange={this.onChangeLN}
            />
          </FormGroup>
          <FormGroup>
            <Label for="insti">Institute Name</Label>
            <Input
              required
              name="insti"
              placeholder="Institute Name"
              value={this.state.institute}
              onChange={this.onChangeInsti}
            />
          </FormGroup>
          <FormGroup>
            <Label for="startyear">Start Year</Label>
            <Input
              required
              name="startyear"
              type="number"
              value={this.state.start_year}
              onChange={this.onChangeSY}
            />
          </FormGroup>
          <FormGroup>
            <Label for="endyear">End Year</Label>
            <Input
              type="number"
              name="endyear"
              value={this.state.end_year}
              onChange={this.onChangeEY}
            />
          </FormGroup>
          <Button color="primary">Submit</Button>
        </Form>
      </div>
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
