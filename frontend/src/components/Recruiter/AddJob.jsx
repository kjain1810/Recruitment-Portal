import React, { Component } from "react";
import { Form, FormGroup, Label, Input, Row, Badge, Button } from "reactstrap";
import axios from "axios";
import "./styles.css";

class AddJob extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeMaxApps = this.onChangeMaxApps.bind(this);
    this.onChangePositions = this.onChangePositions.bind(this);
    this.onChangeDay = this.onChangeDay.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeMinute = this.onChangeMinute.bind(this);
    this.onChangeHour = this.onChangeHour.bind(this);
    this.onChangeSkill = this.onChangeSkill.bind(this);
    this.addSkill = this.addSkill.bind(this);
    this.toggleSkill = this.toggleSkill.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onChangeSalary = this.onChangeSalary.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.toggleErrors = this.toggleErrors.bind(this);

    this.state = {
      email: props.email,
      id: props.id,
      submiterrors: 0,
      errmesg: "",
      title: "",
      maxapps: null,
      positions: null,
      day: null,
      month: null,
      year: null,
      minute: null,
      hour: null,
      skillset: [],
      newSkill: "",
      addingSkill: false,
      type: "Work from Home",
      duration: 0,
      durationOptions: [0, 1, 2, 3, 4, 5, 6],
      salary: 0,
      name: "",
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8080/recruiter/getrecruiter", {
      headers: {
        id: this.state.id
      }
    }).then((response) => {
      if(response.data.status === false) {
        console.log(response.data.err);
      } else if(response.data.found === false) {
        console.log("wtf");
      } else {
        this.setState({
          name:
            response.data.recruiter.first_name +
            " " +
            (response.data.recruiter.middle_name !== undefined ? response.data.recruiter.middle_name : "") +
            " " +
            response.data.recruiter.last_name,
        });
      }
    })
  }

  formSubmit(event) {
    event.preventDefault();
    console.log(this.state);
    axios
      .post("http://localhost:8080/jobs/addjob", {
        skillsetlist: this.state.skillset,
        application_deadline_year: this.state.year,
        application_deadline_month: this.state.month,
        application_deadline_day: this.state.day,
        application_deadline_hours: this.state.hour,
        application_deadline_minutes: this.state.minute,
        title: this.state.title,
        _id: this.state.id,
        email: this.state.email,
        max_applications: this.state.maxapps,
        max_positions: this.state.positions,
        job_type: this.state.type,
        duration: this.state.duration,
        salary: this.state.salary,
        recruiter_name: this.state.name,
      })
      .then((response) => {
        if (response.data.status === false) {
          this.setState({ submiterrors: 1, errmesg: response.data.err });
          console.log("validation", response.data.err);
        } else {
          console.log(response.data.job);
          this.setState({
            skillset: [],
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            title: "",
            maxapps: 0,
            positions: 0,
            type: "Work from Home",
            duration: 0,
            salary: 0,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChangeTitle(event) {
    this.setState({ title: event.target.value });
  }

  onChangeMaxApps(event) {
    this.setState({ maxapps: event.target.value });
  }

  onChangePositions(event) {
    this.setState({ positions: event.target.value });
  }

  onChangeDay(event) {
    this.setState({ day: event.target.value });
  }
  onChangeMonth(event) {
    this.setState({ month: event.target.value });
  }
  onChangeYear(event) {
    this.setState({ year: event.target.value });
  }
  onChangeMinute(event) {
    this.setState({ minute: event.target.value });
  }
  onChangeHour(event) {
    this.setState({ hour: event.target.value });
  }

  onChangeSkill(event) {
    this.setState({ newSkill: event.target.value });
  }
  addSkill(event) {
    event.preventDefault();
    var newSkills = [...this.state.skillset];
    newSkills.push(this.state.newSkill);
    this.setState({ skillset: newSkills, addingSkill: false, newSkill: "" });
  }
  toggleSkill(event) {
    event.preventDefault();
    this.setState({ addingSkill: true });
  }

  onChangeType(event) {
    this.setState({ type: event.target.value });
  }
  onChangeDuration(event) {
    this.setState({ duration: event.target.value });
  }

  onChangeSalary(event) {
    this.setState({ salary: event.target.value });
  }

  toggleErrors(event) {
    event.preventDefault();
    this.setState({ submiterrors: 0, errmesg: "" });
  }

  render() {
    if (this.state.submiterrors === 0) {
      var skills;
      if (this.state.addingSkill === true) {
        skills = (
          <div>
            <Input
              name="skillset"
              value={this.state.newSkill}
              onChange={this.onChangeSkill}
            />
            <Button color="primary" onClick={this.addSkill}>
              Add skill!
            </Button>
          </div>
        );
      } else {
        skills = (
          <div>
            {this.state.skillset.map((skill) => {
              return <Badge color="secondary">{skill}</Badge>;
            })}
            <Button color="primary" onClick={this.toggleSkill}>
              Add Skill
            </Button>
          </div>
        );
      }
      return (
        <div>
          <Form onSubmit={this.formSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                required
                name="title"
                placeholder="Title of the job"
                value={this.state.title}
                onChange={this.onChangeTitle}
              />
            </FormGroup>
            <FormGroup>
              <Label for="max_applicants">Max Applicants</Label>
              <Input
                required
                name="max_applicants"
                type="number"
                placeholder="Maximum applications"
                value={this.state.maxapps}
                onChange={this.onChangeMaxApps}
              />
            </FormGroup>
            <FormGroup>
              <Label for="positions">Positions Available</Label>
              <Input
                required
                name="positions"
                type="number"
                placeholder="Number of positions"
                value={this.state.positions}
                onChange={this.onChangePositions}
              />
            </FormGroup>
            <FormGroup>
              <Label for="deadline">Deadline</Label>
              <div>
                <Row form>
                  <Input
                    required
                    name="deadline"
                    type="number"
                    placeholder="Day"
                    className="deadlineinput"
                    value={this.state.day}
                    onChange={this.onChangeDay}
                  />
                  <Input
                    required
                    name="deadline"
                    type="number"
                    placeholder="Month"
                    className="deadlineinput"
                    value={this.state.month}
                    onChange={this.onChangeMonth}
                  />
                  <Input
                    required
                    name="deadline"
                    type="number"
                    placeholder="Year"
                    className="deadlineinput"
                    value={this.state.year}
                    onChange={this.onChangeYear}
                  />
                  <Input
                    required
                    name="deadline"
                    type="number"
                    placeholder="Minute"
                    className="deadlineinput"
                    value={this.state.minute}
                    onChange={this.onChangeMinute}
                  />
                  <Input
                    required
                    name="deadline"
                    type="number"
                    placeholder="Hour"
                    className="deadlineinput"
                    value={this.state.hour}
                    onChange={this.onChangeHour}
                  />
                </Row>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="skillset">Skill Set</Label>
              {skills}
            </FormGroup>
            <FormGroup>
              <Label for="typeofjob">Type of Job</Label>
              <Input
                required
                type="select"
                name="typeofjob"
                value={this.state.type}
                onChange={this.onChangeType}
              >
                <option value="Work from Home" key="Work from Home">
                  Work from Home
                </option>
                <option value="Part-time" key="Part-time">
                  Part-time
                </option>
                <option value="Full-time" key="Full-time">
                  Full-time
                </option>
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <Input
                required
                type="select"
                name="duration"
                value={this.state.duration}
                onChange={this.onChangeDuration}
              >
                {this.state.durationOptions.map((duration) => {
                  return (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="salary">Salary</Label>
              <Input
                required
                type="number"
                name="salary"
                value={this.state.salary}
                onChange={this.onChangeSalary}
              />
            </FormGroup>
            <Button color="primary"> Post Job! </Button>
          </Form>
        </div>
      );
    } else {
      console.log("here?");
      return (
        <div>
          <p>Errors while submitting:</p>
          <br />
          <p>{JSON.stringify(this.state.errmesg)}</p>
          <br />
          <Button color="primary" onClick={this.toggleErrors}>
            Try again
          </Button>
        </div>
      );
    }
  }
}

export default AddJob;
