import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../../Layout/AppMain/PageTitle";
import API from "../../../../utils/apiRepairer";
import {repairerMenu} from "../../../../Layout/AppNav/VerticalNavWrapper"
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

const jsonData = require('../../../../Reference/alamat.json');


const initialState = {
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
        let result_pdf = await API.list_pdf(formData, this.props);
        this.setState({
            data: result.data,
            data_pdf: result_pdf.data,
            totalpagenum: result.count,
            currentPage: this.state.currentPage + 1 /*page sekarang jump*/ >= result.count /*page total*/ ? (result.count <= 0 ? 0 : result.count - 1) : this.state.currentPage,
            loading: false,
        });

    };

    fetchData = (state, instance) => {

        let name = '';
        let noRocRob = '';
        let agency = '';
        let address = '';
        for (var x in state.filtered) {

            if (state.filtered[x].id === 'name') {
                name = state.filtered[x].value
            }
            if (state.filtered[x].id === 'noRocRob') {
                noRocRob = state.filtered[x].value
            }
            if (state.filtered[x].id === 'agency') {
                agency = state.filtered[x].value
            }
            if (state.filtered[x].id === 'address') {
                address = state.filtered[x].value
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
                        name: name,
                        noRocRob: noRocRob,
                        agency: agency,
                        address: address,
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


    toggleSelectAll() {
        let newSelected = [];
        if (this.state.selectAll === 0) {
            this.state.data.forEach(x => {
                // if (global.global_id === x.created_id) {
                this.selectedDataAssign.push(x.id);
                if (this.state.checkStatusFlag.includes(x.id) === false) {
                    newSelected[x.id] = true;
                }

                // }

            });
        } else {
            this.state.data.forEach(x => {
                this.selectedDataAssign = [];
                newSelected[x.id] = false;
            });
        }

        this.setState({
            selected: newSelected,
            selectAll: this.state.selectAll === 0 ? 1 : 0
        });
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


        const closeBtnProfile = <button className="close" onClick={this.toggleProfile}>&times;</button>;
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
                            heading="Senarai Pembaik"
                            // subheading="Memaparkan member member punya hutang."
                            icon="pe-7s-tools icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <Button style={{width: '140px'}}
                                            onClick={() => {
                                                this.props.history.push('/repairer/register');
                                                setTimeout(function () {
                                                    repairerMenu.changeActiveLinkTo('#/repairer/register');

                                                }.bind(this),);
                                                // myMenu.changeActiveLinkLabel('Register');
                                            }}

                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="success">
                                        <i className="lnr-user btn-icon-wrapper"> </i>
                                        Tambah
                                    </Button>

                                    {/*{userRepairerAccess().length > 0 && userRepairerAccess()[0].delete &&*/}
                                    <Button style={{width: '140px'}} onClick={() => this.openmodalDeleteAll()}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="danger">
                                        <i className="lnr-cross-circle btn-icon-wrapper"> </i>
                                        Hapus
                                    </Button>}


                                    <Button disabled={this.state.loading} style={{width: '140px'}}
                                            onClick={() => {
                                                this.setState({
                                                    filtered: [],
                                                    sorted: [{id: "date_created", desc: true}],
                                                    page: 0,
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
                                                    sorted: [{id: "date_created", desc: true}]
                                                });
                                            }}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="info">
                                        <i className="lnr-sync btn-icon-wrapper"> </i>
                                        Refresh
                                    </Button>

                                    <Button disabled={this.state.loading} style={{width: '140px'}}
                                            onClick={() => {
                                                console.log('test faiz f')
                                                this.setState({showPdf: true});
                                                this.setState({hideTindakan: true}, () => {
                                                    this.pdfExportComponent.save();
                                                    this.setState({hideTindakan: false});
                                                })
                                                setTimeout(function() { //Start the timer
                                                  this.setState({showPdf: false}) //After 1 second, set render to true
                                              }.bind(this), 500)
                                                // this.setState({showPdf: false});
                                            }}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="info">
                                        <i className="lnr-printer btn-icon-wrapper"> </i>
                                        PDF
                                    </Button>

                                    <div style={{display: this.state.showPdf ? 'block' : 'none' }}>
                                        <PDFExport
                                            fileName={'Senarai Pembaik'}
                                            scale={0.5}
                                            paperSize="A4"
                                            margin="1cm"
                                            ref={(component) => this.pdfExportComponent = component}
                                        >

                                            <Table style={{textAlign: 'center'}} id={'tableCarian'}>
                                                <thead>
                                                <tr>
                                                    <td><b>No.</b></td>
                                                    <td><b>Nama Syarikat</b></td>
                                                    <td><b>No. R.O.C/R.O.B</b></td>
                                                    <td><b>Agensi</b></td>
                                                    <td><b>Address</b></td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.data_pdf.map((item, index) =>
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.noRocRob}</td>
                                                        <td>{item.agency}</td>
                                                        <td>{item.address}</td>
                                                    </tr>
                                                )}
                                                {(this.state.data.length === 0) &&
                                                <tr>
                                                    <td colSpan={7}><b>Tiada Rekod</b></td>
                                                </tr>
                                                }
                                                </tbody>
                                            </Table>
                                        </PDFExport>
                                    </div>



                                    <ReactTable
                                        data={data}
                                        filterable
                                        loading={this.state.loading}
                                        filtered={this.state.filtered}

                                        columns={[{
                                            columns: [
                                                {
                                                    id: "checkbox",
                                                    accessor: "",

                                                    Header: x => {
                                                        return (
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox"

                                                                checked={this.state.selectAll === 1}
                                                                ref={input => {
                                                                    if (input) {
                                                                        input.indeterminate = this.state.selectAll === 2;
                                                                    }
                                                                }}
                                                                onChange={() => this.toggleSelectAll()}
                                                            />
                                                        );
                                                    },
                                                    Cell: ({original}) => {
                                                        return (
                                                            <input
                                                                style={{textAlign: 'center', width: '100%'}}
                                                                type="checkbox"
                                                                className="checkbox"
                                                                checked={this.state.selected[original.id] === true}
                                                                onChange={() => this.toggleRow(original.id)}
                                                            />
                                                        );
                                                    },
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 50
                                                },
                                                {
                                                    Header: 'No',
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
                                                    Header: 'Nama Syarikat',
                                                    accessor: 'name',
                                                },
                                                {
                                                    Header: 'No. R.O.C/R.O.B',
                                                    accessor: 'noRocRob',
                                                    width: 250
                                                }, {
                                                    Header: 'Agensi',
                                                    accessor: 'agency',
                                                    width: 200,
                                                    sortable: true,
                                                    Filter: ({filter, onChange}) =>
                                                        <select
                                                            onChange={event => onChange(event.target.value)}
                                                            style={{width: "100%"}}
                                                            value={filter ? filter.value : "All"}>
                                                            <option value="All">Semua</option>
                                                            <option value="Kerajaan">Kerajaan</option>
                                                            <option value="Bukan Kerajaan">Bukan Kerajaan</option>
                                                        </select>
                                                }, {
                                                    Header: 'Address',
                                                    width: 400,
                                                    sortable: true,
                                                    style: {
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    accessor: 'address',
                                                    Cell: row => (<div
                                                        id='descriptionColumn'>{row.value.substring(0, 55)}{(row.value.length > 55) ? '...' : null}</div>)
                                                    // Filter: ({filter, onChange}) =>
                                                    //2
                                                    //     <select
                                                    //         onChange={event => onChange(event.target.value)}
                                                    //         style={{width: "100%"}}
                                                    //         value={filter ? filter.value : "All"}
                                                    //     >
                                                    //         <option key={'All'} value="All">Semua</option>
                                                    //         <option value={'johor'}>Johor</option>
                                                    //         <option value={'kedah'}>Kedah</option>
                                                    //         <option value={'terengganu'}>Terengganu</option>
                                                    //         <option value={'kelantan'}>Kelantan</option>
                                                    //         <option value={'melaka'}>Melaka</option>
                                                    //         <option value={'negeriSembilan'}>Negeri Sembilan</option>
                                                    //         <option value={'pahang'}>Pahang</option>
                                                    //         <option value={'penang'}>Pulau Pinang</option>
                                                    //         <option value={'perak'}>Perak</option>
                                                    //         <option value={'perlis'}>Perlis</option>
                                                    //         <option value={'sabah'}>Sabah</option>
                                                    //         <option value={'sarawak'}>Sarawak</option>
                                                    //         <option value={'selangor'}>Selangor</option>
                                                    //         <option value={'WP Putrajaya'}>WP Putrajaya</option>
                                                    //         <option value={'WP Kuala Lumpur'}>WP Kuala Lumpur</option>
                                                    //         <option value={'WP Labuan'}>WP Labuan</option>
                                                    //     </select>
                                                }, {
                                                    Header: 'Tindakan',
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 140,
                                                    Cell: row => (
                                                        <div
                                                            className="widget-content-right widget-content-actions"
                                                            style={{textAlign: 'center', width: '100%'}}>
                                                            <div>
                                                                <Button className="border-0 btn-transition"
                                                                        onClick={() => this.openModal(row)} outline
                                                                        color="success">
                                                                    <FontAwesomeIcon icon={faEye}/>
                                                                </Button>
                                                                {/*<Button className="border-0 btn-transition"*/}
                                                                {/*        onClick={() => {*/}
                                                                {/*            global.repairerId = row.original.id;*/}
                                                                {/*            global.repairerName = row.original.name;*/}
                                                                {/*            global.repairerSSM = row.original.noRocRob;*/}
                                                                {/*            global.repairerTempat = row.original.streetAddressNo + ' ' + row.original.placeArea + ',' + row.original.state + ',' + row.original.district + ',' + row.original.state;*/}
                                                                {/*            localStorage.setItem('repairerId', global.repairerId)*/}
                                                                {/*            localStorage.setItem('repairerName', global.repairerName)*/}
                                                                {/*            localStorage.setItem('repairerSSM', global.repairerSSM)*/}
                                                                {/*            localStorage.setItem('repairerTempat', global.repairerTempat)*/}
                                                                {/*            this.setState({*/}
                                                                {/*                idSet: row.original.id*/}
                                                                {/*            })*/}
                                                                {/*            toast('Pembaik berjaya dipilih', {*/}
                                                                {/*                transition: Bounce,*/}
                                                                {/*                closeButton: true,*/}
                                                                {/*                autoClose: 3000,*/}
                                                                {/*                position: 'top-right',*/}
                                                                {/*                type: 'success'*/}
                                                                {/*            })*/}
                                                                {/*        }} outline*/}
                                                                {/*        color="warning">*/}
                                                                {/*    <FontAwesomeIcon icon={faFingerprint}/>*/}
                                                                {/*</Button>*/}
                                                                {/*{userRepairerAccess().length > 0 && userRepairerAccess()[0].delete &&*/}
                                                                <Button
                                                                    className="border-0 btn-transition"
                                                                    onClick={e => this.showModalDelete(row)}
                                                                    outline
                                                                    color="danger">
                                                                    <FontAwesomeIcon
                                                                        icon={faTrashAlt}/>
                                                                </Button>}
                                                                {this.htmlDeleteModal(row)}
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

                <Modal size='md' isOpen={this.state.modalDeleteAll} toggle={this.toggleModalDeleteAll}
                       className={'modal-danger ' + this.props.className}>
                    <ModalHeader toggle={this.toggleModalDeleteAll}>Pengesahan</ModalHeader>
                    <ModalBody>
                        Anda pasti untuk hapus data yang telah dipilih ?
                    </ModalBody>
                    <ModalFooter>

                        <Button style={{width: '90px'}} color="success"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                onClick={this.deleteUserAll}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"> </i>Ya</Button>

                        <Button style={{width: '90px'}} color="danger"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                outline onClick={() => this.toggleModalDeleteAll(false)}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i>Tidak</Button>


                    </ModalFooter>
                </Modal>


                <Modal size='lg' isOpen={this.state.modalProfile} toggle={this.toggleProfile}
                       className={this.props.className}>
                    <ModalHeader toggle={this.toggleProfile} close={closeBtnProfile}>Maklumat
                    </ModalHeader>
                    <ModalBody>
                        <CardHeader id="headingOne"
                                    style={{height: '2.5rem', marginBottom: '10px', padding: 'unset'}}>

                            <h5 style={{margin: 'unset'}}>Maklumat Pemilik</h5>
                        </CardHeader>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Nama Syarikat </Label>

                                    <Input
                                           value={this.state.name}
                                           type="text"

                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.nameValid}/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>No. R.O.C/R.O.B</Label>
                                    <Input
                                           value={this.state.noRocRob == null ? '' : this.state.noRocRob} type="text"
                                           name='noRocRob'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.noRocRobValid}/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                    {(this.state.noRocRobExist) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>No. R.O.C/R.O.B telah wujud</div> : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Agensi</Label>
                                    <DropdownList

                                        data={['Kerajaan', 'Bukan Kerajaan']}
                                        allowCreate="onFilter"
                                        placeholder="Sila pilih"
                                        value={this.state.agencySelected}
                                        onChange={(el) => {
                                            this.setState({agencySelected: el, agencySelectedValid: false});
                                        }}
                                        name="agencySelected"
                                        invalid={this.state.agencySelectedValid}
                                        required={true}

                                    />
                                    {(this.state.agencySelectedValid) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>Dikehendaki.</div> : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>No. Tel.</Label>

                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">+60</InputGroupAddon>
                                        <Input
                                            type="text" name="telNo"
                                            placeholder="Tulis di sini"
                                            onKeyPress={this.onKeyNo}
                                            onChange={this.handleChange}
                                            value={this.state.telNo}/>

                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Lesen No.</Label>
                                    <Input value={this.state.lesenNo} type="text"
                                           name='lesenNo'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini"/>
                                </FormGroup>
                            </Col>
                            {
                                global.position === 'HQ' ?
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Status Bayaran</Label>
                                            <select className="form-control"
                                                    value={this.state.statusBayaran}
                                                    onChange={event => {
                                                        this.setState({
                                                            statusBayaran: event.target.value,
                                                            statusBayaranValid: false
                                                        })
                                                    }}>
                                                <option key={''} value={''} disabled>Sila
                                                    pilih
                                                </option>
                                                <option>Tunai</option>
                                                <option>Kredit 7 Hari</option>
                                                <option>Kredit 14 Hari</option>
                                                <option>Kredit 21 Hari</option>
                                                <option>Kredit 30 Hari</option>
                                            </select>
                                        </FormGroup>
                                    </Col>:''
                            }
                            {
                                global.position === 'HQ' ?
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Code Id</Label>
                                            <Input value={this.state.codeid} type="text"
                                           name='codeid'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.codeidValid}/>
                                        </FormGroup>
                                    </Col>:''
                            }
                        </Row>
                        <CardHeader id="headingOne"
                                    style={{height: '2.5rem', marginBottom: '10px', padding: 'unset'}}>

                            <h5 style={{margin: 'unset'}}>Alamat</h5>
                        </CardHeader>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <TextareaAutosize className="form-control"
                                                      invalid={this.state.addressValid}
                                                      minRows={3}
                                                      maxRows={3}
                                                      name="address"
                                                      value={this.state.address}
                                                      onChange={this.handleChange}/>
                                    {(this.state.addressValid) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>Dikehendaki.</div> : null}
                                </FormGroup>
                            </Col>

                        </Row>
                    </ModalBody>
                    <ModalFooter>

                        {/*{userRepairerAccess().length > 0 && userRepairerAccess()[0].update &&*/}
                        {/*<Button style={{width: '140px'}} color="primary"*/}
                        {/*        className="mb-2 mr-2 btn-icon btn-shadow btn-outline" outline*/}
                        {/*        onClick={this.updateAPI}>*/}
                        {/*    <i className="pe-7s-diskette btn-icon-wrapper"> </i>Kemaskini*/}
                        {/*</Button>}*/}
                        <Button style={{width: '140px'}} color="danger"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline
                                onClick={() => {
                                    this.setState({noRocRobExist: false})
                                    this.toggleProfile()
                                }}><i
                            className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                    </ModalFooter>
                </Modal>

            </Fragment>
        );
    }
}
