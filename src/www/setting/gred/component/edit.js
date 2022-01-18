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
import API from "../../../../utils/apiSystemSetting";
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
        let result = await API.viewGred(data.original.id);
        this.setState({modalData: result.data, activeModal: true})
    };

    hideModalEdit() {
        this.setState({activeModal: false})
    }


    editBranch(id) {
        let data = {
            id: id,
            name: this.state.modalData.name,
            gred: this.state.modalData.gred
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        return new Promise((resolve, reject) => {
            fetch(global.ipServer + 'setting/updateJawatanGred', {
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
                                        <Label>Nama</Label>
                                        <Input type="textarea"
                                               name={'name'}
                                               value={this.state.modalData.name}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.name = dataEl.target.value;
                                                   this.setState({name: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Gred</Label>
                                        <Input type="text"
                                               name={'gred'}
                                               value={this.state.modalData.gred}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.gred = dataEl.target.value;
                                                   this.setState({gred: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                            style={{width: '140px'}}
                            onClick={this.editBranch.bind(this, this.state.modalData.id)}
                    ><i
                        className="lnr-checkmark-circle btn-icon-wrapper"> </i>Kemaskini</Button>
                    <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            style={{width: '140px'}}    outline onClick={this.hideModalEdit}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
