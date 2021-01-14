import React, { Component } from "react";
import RecruiterHeader from "./Recruiter/RecruiterHeader";
import "./Recruiter/styles.css";

class RecruiterPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.location.state.email,
      id: this.props.location.state.id,
    };
    console.log(this.state);
  }
  render() {
    return (
      <div>
        <RecruiterHeader email={this.state.email} id={this.state.id} />
        <div className="page"></div>
      </div>
    );
  }
}

export default RecruiterPage;
