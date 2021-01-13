import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';
import ApplicantPage from './components/ApplicantPage';
import RecruiterPage from './components/RecruiterPage';
import RecruiterRegister from './components/loginpage/RecruiterRegister';
import ApplicantRegister from './components/loginpage/ApplicantRegister';
import ApplicantProfile from './components/ApplicantProfile';
import RecruiterProfile from './components/RecruiterProfile';

function App() {
  return (
    <Router>
      <Route path="/" exact component={LoginPage} />
      <Route path="/applicantpage" component={ApplicantPage} />
      <Route path="/recruiterpage" component={RecruiterPage} />
      <Route path="/recruiterregister" component={RecruiterRegister} />
      <Route path="/applicantregister" component={ApplicantRegister} />
      <Route path="/applicantprofile" component={ApplicantProfile} />
      <Route path="/recruiterprofile" component={RecruiterProfile} />
    </Router>
  );
}

export default App;
