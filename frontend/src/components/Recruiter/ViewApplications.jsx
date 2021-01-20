import React, { Component } from "react";
import { Button, Table, Badge } from "reactstrap";
import axios from "axios";

class ViewApplications extends Component {
  constructor(props) {
    super(props);

    this.shortlist = this.shortlist.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);

    this.state = {
      applications: [],
      job_info: props.job_info,
    };
  }

  componentDidMount() {
    console.log("component mounting ", this.props.id);
    axios
      .get("http://localhost:8080/applications/jobapplications", {
        headers: {
          id: this.props.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          var applications = response.data.applications.filter(
            (app) =>
              app.status !== "Rejected" &&
              app.status !== "Accepted" &&
              app.still_eligible === true
          );
          var tosend = [];
          applications.forEach((app) => tosend.push(app.applicant));
          axios
            .get("http://localhost:8080/applicant/myapplicants", {
              headers: {
                ids: tosend,
              },
            })
            .then((response) => {
              if (response.data.status === false) {
                console.log(response.data.err);
              } else {
                var mapper = {};
                response.data.applications.forEach((app) => {
                  mapper[app._id] = {
                    name:
                      app.first_name +
                      (app.middle_name.length > 0
                        ? " " + app.middle_name
                        : "") +
                      " " +
                      app.last_name,
                    skills: app.skill_set,
                    education: app.institute_name,
                    rating:
                      app.rating_cnt > 0 ? app.rating_sum / app.rating_cnt : 0,
                  };
                });
                applications.forEach((app) => {
                  app["name"] = mapper[app.applicant].name;
                  app["skills"] = mapper[app.applicant].skills;
                  app["education"] = mapper[app.applicant].education;
                  app["rating"] = mapper[app.applicant].rating;
                });
                this.setState({ applications: applications });
              }
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  shortlist(event, id) {
    event.preventDefault();
    // console.log("shortlisting", id);
    axios
      .put("http://localhost:8080/applications/changestatus", {
        id: id,
        status: "Shortlist",
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf");
        } else {
          var apps = this.state.applications;
          apps.forEach(
            (app) => (app.status = app._id === id ? "Shortlist" : app.status)
          );
          this.setState({ applications: apps });
        }
      })
      .catch((err) => console.log(err));
  }
  accept(event, id, index) {
    event.preventDefault();
    axios
      .put("http://localhost:8080/applications/changestatus", {
        id: id,
        status: "Accepted",
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf");
        } else {
          var apps = this.state.applications;
          apps.splice(index, 1);
          var job_info = this.state.job_info;
          job_info.max_positions -= 1;
          this.setState({ job_info: job_info, applications: apps });
        }
      })
      .catch((err) => console.log(err));
    axios
      .put("http://localhost:8080/applicant/editapplicant", {
        id: this.state.applications[index].applicant,
        accepted: true,
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.updated === false) {
          console.log("wtf!(2)");
        } else {
          console.log(response.data.newApplicant);
        }
      })
      .catch((err) => console.log(err));
    axios
      .post("http://localhost:8080/employees/addemployee", {
        employee: this.state.applications[index].applicant,
        employer: this.state.applications[index].recruiter,
        job_type: this.state.job_info.job_type,
        job_title: this.state.job_info.title,
        job: this.state.applications[index].job
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          console.log(response.data.employee);
        }
      })
      .catch((err) => console.log(err));
    axios
      .put("http://localhost:8080/applications/markineligible", {
        id: this.state.applications[index].applicant,
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        }
      })
      .catch((err) => console.log(err));
    axios.put("http://localhost:8080/jobs/decrpos", {_id: this.state.job_info._id}).then(response => {
      console.log(response.data);
      if(response.data.status === false) {
        console.log(response.data.err);
      }
    }).catch(err => console.log(err));
  }
  reject(event, id) {
    event.preventDefault();
    axios
      .put("http://localhost:8080/applications/changestatus", {
        id: id,
        status: "Rejected",
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf");
        } else {
          var apps = this.state.applications;
          apps.splice(
            apps.findIndex((app) => app._id === id),
            1
          );
          this.setState({ applications: apps });
        }
      })
      .catch((err) => console.log(err));
  }

  render() {
    console.log(this.state.job_info);
    if (this.state.job_info.max_positions <= 0) {
      return (
        <div>
          <p>All positions for this job listing have been filled!</p>
          <Button color="primary" onClick={this.props.goBack}>
            Go Back!
          </Button>
        </div>
      );
    }
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Skills</td>
              <td>Date of application</td>
              <td>Education</td>
              <td>SOP</td>
              <td>Status</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody>
            {this.state.applications.map((app, index) => {
              return (
                <tr key={index}>
                  <td>{app.name}</td>
                  <td>
                    {app.skills.map((skill, idx) => (
                      <Badge key={idx} color="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </td>
                  <td>{app.date}</td>
                  <td>{app.education}</td>
                  <td>{app.sop}</td>
                  <td>{app.status}</td>
                  <td>
                    {app.status === "Applied" ? (
                      <Button
                        color="primary"
                        onClick={(event) => this.shortlist(event, app._id)}
                      >
                        Shortlist
                      </Button>
                    ) : (
                      <Button
                        color="success"
                        onClick={(event) => this.accept(event, app._id, index)}
                      >
                        Accept
                      </Button>
                    )}{" "}
                    <Button
                      color="danger"
                      onClick={(event) => this.reject(event, app._id)}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button color="primary" onClick={this.props.goBack}>
          Go Back!
        </Button>
      </div>
    );
  }
}

export default ViewApplications;
