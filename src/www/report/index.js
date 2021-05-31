import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';


import ThemeOptions from '../../Layout/ThemeOptions/';
import daily from "./daily";
import monthly from "./monthly";
import yearly from "./yearly";
import alatan from "./alatan";
import serapan from "./serapan";
import tentusahan from "./tentusahan";
import carian from "./carian";
import maklumat from "./maklumat";


const Forms = ({match}) => (
    <Fragment>
        <ThemeOptions/>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* CreateNew CreateNew */}
                    <Route path={`${match.url}/daily`} component={daily}/>
                    <Route path={`${match.url}/monthly`} component={monthly}/>
                    <Route path={`${match.url}/yearly`} component={yearly}/>
                    <Route path={`${match.url}/alatan`} component={alatan}/>
                    <Route path={`${match.url}/serapan`} component={serapan}/>
                    <Route path={`${match.url}/tentusahan`} component={tentusahan}/>
                    <Route path={`${match.url}/carian`} component={carian}/>
                    <Route path={`${match.url}/maklumat`} component={maklumat}/>

                    {/* CreateNew List */}


                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
