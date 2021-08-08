import './polyfills'
import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import { Redirect } from "react-router-dom";
import {HashRouter} from 'react-router-dom';
import './assets/base.scss';
import Main from './Main';
import configureStore from './config/configureStore';
import {Provider} from 'react-redux';
const store = configureStore();
const rootElement = document.getElementById('root');

global.global_id = localStorage.getItem('user');
global.branch_id = localStorage.getItem('branch_id');
global.token = localStorage.getItem('token');
global.position = localStorage.getItem('position');
global.repairerId = localStorage.getItem('repairerId');
global.repairerName =  localStorage.getItem('repairerName');
global.repairerSSM =  localStorage.getItem('repairerSSM');
global.repairerTempat =  localStorage.getItem('repairerTempat');

if (window.location.hostname !== "localhost") {
    global.ipServer = window.location.protocol + "//" + window.location.hostname + "/edata-be/";

} else {
    global.ipServer = 'http://localhost:8080/bernas/';   /*Logic*/
    global.ipServerB = 'http://localhost:8080/bernas/';   /*Logic*/
}

export const redirectLogout = (status, props) => {
    if(status === 401){
        localStorage.clear();

        props.history.push(`/401`);
    }
};

const renderApp = Component => {
    ReactDOM.render(
        <Provider store={store}>
            {/*<HashRouter basename={`${global.appName}`}>*/}
            <HashRouter>
                <Component/>
            </HashRouter>
        </Provider>,
        rootElement
    );
};

renderApp(Main);

if (module.hot) {
    module.hot.accept('./Main', () => {
        const NextApp = require('./Main').default;
        renderApp(NextApp);
    });
}
serviceWorker.unregister();

