import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {
    Button,
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import Loader from 'react-loaders'
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import {Bounce, toast} from "react-toastify";
import API from "../../../utils/apiUser";
import List from "./component/list";

// import {Translation} from 'react-i18next';
// import i18n from '../../../i18n'

export default class ListMember extends React.Component {

    selectedDataAssign = [];

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
            selected: {},
            selectAll: 0,
            name: '', file: '',
            checkStatusFlag: [],
            validName: false,
            validPhone: false,
            validEmail: false,
            validPhoneAPI: false,
            validEmailAPI: false,
            modalProfile: false,
            modalDeleteAll: false,
            validPekerjaanPendapatan: false, src: ''
        };

        this.option = {
            bidang: []
        };

        this.showModalDelete = this.showModalDelete.bind(this);
        this.hideModalDelete = this.hideModalDelete.bind(this);
        this.toggleModalDeleteAll = this.toggleModalDeleteAll.bind(this);


    }


    showModalDelete(index) {
        this.setState({activeModal: index.index})
    }

    hideModalDelete() {
        this.setState({activeModal: null})
    }


    loadData = async () => {
        let result = await API.listUser(this.state.set);

        this.setState({
            data: result.data,
            totalpagenum: result.count,
            loading: false,
        });

    };


    toggleModalDeleteAll(event) {
        this.setState({modalDeleteAll: !this.state.modalDeleteAll})
    }

    deleteUserAll = async (event) => {
        this.setState({modalDeleteAll: null});
        let result = await API.deleteUser(this.selectedDataAssign);
        if (result.status === 'OK') {
            this.loadData();
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

        const {data} = this.state;


        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"

                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Senarai Pengguna"
                            // heading={
                            //     <Translation i18n={i18n}>
                            //         {
                            //             (t) => <p>{t('Senarai Pengguna')}</p>
                            //         }
                            //     </Translation>
                            // }
                            // subheading="Memaparkan senarai pengguna."
                            icon="pe-7s-id icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <List history={this.props.history}/>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>

                <Modal size='md' isOpen={this.state.modalDeleteAll} toggle={this.toggleModalDeleteAll}
                       className={'modal-danger ' + this.props.className}>
                    <ModalHeader toggle={this.toggleModalDeleteAll}>Confirmation</ModalHeader>
                    <ModalBody>
                        Are you sure you want to delete the selected item(s)?
                    </ModalBody>
                    <ModalFooter>

                        <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                onClick={this.deleteUserAll}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"> </i>Yes</Button>

                        <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                outline onClick={() => this.toggleModalDeleteAll(false)}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i>No</Button>


                    </ModalFooter>
                </Modal>


            </Fragment>
        );
    }

}
