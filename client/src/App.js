import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { store } from './index';
import { loadUser } from './actions';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Alert from './components/layout/Alert';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import ProtectedRoute from './components/routing/ProtectedRoute';
import './App.css';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // with [], this is exactly like componentDidMount

  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Landing} />
      <section className="container">
        <Alert />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profiles" component={Profiles} />
          <Route exact path="/profile/:id" component={Profile} />
          <ProtectedRoute exact path="/dashboard" component={Dashboard} />
          <ProtectedRoute
            exact
            path="/create-profile"
            component={CreateProfile}
          />
          <ProtectedRoute exact path="/edit-profile" component={EditProfile} />
          <ProtectedRoute
            exact
            path="/add-experience"
            component={AddExperience}
          />
          <ProtectedRoute
            exact
            path="/add-education"
            component={AddEducation}
          />
          <ProtectedRoute exact path="/posts" component={Posts} />
          <ProtectedRoute exact path="/posts/:postId" component={Post} />
        </Switch>
      </section>
    </Router>
  );
};

export default App;
