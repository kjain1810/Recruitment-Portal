import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LoginHeader from './loginpage/Login_header';
import Login from './loginpage/Login';
import SignUp from './loginpage/Signup';

class LoginPage extends Component {
    state = {  }
    render() { 
        return (
          <div className="LoginPage">
            <LoginHeader></LoginHeader>
            <Login></Login>
            <SignUp></SignUp>
          </div>
        );
    }
}
 
export default LoginPage;