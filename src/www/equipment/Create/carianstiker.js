import React, {Fragment} from 'react';
import Select from 'react-select';
// import MultiSelect from "react-multi-select-componentPentadbiran";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row,
    InputGroupAddon,
    InputGroup,} from 'reactstrap';
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper"; //loading effect
import ReactTable from "react-table";
import {faCalendarAlt, faFolderOpen, faPen} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

import PageTitle from "../../../Layout/AppMain/PageTitle";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faEye} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import {toast} from "react-toastify";
import PrintCertGui from "../../certificate/layoutCert";
import {redirectLogout} from "../../../index";

const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}
const initialValid = {
    jenisValid: false,
    // nostikerValid: false,
};

const groupBadgeStyles = {
    backgroundColor: '#EBECF0',
    borderRadius: '2em',
    color: '#172B4D',
    display: 'inline-block',
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: '1',
    minWidth: 1,
    padding: '0.16666666666667em 0.5em',
    textAlign: 'center',
};

export default class CreateNew extends React.Component {

    componentDidMount() {
        // this.loadElement();
    }

    dateStartChange(date) {
        this.setState({
            dateStart: date
        });
    }

    descChange(event) {
        // console.log(event.target.value);
        this.setState({new_desc: event.target.value});
    }

    validate = () => {
        this.setState(initialValid);

        let checkValid = true;

        // if (this.state.nostiker === '') {
        //     checkValid = this.toggle('nostiker')
        // }

        if (this.state.jenis === '') {
            checkValid = this.toggle('jenis')
        }

        return checkValid;
    };

    toggle = name => {
        this.setState({
            [`${name}Valid`]: true
        });
        return false;
    };



    submit = async () => {
        if (this.validate()) {

            return new Promise((resolve, reject) => {
                let xxy = 'All';
                if (this.state.nostiker !== ''){
                    xxy = this.state.nostiker;
                };
                fetch(global.ipServer + "alatan/caristiker/" + xxy + "/" + this.state.jenis, {
                    headers: {
                        'x-access-token': global.token
                    }
                })
                    .then((response) => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            redirectLogout(response.status, this.props);
                            return [];

                        }
                    })
                    .then((result) => {
                        this.setState({
                            listdata: result.data,
                        })


                    });
            });

        }
    };

    constructor(props) {
        super(props);
        this.state = {
            jenis: '',
            nostiker: '',
            viewtable: false,
        };

        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.toggle = this.toggle.bind(this);
    }


    reset() {
        this.setState({
            //test
        })
    }


    renderEditable(cellInfo) {
        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({data});
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }


    handleClick() {
        this.setState(function (prevState) {
            return {isToggleOn: !prevState.isToggleOn};
        });
        console.log(this.state.isToggleOn)
    }


    formatGroupLabel = data => (
        <div style={groupStyles}>
            <span>{data.label}</span>
            <span style={groupBadgeStyles}>{data.options.length}</span>
        </div>
    );

    render() {
        const {listdata} = this.state;

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Container fluid>
                        <PageTitle
                            heading="Carian Stiker"
                            icon="pe-7s-news-paper"
                        />
                        <Row>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        {/*<CardTitle>Intel Report</CardTitle>*/}

                                        <Form>
                                            <FormGroup>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name"><b>Jenis Stiker</b></Label>
                                                        </Col>
                                                        <Col md={3}>
                                                            <select className="form-control"
                                                                    value={this.state.jenis}
                                                                    onChange={event => {
                                                                        this.setState({
                                                                            jenis: event.target.value,
                                                                            jenisValid: false
                                                                        })
                                                                    }}>
                                                                <option key={''} value={''} disabled>Sila pilih
                                                                </option>
                                                                <option>DE 01</option>
                                                                <option>DE 02</option>
                                                                <option>DE 03</option>
                                                                <option>DE 04</option>
                                                                <option>DE 05</option>
                                                                <option>DE 06</option>
                                                                <option>DE 07</option>
                                                                <option>DE 08</option>
                                                                <option>DE 09</option>
                                                                <option>DE 10</option>
                                                                <option>DE 11</option>
                                                                <option>DE 12</option>
                                                                <option>DE 13</option>
                                                                <option>DE 14</option>
                                                                <option>DE 15</option>
                                                                <option>DE 16</option>
                                                                <option>DE 17</option>
                                                                <option>DE 18</option>
                                                                <option>DE 19</option>
                                                                <option>DE 20</option>
                                                                <option>DE 21</option>
                                                                <option>DE 22</option>
                                                                <option>DE 23</option>
                                                                <option>DE 24</option>
                                                            </select>
                                                            {(this.state.jenisValid) ?
                                                                <div className="invalid-feedback"
                                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name"><b>No Stiker</b></Label>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Input type="text" value={this.state.nostiker}
                                                                   name="name" value={this.state.nostiker}
                                                                   onChange={event => {
                                                                       this.setState({
                                                                           nostiker: event.target.value,
                                                                           // nostikerValid: false
                                                                       })
                                                                   }} placeholder={'Taip disini'}
                                                                   />

                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Button style={{width: '140px'}} color="primary"
                                                                className='mr-1 btn-icon btn-shadow btn-outline'
                                                                outline
                                                                onClick={this.submit}>
                                                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Cari
                                                        </Button>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={12}>
                                                            <Label for="name"><b>Senarai Stiker</b></Label>
                                                        </Col>
                                                        <Col md={12}>
                                                            <ReactTable
                                                                // showPagination={false}
                                                                data={listdata}
                                                                columns={[
                                                                    {
                                                                        Header: 'No',
                                                                        accessor: "",
                                                                        Cell: ({original, index}) => {
                                                                            let page = 1
                                                                            let totalPerPage = page
                                                                            return (
                                                                                <div style={{
                                                                                    textAlign: 'center',
                                                                                    width: '100%'
                                                                                }}>{`${index +  totalPerPage }`}</div>
                                                                            );
                                                                        },
                                                                        sortable: false,
                                                                        filterable: false,
                                                                        width: 50
                                                                    },
                                                                    {
                                                                        Header: "Jenis Stiker",
                                                                        accessor: "jenis",
                                                                    },
                                                                    {
                                                                        Header: "No stiker",
                                                                        accessor: "nostiker",
                                                                    },
                                                                    {
                                                                        Header: "Tarikh",
                                                                        accessor: "tarikh",
                                                                    },

                                                                    {
                                                                        Header: "Cawangan",
                                                                        accessor: "cawangan",
                                                                    },

                                                                    {
                                                                        Header: "Pegawai",
                                                                        accessor: "pegawai",
                                                                    },
                                                                ]}
                                                                minRows={1}
                                                                defaultPageSize={20}
                                                                // defaultPageSize={5}
                                                                className="-striped -highlight"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </FormGroup>

                                        </Form>


                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
