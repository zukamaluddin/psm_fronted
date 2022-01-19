import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import React, {Fragment} from "react";
import API from "../../../../utils/apiSystemSetting";
import {Bounce, toast} from "react-toastify";

export default class DeleteModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIds: [],
            activeModal: false
        };
        this.showModalDelete = this.showModalDelete.bind(this);
        this.hideModalDelete = this.hideModalDelete.bind(this);

        this.toggleModalDeleteAll = this.toggleModalDeleteAll.bind(this);

    }


    showModalDelete(data) {
        this.setState({modalId: [data.original.id], activeModal: true})
    }

    hideModalDelete() {
        this.setState({activeModal: false})
    }

    toggleModalDeleteAll = async (data) => {

        if (data.length === 0) {
            toast("Tiada rekod untuk dipadam.", {
                transition: Bounce,
                closeButton: true,
                autoClose: 5000,
                position: 'top-right',
                type: 'warning'
            })

        } else {
            this.setState({modalId: data, activeModal: true})
        }
    }

    deleteLantikan = async (ids) => {
        this.selectedDataAssign = ids;

        let result = await API.deleteLantikan(this.selectedDataAssign);
        if (result.status === 'OK') {
            this.props.getdata({filtered: [], page: 0, pageSize: 10, sorted: [{id: "date_created", desc: true}]});
            toast("Rekod berjaya dihapus", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'success'
            });
        } else {
            toast("Gagal menghapus data", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'error'
            });
        }
    };

    render() {
        return (
            <Fragment>
                <Modal isOpen={this.state.activeModal}>
                    <ModalHeader toggle={this.hideModalDelete}>Pengesahan</ModalHeader>
                    <ModalBody>
                        Adakah anda pasti untuk memadam rekod ini?
                    </ModalBody>
                    <ModalFooter>

                        <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                style={{width: '90px'}}
                                onClick={this.deleteLantikan.bind(this, this.state.modalId)}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"> </i>Ya</Button>

                        <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                style={{width: '90px'}}
                                outline onClick={this.hideModalDelete}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i> Tidak</Button>

                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }
}
