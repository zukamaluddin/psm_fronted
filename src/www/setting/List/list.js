import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import API from "../../../utils/apiSetting";
import {ownerMenu} from "../../../Layout/AppNav/VerticalNavWrapper"
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from "reactstrap";
import TextareaAutosize from 'react-textarea-autosize';
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {DropdownList} from "react-widgets";
import {Bounce, toast} from "react-toastify";
// import {userOwnerAccess} from "../../../Layout/AppNav/acessLevel";

const initialValid = {
    ownerNameValid: false,
    noRocRobValid: false,
    streetAddressNoValid: false,
    placeAreaValid: false,
    stateSelectedValid: false,
    districtSelectedValid: false,
    noRocRobExist: false,

}
export default class ListForm extends React.Component {
    selectedDataAssign = [];

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            pageSize: 10,
            sorted: [{id: 'date_created', desc: true}],
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
            selected: {},
            selectAll: 0,
            checkStatusFlag: [],
            validPhoneAPI: false,
            validEmailAPI: false,
            modalProfile2: false,
            modalDeleteAll: false,
            validPekerjaanPendapatan: false, src: '',
            name: '',
            noRocRob: '',
            streetAddressNo: '',
            placeArea: '',
            stateSelected: '',
            districtSelected: '',
            agencySelected: '',
            lastPage: 0,
        };
        this.timeout = 0


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
        await API.checkROC(event.target.value, this.props, this.state.id,).then((status) => {

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
        if (finalizeData.code) {
            if (finalizeData.code.includes("//")) {
                let code = finalizeData.code.split("//")
                finalizeData.code = code[0] + '' + code[1]
            }
        }


        this.setState({
            id: finalizeData.id,
            kegunaan: finalizeData.kegunaan,
            jenis: finalizeData.jenis,
            lain: finalizeData.lain,
            kategori: finalizeData.kategori,
            harga: finalizeData.harga,
        })
        this.toggleProfile();
    };

    toggleProfile = () => {
        this.setState({
            modalProfile2: !this.state.modalProfile2
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

    onKeyNo(event) {

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
                            heading="Senarai Pemilik"
                            // subheading="Memaparkan member member punya hutang."
                            icon="pe-7s-users icon-gradient bg-tempting-azure"
                        />
                    </div>
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    {/*{userOwnerAccess()[0].add &&*/}
                                    {/*<Button style={{width: '180px'}}*/}
                                    {/*        onClick={() => {*/}
                                    {/*            this.props.history.push('/owner/register');*/}
                                    {/*            setTimeout(function () {*/}
                                    {/*                ownerMenu.changeActiveLinkTo('#/owner/register');*/}

                                    {/*            }.bind(this),);*/}
                                    {/*            // myMenu.changeActiveLinkLabel('Register');*/}
                                    {/*        }}*/}

                                    {/*        className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline*/}
                                    {/*        color="success">*/}
                                    {/*    <i className="lnr-user btn-icon-wrapper"> </i>*/}
                                    {/*    Tambah Kategori*/}
                                    {/*</Button>}*/}

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
                                    <ReactTable
                                        data={data}
                                        filterable
                                        loading={this.state.loading}
                                        filtered={this.state.filtered}
                                        columns={[{
                                            columns: [
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
                                                    Header: 'Kegunaan',
                                                    accessor: 'kegunaan',
                                                    width: 300
                                                },
                                                {
                                                    Header: 'Jenis',
                                                    accessor: 'jenis',
                                                    width: 300
                                                },
                                                {
                                                    Header: 'Lain',
                                                    accessor: 'lain',
                                                    width: 300
                                                },
                                                {
                                                    Header: 'Kategori',
                                                    accessor: 'kategori',
                                                    width: 250
                                                },
                                                {
                                                    Header: 'Harga',
                                                    accessor: 'harga',
                                                    width: 180
                                                },  {
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
                                                                {/*{userOwnerAccess()[0].update &&*/}
                                                                {/*<Button*/}
                                                                {/*    className="border-0 btn-transition"*/}
                                                                {/*    onClick={e => this.showModalDelete(row)}*/}
                                                                {/*    outline*/}
                                                                {/*    color="danger">*/}
                                                                {/*    <FontAwesomeIcon*/}
                                                                {/*        icon={faTrashAlt}/>*/}
                                                                {/*</Button>*/}
                                                                {/*}*/}
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


                <Modal size='lg' isOpen={this.state.modalProfile2} toggle={this.toggleProfile2}
                       className={this.props.className}>
                    <ModalHeader toggle={this.toggleProfile} close={closeBtnProfile}>Kemaskini Caj
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Kegunaan</Label>

                                    <Input readOnly value={this.state.kegunaan} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Jenis</Label>

                                    <Input readOnly value={this.state.jenis} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Lain</Label>

                                    <Input readOnly value={this.state.lain} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Kategori</Label>

                                    <Input readOnly value={this.state.kategori} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Harga</Label>

                                    <Input value={this.state.harga} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" />
                                </FormGroup>
                            </Col>
                        </Row>

                    </ModalBody>
                    <ModalFooter>
                        {/*{userOwnerAccess()[0].update &&*/}
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
