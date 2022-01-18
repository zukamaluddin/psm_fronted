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
import API from "../../../../utils/apiRepairer";
import {DropdownList} from "react-widgets";
import {Bounce, toast} from "react-toastify";
import moment from "moment";
import DatePicker from "react-datepicker/es";

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
        let result = await API.viewLantikan(data.original.id);
        this.setState({modalData: result.data, activeModal: true})
    };

    hideModalEdit() {
        this.setState({activeModal: false})
    }


    editBranch(id) {
        let data = {
            id: id,
            staffName: this.state.modalData.name,
            staffId: this.state.modalData.staffId,
            dateAssigned: moment(this.state.modalData.dateAssigned).format('D/M/YYYY'),
            dateStart: moment(this.state.modalData.dateStart).format('D/M/YYYY'),
            dateEnd: moment(this.state.modalData.dateEnd).format('D/M/YYYY'),
            jawatanPentadbiran: this.state.modalData.selectedPentadbiranId,
            jawatanGred: this.state.modalData.selectedGredId,
            jawatanLantikan: this.state.modalData.selectedLantikanId,
            jawatanGenerik: this.state.modalData.selectedGenerikId,
            description: this.state.modalData.description,
            referenceNo: this.state.modalData.referenceNo,
            dateLetterLantikan: moment(this.state.modalData.dateLetterLantikan).format('D/M/YYYY'),
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        return new Promise((resolve, reject) => {
            fetch(global.ipServer + 'lantikan/view/', {
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
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Nama Staf</Label>
                                        <Input type="text"
                                               name={'title'}
                                               value={this.state.modalData.staffName} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>ID Staf</Label>
                                        <Input type="text"
                                               name={'staffId'}
                                               value={this.state.modalData.staffId} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Lantikan</Label>
                                        <Input type="text"
                                               name={'dateAssigned'}
                                               value={this.state.modalData.dateAssigned} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Mula</Label>
                                        <Input type="text"
                                               name={'dateStart'}
                                               value={this.state.modalData.dateStart} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Akhir</Label>
                                        <Input type="text"
                                               name={'dateEnd'}
                                               value={this.state.modalData.dateEnd} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Jawatan Pentadbiran</Label>
                                        <Input type="text"
                                               name={'jawatanPentadbiran'}
                                               value={this.state.modalData.jawatanPentadbiran} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Jawatan Gred</Label>
                                        <Input type="text"
                                               name={'jawatanGred'}
                                               value={this.state.modalData.jawatanGred} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Jawatan Lantikan</Label>
                                        <Input type="text"
                                               name={'jawatanLantikan'}
                                               value={this.state.modalData.jawatanLantikan} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Jawatan Generik</Label>
                                        <Input type="text"
                                               name={'jawatanGenerik'}
                                               value={this.state.modalData.jawatanGenerik} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Catatan</Label>
                                        <Input type="text"
                                               name={'description'}
                                               value={this.state.modalData.description} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Nombor Rujukan Surat Lantikan</Label>
                                        <Input type="text"
                                               name={'referenceNo'}
                                               value={this.state.modalData.referenceNo} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Surat Lantikan</Label>
                                        <Input type="text"
                                               name={'dateLetterLantikan'}
                                               value={this.state.modalData.dateLetterLantikan} readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </ModalBody>
                <ModalFooter>
                    {/*<Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline*/}
                    {/*    style={{width: '140px'}}*/}
                    {/*    onClick={this.editBranch.bind(this, this.state.modalData.id)}*/}
                    {/*><i*/}
                    {/*className="lnr-checkmark-circle btn-icon-wrapper"> </i>Kemaskini</Button>*/}
                    <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            style={{width: '140px'}}    outline onClick={this.hideModalEdit}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
