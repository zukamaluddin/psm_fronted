import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import PageTitle from "../../../Layout/AppMain/PageTitle";
import {Button, Card, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faMoneyBillWave, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import Loader from 'react-loaders'
import DatePicker from "react-datepicker";
import {Bounce, toast} from "react-toastify";
import {redirectLogout} from "../../../index";
import Route from "react-router-dom/es/Route";
import Redirect from "react-router-dom/es/Redirect";
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper"; //loading effect

// import MultiStep from ".//create";


export default class List extends React.Component {
    state = {};
    selectedDataAssign = [];

    constructor() {
        super();
        this.state = {
            onShowList: true,
            id_dossier: '',
            onShowAdd: true,
            data: [],
            pages: 2,
            page: 0,
            pageSize: 10,
            set: {},
            selected: {},
            selectAll: 0,
            modalXXX: false,
            nama: '',
            position: global.position,
            checkStatusFlag: [],
            priorityList: [{id: 1, name: 'LOW'}, {id: 2, name: 'MEDIUM'}, {id: 3, name: 'HIGH'}],
            typeList: [{id: 1, name: 'Sitrep'}, {id: 2, name: 'Locstate'}, {id: 3, name: 'Intel'}],

            validNama: false,

            modalProfile: false,
            modalDeleteAll: false,
            validPekerjaanPendapatan: false,
            routePaymentPage: false,
            selectedEqID: null,
        };
        this.refReactTable = React.createRef();

        this.fetchData = this.fetchData.bind(this);

        this.showModalDelete = this.showModalDelete.bind(this);
        this.checkSelection = this.checkSelection.bind(this);
        this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
        this.prosesDeletion = this.prosesDeletion.bind(this);
        this.hideModalDelete = this.hideModalDelete.bind(this);
        //
        // this.showModalDeleteAll = this.showModalDeleteAll.bind(this);
        this.toggleModalDeleteAll = this.toggleModalDeleteAll.bind(this);

        this.toggleProfile = this.toggleProfile.bind(this);

        this.toggleRow = this.toggleRow.bind(this);
    }

    deleteUserAll = (event) => {

        fetch(global.ip_dossier + "target/delete_multiple/" + global.global_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 'x-access-token': global.token
            },
            body: JSON.stringify({data: this.selectedDataAssign}),
        })
            .then((response) => {
               if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                toast("Rekod berjaya dihapuskan", {
                    transition: Bounce,
                    closeButton: true,
                    autoClose: 5000,
                    position: 'top-right',
                    type: 'success'
                });


                // this.state.checkStatusFlag.push( this.selectedDataAssign);
                // for (let x in this.selectedDataAssign) {
                //     this.state.checkStatusFlag.push(this.selectedDataAssign[x])
                //
                // }
                // for (let x in this.selectedDataAssign) {
                //     this.checKIdCelery.push({task_id: result['task_id'], id: this.selectedDataAssign[x]})
                //
                // }

                this.checkCelery(result, this, 'delete_multiple');
                this.selectedDataAssign = [];
                this.state.selectAll = 0;
                this.loadData();


                this.setState({
                    // items: result.data, paging: result.paging, activeModal: null
                    modalDeleteAll: null,
                });
            })
    };

    hideModalDelete() {
        this.setState({activeModal: null})
    }


    handleChange(event) {
        let change = {};
        change[event.target.name] = event.target.value;
        this.setState(change)

    }


    fetchData(state, instance) {

        // let pages = 0;
        let description = '';
        let to = '';
        let type = '';
        let priority = '';
        for (var x in state.filtered) {
            if (state.filtered[x].id === 'description') {
                description = state.filtered[x]
            }
            if (state.filtered[x].id === 'to') {
                to = state.filtered[x]
            }
            if (state.filtered[x].id === 'type') {
                type = state.filtered[x]
            }
            if (state.filtered[x].id === 'priority') {
                priority = state.filtered[x]
            }

        }
        this.state.set.pages = state.page;
        this.state.set = {
            sorted: state.sorted,
            pageSize: state.pageSize,
            page: this.state.set.pages,
            filtered: state.filtered,
            branch_id: global.branch_id

        };

        this.loadData()

    }

    openModal = (rowID) => {
        this.setState({onShowList: false});
        this.setState({onShowAdd: false});
        this.setState({id_dossier: rowID.row.checkbox.id});
        this.state.id_dossier = rowID.row.checkbox.id;
    };

    onShowTextPendidikan = false;

    notify2 = () => this.toastId = toast("Rekod berjaya ditambah", {
        transition: Bounce,
        closeButton: true,
        autoClose: 5000,
        position: 'top-right',
        type: 'success'
    });


    openmodalDeleteAll = () => {
        if (this.selectedDataAssign.length === 0) {
            toast("Tiada rekod dipilih.", {
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

    toggleModalDeleteAll(event) {
        this.setState({modalDeleteAll: !this.state.modalDeleteAll})
    }

    showModalDelete(mode, id) {
        if (mode === 'single')
            this.setState({deleteID: [id]}, () => {
                console.log(this.state.deleteID);
                this.setState({
                    modalXXX: !this.state.modalXXX
                })
            });
        else if (mode === 'multiple') {
            let check = this.state.data.filter(function (v) {
                return v.checked
            });

            if (check.length > 0)
                this.setState({
                    modalXXX: !this.state.modalXXX
                });
            else
                toast.error('Tolong pilih data untuk di padam');


            let selected = this.state.data.filter(v => {
                return v.checked === true
            }).map(v => {
                return v.id
            });
            this.setState({deleteID: selected}, () => {
                console.log(this.state.deleteID);
            });
        }

    }

    checkSelection(){
        let check = this.state.data.filter(function(v){
            return v.checked
        });

        if(check.length > 0)
            this.toggleDeleteModal();
        else
            toast.error('Tiada rekod untuk dipadam')
    }

    loadData() {
        console.log(this.state.position);
        var test = new FormData();
        let apibody ='';
        if (this.state.position == 'Manager Cawangan'){
            apibody = 'payment/list_manager/'
        }
        else if (this.state.position == 'Manager Negeri'){
            apibody = 'payment/list_manager_negeri/'
        }
        else{
            apibody = 'alatan/list_alatan/'
        }
        fetch(global.ipServer + apibody + global.global_id, {
            method: 'POST', body: JSON.stringify(this.state.set),
            headers: {
                'Content-Type': 'application/json', 'x-access-token': global.token
            },
        })
            .then((response) => {
               if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((result) => {
                this.setState({
                    data: result.data,
                    totalpagenum: result.count,
                    // loading: false,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        // console.log(this.state.data);

    }

    toggleProfile() {
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

    prosesDeletion() {

        fetch(global.ipServer + 'alatan/delete_alatan/' + global.global_id, {
            method: 'POST', body: JSON.stringify({'ids': this.state.deleteID}),
            headers: {
                'Content-Type': 'application/json', 'x-access-token': global.token
            },
        })
            .then((response) => {
               if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return [];

                }
            })
            .then((data) => {

                setTimeout(
                    function () {
                        if (data['status'] !== 'OK')
                            toast.error("Ralat");
                        else {
                            toast.success("Rekod berjaya dihapuskan");
                            this.toggleDeleteModal();
                            this.loadData();
                        }
                    }
                        .bind(this),
                    1000
                );


            })
    }

    toggleDeleteModal() {
        this.setState({
            modalXXX: !this.state.modalXXX
        })
    }

    toggleSelectAll() {
        this.setState({selectAll: !this.state.selectAll});
        let copy = this.state.data;
        copy.forEach(v => {
            v.checked = !this.state.selectAll;
        });

        this.setState({data: copy})
    }

    toggleRow(id) {
        let idx = this.state.data.findIndex(item => item.id === id);
        let copy = this.state.data;
        copy[idx].checked = !copy[idx].checked;

        let checkUnselect = copy.filter(function (v) {
            return !v.checked
        });

        this.setState({data: copy, selectAll: checkUnselect.length === 0});
    }


    render() {

        const {data} = this.state;

        function formatDate(string) {
            function pad(s) {
                return (s < 10) ? '0' + s : s;
            }

            let d = new Date(string);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
        }

        if (this.state.routePaymentPage) {
            return <Redirect push to={`/equipment/payment/${this.state.selectedEqID}`} />;
        }

        const closeBtnProfile = <button className="close" onClick={this.toggleProfile}>&times;</button>;
        return (
            <Fragment>
                {this.state.modalXXX &&
                <Modal isOpen={this.state.modalXXX} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggleDeleteModal}>Pengesahan</ModalHeader>
                    <ModalBody>
                        Adakah anda pasti untuk memadam rekod ini?
                    </ModalBody>
                    <ModalFooter>

                        <Button style={{width: '90px'}} color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                onClick={this.prosesDeletion}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"
                        > </i>Ya</Button>

                        <Button style={{width: '90px'}} color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                outline onClick={this.toggleDeleteModal}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i> Tidak</Button>

                    </ModalFooter>
                </Modal>
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
                            heading="Senarai Alatan"
                            icon="pe-7s-news-paper"
                        />
                    </div>
                    <Row id="list">
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <Button style={{width: '140px'}}
                                            onClick={() => {
                                                this.props.history.push('/equipment/create/000');
                                                setTimeout(function () {
                                                    equipmentMenu.changeActiveLinkTo('#/equipment/create/000');

                                                }.bind(this),);
                                                // myMenu.changeActiveLinkLabel('Register');
                                            }}

                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="success">
                                        <i className="lnr-user btn-icon-wrapper"> </i>
                                        Tambah
                                    </Button>
                                    {this.state.position == 'Manager Negeri' &&
                                    <Button style={{width: '140px'}}
                                            onClick={() => {
                                                // this.checkSelection();
                                                this.showModalDelete('multiple', '')
                                            }}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="danger">
                                        <i className="lnr-cross-circle btn-icon-wrapper"> </i>
                                        Hapus
                                    </Button>
                                    }
                                    {this.state.position == 'Manager Cawangan' &&
                                    <Button style={{width: '140px'}}
                                            onClick={() => {
                                                // this.checkSelection();
                                                this.showModalDelete('multiple', '')
                                            }}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="danger">
                                        <i className="lnr-cross-circle btn-icon-wrapper"> </i>
                                        Hapus
                                    </Button>
                                    }
                                    <Button style={{width: '140px'}}
                                            onClick={() => {

                                                setTimeout(function () {
                                                    this.setState({
                                                        filtered: [],
                                                        sorted: this.state.set.sorted,
                                                        currentPage: 0
                                                    });

                                                }.bind(this), 500);

                                                // this.setState({loading: true});

                                                let dataFF = this.state.data;

                                                let isSelected = [];
                                                Object.keys(dataFF).map(function (key, value) {
                                                    isSelected.push(dataFF[key]['id'])
                                                });
                                                for (let i = 0; i < isSelected.length; i++) {
                                                    this.state.selected[isSelected[i]] = false;
                                                }
                                                this.state.selectAll = 0;
                                            }}
                                            className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                            color="info">
                                        <i className="lnr-sync btn-icon-wrapper"> </i>
                                        Refresh
                                    </Button>

                                    <ReactTable
                                        onFetchData={this.fetchData} // Request new data when things change
                                        data={data}
                                        ref={(refReactTable) => {
                                            this.refReactTable = refReactTable;
                                        }}
                                        loading={this.state.loading}
                                        filtered={this.state.filtered}
                                        sorted={this.state.sorted}
                                        onFilteredChange={filtered => {
                                            this.setState({filtered});
                                        }}
                                        style={{whiteSpace: 'unset'}}
                                        filterable

                                        columns={[{
                                            columns: [
                                                {
                                                    id: "checkbox",
                                                    accessor: "",
                                                    filterable: false,
                                                    sortable: false,
                                                    Header: x => {
                                                        return (
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox"
                                                                checked={this.state.selectAll}
                                                                onChange={() => this.toggleSelectAll()}
                                                            />
                                                        );
                                                    },
                                                    Cell: ({original}) => {
                                                        return (
                                                            <input
                                                                style={{textAlign: "center", width: "100%"}}
                                                                type="checkbox"
                                                                className="checkbox"
                                                                checked={original.checked}
                                                                onChange={() => this.toggleRow(original.id)}
                                                            />
                                                        );
                                                    },
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
                                                            }}>{`${index +  totalPerPage + 1 - this.state.set.pageSize}`}</div>
                                                        );
                                                    },
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 50
                                                },
                                                {
                                                    Header: "Tarikh Masa",
                                                    sortable: false,
                                                    accessor: "tarikh",
                                                    width: 200,
                                                    Filter: ({filter, onChange}) =>
                                                        <DatePicker className="form-control"
                                                                    selected={this.state.filterDateTime}
                                                                    onChange={(e) => {
                                                                        this.setState({filterDateTime: e}, () => onChange(moment(e).format('D/M/YYYY')))
                                                                    }}
                                                                    dateFormat="d/M/yyyy"
                                                        />

                                                },   {
                                                    Header: 'Resit',
                                                    sortable: false,
                                                    // width: 500,
                                                    style: {
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    accessor: 'resit',
                                                    Cell: row => (<div id='descriptionColumn'>{row.value.substring(0,65)}{(row.value.length > 65) ? '...' : null}</div>)
                                                    // Cell: row => (<div id='descriptionColumn'
                                                    //                    dangerouslySetInnerHTML={{__html: row.original.description.substring(0, 40) > 40 ?row.original.description.substring(0, 50) :row.original.description.substring(0, 50) + ' ...'}}/>)
                                                },{
                                                    Header: 'Pembaik',
                                                    sortable: false,
                                                    // width: 500,
                                                    style: {
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    accessor: 'pembaik',
                                                    // Cell: row => (<div id='descriptionColumn'>{row.value.substring(0,65)}{(row.value.length > 65) ? '...' : null}</div>)
                                                    // Cell: row => (<div id='descriptionColumn'
                                                    //                    dangerouslySetInnerHTML={{__html: row.original.description.substring(0, 40) > 40 ?row.original.description.substring(0, 50) :row.original.description.substring(0, 50) + ' ...'}}/>)
                                                },{
                                                    Header: 'Tempat',
                                                    sortable: false,
                                                    // width: 500,
                                                    style: {
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: 'nowrap'
                                                    },
                                                    accessor: 'tempat',
                                                    Cell: row => (<div id='descriptionColumn'>{row.value.substring(0,65)}{(row.value.length > 65) ? '...' : null}</div>)
                                                    // Cell: row => (<div id='descriptionColumn'
                                                    //                    dangerouslySetInnerHTML={{__html: row.original.description.substring(0, 40) > 40 ?row.original.description.substring(0, 50) :row.original.description.substring(0, 50) + ' ...'}}/>)
                                                },{
                                                    Header: 'Tindakan',
                                                    sortable: false,
                                                    filterable: false,
                                                    width: 150,
                                                    Cell: row => (


                                                        <div
                                                            className="widget-content-right widget-content-actions"
                                                            style={{textAlign: 'center', width: '100%'}}>
                                                                <Button
                                                                    className="border-0 btn-transition"
                                                                    onClick={() => {
                                                                        // this.toggleDeleteModal();
                                                                        this.showModalDelete('single', row.original.id);
                                                                    }
                                                                    }
                                                                    outline
                                                                    color="danger">

                                                                    <FontAwesomeIcon icon={faTrashAlt}/>
                                                                </Button>
                                                                    {row.original.hantar === 0 &&
                                                                    <Route render={({history}) => (
                                                                        <Button
                                                                            className="border-0 btn-transition"
                                                                            outline
                                                                            color="info"
                                                                            onClick={() => {
                                                                                history.push('/equipment/Create/' + row.original.id);
                                                                                setTimeout(function () {
                                                                                    equipmentMenu.changeActiveLinkTo('#/equipment/create/000');

                                                                                }.bind(this),);
                                                                            }}
                                                                        ><FontAwesomeIcon icon={faEye}/>
                                                                        </Button>
                                                                    )}/>}
                                                                    {row.original.hantar === 1 &&
                                                                    <Route render={({history}) => (
                                                                        <Button
                                                                            className="border-0 btn-transition"
                                                                            outline
                                                                            color="info"
                                                                            onClick={() => {
                                                                                history.push('/equipment/View/' + row.original.id);
                                                                                setTimeout(function () {
                                                                                    equipmentMenu.changeActiveLinkTo('#/equipment/create/000');

                                                                                }.bind(this),);
                                                                            }}
                                                                        ><FontAwesomeIcon icon={faEye}/>
                                                                        </Button>
                                                                    )}/>}
                                                                    {row.original.payment === 1 &&
                                                                    <Button
                                                                        className="border-0 btn-transition"
                                                                        onClick={() => this.setState({routePaymentPage: true,selectedEqID:row.original.id})}
                                                                        outline
                                                                        color="success">

                                                                        <FontAwesomeIcon icon={faMoneyBillWave}/>
                                                                    </Button>}
                                                                    {/*{this.state.position == 'Manager Cawangan' &&*/}
                                                                    {/*<Button*/}
                                                                        {/*className="border-0 btn-transition"*/}
                                                                        {/*onClick={() => {*/}
                                                                            {/*// this.toggleDeleteModal();*/}
                                                                            {/*this.showModalDelete('single', row.original.id);*/}
                                                                        {/*}*/}
                                                                        {/*}*/}
                                                                        {/*outline*/}
                                                                        {/*color="danger">*/}

                                                                        {/*<FontAwesomeIcon icon={faTrashAlt}/>*/}
                                                                    {/*</Button>*/}
                                                                    {/*}*/}
                                                                    {/*{this.state.position == 'Manager Negeri' &&*/}
                                                                    {/*<Button*/}
                                                                        {/*className="border-0 btn-transition"*/}
                                                                        {/*onClick={() => {*/}
                                                                            {/*// this.toggleDeleteModal();*/}
                                                                            {/*this.showModalDelete('single', row.original.id);*/}
                                                                        {/*}*/}
                                                                        {/*}*/}
                                                                        {/*outline*/}
                                                                        {/*color="danger">*/}

                                                                        {/*<FontAwesomeIcon icon={faTrashAlt}/>*/}
                                                                    {/*</Button>*/}
                                                                    {/*}*/}

                                                                {/*</div>}*/}
                                                        </div>
                                                    )
                                                }
                                            ]
                                        }]}

                                        className="-striped -highlight off-overflow"
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
                                        // onSortedChange={(newSort, column) => {
                                        //     this.setState({sorted: newSort});
                                        // }}


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
