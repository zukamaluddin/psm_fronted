import React from 'react';
import {
    Button,
    Card,
    CardBody, CardHeader,
} from "reactstrap";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt, faEye} from "@fortawesome/free-solid-svg-icons";
import API from "../../../../utils/apiUser";
import DeleteModal from "../component/delete";
import EditModal from "../component/edit";

//https://github.com/FormidableLabs/react-animations -> documentation for animation
import styled, {keyframes} from "styled-components";
import {tada} from 'react-animations';
import {umMenu} from "../../../../Layout/AppNav/VerticalNavWrapper";
import ApiReport from "../../../../utils/apiReport";

const tadaAnimation = keyframes`${tada}`;
const AnimationDiv = styled.div`
  animation: infinite 1s ${tadaAnimation};
`;

export default class ListUser extends React.Component {
    selectedDataAssign = [];

    constructor(props) {
        super(props);
        this.state = {
            data: [],branchData:[],
            page: 0, sorted: [{id: 'date_created', desc: true}],
            set: {
                sorted: [{id: 'date_created', desc: true}],
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
                if (global.global_id !== x.id) {
                    this.selectedDataAssign.push(x.id);
                    if (this.state.checkStatusFlag.includes(x.id) === false) {

                        newSelected[x.id] = true;


                    }
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

    componentDidMount= async () => {
        // let branch = await ApiReport.getCawangan();
        // if (branch.status !== "Failed") {
        //     this.setState({branchData: branch})
        // }
        this.fetchData({
            filtered: [],
            page: 0,
            pageSize: 10,
            sorted: [{id: "date_created", desc: true}]
        });
    };

    loadData = async () => {
        let result = await API.listUser(this.state.set);
        this.setState({
            data: result.data,
            totalpagenum: result.count,
            loading: false,
        });

    };

    fetchData(state, instance) {
        let filterName = '';
        let filterEmail = '';
        let filterRole = '';
        let filterPosition = '';
        let filterStatus = '';
        let filterBranch = '';
        for (var x in state.filtered) {

            if (state.filtered[x].id === 'name') {
                filterName = state.filtered[x].value
            }
            if (state.filtered[x].id === 'email') {
                filterEmail = state.filtered[x].value
            }
            if (state.filtered[x].id === 'role') {
                filterRole = state.filtered[x].value
            }
            if (state.filtered[x].id === 'position') {
                filterPosition = state.filtered[x].value
            }
            if (state.filtered[x].id === 'status') {
                filterStatus = state.filtered[x].value
            }
            if (state.filtered[x].id === 'branch') {
                filterBranch = state.filtered[x].value
            }

        }

        setTimeout(function () {
                this.setState({
                    set: {
                        sorted: state.sorted,
                        pageSize: state.pageSize,
                        page: state.page,
                        name: filterName,
                        email: filterEmail,
                        role: filterRole,
                        position: filterPosition,
                        status: filterStatus,
                        branch: filterBranch,
                    }
                }, this.loadData);
            }.bind(this),
        );

    }


    render() {
        const {data} = this.state;
        console.log(global.position)

        return (

            <Card className="main-card mb-3">
                <CardBody>
                    {global.position === 'HQ' ?
                        <Button style={{width: '140px'}}
                                onClick={() => {
                                    this.setState({
                                        filtered: [],
                                        sorted: [{id: "date_created", desc: true}],
                                        page: 0,
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
                                        sorted: [{id: "date_created", desc: true}]
                                    });
                                }}
                                className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                color="info">
                            <i className="lnr-sync btn-icon-wrapper"> </i>
                            Refresh
                        </Button>

                        :
                        <div>
                            <Button style={{width: '140px'}}
                                    onClick={() => {
                                        this.props.history.push('/user/register');
                                        setTimeout(function () {
                                            umMenu.changeActiveLinkTo('#/user/register');
                                        }.bind(this),);
                                    }}
                                    disabled={global.position != "HQ" ? true : false}
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
                                            sorted: [{id: "date_created", desc: true}],
                                            page: 0,
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
                                            sorted: [{id: "date_created", desc: true}]
                                        });
                                    }}
                                    className="mb-2 mr-2 btn-icon btn-shadow btn-outline-2x" outline
                                    color="info">
                                <i className="lnr-sync btn-icon-wrapper"> </i>
                                Refresh
                            </Button>
                        </div>
                    }
                    <ReactTable
                        data={data}
                        // filterable
                        loading={this.state.loading}
                        filtered={this.state.filtered}
                        onFilteredChange={filtered => {
                            this.setState({filtered, loading: true});
                            this.fetchData({
                                filtered: filtered,
                                page: 0,
                                pageSize: 10,
                                sorted: [{id: "date_created", desc: true}]
                            });
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
                                                disabled={global.global_id === original.id}
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
                                    Header: 'Nama',
                                    accessor: 'name',
                                    filterable: false,
                                    width: 250,
                                },
                                {
                                    Header: 'E-mel',
                                    accessor: 'email',
                                    filterable: false,
                                    width: 250,
                                },
                                {
                                    Header: 'Cawangan',
                                    id:'branch',
                                    accessor: dt => dt.branch,
                                    sortable: false,
                                    filterable: false,
                                    width: 200,
                                },
                                {
                                    Header: 'Jawatan',
                                    accessor: 'position',
                                    sortable: false,
                                    filterable: false,
                                    width: 150,
                                },
                                {
                                    Header: 'Status',
                                    accessor: 'status',
                                    sortable: false,
                                    filterable: false,
                                    width: 120,
                                    Cell: ({original}) => {
                                        if (original.status === "1") {
                                            return (<div className="badge badge-success ml-2">Aktif</div>)
                                        } else if (original.status === "0") {
                                            return (<div className="badge badge-secondary ml-2">Tidak Aktif</div>)
                                        } else {
                                            return (<AnimationDiv>
                                                <div className="badge badge-success ml-2">Aktif</div>
                                            </AnimationDiv>)
                                        }
                                    },

                                },
                                {
                                    Header: 'Aksi',
                                    sortable: false,
                                    filterable: false,
                                    width: 150,
                                    Cell: row => (
                                        global.position === 'HQ' ?
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


                                                <EditModal ref={this.editModal} getdata={this.fetchData}/>
                                            </div>

                                            :
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

                                                    <FontAwesomeIcon icon={faTrashAlt}/>

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
                            this.fetchData({
                                filtered: [],
                                page: data,
                                pageSize: 10,
                                sorted: [{id: "date_created", desc: true}]
                            });
                        }}
                        pages={this.state.totalpagenum} // Display the total number of pages
                        minRows={0}
                        sorted={this.state.sorted}
                        onSortedChange={(newSort) => {
                            this.setState({sorted: newSort});
                            this.fetchData({
                                filtered: [],
                                page: 0,
                                pageSize: 10,
                                sorted: newSort
                            });
                        }}


                    />
                </CardBody>
            </Card>
        );
    }

}
