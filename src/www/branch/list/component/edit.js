import {
    Button, Col, Container, FormFeedback,
    FormGroup, Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row
} from "reactstrap";
import React from "react";
import API from "../../../../utils/apiBranch";
import {DropdownList} from "react-widgets";
import {Bounce, toast} from "react-toastify";

export const allState = ['Pekan, Pahang', 'Kulim, Kedah', 'Padang Besar, Perlis'];

export const allStatus = ['Aktif', 'Rosak', 'Baiki'];

export default class EditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalData: {},
            selectedState: ''

        };
        this.showModalEdit = this.showModalEdit.bind(this);
        this.hideModalEdit = this.hideModalEdit.bind(this);

    }


    showModalEdit = async (data) => {
        let result = await API.viewBranch(data.original.id);

        this.setState({modalData: result.data, activeModal: true})
    };

    hideModalEdit() {
        this.setState({activeModal: false})
    }


    editBranch(id) {

        let data = {
            id: id,
            cawangan: this.state.modalData.cawangan,
            ibdNo: this.state.modalData.ibdNo,
            rfidNo:this.state.modalData.rfidNo,
            serialNo: this.state.modalData.serialNo,
            status: this.state.modalData.status,

        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        return new Promise((resolve, reject) => {

            fetch(global.ipServer + 'mesin/update', {
                method: 'PUT',
                body: formData,
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    this.hideModalEdit()
                    if (data['status'] === 'OK') {
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
                            autoClose: 2000,
                            position: 'top-right',
                            type: 'error'
                        });
                    }
                })
                .catch((error) => {
                    toast("Ralat", {
                        transition: Bounce,
                        closeButton: true,
                        autoClose: 2000,
                        position: 'top-right',
                        type: 'error'
                    });
                });
        });

    };

    render() {

        return (
            <Modal isOpen={this.state.activeModal} size='lg'>
                <ModalHeader toggle={this.hideModalEdit}>Butiran Cawangan </ModalHeader>
                <ModalBody>

                    <Container>

                        <div className="form-wizard-content">
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Cawangan </Label>
                                        <Input name="branch" type="select" id='position'
                                               value={this.state.modalData.cawangan}
                                               defaultValue={''}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.cawangan = dataEl.target.value;
                                                   this.setState({selectedState: dataEl.target.value});
                                               }}
                                               >

                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {allState.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}

                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>IBD No</Label>
                                        <Input type="text"
                                               name={'ibdNo'}
                                               value={this.state.modalData.ibdNo}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.ibdNo = dataEl.target.value;
                                                   this.setState({ibdNo: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                        <FormFeedback>Required.</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="negeri">
                                            Serial No</Label>
                                        <Input type="text"
                                               name={'serialNo'}
                                               value={this.state.modalData.serialNo}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.serialNo = dataEl.target.value;
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
                                               value={this.state.modalData.rfidNo}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.rfidNo = dataEl.target.value;
                                                   this.setState({rfid: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Status</Label>
                                        <Input name="status" type="select"
                                               value={this.state.modalData.status}
                                               defaultValue={''}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.status = dataEl.target.value;
                                                   this.setState({selectedStatus: dataEl.target.value});
                                               }}
                                               >

                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {allStatus.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}

                                        </Input>
                                    </FormGroup>
                                </Col>


                                <Col md={6}>
                                    {/*<FormGroup>*/}
                                    {/*    <Label>No. Fax</Label>*/}
                                    {/*    <Input defaultValue={this.state.modalData.fax} type="text"*/}
                                    {/*           name={'fax'}*/}
                                    {/*           onChange={(dataEl) => {*/}
                                    {/*               this.setState({fax: dataEl.target.value});*/}
                                    {/*           }}*/}
                                    {/*           placeholder="Type here"/>*/}
                                    {/*</FormGroup>*/}
                                </Col>

                            </Row>

                        </div>

                    </Container>

                </ModalBody>
                <ModalFooter>
                    {global.position !== 'HQ' &&
                        <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                            style={{width: '140px'}}
                            onClick={this.editBranch.bind(this, this.state.modalData.id)}><i
                        className="lnr-checkmark-circle btn-icon-wrapper"> </i>Kemaskini</Button>
                    }


                    <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            style={{width: '140px'}}    outline onClick={this.hideModalEdit}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>

                </ModalFooter>
            </Modal>
        );
    }
}
