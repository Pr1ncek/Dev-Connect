import axios from 'axios';
import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  GET_PROFILES
} from './types';
import { logoutUser } from './auth-action';

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

export const getProfileByHandle = handle => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/profile/handle/' + handle)
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILE,
        payload: null
      });
    });
};

export const getAllProfiles = () => dispatch => {
  dispatch({ type: PROFILE_LOADING });
  axios
    .get('/api/profile/all')
    .then(res => {
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_PROFILES,
        payload: null
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

export const deleteAccount = () => dispatch => {
  if (window.confirm('Are you sure? This will delete you account!')) {
    axios
      .delete('/api/profile')
      .then(res => {
        dispatch(logoutUser());
      })
      .catch(err => {
        dispatch({ type: GET_ERRORS, payload: err.response.data });
      });
  }
};

export const addExperience = (data, history) => dispatch => {
  axios
    .post('/api/profile/experience', data)
    .then(response => {
      history.push('/dashboard');
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};

export const addEducation = (data, history) => dispatch => {
  axios
    .post('/api/profile/education', data)
    .then(response => {
      history.push('/dashboard');
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};

export const deleteExperience = id => dispatch => {
  axios
    .delete('/api/profile/experience/' + id)
    .then(response => {
      dispatch({
        type: GET_PROFILE,
        payload: response.data
      });
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};

export const deleteEducation = id => dispatch => {
  axios
    .delete('/api/profile/education/' + id)
    .then(response => {
      dispatch({
        type: GET_PROFILE,
        payload: response.data
      });
    })
    .catch(err => {
      dispatch({ type: GET_ERRORS, payload: err.response.data });
    });
};
