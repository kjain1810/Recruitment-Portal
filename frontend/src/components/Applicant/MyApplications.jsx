import React, { Component } from "react";
import axios from "axios";
import { Table, Button, Form, FormGroup, Label, Input } from "reactstrap";

class MyApplications extends Component {
  constructor(props) {
    super(props);

    this.rate = this.rate.bind(this);
    this.giveRating = this.giveRating.bind(this);
    this.onChangeCurRate = this.onChangeCurRate.bind(this);

    this.state = {
      id: props.id,
      email: props.email,
      myapps: [],
      rating: null,
      currating: 0,
      alreadyrated: false,
      prevrating: 0,
      ratingchoice: [0, 1, 2, 3, 4, 5],
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
                this.setState({ myapps: apps });}
              }
                console.log("applications", apps);
            });
        }
      });
  }

  rate(event, app) {
    event.preventDefault();
    console.log("app", app);
    axios.get("http://localhost:8080/rating/getrating", {
      headers: {
        person_giving_rating: this.state.id,
        person_getting_rating: app.job,
      },
    }).then(response => {
      if(response.data.status === false) {
        console.log(response.data.err);
      } else if(response.data.found === false) {
        this.setState({
          rating: app,
          currating: 0,
          alreadyrated: false,
          prevrating: 0,
        });
      } else {
        this.setState({
          rating: app,
          currating: response.data.rating.rating,
          alreadyrated: true,
          prevrating: response.data.rating.rating,
        });
      }
      console.log(response.data);
    });
  }

  giveRating(event) {
    event.preventDefault();
    const rating_body = {
      person_giving_rating: this.state.id,
      person_getting_rating: this.state.rating.job,
      rating: this.state.currating,
      recruiter: false,
    };
    axios
      .put("http://localhost:8080/rating/addrating", rating_body)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          console.log(response.data.rating);
        }
      })
      .catch((err) => console.log(err));
    var rec_body = {
      id: this.state.rating.job,
      inc: {
        rating_sum: this.state.currating - this.state.prevrating,
      },
    };
    if(this.state.alreadyrated === false) {
      rec_body["inc"]["rating_cnt"] = 1;
    }
    axios.put("http://localhost:8080/jobs/getrating", rec_body).then(response => {
      if(response.data.status === false) {
        console.log("err", response.data.err);
      } else if(response.data.found === false) {
        console.log("wtf");
      }
      console.log(response.data);
    }).catch(err => console.log(err));
    this.setState({rating: null});
  }

  onChangeCurRate(event) {
    this.setState({currating: event.target.value});
  }

  render() {
    if(this.state.rating !== null) {
      return (
        <div>
          <Form>
            <FormGroup>
              <Label for="rate">Rate</Label>
              <Input required name="rate" type="select" value={this.state.currating} onChange={this.onChangeCurRate}>
                {this.state.ratingchoice.map(ch => {
                  return (<option value={ch} key={ch}>{ch}</option>)
                })}
              </Input>
            </FormGroup>
            <Button onClick={this.giveRating} color="primary">
              Rate!
            </Button>
          </Form>
        </div>
      );
    }
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
              <td>{app.status === "Accepted" ? (<Button color="primary" onClick={(event) => this.rate(event, app)}>Rate</Button>) : null}</td>
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
