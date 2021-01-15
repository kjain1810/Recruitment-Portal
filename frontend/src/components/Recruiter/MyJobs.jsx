import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Form, FormGroup, Label, Input, Row } from "reactstrap";

class MyJobs extends Component {
  constructor(props) {
    super(props);

    this.deleteJob = this.deleteJob.bind(this);
    this.editJob = this.editJob.bind(this);
    this.viewJob = this.viewJob.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onSubmitEdit = this.onSubmitEdit.bind(this);
    this.onChangeDay = this.onChangeDay.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.onChangeYear = this.onChangeYear.bind(this);
    this.onChangeMinute = this.onChangeMinute.bind(this);
    this.onChangeHour = this.onChangeHour.bind(this);
    this.onChangeMaxPos = this.onChangeMaxPos.bind(this);

    this.state = {
      email: props.email,
      id: props.id,
      jobs: [],
      viewingJob: -1,
      editingJob: -1,
      editTitle: "",
      day: null,
      month: null,
      year: null,
      minute: null,
      hour: null,
      max_positions: null,
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/jobs/recruiterjobs", {
        headers: {
          id: this.state.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          response.data.jobs.forEach((job) => {
            axios
              .get("http://localhost:8080/applications/getapplications", {
                header: {
                  id: job._id,
                },
              })
              .then((response) => {
                if (response.data.status === false) {
                  console.log("status", response.data.err);
                } else {
                  job["applicants"] = response.data.count;
                }

                var newArray = [...this.state.jobs];
                newArray.push(job);
                this.setState({ jobs: newArray });
              })
              .catch((err) => {
                console.log(err);
              });
          });
        }
      });
  }

  editJob(event, index) {
    event.preventDefault();
    var date = new Date(this.state.jobs[index]["application_deadline"]);
    console.log(date.getDate(), typeof date);
    this.setState({
      editingJob: index,
      editTitle: this.state.jobs[index]["title"],
      max_positions: this.state.jobs[index]["max_positions"],
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      minute: date.getMinutes(),
      hour: date.getHours()
    });
  }

  deleteJob(event, index) {
    event.preventDefault();
    axios
      .delete("http://localhost:8080/jobs/deletejob", {
        headers: {
          id: this.state.jobs[index]["_id"],
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          const newArray = this.state.jobs.splice(index, 1);
          this.setState({ jobs: newArray });
        }
      });
  }

  viewJob(event, index) {
    event.preventDefault();
    console.log("Viewing ", index);
  }

  onSubmitEdit(event) {
    event.preventDefault();
    const body = {
        _id: this.state.jobs[this.state.editingJob]._id,
        title: this.state.editTitle,
        application_deadline: new Date(this.state.year, this.state.month, this.state.day, this.state.hour, this.state.minute),
        max_positions: parseInt(this.state.max_positions)
    };
    axios.put("http://localhost:8080/jobs/editjob", body).then((response) => {
        if(response.data.status === false) {
            console.log(response.data.err);
        } else {
            var newJobs = [...this.state.jobs];
            const lmao = newJobs[this.state.editingJob]["applicants"];
            newJobs[this.state.editingJob] = response.data.job;
            newJobs[this.state.editingJob]["applicants"] = lmao;
            this.setState({jobs: newJobs, editingJob: -1});
            console.log(response.data.job);
            this.setState({editingJob: -1});
        }
    }).catch((err) => {
        console.log(err);
    });
  }

  onChangeTitle(event) {
    this.setState({ editTitle: event.target.value });
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
  onChangeMaxPos(event) {
      this.setState({ max_positions: event.target.value });
  }

  render() {
    if (this.state.viewingJob === -1 && this.state.editingJob === -1) {
      return (
        <div>
          <Table>
            <thead>
              <tr>
                <td>Title</td>
                <td>Date of posting</td>
                <td>Number of applicants</td>
                <td>Max positions</td>
                <td>Options</td>
              </tr>
            </thead>
            <tbody>
              {this.state.jobs.map((job, index) => {
                return (
                  <tr key={index}>
                    <td>{job.title}</td>
                    <td>{job.date_of_posting}</td>
                    <td>{job.applicants}</td>
                    <td>{job.max_positions}</td>
                    <td>
                      <Button
                        color="secondary"
                        onClick={(event) => this.editJob(event, index)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={(event) => this.deleteJob(event, index)}
                      >
                        Delete
                      </Button>
                      <Button
                        color="primary"
                        onClick={(event) => this.viewJob(event, index)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      );
    } else if (this.state.editingJob !== -1) {
      return (
        <div>
          <h3> Editing job </h3>
          <Form onSubmit={this.onSubmitEdit}>
            <FormGroup>
              <Label for="newtitle">New Title</Label>
              <Input
                required
                name="newtitle"
                value={this.state.editTitle}
                onChange={this.onChangeTitle}
                placeholder="New Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="deadline">New Deadline</Label>
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
                <Label for="maxpositions">Max Positions</Label>
                <Input required type="number" value={this.state.max_positions} onChange={this.onChangeMaxPos} />
            </FormGroup>
            <Button color="primary">Edit!</Button>
          </Form>
        </div>
      );
    } else {
    }
  }
}

export default MyJobs;
