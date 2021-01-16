import React, { Component } from "react";
import { Button } from "reactstrap";
import axios from "axios";

class ViewApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      applications: [],
    };
  }

  componentDidMount() {
      console.log("component mounting ", this.props.id);
    axios
      .get("http://localhost:8080/applications/jobapplications", {
        headers: {
          id: this.props.id,
        },
      })
      .then((response) => {
        if (response.data.status === false) {
          console.log(response.data.err);
        } else {
          this.setState({ applications: response.data.applications });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        {JSON.stringify(this.state.applications)}
        <Button color="primary" onClick={this.props.goBack}>
          Go Back!
        </Button>
      </div>
    );
  }
}

export default ViewApplications;
