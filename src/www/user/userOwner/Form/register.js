import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Card, CardBody, Col, Container, Row,} from 'reactstrap';
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import MultiStep from "./Wizard";


const steps = [
    {name: 'Information'},
    {name: 'Complete'}
];

export default class RegisterForm extends React.Component {
    // constructor(props) {
    //     super(props);
    // }


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
                    <Container fluid>
                        <PageTitle
                            heading="Pendaftaran Pemilik Baru"
                            // subheading="KARTU TANDA ANGGOTA NAHDLATUL ULAMA"
                            icon="pe-7s-users icon-gradient bg-tempting-azure"
                        />
                        <Row>
                            <Col md="12" lg="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <MultiStep showNavigation={true} steps={steps}/>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
