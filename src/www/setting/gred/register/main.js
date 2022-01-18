import React, {Fragment} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";

import PageTitle from "../../../../Layout/AppMain/PageTitle";

import CreateComp from "./components/create";


class CreateMain extends React.Component {
    constructor(props) {
        super(props)
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
                    <PageTitle
                        heading="Pendaftaran Tugasan"
                        // subheading="KARTU TANDA ANGGOTA NAHDLATUL ULAMA"
                        icon="pe-7s-culture icon-gradient bg-tempting-azure"
                    />
                    <CreateComp history={this.props.history}/>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

export default CreateMain;


