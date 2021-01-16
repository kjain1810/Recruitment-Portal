import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Badge, Input, Label, Row, Col, FormGroup, Form } from "reactstrap";
import Fuse from "fuse.js";

class ApplicationPortal extends Component {
  constructor(props) {
    super(props);

    this.sort_salary = this.sort_salary.bind(this);
    this.sort_duration = this.sort_duration.bind(this);
    this.sort_rating = this.sort_rating.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onChangeTypeFilter = this.onChangeTypeFilter.bind(this);
    this.onChangeDurationFilter = this.onChangeDurationFilter.bind(this);
    this.onChangeMaxSal = this.onChangeMaxSal.bind(this);
    this.onChangeMinSal = this.onChangeMinSal.bind(this);
    this.askSOP = this.askSOP.bind(this);
    this.onChangeSOP = this.onChangeSOP.bind(this);
    this.applyJob = this.applyJob.bind(this);

    this.state = {
      email: props.email,
      id: props.id,
      jobs: [],
      searching: "",
      sort_salary: 0,
      sort_duration: 0,
      sort_rating: 0,
      typefilter: "None",
      filterduration: "None",
      durationopt: [1, 2, 3, 4, 5, 6, 7],
      filterminsal: -1,
      filtermaxsal: -1,
      askSOP: false,
      application: {},
      sop: ""
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8080/jobs/activejobs").then((response) => {
      if (response.data.status === false) {
        console.log(response.data.err);
      } else {
        this.setState({
          jobs: response.data.jobs,
        });
        this.setState({
          fuser: new Fuse(this.state.jobs, { keys: ["title"] }),
        });
      }
    });
  }

  sort_salary(event) {
    event.preventDefault();
    this.setState({ sort_salary: (this.state.sort_salary + 1) % 3 });
  }
  sort_duration(event) {
    event.preventDefault();
    this.setState({ sort_duration: (this.state.sort_duration + 1) % 3 });
  }
  sort_rating(event) {
    event.preventDefault();
    this.setState({ sort_rating: (this.state.sort_rating + 1) % 3 });
  }

  onChangeSearch(event) {
    this.setState({ searching: event.target.value });
  }

  onChangeTypeFilter(event) {
    this.setState({ typefilter: event.target.value });
  }

  onChangeDurationFilter(event) {
    this.setState({ filterduration: event.target.value });
  }

  onChangeMinSal(event) {
    this.setState({ filterminsal: event.target.value });
  }
  onChangeMaxSal(event) {
    this.setState({ filtermaxsal: event.target.value });
  }

  applyJob(event) {
    event.preventDefault();
    var body = this.state.application;
    body["sop"] = this.state.sop;
    console.log(body);
    axios.post("http://localhost:8080/applications/addapplication", body).then((response) => {
      if(response.data.status === false) {
        console.log(response.data.err);
      } else {
        console.log(response.data.recruiter);
        this.setState({askSOP: false});
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  askSOP(event, jobID, recruiterID,) {
    event.preventDefault();
    this.setState({askSOP: true, application: {
      job: jobID,
      applicant: this.state.id,
      recruiter: recruiterID,
      sop: "",
    }});
  }

  onChangeSOP(event) {
    this.setState({sop: event.target.value});
  }

  render() {
    if(this.state.askSOP) {
      return (
        <Form onSubmit={(event) => this.applyJob(event)}>
          <FormGroup>
            <Label for="sop">SOP</Label>
            <Input required name="sop" value={this.state.sop} onChange={this.onChangeSOP} />
          </FormGroup>
          <Button onClick={this.applyJob} color="primary">Submit!</Button>
        </Form>
      );
    }
    var jobs = this.state.jobs;
    if (this.state.searching.length > 0) {
      jobs = this.state.fuser
        .search(this.state.searching)
        .map((res) => res.item);
    }
    if (this.state.typefilter !== "None") {
      jobs = jobs.filter((job) => job.job_type === this.state.typefilter);
    }
    if (this.state.filterduration !== "None") {
      jobs = jobs.filter((job) => job.duration <= this.state.filterduration);
    }
    if (this.state.filtermaxsal >= 0) {
      jobs = jobs.filter((job) => job.salary <= this.state.filtermaxsal);
    }
    if (this.state.filterminsal >= 0) {
      jobs = jobs.filter((job) => job.salary >= this.state.filterminsal);
    }
    var salary_sort_col, duration_sort_col, rating_sort_col;
    var salary_sort_type, duration_sort_type, rating_sort_type;
    if (this.state.sort_salary === 0) {
      salary_sort_col = "secondary";
    } else if (this.state.sort_salary === 1) {
      salary_sort_col = "primary";
      salary_sort_type = "Asc";
    } else {
      salary_sort_col = "primary";
      salary_sort_type = "Desc";
    }
    if (this.state.sort_duration === 0) {
      duration_sort_col = "secondary";
    } else if (this.state.sort_duration === 1) {
      duration_sort_col = "primary";
      duration_sort_type = "Asc";
    } else {
      duration_sort_col = "primary";
      duration_sort_type = "Desc";
    }
    if (this.state.sort_rating === 0) {
      rating_sort_col = "secondary";
    } else if (this.state.sort_rating === 1) {
      rating_sort_col = "primary";
      rating_sort_type = "Asc";
    } else {
      rating_sort_col = "primary";
      rating_sort_type = "Desc";
    }
    if (this.state.sort_rating === 1) {
      jobs.sort((a, b) => {
        const rating_a = a.rating_cnt > 0 ? a.rating_sum / a.rating_cnt : 0;
        const rating_b = b.rating_cnt > 0 ? b.rating_sum / b.rating_cnt : 0;
        if (rating_a > rating_b) {
          return 1;
        } else if (rating_a < rating_b) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (this.state.sort_rating === 2) {
      jobs.sort((a, b) => {
        const rating_a = a.rating_cnt > 0 ? a.rating_sum / a.rating_cnt : 0;
        const rating_b = b.rating_cnt > 0 ? b.rating_sum / b.rating_cnt : 0;
        if (rating_a > rating_b) {
          return -1;
        } else if (rating_a < rating_b) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    if (this.state.sort_duration === 1) {
      jobs.sort((a, b) => {
        if (a.duration > b.duration) {
          return 1;
        } else if (a.duration < b.duration) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (this.state.sort_duration === 2) {
      jobs.sort((a, b) => {
        if (a.duration > b.duration) {
          return -1;
        } else if (a.duration < b.duration) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    if (this.state.sort_salary === 1) {
      jobs.sort((a, b) => {
        if (a.salary > b.salary) {
          return 1;
        } else if (a.salary < b.salary) {
          return -1;
        } else {
          return 0;
        }
      });
    } else if (this.state.sort_salary === 2) {
      jobs.sort((a, b) => {
        if (a.salary > b.salary) {
          return -1;
        } else if (a.salary < b.salary) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return (
      <div>
        <Button color={salary_sort_col} onClick={this.sort_salary}>
          {" "}
          Salary <Badge color="secondary">{salary_sort_type}</Badge>{" "}
        </Button>{" "}
        <Button color={duration_sort_col} onClick={this.sort_duration}>
          {" "}
          Durating <Badge color="secondary">{duration_sort_type}</Badge>{" "}
        </Button>{" "}
        <Button color={rating_sort_col} onClick={this.sort_rating}>
          {" "}
          Rating <Badge color="secondary">{rating_sort_type}</Badge>{" "}
        </Button>
        <br />
        <br />
        <Label for="search">Search by Title</Label>
        <Input
          required
          type="text"
          name="search"
          value={this.state.searching}
          onChange={this.onChangeSearch}
          placeholder="Search"
        />
        <br />
        <br />
        <Label for="filtertype">Filter Job Type</Label>
        <Input
          type="select"
          name="filtertype"
          value={this.state.typefilter}
          onChange={this.onChangeTypeFilter}
        >
          <option key="None" value="None">
            None
          </option>
          <option key="Work from Home" value="Work from Home">
            Work from Home
          </option>
          <option key="Part-time" value="Part-time">
            Part-time
          </option>
          <option key="Full-time" value="Full-time">
            Full-time
          </option>
        </Input>
        <br />
        <br />
        <Label for="filtersalary">Filter Salary</Label>
        <Row>
          <Col>
            <Input
              type="number"
              name="filtersalary"
              value={this.state.filterminsal}
              onChange={this.onChangeMinSal}
            />
          </Col>
          <Col>
            <Input
              type="number"
              name="filtersalary"
              value={this.state.filtermaxsal}
              onChange={this.onChangeMaxSal}
            />
          </Col>
        </Row>
        <br />
        <br />
        <Label for="filterduration">Filter Duration</Label>
        <Input
          type="select"
          name="filterduration"
          value={this.state.filterduration}
          onChange={this.onChangeDurationFilter}
        >
          <option key="None" value="None">
            None
          </option>
          {this.state.durationopt.map((opt) => {
            return (
              <option key={opt} value={opt}>
                {opt}
              </option>
            );
          })}
        </Input>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <td>Title</td>
              <td>Skills</td>
              <td>Recruiter Name</td>
              <td>Recruiter's email</td>
              <td>Application Deadline</td>
              <td>Maximum positions</td>
              <td>Type</td>
              <td>Duration</td>
              <td>Salary</td>
              <td>Rating</td>
              <td>Apply!</td>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index) => {
              return (
                <tr>
                  <td>{job.title}</td>
                  <td>
                    {job.skillset.map((skill) => {
                      return <Button color="secondary">{skill}</Button>;
                    })}
                  </td>
                  <td>{job.recruiter_name}</td>
                  <td>{job.email}</td>
                  <td>{job.application_deadline}</td>
                  <td>{job.max_positions}</td>
                  <td>{job.job_type}</td>
                  <td>{job.duration}</td>
                  <td>{job.salary}</td>
                  <td>
                    {job.rating_cnt > 0 ? job.rating_cnt / job.rating_sum : 0}
                  </td>
                  <td>
                    {job.alreadyApplied ? (
                      <Button color="seconary">Applied!</Button>
                    ) : job.active ? (
                      <Button color="primary" onClick={(event) => this.askSOP(event, job._id, job.recruiter)}>Apply</Button>
                    ) : (
                      <Button color="danger">Full :(</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default ApplicationPortal;
