import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ component: Component, render, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (!auth.isAuthenticated && !auth.loading)
          return (
            <Redirect
              to={{
                // instead of a string, we pass a location object
                pathname: '/login',
                state: {
                  from: props.location
                }
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(ProtectedRoute);
