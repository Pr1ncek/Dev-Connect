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
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import { SET_CURRENT_USER } from './actions/types';
import { logoutUser } from './actions/auth-action';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';

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
              <Route path="/profiles" component={Profiles} exact />
              <Route path="/profile/:handle" component={Profile} exact />
              <Switch>
                <PrivateRoute path="/dashboard" component={Dashboard} exact />
                <PrivateRoute
                  path="/create-profile"
                  component={CreateProfile}
                  exact
                />

                <PrivateRoute
                  path="/edit-profile"
                  component={EditProfile}
                  exact
                />

                <PrivateRoute
                  path="/add-experience"
                  component={AddExperience}
                  exact
                />

                <PrivateRoute
                  path="/add-education"
                  component={AddEducation}
                  exact
                />
                <PrivateRoute path="/feed" component={Posts} exact />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
