import React, {Fragment, Component} from "react";
import LaddaButton, {ZOOM_IN} from 'react-ladda';
import {Col, Row, Button, Form, FormGroup, Label, Input, Alert, FormFeedback} from 'reactstrap';
import {Redirect} from "react-router-dom";

import {authRegex} from "../Login";
import dmsbIcon from "../../../assets/images/logo.png";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',  visible: false, redirect: false, msg: '', validEmailMsg:false,expZoomIn: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        this.setState({visible: false});
    }

    handleChange(event) {


        if (authRegex.email_regex.test(event.target.value)) {
            this.setState({validEmailMsg: false});
        } else {
            this.setState({validEmailMsg: true});
        }

        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change);

    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.handleSubmit()
        }
    }

    toggle(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        })
    }
    handleSubmit = (event) => {

        let data = this.state;
        if (data['email'].length !== 0) {
            this.toggle('expZoomIn');

            fetch(global.ipServer + "forgot_password", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email:data.email, frontendUrl : window.location.protocol + "//" + window.location.hostname}),
            })
                .then((response) => response.json())
                .then((data) => {
                    this.toggle('expZoomIn');

                    if (data.status === 'OK') {
                        this.setState({redirect: true, msg: data.msg});
                    } else {
                        this.setState({visible: true, msg: data.msg});
                    }
                })
                .catch((error) => {
                    this.toggle('expZoomIn');
                    this.setState({msg: error.toString(), visible: true});
                });
        }else{
            this.setState({validEmailMsg: true});
        }
    };

    render() {
        if (this.state.redirect === true) {
            return (<Redirect to={{
                pathname: '/login',
                state: {noti_msg: this.state.msg}
            }}/>)
        } else {
            return (

                <Fragment>
                    <div className="h-100 bg-animation">
                        <div className="d-flex h-100 justify-content-center align-items-center">
                            <Col md="6" className="mx-auto app-login-box">
                                {/*<div className="app-logo-inverse mx-auto mb-3"/>*/}
                                <div style={{
                                    textAlign: 'center', fontFamily: '"Times New Roman", Times, serif',
                                    textShadow: '0px 0px 10px white'
                                }}>
                                    {/*<h1 style={{ fontWeight: 'bold'}}>Sistem e-Data</h1>*/}
                                    <img src={dmsbIcon} alt={'icon'} style={{width:'500px'}}/>
                                </div>

                                <div className="modal-dialog w-100">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="h5 modal-title">
                                                Lupa Kata Laluan?
                                                <h6 className="mt-1 mb-0 opacity-8">
                                                    <span>Isi emel anda di bawah.</span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div>
                                                <Form>
                                                    <Row form>
                                                        <Col md={12}>
                                                            <Row form>
                                                                <Col md={12}>
                                                                    <Alert color='danger' isOpen={this.state.visible}
                                                                           toggle={this.onDismiss}>
                                                                        {this.state.msg}
                                                                    </Alert>
                                                                </Col>
                                                            </Row>
                                                            <FormGroup>
                                                                <Label for="exampleEmail">Email</Label>
                                                                <Input type="email" name="email" id="exampleEmail"
                                                                       onChange={this.handleChange.bind(this)}
                                                                       invalid={this.state.validEmailMsg}
                                                                       placeholder="Taip di sini"/>
                                                                <FormFeedback >
                                                                    Format emel tidak sah
                                                                </FormFeedback>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </div>
                                            <div className="divider"/>
                                            <h6 className="mb-0">
                                                <a href="#/login" className="text-primary">Log Masuk</a>
                                            </h6>
                                        </div>
                                        <div className="modal-footer clearfix">
                                            <div className="float-right">
                                                <LaddaButton className="mb-2 mr-2 btn btn-primary"
                                                        loading={this.state.expZoomIn}
                                                        data-style={ZOOM_IN}
                                                        onClick={this.handleSubmit}>Hantar</LaddaButton>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="text-center text-white opacity-8 mt-3">*/}
                                {/*    Copyright &copy; ArchitectUI 2019*/}
                                {/*</div>*/}
                            </Col>
                        </div>
                    </div>
                </Fragment>
            );
        }
    }
}
