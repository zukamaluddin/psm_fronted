import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import SearchForm from "./component/search";


export default class List extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
        };
    }

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    {/*<PageTitle*/}
                    {/*    heading="Carian Harian"*/}
                    {/*    // subheading="Daily reports"*/}
                    {/*    icon="pe-7s-medal icon-gradient bg-tempting-azure"*/}
                    {/*/>*/}
                    <SearchForm/>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }

}
