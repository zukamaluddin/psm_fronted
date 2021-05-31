import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';


import MultiStep from './Wizard';

import PageTitle from '../../../Layout/AppMain/PageTitle';


export default class FormWizardVar2 extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this.state = {
            cSelected: [],
            dropdownOpen: false
        };

        this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    onMouseEnter() {
        this.setState({dropdownOpen: true});
    }

    onMouseLeave() {
        this.setState({dropdownOpen: false});
    }

    onCheckboxBtnClick(selected) {
        const index = this.state.cSelected.indexOf(selected);
        if (index < 0) {
            this.state.cSelected.push(selected);
        } else {
            this.state.cSelected.splice(index, 1);
        }
        this.setState({cSelected: [...this.state.cSelected]});
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
                            heading="Pendaftaran Pengguna Baru"
                            // subheading="Mendaftarkan pengguna baru"
                            icon="pe-7s-add-user text-info"
                        />
                        <Row>
                            <Col md="12" lg="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <div className="forms-wizard-alt">
                                            <MultiStep history={this.props.history}/>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
