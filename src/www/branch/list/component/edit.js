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
import moment from "moment";
import DatePicker from "react-datepicker/es";

export const allStatus = ['Baru', 'Batal', 'Dalam Progres','Lebih Masa','Selesai',];

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
            title: this.state.modalData.title,
            status: this.state.modalData.status,
            dateStart: this.state.modalData.dateStart,
            dateEnd: this.state.modalData.dateEnd,
            description: this.state.modalData.description,
            report: this.state.modalData.report,
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        return new Promise((resolve, reject) => {
            fetch(global.ipServer + 'tugasan/update', {
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
                <ModalHeader toggle={this.hideModalEdit}>Butiran Tugasan</ModalHeader>
                <ModalBody>
                    <Container>
                        <div className="form-wizard-content">
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Status</Label>
                                        <Input name="status" type="select"
                                               value={this.state.modalData.status}
                                               defaultValue={''}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.status = dataEl.target.value;
                                                   this.setState({status: dataEl.target.value});
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
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Nama Tugasan</Label>
                                        <Input type="text"
                                               name={'title'}
                                               value={this.state.modalData.title}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.title = dataEl.target.value;
                                                   this.setState({title: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Mula</Label>
                                        <DatePicker type="text" className="form-control"
                                               name={'title'}
                                               value={this.state.modalData.dateStart}
                                               onChange={(dataEl) => {
                                                   console.log(dataEl)
                                                   this.state.modalData.dateStart = moment(dataEl).format('D/M/YYYY');
                                                   this.setState({modalData: this.state.modalData});
                                               }} dateFormat="d/M/yyyy"/>
                                        <FormFeedback>Required.</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Tamat</Label>
                                        <DatePicker type="text" className="form-control"
                                                    name={'title'}
                                                    value={this.state.modalData.dateEnd}
                                                    onChange={(dataEl) => {
                                                        this.state.modalData.dateEnd = moment(dataEl).format('D/M/YYYY');
                                                        this.setState({modalData: this.state.modalData});
                                                    }} dateFormat="d/M/yyyy"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Huraian</Label>
                                        <Input type="textarea"
                                               name={'description'}
                                               value={this.state.modalData.description}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.description = dataEl.target.value;
                                                   this.setState({description: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Repot</Label>
                                        <Input type="textarea"
                                               name={'report'}
                                               value={this.state.modalData.report}
                                               onChange={(dataEl) => {
                                                   this.state.modalData.report = dataEl.target.value;
                                                   this.setState({report: dataEl.target.value});
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
