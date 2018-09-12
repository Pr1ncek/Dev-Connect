import axios from 'axios';
import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS } from '../actions/types';

// Get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/profile')
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    });
};

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(response => {
      history.push('/dashboard');
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};
