import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';


import ThemeOptions from '../../Layout/ThemeOptions/';
import sub1 from "./sub1/sub1";
import sub2 from "./sub2/sub2";


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* CreateNew CreateNew */}
                    <Route path={`${match.url}/sub1`} component={sub1}/>
                    <Route path={`${match.url}/sub2`} component={sub2}/>

                    {/* CreateNew List */}


                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
