import React, { Component } from "react";
import ApplicantHeader from "./Applicant/ApplicantHeader";
import "./Applicant/styles.css";

class ApplicantPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
    };
  }
  render() {
    return (
      <div>
        <ApplicantHeader email={this.state.email} id={this.state.id} />
        <div className="page"></div>
      </div>
    );
  }
}

export default ApplicantPage;
