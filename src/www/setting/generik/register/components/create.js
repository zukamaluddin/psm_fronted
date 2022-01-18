import React, {Fragment} from "react";
import {
    Col, CardHeader, CardFooter,
    Card,
    CardBody,
    Input,
    CardTitle,
    FormGroup,
    Label,
    Form,
    Button, ModalHeader, ModalBody, Row, FormFeedback, ModalFooter, Modal, Container
} from "reactstrap";

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import {toast} from "react-toastify";
import {DropdownList} from "react-widgets";
import { settingMenu} from "../../../../../Layout/AppNav/VerticalNavWrapper"; //loading effect

import _ from 'lodash';
import LaddaButton, {EXPAND_LEFT} from "react-ladda";

class CreateComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: {},branchCodeApi: null,
            dateStart: '',
            dateEnd: '',
        };

        this.submit = this.submit.bind(this);
        this.validateBranchApi = _.debounce(this.validateBranchApi, 1000);

    }
    validateBranchApi = async (code) => {

        // if (code) {
        //     this.setState({branchCodeApi:await API.checkBranch(code)});
        // }else{
        //     this.state.validForm.branchCodeApi = false
        // }
    };
    handleKeyDown = evt => {
        if (evt.which === 13) {
            this.submit()
        }
    };

    submit() {
        let copy = this.state.validForm;

        // (this.state.branchCode === '' || this.state.branchCode === undefined) ? copy.branchCode = true : copy.branchCode = false;
        // (this.state.regional === '' || this.state.regional === undefined) ? copy.regional = true : copy.regional = false;
        // (this.state.selectedState === '' || this.state.selectedState === undefined) ? copy.selectedState = true : copy.selectedState = false;
        // (this.state.address === '' || this.state.address === undefined) ? copy.address = true : copy.address = false;
        // (this.state.phone === '' || this.state.phone === undefined) ? copy.phone = true : copy.phone = false;
        // (this.state.fax === '' || this.state.fax === undefined) ? copy.fax = true : copy.fax = false;

        this.setState({validForm: copy}, function () {

            let data = {
                name: this.state.name,
                kod: this.state.kod,
            };
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));

            return new Promise((resolve, reject) => {

                fetch(global.ipServer + 'setting/createJawatanGenerik', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'x-access-token': global.token
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {

                        setTimeout(
                            function () {
                                if (data['status'] === 'OK') {
                                    toast.success("Data berjaya disimpan");
                                    this.props.history.push(`/setting/generik`);
                                    settingMenu.changeActiveLinkTo('#/setting/generik')
                                    resolve('Ok');
                                } else {
                                    toast.error("Ralat");
                                    resolve('Failed');
                                }
                            }
                                .bind(this),
                            1000
                        );
                    })
                    .catch((error) => {
                        toast.error("Ralat");
                        resolve('Failed');
                    });
            });
        });
    }

    render() {
        // alert(global.role)
        return (
            <Card className="main-card mb-3">
                <CardBody>
                    <Container>
                        <div className="form-wizard-content">
                            <Row onKeyDown={this.handleKeyDown}>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Nama</Label>
                                        <Input type="textarea"
                                               name={'name'}
                                               onChange={(dataEl) => {
                                                   this.setState({name: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Kod</Label>
                                        <Input type="text"
                                               name={'kod'}
                                               onChange={(dataEl) => {
                                                   this.setState({kod: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </CardBody>
                <CardFooter>
                    <Col style={{width:'100%'}}>
                        <LaddaButton
                            className="mb-2 mr-2 btn btn-icon btn-shadow btn-outline-2x float-right btn-outline-primary"
                            // loading={this.state.expLeft}
                            onClick={this.submit}
                            data-style={EXPAND_LEFT}
                            style={{width: '140px'}}>
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Simpan
                        </LaddaButton>
                    </Col>
                </CardFooter>
            </Card>
        );
    }
}

export default CreateComp;
