import uuid from 'uuid';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

// ********* ALERT ACTIONS *********
// Set Alert
export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  const id = uuid.v4();

  dispatch({ type: 'SET_ALERT', payload: { msg, alertType, id } });

  setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
};

// ********* USER ACTIONS *********

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: user } = await axios.get('/api/users/me');

    dispatch({ type: 'USER_LOADED', payload: { user } });
  } catch (ex) {
    dispatch({ type: 'AUTH_ERROR' });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  try {
    const { data: token } = await axios.post('/api/users', {
      name,
      email,
      password
    });

    dispatch({ type: 'REGISTER_SUCCESS', payload: { token } });
    dispatch(loadUser());
  } catch (ex) {
    dispatch({ type: 'REGISTER_FAIL' });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  try {
    const { data: token } = await axios.post('/api/auth', {
      email,
      password
    });

    dispatch({ type: 'LOGIN_SUCCESS', payload: { token } });
    dispatch(loadUser());
  } catch (ex) {
    dispatch({ type: 'LOGIN_FAIL' });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Logout User
export const logout = () => dispatch => {
  dispatch({ type: 'CLEAR_PROFILE' });
  dispatch({ type: 'LOGOUT' });
};

// ********* PROFILE ACTIONS *********

// Get Current User's Profile
export const getCurrentProfile = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.get('/api/profile/me');

    dispatch({ type: 'GET_PROFILE', payload: profile });
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
  }
};

// Get All Profiles
export const getProfiles = () => async dispatch => {
  try {
    const { data: profiles } = await axios.get('/api/profile');

    dispatch({ type: 'GET_PROFILES', payload: profiles });
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
  }
};

// Get Profile by ID
export const getProfileById = userId => async dispatch => {
  try {
    const { data: profile } = await axios.get(`/api/profile/user/${userId}`);

    dispatch({ type: 'GET_PROFILE', payload: profile });
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
  }
};

// Get Github Repos
export const getGithubRepos = username => async dispatch => {
  try {
    const { data: repos } = await axios.get(`/api/profile/github/${username}`);

    dispatch({ type: 'GET_REPOS', payload: repos });
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
  }
};

// Create or Update Profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.post('/api/profile', formData);

    dispatch({ type: 'GET_PROFILE', payload: profile });
    dispatch(
      setAlert(edit ? 'Profile updated.' : 'Profile created.', 'success')
    );

    if (!edit) history.push('/dashboard');
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.put(
      '/api/profile/experience',
      formData
    );

    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    dispatch(setAlert('Experience added.', 'success'));

    history.push('/dashboard');
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Add Education
export const addEducation = (formData, history) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.put(
      '/api/profile/education',
      formData
    );

    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    dispatch(setAlert('Education added.', 'success'));

    history.push('/dashboard');
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.delete(
      `/api/profile/experience/${id}`
    );

    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    dispatch(setAlert('Experience removed.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const { data: profile } = await axios.delete(
      `/api/profile/education/${id}`
    );

    dispatch({ type: 'UPDATE_PROFILE', payload: profile });
    dispatch(setAlert('Education removed.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'PROFILE_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Delete Account & Profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      await axios.delete(`/api/profile/`);

      dispatch({ type: 'CLEAR_PROFILE' });
      dispatch({ type: 'ACCOUNT_DELETED' });

      dispatch(setAlert('Your account has been deleted.'));
    } catch (ex) {
      dispatch({
        type: 'PROFILE_ERROR',
        payload: { msg: ex.response.data, status: ex.response.status }
      });
      dispatch(setAlert(ex.response.data, 'danger'));
    }
  }
};
// ********* POST ACTIONS *********
// Get Posts
export const getPosts = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: posts } = await axios.get('/api/posts');

    dispatch({ type: 'GET_POSTS', payload: posts });
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Add Like
export const addLike = postId => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: likes } = await axios.put(`/api/posts/like/${postId}`);

    dispatch({ type: 'UPDATE_LIKES', payload: { postId, likes } });
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Remove Like
export const removeLike = postId => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: likes } = await axios.put(`/api/posts/unlike/${postId}`);

    dispatch({ type: 'UPDATE_LIKES', payload: { postId, likes } });
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Delete Post
export const deletePost = postId => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    await axios.delete(`/api/posts/${postId}`);

    dispatch({ type: 'DELETE_POST', payload: postId });

    dispatch(setAlert('Post removed.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Add Post
export const addPost = formData => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: post } = await axios.post('/api/posts', formData);

    dispatch({ type: 'ADD_POST', payload: post });

    dispatch(setAlert('Post created.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Get Post
export const getPost = postId => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: post } = await axios.get(`/api/posts/${postId}`);

    dispatch({ type: 'GET_POST', payload: post });
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Add Comment
export const addComment = (postId, formData) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const { data: comments } = await axios.post(
      `/api/posts/comment/${postId}`,
      formData
    );

    dispatch({ type: 'ADD_COMMENT', payload: comments });

    dispatch(setAlert('Comment added.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    dispatch({ type: 'REMOVE_COMMENT', payload: commentId });

    dispatch(setAlert('Comment deleted.', 'success'));
  } catch (ex) {
    dispatch({
      type: 'POST_ERROR',
      payload: { msg: ex.response.data, status: ex.response.status }
    });
    dispatch(setAlert(ex.response.data, 'danger'));
  }
};
