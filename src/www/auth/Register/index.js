import React, {Fragment, Component} from "react";
import {Redirect} from 'react-router-dom';
import LaddaButton, {ZOOM_IN} from 'react-ladda';

import {Col, Row, Button, Form, FormGroup, Label, Input, Alert, FormFeedback} from 'reactstrap';
import API from "../../../utils/apiBranch";
import {authRegex} from "../Login/index"
import dmsbIcon from "../../../assets/images/dmsb-no-bg.png";

export default class Register extends Component {

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
            colorMessage2: '',

            branch: '',
            branchData: [],
            validForm: {}

        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount = async () => {
        let branches = await API.getAllBranches();
        this.setState({branchData: branches.data})
    };


    onChangeNewPassword(data) {
        this.setState({newPassword: data});

        if (data.length >= 4) {
            this.setState({displayMessage1: 'none', formMessage1: '', colorMessage1: '', validNewPassword: false})
        } else if (data.length === 0) {
            this.setState({
                displayMessage1: 'block',
                formMessage1: 'Wajib isi',
                colorMessage1: 'red',
                validNewPassword: true
            })
        } else {
            this.setState({
                displayMessage1: 'block',
                formMessage1: '4 aksara atau lebih',
                colorMessage1: 'red',
                validNewPassword: true
            })
        }

        if (data !== this.state.reEnterPassword) {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Kata laluan dan pengesahan kata laluan tidak sepadan',
                colorMessage2: 'red', validReEnterPassword: true
            })
        } else if (data === this.state.reEnterPassword) {
            this.setState({
                displayMessage2: 'none',
            })
        }

    }

    onChangeReEnterPassword(data) {
        this.setState({reEnterPassword: data})
        if (data === this.state.newPassword) {
            this.setState({
                displayMessage2: 'none',
            })
        } else {
            this.setState({
                displayMessage2: 'block',
                formMessage2: 'Kata laluan dan pengesahan kata laluan tidak sepadan',
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
        let fdata = {
            name: data.name,
            staffId: data.staffId,
            branch: data.branch,
            email: data.email,
            phone: data.phone,
            password: data.newPassword
        };

        let copy = this.state.validForm;

        (this.state.name === '' || this.state.name === undefined) ? copy.name = true : copy.name = false;
        (this.state.branch === '' || this.state.branch === undefined) ? copy.branch = true : copy.branch = false;
        (this.state.staffId === '' || this.state.staffId === undefined) ? copy.staffId = true : copy.staffId = false;
        (this.state.phone === '' || this.state.phone === undefined) ? copy.phone = true : copy.phone = false;
        (this.state.email === '' || this.state.email === undefined) ? copy.email = true : copy.email = false;


        if (data['newPassword'].length !== 0 && data['reEnterPassword'].length !== 0) {
            if (data['newPassword'] === data['reEnterPassword']) {
                this.toggle('expZoomIn');
                fetch(global.ipServer + "user/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fdata),
                })
                    .then((response) => response.json())
                    .then((res) => {
                        this.toggle('expZoomIn');
                        if (res.status === 'OK') {
                            this.setState({visible: true, msg: res.msg});
                        } else {
                            this.setState({visible: true, msg: res.msg});
                        }
                    })
                    .catch((error) => {
                        this.toggle('expZoomIn');
                        console.error('Error:', error);
                    });
            }

        } else {
            if (data['newPassword'].length === 0) {
                this.setState({
                    displayMessage1: 'block',
                    formMessage1: 'Wajib isi',
                    colorMessage1: 'red',
                    validNewPassword: true
                });
            }
            if (data['reEnterPassword'].length === 0) {
                this.setState({
                    displayMessage2: 'block',
                    formMessage2: 'Wajib isi',
                    colorMessage2: 'red',
                    validReEnterPassword: true
                });
            }
        }
    };

    render() {
        let branchData = this.state.branchData;

        if (this.state.visible === true) {
            return (<Redirect to={{
                pathname: '/login',
                state: {noti_msg: this.state.msg}
            }}/>)
        } else {
            return (

                <Fragment>
                    <div className="h-100 bg-transparent">
                        <div className="d-flex h-100 justify-content-center align-items-center">
                            <Col md="8" className="mx-auto app-login-box">
                                <div style={{
                                    textAlign: 'center', fontFamily: '"Times New Roman", Times, serif',
                                    textShadow: '0px 0px 10px white'
                                }}>
                                    {/*<h1 style={{fontWeight: 'bold'}}>Sistem e-Data</h1>*/}
                                    <img src={dmsbIcon} alt={'icon'} style={{width:'200px'}}/>
                                </div>

                                <div className="modal-dialog w-100">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-title">
                                                <h4 className="mt-2">
                                                    <div>Pendaftaran</div>
                                                    <span>Cipta akaun e-Data anda</span>
                                                </h4>
                                            </div>
                                            <Row className="divider"/>
                                            <Row form>

                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="text" name="name" id="name"
                                                               onChange={elem => this.setState({name: elem.target.value})}
                                                               invalid={this.state.validForm.name}
                                                               placeholder="Nama"/>
                                                        <FormFeedback><i>Wajib isi</i></FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input name="branch" type="select" id='branch'
                                                               invalid={this.state.validForm.branch}
                                                               value={this.state.branch}
                                                               onChange={(dataEl) => {
                                                                   this.setState({branch: dataEl.target.value});
                                                               }}
                                                        >
                                                            <option key={''} value={''} disabled>Pilih cawangan...
                                                            </option>
                                                            {branchData.map(option => (
                                                                <option key={option.id} value={option.id}>
                                                                    {option.code} - {option.kawasan}
                                                                </option>
                                                            ))}

                                                        </Input>
                                                        <FormFeedback><i>Wajib isi</i></FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Input type="text" name="staffId" id="staffId"
                                                               invalid={this.state.validForm.staffId}
                                                               onChange={elem => this.setState({staffId: elem.target.value})}
                                                               placeholder="ID Staff"/>
                                                        <FormFeedback><i>Wajib isi</i></FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Input type="text" name="phone" id="phone"
                                                               invalid={this.state.validForm.phone}
                                                               onChange={elem => this.setState({phone: elem.target.value})}
                                                               placeholder="No Telefon"/>
                                                        <FormFeedback><i>Wajib isi</i></FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row className="divider"/>
                                            <Row form>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="email" name="email" id="email"
                                                               invalid={this.state.validForm.email}
                                                               onChange={elem => {
                                                                   if (authRegex.email_regex.test(elem.target.value)) {
                                                                       this.state.validForm.email = false;
                                                                   } else {
                                                                       this.state.validForm.email = true;
                                                                   }
                                                                   this.setState({email: elem.target.value})
                                                               }}
                                                               placeholder="Emel"/>
                                                        <FormFeedback><i>Wajib isi dengan format emel yang betul</i></FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="password" name="password" id="password"
                                                               onChange={elem => this.onChangeNewPassword(elem.target.value)}
                                                               placeholder="Kata laluan"/>
                                                        <span style={{
                                                            display: this.state.displayMessage1,
                                                            width: '100%', fontStyle: 'italic',
                                                            marginTop: '0.25rem', fontSize: '80%',
                                                            color: this.state.colorMessage1
                                                        }}> {this.state.formMessage1} </span>

                                                    </FormGroup>
                                                    <FormGroup>
                                                        <Input type="password" name="confirm" id="confirm"
                                                               onChange={(elem) => this.onChangeReEnterPassword(elem.target.value)}
                                                               placeholder="Pengesahan kata laluan"/>
                                                        <span style={{
                                                            display: this.state.displayMessage2,
                                                            width: '100%', fontStyle: 'italic',
                                                            marginTop: '0.25rem', fontSize: '80%',
                                                            color: this.state.colorMessage2
                                                        }}>{this.state.formMessage2}</span>
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                            <Row className="divider"/>
                                            <h6 className="mb-0">
                                                Sudah ada akaun?{' '}
                                                <a href="#/login" className="text-primary">Log Masuk</a>
                                                {' '} | {' '}
                                                <a href="#/forgot-password" className="text-primary">Lupa Kata
                                                    Laluan</a>
                                            </h6>
                                        </div>
                                        <div className="modal-footer d-block text-center">
                                            <LaddaButton className="mb-2 mr-2 btn btn-primary"
                                                         loading={this.state.expZoomIn}
                                                         data-style={ZOOM_IN}
                                                         onClick={this.handleSubmit}>Cipta Akaun</LaddaButton>
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
