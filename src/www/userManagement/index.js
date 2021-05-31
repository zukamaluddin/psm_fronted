import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';


import ThemeOptions from '../../Layout/ThemeOptions/';
import list from "./list/main";
import register from "./register/main";


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* CreateNew CreateNew */}
                    <Route path={`${match.url}/list`} component={list}/>
                    <Route path={`${match.url}/register`} component={register}/>

                    {/* CreateNew List */}


                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
