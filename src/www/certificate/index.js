import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';


import ThemeOptions from '../../Layout/ThemeOptions/';
import main from "./menu";


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* CreateNew CreateNew */}
                    <Route path={`${match.url}`} component={main}/>

                    {/* CreateNew List */}


                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
