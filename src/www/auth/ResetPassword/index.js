import React, {Fragment, Component} from "react";
import {Redirect} from 'react-router-dom';
import LaddaButton, {ZOOM_IN} from 'react-ladda';

import {Col, Row, Button, Form, FormGroup, Label, Input, Alert, FormFeedback} from 'reactstrap';
import dmsbIcon from "../../../assets/images/dmsb-no-bg.png";

export default class ResetPassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            msg: '',
            expZoomIn: false,
            visible: false,
            newPassword: '',
            reEnterPassword: '',

            validNewPassword: false,
            validReEnterPassword: false,

            displayMessage1: 'none',
            formMessage1: '',
            colorMessage1: '',

            displayMessage2: 'none',
            formMessage2: '',
            colorMessage2: ''
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss() {
        // this.setState({visible: false});
    }


    onChangeNewPassword(data) {
        this.setState({newPassword: data});

        if (data.length >= 4) {
            this.setState({displayMessage1: 'none', formMessage1: '', colorMessage1: '', validNewPassword: false})
        } else if (data.length === 0) {
            this.setState({
                displayMessage1: 'block',
                formMessage1: 'required',
                colorMessage1: 'red',
                validNewPassword: true
            })
        } else {
            this.setState({
                displayMessage1: 'block',
                formMessage1: '4 character or more',
                colorMessage1: 'red',
                validNewPassword: true
            })
        }

        if (data !== this.state.reEnterPassword ) {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Password and confirmation do not match',
                colorMessage2: 'red', validReEnterPassword: true
            })
        } else if (data === this.state.reEnterPassword) {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Password and confirmation match',
                colorMessage2: 'green', validReEnterPassword: false
            })
        }

    }

    onChangeReEnterPassword(data) {
        this.setState({reEnterPassword: data})
        if (data === this.state.newPassword) {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Password and confirmation match',
                colorMessage2: 'green', validReEnterPassword: true
            })
        } else {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Password and confirmation do not match',
                colorMessage2: 'red', validReEnterPassword: true
            })
        }
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
    handleSubmit = (e) => {

        let data = this.state;

        if (data['newPassword'].length !== 0 && data['reEnterPassword'].length !== 0) {
            this.toggle('expZoomIn');
            fetch(global.ipServer + "reset_password/" + this.props.match.params.token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({newPassword:data.newPassword}),
            })
                .then((response) => response.json())
                .then((data) => {
                    this.toggle('expZoomIn');
                    if (data.status === 'OK') {
                        this.setState({visible: true, msg: data.msg});
                    } else {
                        this.setState({visible: true, msg: data.msg});
                    }
                })
                .catch((error) => {
                    this.toggle('expZoomIn');
                    console.error('Error:', error);
                });
        } else {
            if (data['newPassword'].length === 0) {
                this.setState({
                    displayMessage1: 'block',
                    formMessage1: 'required',
                    colorMessage1: 'red',
                    validNewPassword: true
                });
            }
            if (data['reEnterPassword'].length === 0) {
                this.setState({
                    displayMessage2: 'block',
                    formMessage2: 'required',
                    colorMessage2: 'red',
                    validReEnterPassword: true
                });
            }
        }
    };

    render() {
        if (this.state.visible === true) {
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
                                    <img src={dmsbIcon} alt={'icon'} style={{width:'200px'}}/>
                                </div>

                                <div className="modal-dialog w-100">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="h5 modal-title">
                                                Set Semula Kata Laluan
                                                <h6 className="mt-1 mb-0 opacity-8">
                                                    <span>Isi kata laluan baru di bawah</span>
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div>
                                                <Form>
                                                    <Row form>
                                                        <Col md={12}>
                                                            {/*<Row form>*/}
                                                            {/*    <Col md={12}>*/}
                                                            {/*        <Alert color="success" isOpen={this.state.visible}*/}
                                                            {/*               toggle={this.onDismiss}>*/}
                                                            {/*            Pasword anda berjaya diubah.*/}
                                                            {/*        </Alert>*/}
                                                            {/*    </Col>*/}
                                                            {/*</Row>*/}
                                                            <FormGroup>
                                                                <Label for="password">Kata Laluan Baru</Label>
                                                                <Input type="password" name="password" id="password"
                                                                       onChange={elem => this.onChangeNewPassword(elem.target.value)}
                                                                    // valid={this.state.validNewPassword === false}
                                                                    // invalid={this.state.validNewPassword === true}
                                                                       placeholder="Taip di sini..."/>
                                                                <span style={{
                                                                    display: this.state.displayMessage1,
                                                                    width: '100%',
                                                                    marginTop: '0.25rem', fontSize: '80%',
                                                                    color: this.state.colorMessage1
                                                                }}> {this.state.formMessage1} </span>

                                                                {/*<FormFeedback valid>{this.state.formMessage1}</FormFeedback>*/}
                                                                {/*<FormFeedback>{this.state.formMessage1}</FormFeedback>*/}
                                                            </FormGroup>
                                                            <FormGroup>
                                                                <Label for="confirm">Masuk Semula Kata Laluan</Label>
                                                                <Input type="password" name="confirm" id="confirm"
                                                                       onChange={(elem) => this.onChangeReEnterPassword(elem.target.value)}
                                                                    // valid={this.state.validReEnterPassword}
                                                                    // invalid={this.state.validReEnterPassword}
                                                                       placeholder="Taip di sini..."/>
                                                                <span style={{
                                                                    display: this.state.displayMessage2,
                                                                    width: '100%',
                                                                    marginTop: '0.25rem', fontSize: '80%',
                                                                    color: this.state.colorMessage2
                                                                }}>{this.state.formMessage2}</span>
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
