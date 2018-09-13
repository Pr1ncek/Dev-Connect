import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux-store';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/set-auth-token';
import './App.css';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';
import CreateProfile from './components/create-profile/CreateProfile';
import { SET_CURRENT_USER } from './actions/types';
import { logoutUser } from './actions/auth-action';

// Check for token
const token = localStorage.JWT;
if (token) {
  setAuthToken(token);
  const decodedUser = jwt_decode(token);
  store.dispatch({ type: SET_CURRENT_USER, payload: decodedUser });
  if (decodedUser.exp < Date.now() / 1000) {
    store.dispatch(logoutUser());
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route path="/" component={Landing} exact />
            <div className="container">
              <Route path="/login" component={Login} exact />
              <Route path="/register" component={Register} exact />
              <Switch>
                <PrivateRoute path="/dashboard" component={Dashboard} exact />
              </Switch>
              <Switch>
                <PrivateRoute
                  path="/create-profile"
                  component={CreateProfile}
                  exact
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
