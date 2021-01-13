import React, { Component } from 'react'
import './Applicant/styles.css'
import ApplicantHeader from './Applicant/ApplicantHeader'

class ApplicantProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
    };
  }
  render() {
    return (
      <div className="page">
        <ApplicantHeader email={this.state.email} id={this.state.id} />
      </div>
    );
  }
}
 
export default ApplicantProfile;