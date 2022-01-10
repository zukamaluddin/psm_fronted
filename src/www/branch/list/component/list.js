import React from 'react';
import {
    Button,
    Card,
    CardBody, CardHeader,
} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEye} from "@fortawesome/free-solid-svg-icons";
import Loader from 'react-loaders'
import API from "../../../../utils/apiBranch";
import DeleteModal from "../component/delete";
import EditModal from "../component/edit";

import {allState} from '../../register/components/create'
import {branchMenu} from "../../../../Layout/AppNav/VerticalNavWrapper";
export default class ListBranch extends React.Component {
    selectedDataAssign = [];

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 0, sorted: [{id: 'code', desc: true}],
            set: {
                sorted: [{id: 'code', desc: true}],
                page: 0,
                pageSize: 10,
            },
            selected: {},
            selectAll: 0,
            checkStatusFlag: [],
            activeModal: null
        };
        this.fetchData = this.fetchData.bind(this);
        this.toggleRow = this.toggleRow.bind(this);
        this.deleteModal = React.createRef();
        this.editModal = React.createRef();
    }

    toggleSelectAll() {

        let newSelected = [];
        if (this.state.selectAll === 0) {
            this.state.data.forEach(x => {
                this.selectedDataAssign.push(x.id);
                if (this.state.checkStatusFlag.includes(x.id) === false) {
                    newSelected[x.id] = true;
                }

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

    toggleRow(row) {

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

    loadData = async () => {
        let result = await API.listBranch(this.state.set);
        this.setState({
            data: result.data,
            totalpagenum: result.count,
            loading: false,
        });

    };

    fetchData(state, instance) {
        let filterRFID = '';
        let filteribdNo = '';
        let filterCawangan = '';
        let filterserial = '';
        for (var x in state.filtered) {
            console.log(state.filtered[x].id)
            if (state.filtered[x].id === 'rfidNo') {
                filterRFID = state.filtered[x].value
            }
            if (state.filtered[x].id === 'ibdNo') {
                filteribdNo = state.filtered[x].value
            }
            if (state.filtered[x].id === 'cawangan') {
                filterCawangan = state.filtered[x].value
            }
            if (state.filtered[x].id === 'serialNo') {
                filterserial = state.filtered[x].value
            }

        }

        this.state.set.pages = this.state.currentPage;
        this.state.set.sorted = this.state.sorted;
        setTimeout(function () {
                this.setState({
                    set: {
                        sorted: this.state.set.sorted,
                        pageSize: state.pageSize,
                        page: this.state.currentPage,
                        rfidNo: filterRFID,
                        ibdNo: filteribdNo,
                        cawangan: filterCawangan,
                        serialno: filterserial,
                    }
                }, this.loadData);
            }.bind(this),
        );
    }


    render() {

        const {data} = this.state;
        return (
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
                                    this.deleteModal.current.toggleModalDeleteAll(this.selectedDataAssign);
                                }}
                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                color="danger">
                            <i className="lnr-cross-circle btn-icon-wrapper"> </i>
                            Hapus
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
                        onFetchData={(state, instance) => {
                            this.setState({loading: true});
                            this.fetchData(state, instance);
                        }}

                        data={data}
                        filterable
                        loading={this.state.loading}
                        filtered={this.state.filtered}
                        onFilteredChange={filtered => {
                            this.setState({filtered});
                        }}
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
                                // {
                                //     Header: 'Cawangan',
                                //     accessor: 'cawangan',width: 200,
                                //     Cell: row => <div style={{ textAlign: "center",width:'100%'}}>{row.value}</div>,
                                // },

                                {
                                    Header: 'Nama Tugasan',
                                    accessor: 'title',
                                    // width: 200,
                                    Cell: row => <div style={{ textAlign: "center",width:'100%'}}>{row.value}</div>,
                                },
                                {
                                    Header: 'Tarikh Mula',
                                    accessor: 'dateStart',
                                    width: 200
                                },
                                {
                                    Header: 'Tarikh Akhir',
                                    accessor: 'dateEnd',
                                    width: 200,
                                },
                                {
                                    Header: 'Status',
                                    accessor: 'status',width: 200,
                                    filterable: false
                                },  {
                                    Header: 'Aksi',
                                    sortable: false,
                                    filterable: false,
                                    width: 100,
                                    Cell: row => (
                                        // global.position === 'HQ' ?
                                        // <div
                                        //     className="widget-content-right widget-content-actions"
                                        //     style={{textAlign: 'center', width: '100%'}}>
                                        //
                                        //     <Button className="border-0 btn-transition"
                                        //             onClick={() => {
                                        //                 this.editModal.current.showModalEdit(row);
                                        //             }}
                                        //             outline
                                        //             color="success">
                                        //         <FontAwesomeIcon icon={faEye}/>
                                        //     </Button>
                                        //
                                        //     <EditModal ref={this.editModal} getdata={this.fetchData}/>
                                        //     </div>
                                        //     :
                                            <div
                                                className="widget-content-right widget-content-actions"
                                                style={{textAlign: 'center', width: '100%'}}>

                                                <Button className="border-0 btn-transition"
                                                        onClick={() => {
                                                            this.editModal.current.showModalEdit(row);
                                                        }}
                                                        outline
                                                        color="success">
                                                    <FontAwesomeIcon icon={faEye}/>
                                                </Button>
                                                <Button
                                                    className="border-0 btn-transition"
                                                    onClick={() => {
                                                        this.deleteModal.current.showModalDelete(row);
                                                    }}
                                                    outline
                                                    color="danger">
                                                    {
                                                        <FontAwesomeIcon
                                                            disabled={global.global_id === row.original.created_id}
                                                            icon={faTrashAlt}/>

                                                    }
                                                </Button>
                                                <EditModal ref={this.editModal} getdata={this.fetchData}/>
                                                <DeleteModal ref={this.deleteModal} getdata={this.fetchData}/>
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
                        onPageChange={(data) => {
                            this.setState({currentPage: data})
                        }}
                        pages={this.state.totalpagenum} // Display the total number of pages
                        minRows={0}
                        sorted={this.state.sorted}
                        onSortedChange={(newSort) => {
                            this.setState({sorted: newSort});
                        }}


                    />
                </CardBody>
            </Card>
        );
    }

}
