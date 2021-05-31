import React, {Fragment} from 'react';
import cx from 'classnames';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import HeaderLogo from '../AppLogo';
import UserBox from './Components/UserBox';

// import i18n from '../../i18n'
// import { changeLanguage } from "react-i18next";

class Header extends React.Component {
    // changeLang = (lang) => {
    //     i18n.changeLanguage(lang);
    // }

    render() {
        let {
            headerBackgroundColor,
            enableMobileMenuSmall,
            enableHeaderShadow
        } = this.props;
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    className={cx("app-header", headerBackgroundColor, {'header-shadow': enableHeaderShadow})}
                    transitionName="HeaderAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={1500}
                    transitionEnter={false}
                    transitionLeave={false}>

                    <HeaderLogo/>

                    <div className={cx(
                        "app-header__content",
                        {'header-mobile-open': enableMobileMenuSmall},
                    )}>
                        <div className="app-header-left">
                            {/*<SearchBox/>*/}
                            {/*<MegaMenu/>*/}
                        </div>
                        <div className="app-header-right">
                            {/*<HeaderDots/>*/}
                            {/*<button onClick={() => this.changeLang('my')}>my</button>*/}
                            {/*<button onClick={() => this.changeLang('en')}>en</button>*/}
                            <UserBox/>
                            {/*<HeaderRightDrawer/>*/}
                        </div>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
    closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
    headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
    enableMobileMenuSmall: state.ThemeOptions.enableMobileMenuSmall,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
