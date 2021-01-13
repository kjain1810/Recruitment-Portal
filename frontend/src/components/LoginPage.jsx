import React, { Component } from 'react';
import LoginHeader from './loginpage/Login_header';
import Login from './loginpage/Login';
import SignUp from './loginpage/Signup';
import "./loginpage/styles.css";

class LoginPage extends Component {
    state = {  }
    render() { 
        return (
          <div className="LoginPage">
            <LoginHeader></LoginHeader>
            <div className="rowC">
              <Login className="columnLeft"></Login>
              <SignUp className="columnRight"></SignUp>
            </div>
          </div>
        );
    }
}
 
export default LoginPage;