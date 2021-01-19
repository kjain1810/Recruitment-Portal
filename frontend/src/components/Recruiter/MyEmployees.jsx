import React, { Component } from "react";
import { Table } from "reactstrap";
import axios from "axios";

class MyEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: props.email,
      id: props.id,
      employees: [],
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

  render() {
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

export default MyEmployees;
