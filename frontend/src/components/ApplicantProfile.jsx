import React, { Component } from "react";
import "./Applicant/styles.css";
import ApplicantHeader from "./Applicant/ApplicantHeader";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Button,
  Badge,
} from "reactstrap";
import axios from "axios";

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);

    this.onChangeFN = this.onChangeFN.bind(this);
    this.onChangeMN = this.onChangeMN.bind(this);
    this.onChangeLN = this.onChangeLN.bind(this);
    this.onChangeInsti = this.onChangeInsti.bind(this);
    this.onChangeSY = this.onChangeSY.bind(this);
    this.onChangeEY = this.onChangeEY.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.toggleAddSkill = this.toggleAddSkill.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.onChangeAddSkill = this.onChangeAddSkill.bind(this);

    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
      firstname: "",
      lastname: "",
      middlename: "",
      sy: 0,
      ey: 0,
      insti: "",
      rating_cnt: 0,
      rating: 0,
      accepted: false,
      skill_set: [],
      addingSkill: false,
      newSkill: "",
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/applicant/getapplicant", {
        headers: {
          id: this.state.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log("error", response.data);
        } else if (response.data.found === false) {
          console.log("wtf");
        } else {
          console.log("applicant", response.data.applicant);
          const applicant = response.data.applicant;
          this.setState({
            firstname: applicant.first_name,
            lastname: applicant.last_name,
            sy: applicant.start_year,
            insti: applicant.institute_name,
            rating_cnt: applicant.rating_cnt,
            rating:
              applicant.rating_cnt > 0
                ? applicant.rating_sum / applicant.rating_cnt
                : 0,
            skill_set: applicant.skill_set,
          });
          if (applicant.middle_name !== undefined) {
            this.setState({ middlename: applicant.middle_name });
          }
          if (applicant.end_year !== undefined) {
            this.setState({ ey: applicant.end_year });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChangeFN(event) {
    this.setState({ firstname: event.target.value });
  }

  onChangeMN(event) {
    this.setState({ middlename: event.target.value });
  }

  onChangeLN(event) {
    this.setState({ lastname: event.target.value });
  }

  onChangeInsti(event) {
    this.setState({ insti: event.target.value });
  }

  onChangeSY(event) {
    this.setState({ sy: event.target.value });
  }

  onChangeEY(event) {
    this.setState({ ey: event.target.value });
  }

  onSubmit(event) {
    event.preventDefault();

    const body = {
      id: this.state.id,
      first_name: this.state.firstname,
      last_name: this.state.lastname,
      institute_name: this.state.insti,
      start_year: this.state.sy,
      end_year: this.state.ey,
    };

    axios
      .put("http://localhost:8080/applicant/editapplicant", body)
      .then((response) => {
        if (response.data.status === false) {
          console.log("err", response.data.err);
        } else if (response.data.updated === false) {
          console.log("wtf");
        } else {
          console.log("updated?", response.data.newApplicant);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addSkill(event) {
    event.preventDefault();
    var newArray = [...this.state.skill_set];
    newArray.push(this.state.newSkill);
    console.log(newArray);
    this.setState({
      skill_set: newArray,
      newSkill: "",
      addingSkill: !this.state.addingSkill,
    });
    axios
      .put("http://localhost:8080/applicant/editapplicant", {
        skill_set: newArray,
        id: this.state.id,
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.updated === false) {
          console.log("wtf");
        } else {
          console.log(response.data.newApplicant);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChangeAddSkill(event) {
    this.setState({ newSkill: event.target.value });
  }

  toggleAddSkill(event) {
    event.preventDefault();
    this.setState({ addingSkill: !this.state.addingSkill });
  }

  render() {
    var Skill;
    if (this.state.addingSkill === true) {
      Skill = (
        <div>
          <Input value={this.state.newSkill} onChange={this.onChangeAddSkill} />
          <Button color="secondary" onClick={this.addSkill}>
            Add
          </Button>
        </div>
      );
    } else {
      Skill = <Button onClick={this.toggleAddSkill}>Add skill</Button>;
    }
    return (
      <div>
        <ApplicantHeader email={this.state.email} id={this.state.id} />
        <div className="page">
          <h3>Personal Profile</h3>
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              <Label for="firstname">First Name</Label>
              <Input
                required
                name="firstname"
                value={this.state.firstname}
                onChange={this.onChangeFN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="middlename"> Middle Name </Label>
              <Input
                name="middlename"
                value={this.state.middlename}
                onChange={this.onChangeMN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastname"> Last Name </Label>
              <Input
                required
                name="lastname"
                value={this.state.lastname}
                onChange={this.onChangeLN}
              />
            </FormGroup>
            <FormGroup>
              <Label for="insti">Institute Name</Label>
              <Input
                required
                name="insti"
                value={this.state.insti}
                onChange={this.onChangeInsti}
              />
            </FormGroup>
            <FormGroup>
              <Label for="sy">Start Year</Label>
              <Input
                required
                type="number"
                value={this.state.sy}
                onChange={this.onChangeSY}
              />
            </FormGroup>
            <FormGroup>
              <Label for="ey">End Year</Label>
              <Input
                type="number"
                value={this.state.ey}
                onChange={this.onChangeEY}
              />
            </FormGroup>
            <Button color="primary">Update</Button>
          </Form>
          <h3>Job Profile</h3>
          <Table>
            <tbody>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td>Skill Set</td>
                <td>
                  {this.state.skill_set.map((skill, index) => {
                    return (
                      <div key={index}>
                        <Badge color="secondary">{skill}</Badge>
                      </div>
                    );
                  })}
                  {Skill}
                </td>
              </tr>
              <tr>
                <td>Rating</td>
                <td>{this.state.rating}</td>
              </tr>
              <tr>
                <td>Number of ratings</td>
                <td>{this.state.rating_cnt}</td>
              </tr>
              <tr>
                <td>Accepted to a job</td>
                <td>{this.accepted === true ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default ApplicantProfile;
