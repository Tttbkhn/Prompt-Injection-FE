// PasswordPath.js (formerly App.js)
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ForgetPassword from './ForgetPassword';
import ResetPassword from './ResetPassword';

const PasswordPath = () => {
  return (
    <Router>
      <Switch>
        <Route path="/forgot-password" component={ForgetPassword} />
        <Route path="/reset-password" component={ResetPassword} />
      </Switch>
    </Router>
  );
};

export default PasswordPath;
