import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import AppHeader from '../../../Layout/AppHeader';
import AppSidebar from '../../../Layout/AppSidebar';
import AppFooter from '../../../Layout/AppFooter';


import ThemeOptions from '../../../Layout/ThemeOptions';
import registerPentadbiran from "./register/main";
import ListMember from "./List/list";

const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/register`} component={registerPentadbiran}/>
                    <Route path={`${match.url}/list`} component={ListMember}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
