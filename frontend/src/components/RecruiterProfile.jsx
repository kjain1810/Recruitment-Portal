import React, { Component } from "react";
import RecruiterHeader from "./Recruiter/RecruiterHeader";
import "./Recruiter/styles.css";
import { Form, FormGroup, Label, Input, Button, Table } from "reactstrap";
import axios from "axios";

class RecruiterProfile extends Component {
  constructor(props) {
    super(props);

    this.onSubmitUpdate = this.onSubmitUpdate.bind(this);
    this.onChangeFN = this.onChangeFN.bind(this);
    this.onChangeMN = this.onChangeMN.bind(this);
    this.onChangeLN = this.onChangeLN.bind(this);
    this.onChangeCN = this.onChangeCN.bind(this);
    this.onChangeBio = this.onChangeBio.bind(this);
    this.updateBio = this.updateBio.bind(this);
    this.changeBioError = this.changeBioError.bind(this);

    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
      fn: "",
      mn: "",
      ln: "",
      bio: "",
      listings: 0,
      contact_num: 0,
      errorbio: 0,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/recruiter/getrecruiter", {
        headers: {
          id: this.state.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf?");
        } else {
          const newState = {
            fn: response.data.recruiter.first_name,
            ln: response.data.recruiter.last_name,
            listings: response.data.recruiter.listings.length,
          };
          if (response.data.recruiter.middle_name !== undefined) {
            newState["mn"] = response.data.recruiter.middle_name;
          }
          if (response.data.recruiter.bio !== undefined) {
            newState["bio"] = response.data.recruiter.bio;
          }
          if (response.data.recruiter.contact_num !== undefined) {
            newState["contact_num"] = response.data.recruiter.contact_num;
          }

          this.setState(newState);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmitUpdate(event) {
    event.preventDefault();
    const body = {
      first_name: this.state.fn,
      last_name: this.state.ln,
      contact_num: this.state.contact_num,
      id: this.state.id,
    };
    if (this.state.bio.length > 0) {
      body["bio"] = this.state.bio;
    }
    if (this.state.mn.length > 0) {
      body["middle_name"] = this.state.mn;
    }
    console.log(body);
    axios
      .put("http://localhost:8080/recruiter/updaterecruiter", body)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf?");
        } else {
          console.log("Updated?", response.data.recruiter);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  updateBio(event) {
    event.preventDefault();
    if (this.state.bio.length === 0) {
      return;
    }
    if (this.state.bio.split(" ").length > 250) {
      this.setState({ errorbio: 1 });
      return;
    }
    const body = {
      id: this.state.id,
      bio: this.state.bio,
    };
    axios
      .put("http://localhost:8080/recruiter/updaterecruiter", body)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf?");
        } else {
          console.log("Updated?", response.data.recruiter);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChangeFN(event) {
    this.setState({ fn: event.target.value });
  }

  onChangeMN(event) {
    this.setState({ mn: event.target.value });
  }

  onChangeLN(event) {
    this.setState({ ln: event.target.value });
  }

  onChangeBio(event) {
    this.setState({ bio: event.target.value });
  }

  onChangeCN(event) {
    this.setState({ contact_num: event.target.value });
  }

  changeBioError() {
      this.setState({errorbio: 0});
  }

  render() {
    var bio;
    if (this.state.errorbio === 1) {
      bio = (
        <div>
          Bio can not be longer than 250 words!{" "}
          <Button color="secondary" onClick={this.changeBioError}>
            Okay, try again!
          </Button>
        </div>
      );
    } else {
      bio = (
        <div>
          <Input value={this.state.bio} onChange={this.onChangeBio} />
          <Button onClick={this.updateBio}>Update</Button>
        </div>
      );
    }
    return (
      <div>
        <RecruiterHeader email={this.state.email} id={this.state.id} />
        <br />
        <div className="page" onSubmit={this.onSubmitUpdate}>
          <h3>Personal Profile</h3>
          <Form>
            <FormGroup>
              <Label for="firstname">First Name</Label>
              <Input
                required
                name="firstname"
                value={this.state.fn}
                onChange={this.onChangeFN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="middlename">Middle Name</Label>
              <Input
                name="middlename"
                value={this.state.mn}
                onChange={this.onChangeMN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastname">Last Name</Label>
              <Input
                required
                name="lastname"
                value={this.state.ln}
                onChange={this.onChangeLN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="contactnum">Contact Number</Label>
              <Input
                name="contactnum"
                value={this.state.contact_num}
                onChange={this.onChangeCN}
                type="tel"
              />
            </FormGroup>
            <Button color="secondary">Update</Button>
          </Form>
          <br />
          <h3>Recruiter Profile</h3>
          <Table>
            <tbody>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Bio</td>
                <td>{bio}</td>
              </tr>
              <tr>
                <td>Listings</td>
                <td>{this.state.listings}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default RecruiterProfile;
