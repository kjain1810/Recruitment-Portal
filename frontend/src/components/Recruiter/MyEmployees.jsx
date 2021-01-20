import React, { Component } from "react";
import { Table, Input, Button, FormGroup, Form, Label, Badge } from "reactstrap";
import axios from "axios";

class MyEmployees extends Component {
  constructor(props) {
    super(props);

    this.rateEmp = this.rateEmp.bind(this);
    this.onChangeRate = this.onChangeRate.bind(this);
    this.giveRating = this.giveRating.bind(this);
    this.sortname = this.sortname.bind(this);
    this.sortdoj = this.sortdoj.bind(this);
    this.sorttitle = this.sorttitle.bind(this);
    this.sortrating = this.sortrating.bind(this);

    this.state = {
      email: props.email,
      id: props.id,
      employees: [],
      rating: null,
      currating: 0,
      alreadyrated: false,
      prevrating: 0,
      ratingchoice: [0, 1, 2, 3, 4, 5],
      name_sort: 0,
      title_sort: 0,
      doj_sort: 0,
      rating_sort: 0,
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
                    (mapper[app._id] = {
                      name:
                        app.first_name +
                        (app.middle_name ? " " + app.middle_name : "") +
                        " " +
                        app.last_name,
                      rating:
                        app.rating_cnt > 0
                          ? app.rating_sum / app.rating_cnt
                          : 0,
                    })
                );
                emps.forEach((emp) => {
                  emp.name = mapper[emp.employee].name;
                  emp.rating = mapper[emp.employee].rating;
                });
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
      recruiter: true,
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
    var app_body = {
      id: this.state.rating.employee,
      inc: {
        rating_sum: this.state.currating - this.state.prevrating,
      },
    };
    if (this.state.alreadyrated === false) {
      app_body["inc"]["rating_cnt"] = 1;
    }
    axios
      .put("http://localhost:8080/applicant/getrating", app_body)
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else if (response.data.found === false) {
          console.log("wtf");
        }
      });
    this.setState({ rating: null });
  }

  sortname(event) {
    event.preventDefault();
    this.setState({ name_sort: (this.state.name_sort + 1) % 3 });
  }
  sortdoj(event) {
    event.preventDefault();
    this.setState({ doj_sort: (this.state.doj_sort + 1) % 3 });
  }
  sorttitle(event) {
    event.preventDefault();
    this.setState({ title_sort: (this.state.title_sort + 1) % 3 });
  }
  sortrating(event) {
    event.preventDefault();
    this.setState({ rating_sort: (this.state.rating_sort + 1) % 3 });
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
    var emps = this.state.employees;
    var namecol = "secondary",
      nameorder = "";
    if (this.state.name_sort === 1) {
      namecol = "primary";
      nameorder = "Asc";
      emps.sort((a, b) => {
        if(a.name > b.name)
          return 1;
        else if(a.name < b.name)
          return -1;
        return 0;
      });
    } else if (this.state.name_sort === 2) {
      namecol = "primary";
      nameorder = "Desc";
      emps.sort((a, b) => {
        if(a.name < b.name)
          return 1;
        else if(a.name > b.name)
          return -1;
        return 0;
      });
    }
    var titlecol = "secondary",
      titleorder = "";
    if (this.state.title_sort === 1) {
      titlecol = "primary";
      titleorder = "Asc";
      emps.sort((a, b) => {
        if(a.job_title > b.job_title)
          return 1;
        else if(a.job_title < b.job_title)
          return -1;
        return 0;
      });
    } else if (this.state.title_sort === 2) {
      titlecol = "primary";
      titleorder = "Desc";
      emps.sort((a, b) => {
        if(a.job_title < b.job_title)
          return 1;
        if(a.job_title > b.job_title)
          return -1;
        return 0;
      });
    }
    var dojcol = "secondary",
      dojorder = "";
    if (this.state.doj_sort === 1) {
      dojcol = "primary";
      dojorder = "Asc";
      emps.sort((a, b) => {
        if(a.date_of_joining > b.date_of_joining)
          return 1;
        if(a.date_of_joining < b.date_of_joining)
          return -1;
        return 0;
      });
    } else if (this.state.doj_sort === 2) {
      dojcol = "primary";
      dojorder = "Desc";
      emps.sort((a, b) => {
        if(a.date_of_joining < b.date_of_joining)
          return 1;
        else if(a.date_of_joining > b.date_of_joining)
          return -1;
        return 0;
      });
    }
    var ratingcol = "secondary",
      ratingorder = "";
    if (this.state.rating_sort === 1) {
      ratingcol = "primary";
      ratingorder = "Asc";
      emps.sort((a, b) => {
        if (a.rating > b.rating)
          return 1;
        else if (a.rating < b.rating)
          return -1;
        return 0;
      });
    } else if (this.state.rating_sort === 2) {
      ratingcol = "primary";
      ratingorder = "Desc";
      emps.sort((a, b) => {
        if (a.rating < b.rating)
          return 1;
        else if (a.rating > b.rating)
          return -1;
        return 0;
      });
    }
    return (
      <div>
        <Button color={namecol} onClick={this.sortname}>
          Name <Badge color="secondary">{nameorder}</Badge>
        </Button>{" "}
        <Button color={titlecol} onClick={this.sorttitle}>
          Title <Badge color="secondary">{titleorder}</Badge>
        </Button>{" "}
        <Button color={dojcol} onClick={this.sortdoj}>
          DOJ <Badge color="secondary">{dojorder}</Badge>
        </Button>{" "}
        <Button color={ratingcol} onClick={this.sortrating}>
          Rating <Badge color="secondary">{ratingorder}</Badge>
        </Button>
        <br />
        <br />
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>DOJ</td>
              <td>Type</td>
              <td>Title</td>
              <td>Rating</td>
              <td>Rate!</td>
            </tr>
          </thead>
          <tbody>
            {emps.map((emp, index) => {
              return (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.date_of_joining}</td>
                  <td>{emp.job_type}</td>
                  <td>{emp.job_title}</td>
                  <td>{emp.rating}</td>
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
