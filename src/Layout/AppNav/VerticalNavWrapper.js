import React, {Component, Fragment} from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import MetisMenu from 'react-metismenu';
import {setEnableMobileMenu} from '../../reducers/ThemeOptions';
import {
    Branch,
    EquipmentNav,
    UserManagement,
    userRepairerNav,
    ReportNav,
    DashboardNav,
    lantikanNav,
    SettingNav
} from './NavItems';

export let umMenu;
export let branchMenu;
export let equipmentMenu;
export let ownerMenu;
export let repairerMenu;
export let reportMenu;
export let settingMenu;

class Nav extends Component {
    state = {};
    toggleMobileSidebar = () => {
        let {enableMobileMenu, setEnableMobileMenu} = this.props;
        setEnableMobileMenu(!enableMobileMenu);
    };

    render() {
        return (
            <Fragment>

                {
                    ["Staf", "Pentadbir"].includes(localStorage.getItem('position')) &&
                    <MetisMenu content={DashboardNav} onSelected={this.toggleMobileSidebar} activeLinkFromLocation
                               className="vertical-nav-menu" iconNamePrefix="" ref={(r) => {
                        repairerMenu = r;
                    }} classNameStateIcon="pe-7s-angle-down"/>
                }

                {
                    ["Staf", "Pentadbir"].includes(localStorage.getItem('position')) &&
                    <MetisMenu content={userRepairerNav} onSelected={this.toggleMobileSidebar} activeLinkFromLocation
                               className="vertical-nav-menu" iconNamePrefix="" ref={(r) => {
                        repairerMenu = r;
                    }} classNameStateIcon="pe-7s-angle-down"/>
                }
                {
                    ["Staf", "Pentadbir"].includes(localStorage.getItem('position')) &&
                    <MetisMenu content={Branch} onSelected={this.toggleMobileSidebar} activeLinkFromLocation
                               className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"
                               ref={(r) => {
                                   branchMenu = r;
                               }}/>
                }

                {
                    localStorage.getItem('position') === 'Admin' &&
                    <MetisMenu content={UserManagement} onSelected={this.toggleMobileSidebar} activeLinkFromLocation
                               className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"
                               ref={(r) => {
                                   umMenu = r;
                               }}/>
                }

                {
                    ["Admin"].includes(localStorage.getItem('position')) &&
                    <MetisMenu content={SettingNav} onSelected={this.toggleMobileSidebar} activeLinkFromLocation
                               className="vertical-nav-menu" iconNamePrefix="" classNameStateIcon="pe-7s-angle-down"
                               ref={(r) => {
                                   settingMenu = r;
                               }}/>
                }

            </Fragment>
        );
    }

    isPathActive(path) {
        return this.props.location.pathname.startsWith(path);
    }
}

const mapStateToProps = state => ({
    enableMobileMenu: state.ThemeOptions.enableMobileMenu
});

const mapDispatchToProps = dispatch => ({
    setEnableMobileMenu: enable => dispatch(setEnableMobileMenu(enable)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
