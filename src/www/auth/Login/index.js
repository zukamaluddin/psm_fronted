import React, {Fragment, lazy} from "react";
import {Col, Row, Button, Form, FormGroup, Label, Input, Alert, FormFeedback} from 'reactstrap';
import LaddaButton, {ZOOM_IN} from 'react-ladda';
import {fakeAuth} from '../../../Layout/AppMain'
import dmsbIcon from '../../../assets/images/logo.png'

export const authRegex = {
    email_regex: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
};
export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '', password: '',
            visible: false, message: '', messageColor: '',
            emailValidate: false, passValidate: false,
            expZoomIn: false,
            ip: '',


        };
        fetch('https://api.ipify.org?format=json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ip: data.ip});
            })
            .catch((error) => {
                console.log(error)
            });

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state) {
            if (this.props.location.state.noti_msg) {
                this.setState({message: this.props.location.state.noti_msg, messageColor: 'success', visible: true})
            } else {
                this.setState({message: '', messageColor: '', visible: false})
            }
        }
    }

    onDismiss() {
        this.setState({visible: false});
    }

    handleChange(event) {
        if (event.target.name === 'email') {
            if (authRegex.email_regex.test(event.target.value)) {
                this.setState({emailValidate: false});
            } else {
                this.setState({emailValidate: true});
            }

        } else if (event.target.name === 'password') {
            if (event.target.value.length > 0) {
                this.setState({passValidate: false});
            } else {
                this.setState({passValidate: true});
            }
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
        if (data['email'].length !== 0 && data['password'].length !== 0) {
            this.toggle('expZoomIn');

            fetch(global.ipServer + "user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // body: JSON.stringify(data),credentials: "include",//if use cookie
                body: JSON.stringify(data),
            })
                .then((response) => response.json())
                .then((data) => {
                    this.toggle('expZoomIn');
                    if (data.status === 'OK') {
                        global.global_id = data.userid;
                        global.token = data.cawangan
                        global.role = data.jawatan;
                        global.name = data.name;
                        global.position = data.position;
                        global.branch_id = data.branch_id;

                        global.picture = global.ipServer + 'file/' + global.global_id + '/' + data.picture;

                        fakeAuth.authenticate();
                        window['location']['reload']()
                    } else {
                        this.setState({message: data.msg, messageColor: 'danger', visible: true});
                    }
                })
                .catch((error) => {
                    this.toggle('expZoomIn');
                    this.setState({message: error.toString(), messageColor: 'danger', visible: true});
                });

        } else {
            if (data['password'].length === 0) {
                this.setState({passValidate: true, visible: false});
            }
            if (data['email'].length === 0) {
                this.setState({emailValidate: true, visible: false});
            }
        }

    };

    render() {

        return (

            <Fragment>
                <div className="h-100 bg-animation">
                    <div className="d-flex h-100 justify-content-center align-items-center">
                        <Col md="8" className="mx-auto app-login-box">
                            {/*<div className="app-logo-inverse mx-auto mb-3"/>*/}
                            <div style={{
                                textAlign: 'center', fontFamily: '"Times New Roman", Times, serif',
                                textShadow: '0px 0px 10px white'
                            }}>
                                {/*<h1 style={{fontWeight: 'bold'}}>Sistem e-Data</h1>*/}
                                <img src={dmsbIcon} alt={'icon'} style={{width:'200px'}}/>
                            </div>

                            <div className="modal-dialog w-100 mx-auto">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <div className="h5 modal-title text-center">
                                            <h4 className="mt-2">
                                                <div>Selamat Datang</div>
                                                <span>Log Masuk ke Sistem BERNAS</span>
                                            </h4>
                                        </div>
                                        <Form>
                                            <Row form>
                                                <Col md={12}>
                                                    <Alert color={this.state.messageColor} isOpen={this.state.visible}
                                                           toggle={this.onDismiss}>
                                                        {this.state.message}
                                                    </Alert>
                                                </Col>
                                            </Row>
                                            <Row form>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="email" name="email" id="exampleEmail"
                                                               onChange={this.handleChange.bind(this)}
                                                               onKeyDown={this.handleKeyDown}
                                                               invalid={this.state.emailValidate}
                                                               placeholder="emel"/>
                                                        <FormFeedback>
                                                            <i>Wajib isi dengan format emel yang betul</i>
                                                        </FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                                <Col md={12}>
                                                    <FormGroup>
                                                        <Input type="password" name="password" id="examplePassword"
                                                               onChange={this.handleChange.bind(this)}
                                                               onKeyDown={this.handleKeyDown}
                                                               invalid={this.state.passValidate}
                                                               placeholder="kata laluan"/>
                                                        <FormFeedback>
                                                            <i>Wajib isi</i>
                                                        </FormFeedback>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <FormGroup check>
                                                {/*<Input type="checkbox" name="check" id="exampleCheck"/>*/}
                                                {/*<Label for="exampleCheck" check>Keep me logged in</Label>*/}
                                            </FormGroup>
                                        </Form>
                                        <div className="divider"/>
                                        {/*<h6 className="mb-0">*/}
                                        {/*    Tiada akaun?{' '}*/}
                                        {/*    <a href="#/register" className="text-primary">Daftar sekarang</a>*/}
                                        {/*</h6>*/}
                                    </div>
                                    <div className="modal-footer clearfix" style={{marginTop: '1em'}}>
                                        <div className="float-left">
                                            <a href="#/forgot-password" className="btn-lg btn btn-link">Lupa Kata Laluan
                                                ?</a>
                                        </div>
                                        <div className="float-right">
                                            <LaddaButton className="mb-2 mr-2 btn btn-primary"
                                                         loading={this.state.expZoomIn}
                                                         data-style={ZOOM_IN}
                                                         onClick={this.handleSubmit}>Masuk
                                            </LaddaButton>
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
