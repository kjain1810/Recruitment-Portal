import React, { Component } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Badge,
  Input,
  Label,
  Row,
  Col,
  FormGroup,
  Form,
} from "reactstrap";
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
    this.onChangeSkillFilter = this.onChangeSkillFilter.bind(this);

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
      sop: "",
      jobsApplied: 0,
      accepted: false,
      allskills: [],
      filterskill: "None",
      filteredskills: [],
    };
  }

  componentDidMount() {
    axios.get("http://localhost:8080/skills/allskills").then((response) => {
      if (response.data.status === false) {
        console.log(response.data.err);
      } else {
        this.setState({ allskills: response.data.skills });
      }
    });
    axios
      .get("http://localhost:8080/applicant/getapplicant", {
        headers: {
          id: this.state.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf");
        } else {
          this.setState({ accepted: response.data.applicant.accepted });
        }
      });
    axios.get("http://localhost:8080/jobs/activejobs").then((response) => {
      if (response.data.status === false) {
        console.log(response.data.err);
      } else {
        var jobs = response.data.jobs;
        jobs.forEach((job) => {
          if (job.max_applications <= 0 || job.max_positions <= 0) {
            job.canapply = false;
          } else {
            job.canapply = true;
          }
        });
        axios
          .get("http://localhost:8080/applications/myapplications", {
            headers: {
              applicantid: this.state.id,
            },
          })
          .then((response) => {
            if (response.data.status === false) {
              console.log(response.data.err);
            } else {
              var lmao = {};
              response.data.applications.forEach((application) => {
                lmao[application.job] = true;
              });
              jobs.forEach((job) => {
                if (lmao[job._id]) {
                  job.alreadyApplied = true;
                } else {
                  job.alreadyApplied = false;
                }
              });
              var canApply = response.data.applications.filter(
                (app) => app.status !== "Rejected"
              ).length;
              this.setState({
                jobs: jobs,
                jobsApplied: canApply,
                fuser: new Fuse(jobs, { keys: ["title"] }),
              });
            }
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

  onChangeSkillFilter(event) {
    if(event.target.value === -1)
    {
      this.setState({filterskill: "None"});
      return;
    }
      var allskills = [...this.state.filteredskills];
    if (
      allskills.findIndex(
        (skill) => skill.key_name === this.state.allskills[event.target.value].key_name
      ) === -1
    )
      allskills.push(this.state.allskills[event.target.value]);
    this.setState({
      filterskill: this.state.allskills[event.target.value].name,
      filteredskills: allskills,
    });
  }
  removeSkillFilter(event, skillkey) {
    var allskills = [];
    this.state.filteredskills.forEach(skill => {
      if(skill.key_name !== skillkey)
        allskills.push(skill);
    });
    this.setState({filteredskills: allskills});
  }

  applyJob(event) {
    event.preventDefault();
    var body = this.state.application;
    body["sop"] = this.state.sop;
    axios
      .post("http://localhost:8080/applications/addapplication", body)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          this.setState({ askSOP: false });
        }
        axios
          .put("http://localhost:8080/jobs/decrapps", { _id: body.job })
          .then((response) => {
            if (response.data.status === false) {
              console.log(response.data.err);
            } else {
              var jobs = [...this.state.jobs];
              jobs.forEach((job) => {
                console.log(response.data.job);
                if (job._id === response.data.job._id) {
                  job.max_applications -= 1;
                  job.alreadyApplied = true;
                }
              });
              this.setState({ jobs: jobs, sop: "" });
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  askSOP(event, jobID, recruiterID, jobTitle) {
    event.preventDefault();
    this.setState({
      askSOP: true,
      application: {
        job: jobID,
        applicant: this.state.id,
        recruiter: recruiterID,
        sop: "",
        title: jobTitle,
      },
    });
  }

  onChangeSOP(event) {
    this.setState({ sop: event.target.value });
  }

  render() {
    if (this.state.accepted === true) {
      return <p>You already have a job! Can't apply for another</p>;
    }
    if (this.state.askSOP) {
      return (
        <Form onSubmit={(event) => this.applyJob(event)}>
          <FormGroup>
            <Label for="sop">SOP</Label>
            <Input
              required
              name="sop"
              value={this.state.sop}
              onChange={this.onChangeSOP}
            />
          </FormGroup>
          <Button onClick={this.applyJob} color="primary">
            Submit!
          </Button>
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
    if (this.state.filteredskills.length > 0) {
      console.log(this.state.filteredskills);
      jobs = jobs.filter((job) => {
        var exist = false;
        job.skillset.forEach(skill => {
          if(this.state.filteredskills.findIndex(sk => sk.key_name === skill.key_name) !== -1)
            exist = true;
        });
        return exist;
      })
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
        <Label for="filterskills">Filter Skills</Label>
        {this.state.filteredskills.map((skill) => {
          return (
            <div key={skill.key_name}>
              <Button
                onClick={(event) =>
                  this.removeSkillFilter(event, skill.key_name)
                }
                color="danger"
              >
                {skill.name}
              </Button>
            </div>
          );
        })}
        <Input
          type="select"
          name="filterskills"
          value={this.state.filterskill}
          onChange={this.onChangeSkillFilter}
        >
          <option key="None" value={-1}>
            None
          </option>
          {this.state.allskills.map((skill, index) => {
            return (
              <option key={skill.key_name} value={index}>
                {skill.name}
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
                <tr key={index}>
                  <td>{job.title}</td>
                  <td>
                    {job.skillset.map((skill) => {
                      return (
                        <div>
                          <Button color="secondary">{skill.name}</Button>
                        </div>
                      );
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
                    {job.rating_cnt > 0 ? job.rating_sum / job.rating_cnt : 0}
                  </td>
                  <td>
                    {job.alreadyApplied ? (
                      <Button color="secondary">Applied!</Button>
                    ) : this.state.jobsApplied >= 10 ? (
                      <Button color="danger">Application limit reached!</Button>
                    ) : job.canapply ? (
                      <Button
                        color="primary"
                        onClick={(event) =>
                          this.askSOP(event, job._id, job.recruiter, job.title)
                        }
                      >
                        Apply
                      </Button>
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
