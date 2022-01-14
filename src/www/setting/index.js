import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

import ThemeOptions from '../../Layout/ThemeOptions/';
import Pentadbiran from "./pentadbiran";
import registerPentadbiran from "./registerPentadbiran/main";
// import List from "./List/list";


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/pentadbiran`} component={Pentadbiran}/>
                    <Route path={`${match.url}/registerPentadbiran`} component={registerPentadbiran}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
