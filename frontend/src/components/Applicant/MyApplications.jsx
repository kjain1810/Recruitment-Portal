import React, { Component } from "react";
import axios from "axios";
import { Table } from "reactstrap";

class MyApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      email: props.email,
      myapps: [],
    };
  }

  componentDidMount() {
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
          var apps = response.data.applications;
          var tosend = [];
          apps.forEach(app => tosend.push(app.job))
          axios
            .get("http://localhost:8080/jobs/myjobs", {
              headers: {
                ids: tosend,
              },
            })
            .then((response) => {
              if (response.data.status === false) {
                console.log(response.data.err);
              } else {
                var infos = {};
                response.data.jobs.forEach((job) => {
                  infos[job._id] = {
                    salary: job.salary,
                    name: job.recruiter_name,
                  };
                });
                console.log(infos);
                console.log(apps);
                apps.forEach((app) => {
                  app["salary"] = infos[app.job].salary;
                  app["recruiter_name"] = infos[app.job].name;
                });
                console.log("applications", apps);
                this.setState({ myapps: apps });
              }
            });
        }
      });
  }

  render() {
    return (
      <div className="page">
        <Table>
          <thead>
            <tr>
              <td>Job Title</td>
              <td>Recruiter</td>
              <td>Salary</td>
              <td>Status</td>
              <td>DOJ?</td>
              <td>Rate!</td>
            </tr>
          </thead>
          <tbody>
            {this.state.myapps.map((app, index) => {
              return (
                <tr key={index}>
                  <td>{app.title}</td>
                  <td>{app.recruiter_name}</td>
                  <td>{app.salary}</td>
                  <td>{app.status}</td>
                  <td>{app.doj}</td>
                  <td>Add rating here</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default MyApplications;
