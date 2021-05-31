import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

import ThemeOptions from '../../Layout/ThemeOptions/';
import List from "./List/index";
import Create from "./Create/register";
import View from "./Create/view";
import Carian from "./Create/carianstiker";
import Payments from "./Payment/index"


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Route path={`${match.url}/Create/:id`} component={Create}/>
                    <Route path={`${match.url}/List`} component={List}/>
                    <Route path={`${match.url}/View/:id`} component={View}/>
                    <Route path={`${match.url}/Carian`} component={Carian}/>
                    <Route path={`${match.url}/Payment/:id`} component={Payments}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
