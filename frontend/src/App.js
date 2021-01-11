import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <br/>
      <Route path="/" exact component={LoginPage} />
    </Router>
  );
}

export default App;
