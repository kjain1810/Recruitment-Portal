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
                var getinfo = null;
                apps.forEach((app) => {
                  app["salary"] = infos[app.job].salary;
                  app["recruiter_name"] = infos[app.job].name;
                  if(app.status === "Accepted") {
                    getinfo = app.job;
                  }
                });
                if(getinfo) {
                  axios.get("http://localhost:8080/employees/myemployeeinfo", {
                    headers: {
                      employee: this.state.id,
                      job: getinfo
                    }
                  }).then(response => {
                    if(response.data.status === false) {
                      console.log(response.data.err);
                    } else if(response.data.found === false) {
                      console.log("lmao wtf");
                    } else {
                      console.log(response.data.employee);
                      apps.forEach(app => app.doj = (app.job === getinfo ? response.data.employee.date_of_joining : null));
                      this.setState({myapps: apps});
                    }
                  });
                } else {
                console.log("applications", apps);
                this.setState({ myapps: apps });}
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
