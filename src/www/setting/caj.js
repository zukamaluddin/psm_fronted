import React, {Fragment} from 'react';
import Select from 'react-select';
// import MultiSelect from "react-multi-select-componentPentadbiran";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row,
    InputGroupAddon,
    InputGroup,} from 'reactstrap';
import {equipmentMenu} from "../../Layout/AppNav/VerticalNavWrapper"; //loading effect
import ReactTable from "react-table";
import {faCalendarAlt, faFolderOpen, faPen} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";

import PageTitle from "../../Layout/AppMain/PageTitle";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faEye} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import {toast} from "react-toastify";
import {redirectLogout} from "../../index";

const groupStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}
const initialValid = {
    jenisValid: false,
    lainValid: false,
    kaegoriValid: false,
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

        console.log('test masuk')

        let checkValid = true;

        // if (this.state.nostiker === '') {
        //     checkValid = this.toggle('nostiker')
        // }

        if (this.state.jenis === '') {
            checkValid = this.toggle('jenis')
        }
        if (this.state.lain === '') {
            checkValid = this.toggle('lain')
        }
        if (this.state.kategori === '') {
            checkValid = this.toggle('kategori')
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
                fetch(global.ipServer + "alatan/updatecaj/" + this.state.caj + "/" + this.state.kategori_id + "/"  + global.global_id, {
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
                    .then((data) => {

                        setTimeout(
                            function () {
                                if (data['status'] !== 'OK'){
                                    if (data['msg'] === 'Not valid value!'){
                                        toast.error("Not valid value!");
                                    }
                                    else{
                                        toast.error("Ralat");
                                    }
                                }
                                else {
                                    toast.success("Rekod berjaya dikemaskini");
                                }
                            }
                                .bind(this),
                            1000
                        );


                    })
                    .catch((error) => {
                        resolve('Failed');
                    });
            });

        }
    };

    constructor(props) {
        super(props);
        this.state = {
            nostiker: '',
            viewtable: false,
            datajenis: [],
            datalain: [],
            datakategori: [],
            jenis:'',
            lain:'',
            kategori:'',
            jenis_id:'',
            lain_id:'',
            kategori_id:'',
            caj:'',
            jenisValid: false,
            lainValid: false,
            kategoriValid: false,
        };

        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.toggle = this.toggle.bind(this);
        this.getlain = this.getlain.bind(this);
        this.getkategori = this.getkategori.bind(this);
        this.setharga = this.setharga.bind(this);

        fetch(global.ipServer + "alatan/get_jenis/A/" + global.global_id, {
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
                if (result.status === 'OK') {
                    this.setState({
                        datajenis: result.data,
                    })
                }

            });
    }

    getlain(id) {
        fetch(global.ipServer + "alatan/get_lain/" + id + '/' + global.global_id, {
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
                if (result.status === 'OK') {
                    this.setState({
                        datalain: result.data,
                        datakategori: [],
                        lain:'',
                        kategori:'',
                        lain_id:'',
                        kategori_id:'',
                        caj:'',
                    })
                }

            });
    }

    getkategori(id) {
        fetch(global.ipServer + "alatan/get_kategori/" + id + '/' + global.global_id, {
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
                if (result.status === 'OK') {
                    this.setState({
                        datakategori: result.data,
                        kategori:'',
                        caj:'',
                        kategori_id: '',
                    })
                }

            });
    }

    setharga(id) {
        // console.log(id)
        fetch(global.ipServer + "alatan/get_harga/" + id + '/' + global.global_id, {
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
                if (result.status === 'OK') {
                    this.setState({
                        caj: result.data
                    })
                }

            });
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
                            heading="Caj Tentusah"
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
                                                            <Label for="name"><b>Jenis Alatan</b></Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input name="jenis" type="select" id='jenis'
                                                                   value={this.state.jenis_id}
                                                                   onChange={(dataEl) => {
                                                                       let index = dataEl.nativeEvent.target.selectedIndex;
                                                                       let label = dataEl.nativeEvent.target[index].text;
                                                                       this.getlain(dataEl.target.value);
                                                                       this.setState({
                                                                           jenis: label,
                                                                           jenis_id: dataEl.target.value,
                                                                           jenisValid: false
                                                                       });
                                                                   }}
                                                            >
                                                                <option key={''} value={''} disabled>Sila Pilih
                                                                </option>
                                                                {this.state.datajenis.map(option => (
                                                                    <option key={option.id}
                                                                            value={option.id}>
                                                                        {option.name}
                                                                    </option>
                                                                ))}

                                                            </Input>
                                                            {(this.state.jenisValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name"><b>Jenis Lain</b></Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input name="lain" type="select" id='lain'
                                                                   value={this.state.lain_id}
                                                                   onChange={(dataEl) => {
                                                                       let index = dataEl.nativeEvent.target.selectedIndex;
                                                                       let label = dataEl.nativeEvent.target[index].text;
                                                                       this.getkategori(dataEl.target.value);
                                                                       this.setState({
                                                                           lain: label,
                                                                           lain_id: dataEl.target.value,
                                                                           lainValid: false
                                                                       });
                                                                   }}
                                                            >
                                                                <option key={''} value={''} disabled>Sila Pilih
                                                                </option>
                                                                {this.state.datalain.map(option => (
                                                                    <option key={option.id}
                                                                            value={option.id}>
                                                                        {option.name}
                                                                    </option>
                                                                ))}

                                                            </Input>
                                                            {(this.state.lainValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>

                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name"><b>Kategori Alatan</b></Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input name="kategori" type="select"
                                                                   id='kategori'
                                                                   value={this.state.kategori_id}
                                                                   onChange={(dataEl) => {
                                                                       let index = dataEl.nativeEvent.target.selectedIndex;
                                                                       let label = dataEl.nativeEvent.target[index].text;
                                                                       this.setharga(dataEl.target.value);
                                                                       this.setState({
                                                                           kategori: label,
                                                                           kategori_id: dataEl.target.value,
                                                                           kategoriValid: false
                                                                       });
                                                                   }}
                                                            >
                                                                <option key={''} value={''} disabled>Sila Pilih
                                                                </option>
                                                                {this.state.datakategori.map(option => (
                                                                    <option key={option.id}
                                                                            value={option.id}>
                                                                        {option.name}
                                                                    </option>
                                                                ))}

                                                            </Input>
                                                            {(this.state.kategoriValid) ?
                                                                    <div className="invalid-feedback"
                                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name"><b>Caj (RM)</b></Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Input type="text" value={this.state.caj}
                                                               name="name" value={this.state.caj}
                                                               onChange={event => {
                                                                   this.setState({
                                                                       caj: event.target.value
                                                                   })
                                                               }} placeholder={'Taip disini'}
                                                            />
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>

                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Button style={{width: '140px'}} color="primary"
                                                                className='mr-1 btn-icon btn-shadow btn-outline'
                                                                outline
                                                                onClick={this.submit}>
                                                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Kemaskini
                                                        </Button>
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
