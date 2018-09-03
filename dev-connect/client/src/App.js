import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route path="/" component={Landing} exact />
          <div className="container">
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
