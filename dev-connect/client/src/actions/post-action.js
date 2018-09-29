import axios from 'axios';

import {
  ADD_POST,
  GET_ERRORS,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST,
  CLEAR_ERRORS
} from './types';

// Add a post
export const addPost = postData => dispatch => {
  axios
    .post('/api/posts', postData)
    .then(response =>
      dispatch({
        type: ADD_POST,
        payload: response.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Fetch all posts
export const getPosts = () => dispatch => {
  dispatch({ type: POST_LOADING });
  axios
    .get('/api/posts')
    .then(response =>
      dispatch({
        type: GET_POSTS,
        payload: response.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};
// Fetch one post
export const getPost = id => dispatch => {
  dispatch({ type: POST_LOADING });
  axios
    .get(`/api/posts/${id}`)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    );
};

// Comment on a post
export const addComment = (id, newComment) => dispatch => {
  axios
    .post(`/api/comments/${id}`, newComment)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Comment on a post
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/comments/${postId}/${commentId}`)
    .then(response =>
      dispatch({
        type: GET_POST,
        payload: response.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Like Post
export const likePost = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(response => dispatch(getPosts()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/${id}`)
    .then(response =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
