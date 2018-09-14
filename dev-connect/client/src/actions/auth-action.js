import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, GET_PROFILE } from './types';
import setAuthToken from '../utils/set-auth-token';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/auth/register', userData)
    .then(response => {
      history.push('/login');
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginUser = userData => dispatch => {
  axios
    .post('/api/auth/login', userData)
    .then(response => {
      const { token } = response.data;
      localStorage.setItem('JWT', token);
      setAuthToken(token);
      const decodedUser = jwt_decode(token);
      dispatch({
        type: SET_CURRENT_USER,
        payload: decodedUser
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const logoutUser = () => dispatch => {
  localStorage.removeItem('JWT');
  setAuthToken(false);
  dispatch({
    type: SET_CURRENT_USER,
    payload: {}
  });
  dispatch({
    type: GET_PROFILE,
    payload: null
  });
};
