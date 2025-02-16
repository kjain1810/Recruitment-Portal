import React, { Component } from 'react'
import {Navbar, Nav, NavItem, NavbarBrand, NavLink} from 'reactstrap';
import {NavLink as RRNavLink} from 'react-router-dom';

class RecruiterHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
      id: this.props.id,
    };
  }
  render() {
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand>LinkedIn Lite</NavbarBrand>
        <Nav className="mr-auto" navbar>
            <NavItem>
                <NavLink to={{
                    pathname: "/recruiterpage",
                    state: {email: this.state.email, id: this.state.id}
                }} tag={RRNavLink}>
                    Jobs
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink to={{
                    pathname: "/recruiterprofile",
                    state: {email: this.state.email, id: this.state.id}
                }} tag={RRNavLink}>
                    My Profile
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink to={{
                    pathname: "/"
                }} tag={RRNavLink}>
                    LogOut
                </NavLink>
            </NavItem>
        </Nav>
      </Navbar>
    );
  }
}
 
export default RecruiterHeader;