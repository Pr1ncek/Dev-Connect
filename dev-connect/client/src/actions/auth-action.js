import axios from 'axios';
import { GET_ERRORS } from '../actions/types';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/auth/register', userData)
    .then(response => {
      console.log(response.data);
      history.push('/login');
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
