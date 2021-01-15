import React, { Component } from "react";
import RecruiterHeader from "./Recruiter/RecruiterHeader";
import "./Recruiter/styles.css";
import AddJob from "./Recruiter/AddJob";
import MyJobs from "./Recruiter/MyJobs";
import MyEmployees from "./Recruiter/MyEmployees";

class RecruiterPage extends Component {
  constructor(props) {
    super(props);

    this.showAddJob = this.showAddJob.bind(this);
    this.showMyJobs = this.showMyJobs.bind(this);
    this.showMyEmployees = this.showMyEmployees.bind(this);

    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
      show: 0,
    };
    console.log(this.state);
  }

  showAddJob(event) {
    event.preventDefault();
    this.setState({ show: 0 });
  }

  showMyJobs(event) {
    event.preventDefault();
    this.setState({ show: 1 });
  }

  showMyEmployees(event) {
    event.preventDefault();
    this.setState({ show: 2 });
  }

  render() {
    var disp, ajcol, mjcol, mecol;
    if (this.state.show === 0) {
      disp = <AddJob email={this.state.email} id={this.state.id}/>;
      ajcol = "#a2a6a3";
      mjcol = "#FFFFFF";
      mecol = "#FFFFFF";
    } else if (this.state.show === 1) {
      disp = <MyJobs email={this.state.email} id={this.state.id} />;
      ajcol = "#FFFFFF";
      mjcol = "#a2a6a3";
      mecol = "#FFFFFF";
    } else if (this.state.show === 2) {
      disp = <MyEmployees email={this.state.email} id={this.state.id} />;
      ajcol = "#FFFFFF";
      mjcol = "#FFFFFF";
      mecol = "#a2a6a3";
    }
    return (
      <div>
        <RecruiterHeader email={this.state.email} id={this.state.id} />
        <div className="page">
          <br />
          <div className="header">
            <div
              className="section"
              style={{ background: ajcol }}
              onClick={this.showAddJob}
            >
              <center>Add Job</center>
            </div>
            <div
              className="section"
              style={{ background: mjcol }}
              onClick={this.showMyJobs}
            >
              <center>My Jobs</center>
            </div>
            <div
              className="section"
              style={{ background: mecol }}
              onClick={this.showMyEmployees}
            >
              <center>My Employees</center>
            </div>
          </div>
          <br />
          {disp}
        </div>
      </div>
    );
  }
}

export default RecruiterPage;
