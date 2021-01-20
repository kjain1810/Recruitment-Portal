import React, { Component } from "react";
import { Table, Input, Button, FormGroup, Form, Label } from "reactstrap";
import axios from "axios";

class MyEmployees extends Component {
  constructor(props) {
    super(props);

    this.rateEmp = this.rateEmp.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.giveRating = this.giveRating.bind(this);

    this.state = {
      email: props.email,
      id: props.id,
      employees: [],
      rating: null,
      currating: 0,
      alreadyrated: false,
      prevrating: 0,
      ratingchoice: [0, 1, 2, 3, 4, 5],
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8080/employees/myemployee", {
        headers: {
          id: this.state.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          var emps = response.data.employees;
          var ids = [];
          emps.forEach((emp) => ids.push(emp.employee));
          axios
            .get("http://localhost:8080/applicant/myapplicants", {
              headers: {
                ids: ids,
              },
            })
            .then((response) => {
              if (response.data.status === false) {
                console.log(response.data.err);
              } else {
                var mapper = {};
                response.data.applications.forEach(
                  (app) =>
                    (mapper[app._id] =
                      app.first_name +
                      (app.middle_name ? " " + app.middle_name : "") +
                      " " +
                      app.last_name)
                );
                emps.forEach((emp) => (emp.name = mapper[emp.employee]));
                this.setState({ employees: emps });
              }
            });
        }
      });
  }

  rateEmp(event, index) {
    event.preventDefault();
    axios
      .get("http://localhost:8080/rating/getrating", {
        headers: {
          person_giving_rating: this.state.id,
          person_getting_rating: this.state.employees[index].employee,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          this.setState({
            rating: this.state.employees[index],
            currating: 0,
            alreadyrated: false,
            prevrating: 0,
          });
        } else {
          this.setState({
            rating: this.state.employees[index],
            currating: response.data.rating.rating,
            alreadyrated: true,
            prevrating: response.data.rating.rating,
          });
        }
      });
  }

  onChangeRate(event) {
    this.setState({ currating: event.target.value });
  }

  giveRating(event) {
    event.preventDefault();
    const rating_body = {
      person_giving_rating: this.state.id,
      person_getting_rating: this.state.rating.employee,
      rating: this.state.currating,
      recruiter: true
    };
    axios.put("http://localhost:8080/rating/addrating", rating_body).then(response => {
      if(response.data.status === false) {
        console.log(response.data.err);
      } else {
        console.log(response.data.rating);
      }
    }).catch(err => console.log(err));
    var app_body = {
      id: this.state.rating.employee,  
      inc: {
        rating_sum: this.state.currating - this.state.prevrating
      }
    };
    if(this.state.alreadyrated === false) {
      app_body["inc"]["rating_cnt"] = 1;
    }
    axios.put("http://localhost:8080/applicant/getrating", app_body).then(response => {
      if(response.data.status === false) {
        console.log(response.data.err);
      } else if(response.data.found === false) {
        console.log("wtf");
      }
    });
    this.setState({ rating: null });
  }

  render() {
    if (this.state.rating !== null) {
      return (
        <div>
          <Form onSubmit={this.giveRating}>
            <FormGroup>
              <Label for="rate">Rate</Label>
              <Input
                required
                name="rate"
                type="select"
                value={this.state.currating}
                onChange={this.onChangeRate}
              >
                {this.state.ratingchoice.map((ch) => {
                  return (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  );
                })}
              </Input>
            </FormGroup>
            <Button color="primary">Rate!</Button>
          </Form>
        </div>
      );
    }
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>DOJ</td>
              <td>Type</td>
              <td>Title</td>
              <td>Rate!</td>
            </tr>
          </thead>
          <tbody>
            {this.state.employees.map((emp, index) => {
              return (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.date_of_joining}</td>
                  <td>{emp.job_type}</td>
                  <td>{emp.job_title}</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={(event) => this.rateEmp(event, index)}
                    >
                      Rate!
                    </Button>
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

export default MyEmployees;
