import React, { Fragment } from 'react';
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import PageTitle from '../../Layout/AppMain/PageTitle';
// Layout
import AppHeader from '../../Layout/AppHeader';
import AppSidebar from '../../Layout/AppSidebar';
import AppFooter from '../../Layout/AppFooter';

// Theme Options
import ThemeOptions from '../../Layout/ThemeOptions';
import HomeComponent from "./Component";

const Home = ({ match }) => (
    <Fragment>
        <ThemeOptions />
        <AppHeader />
        <div className="app-main">
            <AppSidebar />
            <div className="app-main__outer">
                <div className="app-main__inner">
                    <Fragment>
                        <CSSTransitionGroup component="div" transitionName="TabsAnimation" transitionAppear={true}
                            transitionAppearTimeout={0} transitionEnter={false} transitionLeave={false}>

                            <PageTitle heading="Dashboard" breadcrumbTitle="Dashboard"
                                icon="pe-7s-graph3 icon-gradient bg-ripe-malin" />


                            <HomeComponent />

                        </CSSTransitionGroup>
                    </Fragment>

                </div>
                <AppFooter />
            </div>
        </div>
    </Fragment>
);

export default Home;