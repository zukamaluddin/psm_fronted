import {Route, Redirect, Switch, Link} from 'react-router-dom';
import React, {Suspense, lazy, Fragment} from 'react';
import Loader from 'react-loaders'

import {
    ToastContainer,
} from 'react-toastify';
import {Col} from "reactstrap";
import dashboard from "../../www/Dashboard";

const Auth = lazy(() => import('../../www/auth'));
const userOwner = lazy(() => import('../../www/user/userOwner'));
const userRepairer = lazy(() => import('../../www/user/userRepairer'));
// const certificateNav = lazy(() => import('../../www/certificate'));

const userManagement = lazy(() => import('../../www/userManagement'));
const branch = lazy(() => import('../../www/branch'));
const equipment = lazy(() => import('../../www/equipment'));
const report = lazy(() => import('../../www/report'));
const setting = lazy(() => import('../../www/setting'));


export const fakeAuth = {
    isAuthenticated: localStorage.getItem('user'),
    authenticate(cb) {
        localStorage.setItem('token', global.token)
        localStorage.setItem('user', global.global_id)
        localStorage.setItem('role', global.role)
        localStorage.setItem('position', global.position)
        localStorage.setItem('name', global.name)
        localStorage.setItem('picture', global.picture)
        localStorage.setItem('branch_id', global.branch_id)
        this.isAuthenticated = localStorage.getItem('user')
    },
    signout(cb) {
        localStorage.clear()
        this.isAuthenticated = null


    }
};

export const Page404 = () => (
    <div className="h-100 bg-animation">
        <div className="d-flex h-100 justify-content-center align-items-center">
            <Col md="8" className="mx-auto app-login-box">
                <div className="modal-dialog w-100 mx-auto">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="h5 modal-title text-center">
                                <div className="mt-2">
                                    <h2 style={{fontFamily: 'fantasy'}}>Error 404-Not Found</h2>
                                    <h6>Mohon maaf, halaman yang Anda cari tidak ditemukan.
                                        Kemungkinan halaman dihapus atau Anda salah menuliskan URL.
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer clearfix">
                            <div className="float-left">
                                <span>Kembali</span>
                            </div>
                            <div className="float-right">
                                <Link className="mr-2 btn-icon btn-icon-only btn btn-primary" to='/login'><i
                                    className='lnr-home'/></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    </div>
);
export const Page401 = () => (
    <div className="h-100 bg-animation">
        <div className="d-flex h-100 justify-content-center align-items-center">
            <Col md="8" className="mx-auto app-login-box">
                <div className="modal-dialog w-100 mx-auto">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="h5 modal-title text-center">
                                <div className="mt-2">
                                    <h2 style={{fontFamily: 'fantasy'}}>Error 401-Unauthorized</h2>
                                    <h6>Mohon maaf, halaman yang Anda cari tidak dapat diproses.
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer clearfix">
                            <div className="float-left">
                                <span>Kembali</span>
                            </div>
                            <div className="float-right">
                                <Link className="mr-2 btn-icon btn-icon-only btn btn-primary" to='/login'><i
                                    className='lnr-home'/></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>
        </div>
    </div>
);
const AppMain = () => {

    return (
        <Fragment>
            <Suspense fallback={
                <div className="loader-container">
                    <div className="loader-container-inner">
                        <div className="text-center">
                            <Loader type="ball-pulse-rise"/>
                        </div>
                    </div>
                </div>
            }>
                <Switch>
                    {/*<Route path="/401" component={Page401}/>*/}
                    <Route exact path="/forgot-password" component={Auth}/>
                    <Route exact path="/reset-password/:token" component={Auth}/>
                    <Route exact path="/register" component={Auth}/>
                    <Route path="/dashboard" component={dashboard}/>
                    <Route path="/branch" component={branch}/>
                    <Route path="/owner" component={userOwner}/>
                    <Route path="/repairer" component={userRepairer}/>
                    {/*<Route path="/certificate" component={certificateNav}/>*/}
                    <Route path="/Equipment" component={equipment}/>
                    <Route path="/report" component={report}/>
                    <Route path="/setting" component={setting}/>
                    {
                        localStorage.getItem('user') ?
                            <Route path="/user" component={userManagement}/>:
                            <Route exact path="/login" component={Auth}/>
                    }
                    {
                        localStorage.getItem('position') === 'Admin' ?
                            <Redirect to={'/user/list'}/> : <Redirect to={'/dashboard'}/>
                    }



                    <Route component={Page404}/>

                </Switch>

            </Suspense>

            <Route exact path="/" render={() => (
                <Redirect to="/login"/>
            )}/>
            <ToastContainer/>
        </Fragment>
    )
};

export default AppMain;
