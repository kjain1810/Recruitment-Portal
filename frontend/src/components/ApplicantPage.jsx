import React, { Component } from "react";
import ApplicantHeader from "./Applicant/ApplicantHeader";
import "./Applicant/styles.css";
import ApplicationPortal from "./Applicant/ApplicationPortal";
import MyApplications from "./Applicant/MyApplications";

class ApplicantPage extends Component {
  constructor(props) {
    super(props);

    this.viewJobs = this.viewJobs.bind(this);
    this.viewApps = this.viewApps.bind(this);

    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
      showing: 0,
    };
  }

  viewJobs(event) {
    event.preventDefault();
    this.setState({ showing: 0 });
  }
  viewApps(event) {
    event.preventDefault();
    this.setState({ showing: 1 });
  }

  render() {
    var jobColor, myAppsColor, disp;
    if (this.state.showing === 0) {
      jobColor = "#a2a6a3";
      myAppsColor = "#FFFFFF";
      disp = <ApplicationPortal email={this.state.email} id={this.state.id} />;
    } else {
      jobColor = "#FFFFFF";
      myAppsColor = "#a2a6a3";
      disp = <MyApplications email={this.state.email} id={this.state.id} />;
    }
    return (
      <div>
        <ApplicantHeader email={this.state.email} id={this.state.id} />
        <div className="page">
          <br />
          <div className="header">
            <div
              style={{ background: jobColor, width: "50%" }}
              onClick={this.viewJobs}
            >
              <center>Jobs</center>
            </div>
            <div
              style={{ background: myAppsColor, width: "50%" }}
              onClick={this.viewApps}
            >
              <center>My Applications</center>
            </div>
          </div>
          <br />
          {disp}
        </div>
      </div>
    );
  }
}

export default ApplicantPage;
