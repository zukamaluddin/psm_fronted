import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import API from "../../../../utils/apiRepairer";
import {branchMenu, repairerMenu} from "../../../../Layout/AppNav/VerticalNavWrapper"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormFeedback,
    FormGroup,
    Input, InputGroup, InputGroupAddon,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row, Table
} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DropdownList} from "react-widgets";
import {Bounce, toast} from "react-toastify";
import {faEye, faFingerprint, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
// import {userRepairerAccess} from "../../../../Layout/AppNav/acessLevel";
import TextareaAutosize from 'react-textarea-autosize';
import PDFExport from "@progress/kendo-react-pdf/dist/npm/PDFExport";
import styled, {keyframes} from "styled-components";
import {tada} from "react-animations";
import DialogEditView from "./edit";
const tadaAnimation = keyframes`${tada}`;
const AnimationDiv = styled.div`
  animation: infinite 1s ${tadaAnimation};
`;
const jsonData = require('../../../../Reference/alamat.json');


const initialState = {
    isDialogSubmitReportOpen: false,
    selectedValue: '',
    idSet: global.repairerId,
    data: [],
    data_pdf: [],
    page: 0,
    pageSize: 10,
    sorted: [{id: 'date_created', desc: true}],
    set: {
        sorted: [{id: 'date_created', desc: true}],
        page: 0,
        pageSize: 10,
    },
    selected: {},
    showPdf: false,
    selectAll: 0,
    checkStatusFlag: [],
    validPhoneAPI: false,
    validEmailAPI: false,
    modalProfile: false,
    modalDeleteAll: false,
    validPekerjaanPendapatan: false, src: '',
    name: '',
    noRocRob: '',
    streetAddressNo: '',
    placeArea: '',
    stateSelected: '',
    districtSelected: '',
    agencySelected: '',

}

const initialValid = {
    ownerNameValid: false,
    noRocRobValid: false,
    streetAddressNoValid: false,
    placeAreaValid: false,
    stateSelectedValid: false,
    districtSelectedValid: false,

}
export default class ListForm extends React.Component {
    selectedDataAssign = [];

    constructor(props) {
        super(props);
        this.state = initialState;

        this.refReactTable = React.createRef();

        // userRepairerAccess().length < 1 && this.props.history.push('/owner/list');
    }

    componentDidMount = async () => {
        this.fetchData({
            filtered: [],
            page: 0,
            pageSize: 10,
            sorted: [{id: "date_created", desc: true}]
        });
    };

    htmlDeleteModal(id) {
        return (
            <Modal id={id.original.id} isOpen={this.state.activeModal === id.original.id} toggle={this.showModalDelete}
                   className={'modal-danger ' + this.props.className}>
                <ModalHeader toggle={this.hideModalDelete}>Pengesahan</ModalHeader>
                <ModalBody>
                    Anda pasti untuk hapus data ini ?
                </ModalBody>
                <ModalFooter>

                    <Button style={{width: '90px'}} color="success"
                            className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                            onClick={this.deleteUser.bind(this, id)}><i
                        className="lnr-checkmark-circle btn-icon-wrapper"> </i>Ya</Button>

                    <Button style={{width: '90px'}} color="danger"
                            className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            outline onClick={this.hideModalDelete}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tidak</Button>

                </ModalFooter>
            </Modal>
        );
    }


    deleteUser = async (event) => {

        this.selectedDataAssign = [event.original.id];
        this.hideModalDelete()
        let result = await API.delete(event.original.id, this.props);
        if (result.status === 'OK') {
            this.selectedDataAssign = []
            await this.loadData();
            toast("Rekod berjaya dipadam", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'success'
            });
        } else {
            toast("Gagal memadam data", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'error'
            });
        }
    };


    loadData = async () => {
        let formData = new FormData();
        formData.append('data', JSON.stringify(this.state.set));
        let result = await API.list(formData, this.props);

        this.setState({
            data: result.data,
            // data_pdf: result_pdf.data,
            totalpagenum: 0,
            currentPage: 0,
            loading: false,
        });

    };

    fetchData = (state, instance) => {

        let batchNo = '';
        let year = '';
        let month = '';
        let cawangan = '';
        for (var x in state.filtered) {

            if (state.filtered[x].id === 'batchNo') {
                batchNo = state.filtered[x].value
            }
            if (state.filtered[x].id === 'year') {
                year = state.filtered[x].value
            }
            if (state.filtered[x].id === 'month') {
                month = state.filtered[x].value
            }
            if (state.filtered[x].id === 'cawangan') {
                cawangan = state.filtered[x].value
            }

        }

        setTimeout(function () {
                this.setState({
                    loading: true,
                    set: {
                        sorted: this.state.sorted,
                        pageSize: state.pageSize,
                        page: state.page,
                        pages: state.page,
                        batchNo: batchNo,
                        year: year,
                        month: month,
                        cawangan: cawangan,
                    }
                }, this.loadData);
            }.bind(this),
        );
    }
    showModalDelete = (index) => {
        this.setState({activeModal: index.original.id})
    }

    hideModalDelete = () => {
        this.setState({activeModal: null})
    }
    updateAPI = async () => {
        if (this.validate() && !this.state.noRocRobExist) {
            this.state.checkStatusFlag.push(this.state.id);
            let data = {
                id: this.state.id,
                name: this.state.name,
                noRocRob: this.state.noRocRob,
                address: this.state.address,
                agency: this.state.agencySelected,
                telNo: this.state.telNo,
                statusBayaran: this.state.statusBayaran,
                codeid: this.state.codeid,
            };
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));

            await API.updateAPI(formData, this.state.id, this.props).then((result) => {
                if (result.status === "OK") {
                    this.notify2();
                    this.setState({checkStatusFlag: []});
                    this.toggleProfile();
                    this.loadData();
                } else {
                    toast("Data tidak berjaya dikemaskini.", {
                        transition: Bounce,
                        closeButton: true,
                        autoClose: 5000,
                        position: 'top-right',
                        type: 'warning'
                    });
                }


            });
        } else {
            toast("No. R.O.C /R.O.B. telah wujud", {
                transition: Bounce,
                closeButton: true,
                autoClose: 5000,
                position: 'top-right',
                type: 'warning'
            });
        }
    };


    notify2 = () => this.toastId = toast("Berjaya dikemaskini.", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'top-right',
        type: 'success'
    });
    validate = () => {
        this.setState(initialValid);

        let checkValid = true
        if (!this.state.name) {
            checkValid = this.toggle('name')
        }
        // if (!this.state.noRocRob) {
        //     checkValid = this.toggle('noRocRob')
        // }
        if (!this.state.address) {
            checkValid = this.toggle('address');
        }
        if (!this.state.agencySelected) {
            checkValid = this.toggle('agencySelected');
        }
        return checkValid;
    };


    toggle = name => {
        this.setState({
            [`${name}Valid`]: true
        });
        return false;
    };
    handleChange = event => {
        if (event.target.name === 'noRocRob') {
            this.onValidRocAPI(event)
        }
        this.setState({
            [event.target.name]: event.target.value,
            [`${event.target.name}Valid`]: false
        })

    };
    onValidRocAPI = async (event) => {
        await API.checkROC(event.target.value, this.props, this.state.id).then((status) => {
            this.setState({noRocRobExist: status})

        });
    }
    openmodalDeleteAll = () => {
        if (this.selectedDataAssign.length === 0) {
            toast("Tiada rekod yang akan dipadamkan.", {
                transition: Bounce,
                closeButton: true,
                autoClose: 5000,
                position: 'top-right',
                type: 'warning'
            })

        } else {
            this.toggleModalDeleteAll();
        }


    };

    toggleModalDeleteAll = (event) => {
        this.setState({modalDeleteAll: !this.state.modalDeleteAll})
    }

    deleteUserAll = async (event) => {

        this.toggleModalDeleteAll()
        let result = await API.delete(this.selectedDataAssign, this.props);
        if (result.status === 'OK') {
            this.selectedDataAssign = []
            await this.loadData();

            toast("Rekod berjaya dipadam", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'success'
            });
        } else {
            toast("Gagal memadam data", {
                transition: Bounce,
                closeButton: true,
                autoClose: 3000,
                position: 'top-right',
                type: 'error'
            });
        }
    };


    openModal = (rowID) => {
        let finalizeData = this.state.data[rowID.index]
        this.setState({
            id: finalizeData.id,
            name: finalizeData.name,
            noRocRob: finalizeData.noRocRob,
            address: finalizeData.address,
            agencySelected: finalizeData.agency,
            telNo: finalizeData.telNo,
            lesenNo: finalizeData.lesenNo,
            statusBayaran: finalizeData.statusBayaran,
            codeid: finalizeData.codeid,
        })
        this.toggleProfile();
    };

    toggleProfile = () => {
        this.setState({
            modalProfile: !this.state.modalProfile
        });

    }

    onKeyPress(event) {

        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (keyValue === " ")
            event.preventDefault();
        else if (isNaN(keyValue))
            event.preventDefault();
        else if (/\.+|-/.test(keyValue))
            event.preventDefault();
    }


    toggleRow = (row) => {

        const newSelected = Object.assign({}, this.state.selected);
        newSelected[row] = !this.state.selected[row];
        if (newSelected[row] === false) {
            const index = this.selectedDataAssign.indexOf(row);
            if (index > -1) {
                this.selectedDataAssign.splice(index, 1);
            }

        }
        if (newSelected[row] === true) {
            this.selectedDataAssign.push(row)

        }

        if (Object.values(newSelected).includes(true)) {
            this.setState({
                selected: newSelected,
                selectAll: 2
            });
        } else {
            this.setState({
                selected: newSelected,
                selectAll: 0
            });
        }

    }

    onKeyNo = (event) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (keyValue !== 'A') {
            if (keyValue === " ")
                event.preventDefault();
            else if (isNaN(keyValue))
                event.preventDefault();
            else if (/\.+|-/.test(keyValue))
                event.preventDefault();
        }

    }

    render() {

        const {data} = this.state;

        return (
            <Fragment>
                {this.state.isDialogSubmitReportOpen &&
                <DialogEditView datas={this.state.selectedValue} isOpen={true} onClose={() => {
                    this.setState({
                        isDialogSubmitReportOpen: false
                    })
                }}/>
                }
                <ReactCSSTransitionGroup
                    component="div"

                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <PageTitle
                            heading="Senarai Surat Lantikan"
                            icon="pe-7s-tools icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <div>
                                        <Button style={{width: '140px'}}
                                                onClick={() => {
                                                    this.props.history.push('/branch/register');
                                                    setTimeout(function () {
                                                        branchMenu.changeActiveLinkTo('#/branch/register');
                                                    }.bind(this),);
                                                }}

                                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                                color="success">
                                            <i className="lnr-user btn-icon-wrapper"> </i>
                                            Tambah
                                        </Button>
                                        <Button style={{width: '140px'}}
                                                onClick={() => {
                                                    this.setState({
                                                        filtered: [],
                                                        sorted: [{id: 'code', desc: true}],
                                                        currentPage: 0,
                                                        loading: true
                                                    });

                                                    let dataSelected = this.state.data;

                                                    let isSelected = [];
                                                    Object.keys(dataSelected).map(function (key, value) {
                                                        isSelected.push(dataSelected[key]['id'])
                                                    });
                                                    for (let i = 0; i < isSelected.length; i++) {
                                                        this.state.selected[isSelected[i]] = false;
                                                    }
                                                    this.state.selectAll = 0;
                                                    this.fetchData({
                                                        filtered: [],
                                                        page: 0,
                                                        pageSize: 10,
                                                        sorted: [{id: 'code', desc: true}]
                                                    });
                                                }}
                                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                                color="info">
                                            <i className="lnr-sync btn-icon-wrapper"> </i>
                                            Refresh
                                        </Button>
                                    </div>
                                    <ReactTable
                                        data={data}
                                        filterable
                                        loading={this.state.loading}
                                        filtered={this.state.filtered}

                                        columns={[{
                                            columns: [
                                                {
                                                    Header: 'No.',
                                                    accessor: "",
                                                    Cell: ({original, index}) => {
                                                        let page = this.state.set.page + 1
                                                        let totalPerPage = page * this.state.set.pageSize
                                                        return (
                                                            <div style={{
                                                                textAlign: 'center',
                                                                width: '100%'
                                                            }}>{`${index + totalPerPage + 1 - this.state.set.pageSize}`}</div>
                                                        );
                                                    },
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 50
                                                },
                                                {
                                                    Header: 'No. Pekerja',
                                                    accessor: "batchNo",
                                                    sortable: false,
                                                    // filterable: false,
                                                    width: 100
                                                },
                                                {
                                                    Header: 'Nama',
                                                    accessor: "batchNo",
                                                    sortable: false,
                                                    // filterable: false,
                                                    width: 250
                                                },
                                                {
                                                    Header: 'Jawatan Pentadbir',
                                                    accessor: 'year',
                                                    // filterable: false,
                                                    width: 250
                                                },
                                                {
                                                    Header: 'Jawatan & Gred',
                                                    accessor: 'month',
                                                    // filterable: false,
                                                    width: 200
                                                },
                                                {
                                                    Header: 'Lantikan',
                                                    accessor: 'cawangan',
                                                    filterable: false,
                                                    width: 100
                                                }, {
                                                    Header: 'Jawatan Generik',
                                                    accessor: 'processName',
                                                    width: 200,
                                                    sortable: false,
                                                    filterable: false,

                                                },{
                                                    Header: 'Tarikh Mula',
                                                    accessor: 'processName',
                                                    width: 200,
                                                    sortable: false,
                                                    filterable: false,

                                                },{
                                                    Header: 'Tarikh Akhir',
                                                    accessor: 'processName',
                                                    width: 200,
                                                    sortable: false,
                                                    filterable: false,

                                                },{
                                                    Header: 'Elaun',
                                                    accessor: 'processName',
                                                    width: 200,
                                                    sortable: false,
                                                    filterable: false,

                                                },{
                                                    Header: 'No. Rujukan',
                                                    accessor: 'processName',
                                                    width: 200,
                                                    sortable: false,
                                                    filterable: false,

                                                },{
                                                    Header: 'Status',
                                                    accessor: 'isFinish',
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 120,
                                                    Cell: ({original}) => {
                                                        if (original.isFinish === false) {
                                                            return (<div className="badge badge-success ml-2">Sedang aktif</div>)
                                                        } else {
                                                            return (<div className="badge badge-secondary ml-2">Proses Siap</div>)
                                                        }
                                                    },

                                                }, {
                                                    Header: 'Aksi',
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 140,
                                                    Cell: row => (
                                                        <div
                                                            className="widget-content-right widget-content-actions"
                                                            style={{textAlign: 'center', width: '100%'}}>
                                                            <div>
                                                                <Button className="border-0 btn-transition"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                isDialogSubmitReportOpen: true,
                                                                                selectedValue: row.original.id,
                                                                            })
                                                                        }} outline
                                                                        color="success">
                                                                    <FontAwesomeIcon icon={faEye}/>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            ]
                                        }]}

                                        className="-striped -highlight"
                                        showPagination={true}
                                        showPaginationTop={false}
                                        showPaginationBottom={true}
                                        manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                                        defaultPageSize={10}
                                        previousText="Kembali"
                                        nextText="Seterusnya"
                                        rowsText="baris"
                                        ofText="daripada"
                                        pageText="Muka"
                                        pages={this.state.totalpagenum} // Display the total number of pages
                                        minRows={0}
                                        sorted={this.state.sorted}
                                        onPageSizeChange={(data) => {
                                            this.setState({
                                                pageSize: data,
                                                loading: true,
                                            }, this.fetchData({
                                                filtered: this.state.filtered,
                                                page: this.state.page,
                                                pageSize: data,
                                                sorted: this.state.sorted
                                            }));
                                        }}
                                        onPageChange={(data) => {
                                            this.setState({
                                                page: data,
                                                loading: true,
                                            }, this.fetchData({
                                                filtered: this.state.filtered,
                                                page: data,
                                                pageSize: this.state.pageSize,
                                                sorted: this.state.sorted
                                            }));

                                        }}
                                        onFilteredChange={filtered => {

                                            this.setState({filtered, loading: true});
                                            if (this.timeout) clearTimeout(this.timeout);
                                            this.timeout = setTimeout(() => {
                                                this.fetchData({
                                                    filtered: filtered,
                                                    page: this.state.page,
                                                    pageSize: this.state.pageSize,
                                                    sorted: this.state.sorted
                                                });
                                            }, 700);


                                        }}
                                        onSortedChange={(newSort) => {
                                            this.setState({sorted: newSort, loading: true},
                                                this.fetchData({
                                                    filtered: this.state.filtered,
                                                    page: this.state.page,
                                                    pageSize: this.state.pageSize,
                                                    sorted: newSort
                                                }));
                                        }}

                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
