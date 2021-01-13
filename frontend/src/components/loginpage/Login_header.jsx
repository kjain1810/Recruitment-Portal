import React, { Component } from 'react';
import { Navbar, NavbarBrand } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

class LoginHeader extends Component {
    render() {
        return (
          <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand>LinkedIn Lite</NavbarBrand>
            </Navbar>
          </div>
        );
    }
}

export default LoginHeader;