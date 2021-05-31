import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import Login from './Login';
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Register from "./Register";

const Auth = ({match}) => (
    <Fragment>
        <div className="app-container">
            <Route path={`/login`} component={Login}/>
            <Route path={`/forgot-password`} component={ForgotPassword}/>
            <Route path={`/reset-password/:token`} component={ResetPassword}/>
            <Route path={`/register`} component={Register}/>
        </div>

    </Fragment>
);

export default Auth;
