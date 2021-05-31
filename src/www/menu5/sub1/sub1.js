import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";

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
                    <div>
                        <PageTitle
                            heading="Sub1"
                            subheading="This is sub 1 for Menu5."
                            icon="pe-7s-medal icon-gradient bg-tempting-azure"
                        />
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }

}
