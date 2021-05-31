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
import { branchMenu} from "../../../../Layout/AppNav/VerticalNavWrapper"; //loading effect
import _ from 'lodash';
import API from "../../../../utils/apiBranch";
import LaddaButton, {EXPAND_LEFT} from "react-ladda";

export const allState = ['Pekan, Pahang', 'Kulim, Kedah', 'Padang Besar, Perlis'];

export const allStatus = ['Aktif', 'Rosak', 'Baiki'];

class CreateComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: {},branchCodeApi: null
        };

        this.submit = this.submit.bind(this);
        this.validateBranchApi = _.debounce(this.validateBranchApi, 1000);

    }
    validateBranchApi = async (code) => {

        if (code) {
            this.setState({branchCodeApi:await API.checkBranch(code)});
        }else{
            this.state.validForm.branchCodeApi = false
        }
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
            // if (Object.keys(this.state.validForm).every(k => !this.state.validForm[k])) {
                let data = {
                    cawangan: this.state.selectedState,
                    ibdNo: this.state.ibdNo,
                    serialNo: this.state.serialNo,
                    rfid: this.state.rfid,
                    status: this.state.selectedStatus,
                };
                const formData = new FormData();
                formData.append('data', JSON.stringify(data));

                return new Promise((resolve, reject) => {

                    fetch(global.ipServer + 'mesin/create', {
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
                                        this.props.history.push(`/branch/list`);
                                        branchMenu.changeActiveLinkTo('#/branch/list')
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
            // }else {
            //     toast.warn("Sila isi ruang yang wajib");
            // }

        });



    }


    render() {
        return (
            <Card className="main-card mb-3">

                <CardBody>

                    <Container>

                        <div className="form-wizard-content">
                            <Row onKeyDown={this.handleKeyDown}>
                                {/*<Col md={6}>*/}
                                {/*    <FormGroup>*/}
                                {/*        <Label>Kod Cawangan </Label>*/}
                                {/*        <Input type="text"*/}
                                {/*               name='branchCode'*/}
                                {/*               placeholder={'Taip di sini'}*/}
                                {/*               onChange={(dataEl) => {*/}
                                {/*                   this.setState({branchCode: dataEl.target.value});*/}
                                {/*                   this.validateBranchApi(dataEl.target.value);*/}
                                {/*               }}*/}
                                {/*               invalid={this.state.validForm.branchCode || this.state.branchCodeApi}*/}
                                {/*        />*/}
                                {/*        {this.state.validForm.branchCode ?<FormFeedback><i>Wajib diisi</i></FormFeedback>:''}*/}
                                {/*        {this.state.branchCodeApi ? <FormFeedback><i>Kod cawangan sudah wujud</i></FormFeedback>:''}*/}
                                {/*    </FormGroup>*/}
                                {/*</Col>*/}
                                {/*<Col md={6}>*/}
                                {/*    <FormGroup>*/}
                                {/*        <Label>Kawasan</Label>*/}
                                {/*        <Input type="text"*/}
                                {/*               name='regional'*/}
                                {/*               onChange={(dataEl) => {*/}
                                {/*                   this.setState({regional: dataEl.target.value});*/}
                                {/*               }}*/}
                                {/*               placeholder="Taip di sini"*/}
                                {/*               invalid={this.state.validForm.regional}*/}
                                {/*        />*/}
                                {/*        <FormFeedback><i>Wajib diisi</i></FormFeedback>*/}
                                {/*    </FormGroup>*/}
                                {/*</Col>*/}
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="negeri">
                                            Cawangan</Label>
                                        <Input name="branch" type="select" id='position'
                                               value={this.state.selectedState}
                                               defaultValue={''}
                                               onChange={(dataEl) => {
                                                   this.setState({selectedState: dataEl.target.value});
                                               }}
                                               invalid={this.state.validForm.selectedState}>

                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {allState.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}

                                        </Input>
                                        <FormFeedback><i>Wajib diisi</i></FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>IBD No.</Label>
                                        <Input type="text"
                                               name={'ibdNo'}
                                               onChange={(dataEl) => {
                                                   this.setState({ibdNo: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Serial No.</Label>
                                        <Input type="text"
                                               name={'serialNo'}
                                               onChange={(dataEl) => {
                                                   this.setState({serialNo: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>RFID No.</Label>
                                        <Input type="text"
                                               name={'rfid'}
                                               onChange={(dataEl) => {
                                                   this.setState({rfid: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>


                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Status</Label>
                                        <Input name="status" type="select"
                                               value={this.state.selectedStatus}
                                               defaultValue={''}
                                               onChange={(dataEl) => {
                                                   this.setState({selectedStatus: dataEl.target.value});
                                               }}
                                               invalid={this.state.validForm.selectedState}>

                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {allStatus.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}

                                        </Input>
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
                            style={{width: '140px'}}
                        >
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Simpan
                        </LaddaButton>

                    </Col>
                </CardFooter>
            </Card>


        );
    }
}

export default CreateComp;
