import React, {Fragment} from 'react';
import _ from 'lodash';

import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Collapse,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap';
import ApiUser from "../../../../utils/apiUser";
import ApiBranch from "../../../../utils/apiBranch";
import {redirectLogout} from "../../../../index";

const defaultPic = require('../../../../../src/assets/images/profile.png');

export default class WizardStep3 extends React.Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.toggleAccordion = this.toggleAccordion.bind(this);
        this.state = {
            accordion: [true, true],
            src: '',
            isToggleOn: true,
            validEmail: false,
            branchData: [],
        };
        // this.validateEmailApi = _.debounce(this.validateEmailApi, 1000);
    }

    componentDidMount = async () => {
        // this._isMounted = true;
        // let branches = await ApiBranch.getAllBranches();
        // if(branches.status!=='Failed'){
        //     if (this._isMounted) {
        //         this.setState({branchData: branches.data})
        //     }
        // }else{
        //     redirectLogout(401, this.props);
        //     return [];
        // }

    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    toggleAccordion(tab) {

        const prevState = this.state.accordion;
        const state = prevState.map((x, index) => tab === index ? !x : false);

        this.setState({
            accordion: state,
        });
    }

    openUpload = e => {
        document.getElementById('picture').click()
    };
    onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.setState({src: reader.result})
            });
            reader.readAsDataURL(e.target.files[0]);
            this.props.registerData.picture = e.target.files[0];
        }
    };

    validateEmailApi = async (email) => {
        //
        // if (email) {
        //     this.setState({validEmail: await ApiUser.checkEmail(email)});
        //     this.props.validForm.emailApi = await ApiUser.checkEmail(email)
        // } else {
        //     this.setState({validEmail: false});
        //     this.props.validForm.emailApi = false
        // }
    };


    render() {
        let branchData = this.state.branchData;
        return (
            <Fragment>
                <Row className="invalid-feedback" style={{display: 'block'}}><Col md={{offset: 11}}><i>* Ruangan wajib
                    isi</i></Col></Row>
                <div className="form-wizard-content">
                    <div id="accordion" className="accordion-wrapper mb-3">
                        <Card>
                            <CardHeader id="headingOne">
                                <Button block color="link" className="text-left m-0 p-0"
                                    // onClick={() => this.toggleAccordion(0)}
                                    // aria-expanded={this.state.accordion[0]}
                                        aria-controls="collapseOne">
                                    <h3 className="form-heading">
                                        Maklumat Akaun
                                        <p>Masukkan maklumat ahli baru di bawah</p>
                                    </h3>
                                </Button>
                            </CardHeader>
                            <Collapse data-parent="#accordion"
                                // isOpen={this.state.accordion[0]}
                                      isOpen={true}
                                      id="collapseOne" aria-labelledby="headingOne">
                                <CardBody>
                                    <Row form>
                                        <Col md={4}>
                                            <FormGroup
                                                style={{
                                                    border: 'solid',
                                                    display: 'inline-block',
                                                    minWidth: '200px',
                                                    marginBottom: '10px'
                                                }}>
                                                <div style={{height: '200px'}}>
                                                    <img alt="Crop" src={this.state.src}
                                                         onError={(e) => {
                                                             e.target.onerror = null;
                                                             e.target.src = defaultPic
                                                         }}
                                                         style={{
                                                             width: 'auto', maxHeight: '200px', maxWidth: '200px',
                                                             position: 'relative',
                                                             transform: 'translate(-50%, -50%)',
                                                             left: '50%',
                                                             top: '50%'
                                                         }}/>

                                                </div>
                                                {/*<Button style={{width: '100%', borderRadius: 'unset',}}*/}
                                                {/*        onClick={this.openUpload}>Pilih Gambar</Button>*/}
                                                {/*<input id='picture' type="file" accept="image/*" onChange={(dataEl) => {*/}
                                                {/*    this.onSelectFile(dataEl);*/}
                                                {/*}} hidden/>*/}

                                            </FormGroup>

                                        </Col>
                                        <Col md={8}>
                                            <Row>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label for="email">E-mel <span
                                                            style={{color: 'red'}}>*</span></Label>
                                                        <Input type="email" name="email" id="email"
                                                               onChange={(dataEl) => {
                                                                   this.setState({registerData: {email: dataEl.target.value}});
                                                                   this.props.registerData.email = dataEl.target.value;
                                                                   // this.validateEmailApi(dataEl.target.value);
                                                               }}
                                                               invalid={this.props.validForm.email || this.state.validEmail}
                                                               placeholder="Taip di sini"/>

                                                        {this.props.validForm.email ?
                                                            <FormFeedback><i>Wajib diisi</i></FormFeedback> : ''}
                                                        {this.state.validEmail ?
                                                            <FormFeedback><i>Emel sudah wujud</i></FormFeedback> : ''}
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label for="position">Jawatan <span
                                                            style={{color: 'red'}}>*</span></Label>
                                                        <Input name="position" type="select" id='position'
                                                               value={this.props.registerData.position}
                                                               onChange={(dataEl) => {
                                                                   this.setState({registerData: {position: dataEl.target.value}});
                                                                   this.props.registerData.position = dataEl.target.value;
                                                               }}
                                                               invalid={this.props.validForm.position}
                                                        >
                                                            <option key={''} value={''} disabled>Sila pilih</option>
                                                            <option key={'Admin'} value={'Admin'}>Admin</option>
                                                            <option key={'Pentadbir'} value={'Pentadbir'}>Pentadbir</option>
                                                            <option key={'Staf'} value={'Staf'}>Staf</option>
                                                        </Input>
                                                        <FormFeedback><i>Wajib diisi</i></FormFeedback>
                                                    </FormGroup>


                                                </Col>
                                            </Row>
                                            <Row>
                                                {/*<Col sm={6}>*/}
                                                {/*    <FormGroup>*/}
                                                {/*        <Label for="position1">Cawangan</Label>*/}
                                                {/*        <Input name="branch" type="select" id='position'*/}
                                                {/*               value={this.props.registerData.branch}*/}
                                                {/*               onChange={(dataEl) => {*/}
                                                {/*                   this.setState({registerData: {branch: dataEl.target.value}});*/}
                                                {/*                   this.props.registerData.branch = dataEl.target.value;*/}
                                                {/*               }}*/}
                                                {/*               invalid={this.props.validForm.position}*/}
                                                {/*        >*/}
                                                {/*            <option key={''} value={''} disabled>Sila pilih</option>*/}
                                                {/*            <option key={'Pekan, Pahang'} value={'Pekan, Pahang'}>Pekan, Pahang</option>*/}
                                                {/*            <option key={'Kulim, Kedah'} value={'Kulim, Kedah'}>Kulim, Kedah</option>*/}
                                                {/*            <option key={'Padang Besar, Perlis'} value={'Padang Besar, Perlis'}>Padang Besar, Perlis</option>*/}
                                                {/*        </Input>*/}
                                                {/*        /!*<Input name="branch" type="select" id='position'*!/*/}
                                                {/*        /!*       value={this.props.registerData.branch}*!/*/}
                                                {/*        /!*       onChange={(dataEl) => {*!/*/}
                                                {/*        /!*           this.setState({registerData: {branch: dataEl.target.value}});*!/*/}
                                                {/*        /!*           this.props.registerData.branch = dataEl.target.value;*!/*/}
                                                {/*        /!*       }}*!/*/}
                                                {/*        /!*>*!/*/}
                                                {/*        /!*    <option key={''} value={''} disabled>Sila pilih</option>*!/*/}
                                                {/*        /!*    {branchData.map(option => (*!/*/}
                                                {/*        /!*        <option key={option.id} value={option.id}>*!/*/}
                                                {/*        /!*            {option.code} - {option.kawasan}*!/*/}
                                                {/*        /!*        </option>*!/*/}
                                                {/*        /!*    ))}*!/*/}

                                                {/*        /!*</Input>*!/*/}
                                                {/*    </FormGroup>*/}
                                                {/*</Col>*/}
                                                <Col sm={6}>
                                                    <Label for="exampleEmail2">Status <span
                                                        style={{color: 'red'}}>*</span></Label>

                                                    <FormGroup row check style={{marginLeft:'10px'}}>
                                                        <Label sm={6}>
                                                            <Input type="radio" name="status"
                                                                   onChange={(dataEl) => {
                                                                       this.setState({registerData: {status: dataEl.target.value}});
                                                                       this.props.registerData.status = "Active";
                                                                   }}
                                                            />{' '}
                                                            Aktif
                                                        </Label>
                                                        <Label sm={6}>
                                                            <Input type="radio" name="status"
                                                                   onChange={(dataEl) => {
                                                                       this.setState({registerData: {status: dataEl.target.value}});
                                                                       this.props.registerData.status = "Inactive";
                                                                   }}
                                                            />{' '}
                                                            Tidak Aktif
                                                        </Label>
                                                        {(this.props.validForm.status) ?
                                                            <div className="invalid-feedback"
                                                                 style={{display: 'block'}}><i>Wajib diisi</i>
                                                            </div> : null}
                                                    </FormGroup>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </Card>
                        <Card>
                            <CardHeader className="b-radius-0" id="headingTwo">
                                <Button block color="link" className="text-left m-0 p-0"
                                    // onClick={() => this.toggleAccordion(1)}
                                    // aria-expanded={this.state.accordion[1]}
                                        aria-controls="collapseTwo">
                                    <h3 className="form-heading">
                                        Butiran Peribadi
                                        <p>Masukkan butiran peribadi ahli di bawah</p>
                                    </h3>
                                </Button>
                            </CardHeader>
                            <Collapse data-parent="#accordion"
                                // isOpen={this.state.accordion[1]}
                                      isOpen={true}
                                      id="collapseTwo">
                                <CardBody>

                                    <FormGroup>
                                        <Label for="name">Nama <span style={{color: 'red'}}>*</span></Label>
                                        <Input type="text" name="name" id="name"
                                               placeholder="Taip di sini"
                                               onChange={(dataEl) => {
                                                   this.setState({registerData: {name: dataEl.target.value}});
                                                   this.props.registerData.name = dataEl.target.value;
                                               }}
                                               invalid={this.props.validForm.name}
                                        />
                                        <FormFeedback><i>Wajib diisi</i></FormFeedback>
                                    </FormGroup>
                                    <Row>
                                        <Col sm={6}>
                                            <FormGroup>
                                                <Label for="staffId">ID Staf <span
                                                    style={{color: 'red'}}>*</span></Label>
                                                <Input type="text" name="staffId" id="staffId"
                                                       placeholder="Taip di sini"
                                                       onChange={(dataEl) => {
                                                           this.setState({registerData: {staffId: dataEl.target.value}});
                                                           this.props.registerData.staffId = dataEl.target.value;
                                                       }}
                                                       invalid={this.props.validForm.staffId}
                                                />
                                                <FormFeedback><i>Wajib diisi</i></FormFeedback>
                                            </FormGroup>
                                        </Col> <Col sm={6}>
                                        <FormGroup>
                                            <Label for="phone">No. Telefon <span style={{color: 'red'}}>*</span></Label>
                                            <Input type="number" name="phone" id="phone"
                                                   placeholder="Taip di sini"
                                                   onChange={(dataEl) => {
                                                       this.setState({registerData: {phone: dataEl.target.value}});
                                                       this.props.registerData.phone = dataEl.target.value;
                                                   }}
                                                   invalid={this.props.validForm.phone}
                                            /><FormFeedback><i>Wajib diisi</i></FormFeedback>
                                        </FormGroup>
                                    </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                </div>
            </Fragment>
        );
    }
}
