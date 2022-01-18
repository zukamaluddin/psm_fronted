import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

import ThemeOptions from '../../Layout/ThemeOptions/';
import Pentadbiran from "./pentadbiran/List/pentadbiran";
import registerPentadbiran from "./pentadbiran/register/main";
import Gred from "./gred/List/gred";
import registerGred from "./gred/register/main";
import Lantikan from "./lantikan/List/lantikan";
import registerLantikan from "./lantikan/register/main";
import Generik from "./generik/List/generik";
import registerGenerik from "./generik/register/main";
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
                    <Route path={`${match.url}/gred`} component={Gred}/>
                    <Route path={`${match.url}/registerGred`} component={registerGred}/>
                    <Route path={`${match.url}/lantikan`} component={Lantikan}/>
                    <Route path={`${match.url}/registerLantikan`} component={registerLantikan}/>
                    <Route path={`${match.url}/generik`} component={Generik}/>
                    <Route path={`${match.url}/registerGenerik`} component={registerGenerik}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Forms;
