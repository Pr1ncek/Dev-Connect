import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteAccount } from '../../actions/profile-action';
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick = e => {
    this.props.deleteAccount();
  };

  render() {
    const { user } = this.props.auth;

    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (loading) {
      dashboardContent = <Spinner />;
    } else {
      if (profile !== null)
        if (Object.keys(profile).length > 0) {
          dashboardContent = (
            <div>
              <ProfileActions />
              <div>
                <button className="btn btn-danger" onClick={this.onDeleteClick}>
                  Delete My Account
                </button>
              </div>
            </div>
          );
        } else {
          // User is logged in, but has not created a profile yet
          dashboardContent = (
            <div>
              <p className="lead text-muted">Welcome {user.name}</p>
              <p> You have not created a profile yet! </p>
              <Link to="/create-profile" className="btn btn-lg btn-info">
                Create Profile
              </Link>
            </div>
          );
        }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
