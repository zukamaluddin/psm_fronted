import {
    Button, Card,
    CardBody,
    CardHeader, Col, Collapse, FormFeedback,
    FormGroup, Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row
} from "reactstrap";
import React from "react";
import API from "../../../../utils/apiUser";
import API2 from "../../../../utils/apiBranch";

import {Bounce, toast} from "react-toastify";

const defaultPic = require('../../../../../src/assets/images/profile.png');

export default class EditModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accordion: [true, true],
            src: '',
            modalData: {},
            branchData: [],
            role: {},
            branch: {},
            position: {},
            status: null,
        };
        this.showModalEdit = this.showModalEdit.bind(this);
        this.hideModalEdit = this.hideModalEdit.bind(this);
        // this.toggleAccordion = this.toggleAccordion.bind(this);

    }


    // toggleAccordion(tab) {
    //
    //     const prevState = this.state.accordion;
    //     const state = prevState.map((x, index) => tab === index ? !x : false);
    //
    //     this.setState({
    //         accordion: state,
    //     });
    // }
    componentDidMount() {

        // alert("SSSS")
    }

    showModalEdit = async (data) => {
        // let branches = await API2.getAllBranches();
        // this.setState({branchData: branches.data})
        let result = await API.viewUser(data.original.id);
        this.setState({
            modalData: result,
            branch: result.branch !== null ? result.id : "",
            role: result.role !== null ? result.role : "",
            position: result.position !== null ? result.position : "",
            status: result.status,
            activeModal: true,
            // src: global.ipServer + 'file/' + data.original.id + '/' + result.picture,
        })

    };

    hideModalEdit() {
        this.setState({activeModal: false})
    }

    openUpload = e => {
        // document.getElementById('picture').click()
    };
    onSelectFile = e => {
        // if (e.target.files && e.target.files.length > 0) {
        //     const reader = new FileReader();
        //     reader.addEventListener('load', () => {
        //         this.setState({src: reader.result})
        //     });
        //     reader.readAsDataURL(e.target.files[0]);
        //     this.state.picture = e.target.files[0];
        // }
    };


    submitEditUser(userid) {
        let data = {
            role: this.state.modalData.role,
            status: this.state.modalData.status,

            staffId: this.state.modalData.staffId,
            name: this.state.modalData.name,
            // position: this.state.modalData.position,
            phone: this.state.modalData.phone,
            branch: this.state.modalData.branch,
            // picture: this.state.picture ? this.state.picture.name : null,
        };
        console.log(data)
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append("picture", this.state.picture);
        fetch(global.ipServer + 'user/update/' + userid, {
            method: 'POST',
            body: formData,
            headers: {
                'x-access-token': global.token
            }
        })
            .then((response) => response.json())
            .then((result) => {
                this.hideModalEdit();
                if (result.status === 'OK') {
                    this.props.getdata({
                        filtered: [],
                        page: 0,
                        pageSize: 10,
                        sorted: [{id: "date_created", desc: true}]
                    });
                    toast("Rekod berjaya dikemaskini", {
                        transition: Bounce,
                        closeButton: true,
                        autoClose: 2000,
                        position: 'top-right',
                        type: 'success'
                    });
                } else {
                    toast("Gagal kemaskini data", {
                        transition: Bounce,
                        closeButton: true,
                        autoClose: 3000,
                        position: 'top-right',
                        type: 'error'
                    });
                }

            })
            .catch((error) => {
                console.error('Error:', error);
            });


    };

    render() {
        let branchData = this.state.branchData;
        return (
            <Modal isOpen={this.state.activeModal} size='xl'>
                <ModalHeader toggle={this.hideModalEdit}>Paparan Terperinci </ModalHeader>
                <ModalBody>

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
                                        <Col md={3}>
                                            <FormGroup
                                                style={{
                                                    border: 'solid',
                                                    display: 'inline-block',
                                                    minWidth: '200px',
                                                    marginBottom: '10px'
                                                }}>
                                                <div style={{height: '200px'}}>
                                                    <img alt="Crop" src={defaultPic}
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
                                        <Col md={9}>
                                            <Row>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="email">E-mel</Label>
                                                        <Input type="email" name="email" id="email"
                                                               defaultValue={this.state.modalData.email}
                                                               disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md={6}>
                                                    <FormGroup>
                                                        <Label for="position">Jawatan</Label>
                                                        <Input name="position" type="select" id='position'
                                                               value={this.state.position}
                                                               onChange={(dataEl) => {
                                                                   this.setState({position: dataEl.target.value});
                                                                   this.state.modalData.position = dataEl.target.value;
                                                               }}
                                                        >
                                                            <option key={''} value={''} disabled>Pilih Jawatan</option>
                                                            <option key={'HQ'} value={'HQ'}>HQ</option>
                                                            {/*<option key={'Manager Negeri'} value={'Manager Negeri'}>Manager Negeri</option>*/}
                                                            <option key={'Manager Cawangan'} value={'Manager Cawangan'}>Manager Cawangan</option>
                                                            <option key={'Staf'} value={'Staf'}>Staf</option>

                                                        </Input>
                                                    </FormGroup>
                                                    {/*<FormGroup>*/}
                                                    {/*    <Label for="role">Jenis Akaun</Label>*/}
                                                    {/*    <Input name="role" type="select" id='role'*/}
                                                    {/*           value={this.state.role}*/}
                                                    {/*           onChange={(dataEl) => {*/}
                                                    {/*               this.setState({role: dataEl.target.value})*/}
                                                    {/*               this.state.modalData.role = dataEl.target.value;*/}
                                                    {/*           }}*/}
                                                    {/*    >*/}
                                                    {/*        <option key={''} value={''} disabled>pilih jenis akaun*/}
                                                    {/*        </option>*/}
                                                    {/*        <option key={'Administrator'}*/}
                                                    {/*                value={'Administrator'}>Administrator*/}
                                                    {/*        </option>*/}
                                                    {/*        <option key={'Normal User'} value={'Normal User'}>Ahli Biasa*/}
                                                    {/*        </option>*/}
                                                    {/*    </Input>*/}
                                                    {/*</FormGroup>*/}
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col sm={6}>
                                                    <FormGroup>
                                                        <Label for="branch">Cawangan</Label>
                                                        <Input name="branch" type="select" id='position'
                                                               value={this.state.branch}
                                                               onChange={(dataEl) => {
                                                                   this.state.modalData.branch = dataEl.target.value;
                                                                   this.setState({branch: dataEl.target.value});
                                                               }}
                                                        >
                                                            <option key={''} value={''} disabled>Sila pilih</option>
                                                            <option key={'Pekan, Pahang'} value={'Pekan, Pahang'}>Pekan, Pahang</option>
                                                            <option key={'Kulim, Kedah'} value={'Kulim, Kedah'}>Kulim, Kedah</option>
                                                            <option key={'Padang Besar, Perlis'} value={'Padang Besar, Perlis'}>Padang Besar, Perlis</option>

                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={6}>
                                                    <Label for="status">Status</Label>

                                                    <FormGroup row check style={{marginLeft:'10px'}}>
                                                        <Label lg={4}>
                                                            <Input type="radio" name="status"
                                                                   defaultChecked={(this.state.modalData.status === "0") ? false : true}
                                                                   value={1}
                                                                   onChange={(dataEl) => {
                                                                       this.state.modalData.status = dataEl.target.value;
                                                                       this.setState({status: dataEl.target.value});
                                                                   }}
                                                            />{' '}
                                                            Aktif
                                                        </Label>
                                                        <Label lg={4}>
                                                            <Input type="radio" name="status"
                                                                   defaultChecked={(this.state.modalData.status === "0") ? true : false}
                                                                   value={0}
                                                                   onChange={(dataEl) => {
                                                                       this.state.modalData.status = dataEl.target.value;
                                                                       this.setState({status: dataEl.target.value});
                                                                   }}
                                                            />{' '}
                                                            Tidak Aktif
                                                        </Label>
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
                                        <Label for="nama">Nama</Label>
                                        <Input type="text" name="nama" id="nama"
                                               defaultValue={this.state.modalData.name}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.name = dataEl.target.value;
                                                   this.setState({name: dataEl.target.value});
                                               }}
                                        />
                                    </FormGroup>
                                    <Row>
                                        <Col sm={6}>
                                            <FormGroup>
                                                <Label for="staffId">ID Staf</Label>
                                                <Input type="text" name="staffId" id="staffId"
                                                       defaultValue={this.state.modalData.staffId}
                                                       onChange={(dataEl) => {
                                                           this.state.modalData.staffId = dataEl.target.value;
                                                           this.setState({staffId: dataEl.target.value});
                                                       }}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col sm={6}>
                                            <FormGroup>
                                                <Label for="phone">No. Telefon</Label>
                                                <Input type="number" name="phone" id="phone"
                                                       defaultValue={this.state.modalData.phone}
                                                       onChange={(dataEl) => {
                                                           this.state.modalData.phone = dataEl.target.value;
                                                           this.setState({phone: dataEl.target.value});
                                                       }}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                        </Card>
                    </div>
                </ModalBody>
                <ModalFooter>

                    <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                            style={{width: '140px'}}
                            onClick={this.submitEditUser.bind(this, this.state.modalData.id)}><i
                        className="lnr-checkmark-circle btn-icon-wrapper"> </i>Kemaskini</Button>

                    <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            outline onClick={this.hideModalEdit} style={{width: '140px'}}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>

                </ModalFooter>
            </Modal>
        );
    }
}
