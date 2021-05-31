import React, {Fragment} from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {Button, Card, CardBody, Col, Container, Form, FormGroup, Label, Row} from "reactstrap";

import PageTitle from "../../../Layout/AppMain/PageTitle";
import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCertificate, faEye} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import PrintCertGui from "../../certificate/layoutCert";
import {redirectLogout} from "../../../index";
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper";

export default class ViewReport extends React.Component {

    printView = () => {
        this.setState({printCert: !this.state.printCert, alatanId: undefined})
    };
    printCert = (e) => {
        this.setState({printCert: true, alatanId: e.original.id})

    };

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            report: {
                date_received: "",
                description: "",
                from: "",
                to: "",
                priority: "",
                attachment: []
            }
        };

        this.detailview = this.detailview.bind(this);

    }

    detailview(id) {
        console.log( this.state.report.detail[id])
        this.setState({
            tambahdetail: !this.state.tambahdetail,
            jenis: this.state.report.detail[id].jenis,
            kategori: this.state.report.detail[id].kategori,
            kategori_id: this.state.report.detail[id].kategori_id,
            lain: this.state.report.detail[id].lain,
            lain_id: this.state.report.detail[id].lain_id,
            had: this.state.report.detail[id].had,
            pemilik: this.state.report.detail[id].pemilik,
            pemilik_id: this.state.report.detail[id].pemilik_id,
            jenis_id: this.state.report.detail[id].jenis_id,
            jenishad: this.state.report.detail[id].jenishad,
            hadpenuh: this.state.report.detail[id].hadpenuh,
            jenama: this.state.report.detail[id].jenama,
            siri: this.state.report.detail[id].siri,
            caj: this.state.report.detail[id].caj,
            tentusan: this.state.report.detail[id].tentusan,
            alamatalatan: this.state.report.detail[id].alamatalatan,
            pegawaitentusah_id: this.state.report.detail[id].pegawaitentusah_id,
            pegawaitentusah: this.state.report.detail[id].pegawaitentusah,
            kegunaan: this.state.report.detail[id].kegunaan,
            nombordaftar: this.state.report.detail[id].nombordaftar,
            nomborsijil: this.state.report.detail[id].nomborsijil,
            stikerbaru: this.state.report.detail[id].stikerbaru,
            jenisstikerbaru: this.state.report.detail[id].jenisstikerbaru,
            stikerlama: this.state.report.detail[id].stikerlama,
            jenisstikerlama: this.state.report.detail[id].jenisstikerlama,
            rowUpdate: id,
            idUpdate: this.state.report.detail[id].id,
            lamaUpdate: this.state.report.detail[id].lama,
            newDetail: false,
        });
        // this.setState({new_desc: ''});
        // this.setState({new_attach: ''});

    }

    componentDidMount() {
        fetch(global.ipServer + "alatan/get_alatan/" + this.state.id + '/' + global.global_id, {
            headers: {
                'x-access-token': global.token
            }
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
                console.log(result);
                if (result.status === 'OK') {
                    this.setState({report: result.data})

                    if (result.data.jenisresit === 'Auto') {
                        this.setState({
                                resit: 'DMSB/' + result.data.codeCawangan + '/' + result.data.tahun + '/' + result.data.resit
                            })
                    }
                    else{
                        this.setState({
                                resit: result.data.resit
                            })
                    }

                    if (result.data.resit !== ''){
                        this.setState({
                            adaresit: true,
                        });
                    }
                }
            });
    }


    render() {

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
                            heading="Paparan Alatan"
                            icon="lnr-map text-info"
                        />
                        <Row>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        {/*<CardTitle>Paparan Alatan</CardTitle>*/}

                                        <Form>
                                            <FormGroup>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Pembaik :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <p>{this.state.report.pembaik}</p>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Kawasan :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <p>{this.state.report.kawasan}</p>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name">Tarikh Tentusah :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <p>{this.state.report.tarikh}</p>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Tempat :</Label>
                                                        </Col>
                                                        <Col md={2}>
                                                            <p>{this.state.report.jenistempat}</p>
                                                        </Col>
                                                        <Col md={7}>
                                                            <p>{this.state.report.tempat}</p>
                                                        </Col>
                                                    </Row>
                                                </div>
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Pegawai :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <p>{this.state.report.pegawai}</p>
                                                        </Col>
                                                        <Col md={6}></Col>
                                                    </Row>
                                                </div>
                                                {this.state.adaresit &&
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={1}>
                                                            <Label for="name">Resit :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            {this.state.report.jenisresit == 'Auto' &&
                                                                <p>{this.state.report.resitcawangan}</p>
                                                            }
                                                            {this.state.report.jenisresit == 'Manual' &&
                                                                <p>{this.state.report.resit}</p>
                                                            }
                                                        </Col>
                                                        <Col md={1}></Col>
                                                        <Col md={1}>
                                                            <Label for="name">No Rujukan :</Label>
                                                        </Col>
                                                        <Col md={4}>
                                                            <p>{this.state.report.rujukan}</p>
                                                        </Col>
                                                        <Col md={1}></Col>
                                                    </Row>
                                                </div>}
                                                {this.state.tambahdetail &&
                                                <div style={{backgroundColor: 'lightgrey', padding: '20px'}}>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Pegawai Tentusah :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.pegawaitentusah}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Pemilik :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.pemilik}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Alamat Alatan :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.alamatalatan}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Kegunaan :</Label>
                                                            </Col>
                                                            <Col md={10}>
                                                                <p>{this.state.kegunaan}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Jenis :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.jenis}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Lain :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.lain}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Kategori :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.kategori}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Had :</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.had}</p>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.jenishad}</p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Jenama :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.jenama}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">No. Siri :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.siri}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Caj Fi :</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.caj}</p>
                                                            </Col>
                                                            <Col md={3}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Tentusah :</Label>
                                                            </Col>
                                                            <Col md={4}>
                                                                <p>{this.state.tentusan}</p>
                                                            </Col>
                                                            <Col md={1}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Nombor Daftar :</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.nombordaftar}</p>
                                                            </Col>
                                                            <Col md={3}></Col>
                                                            <Col md={1}>
                                                                <Label for="name">Nombor Sijil :</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.nomborsijil}</p>
                                                            </Col>
                                                            <Col md={3}></Col>
                                                        </Row>
                                                    </div>
                                                    <div style={{margin: '20px'}}>
                                                        <Row form>
                                                            <Col md={1}>
                                                                <Label for="name">Stiker :</Label>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.jenisstikerbaru}</p>
                                                            </Col>
                                                            <Col md={2}>
                                                                <p>{this.state.stikerbaru}</p>
                                                            </Col>
                                                            <Col md={6}>
                                                                <Button  style={{width: '140px',float:'right'}} color="danger"
                                                                        className='mr-1 btn-icon btn-shadow btn-outline'
                                                                        outline
                                                                        onClick={event => {
                                                                               this.setState({tambahdetail: !this.state.tambahdetail})
                                                                           }}>
                                                                    <i className="lnr-cross btn-icon-wrapper"> </i>Tutup
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>}
                                                <div style={{margin: '20px'}}>
                                                    <Row form>
                                                        <Col md={12}>
                                                            <Label for="name">Alatan</Label>
                                                        </Col>
                                                        <Col md={12}>
                                                            <ReactTable
                                                                data={this.state.report.detail}
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
                                                                        Header: "Pemilik",
                                                                        accessor: "pemilik",
                                                                    },

                                                                    {
                                                                        Header: "Jenis",
                                                                        accessor: "jenis",
                                                                    },
                                                                    {
                                                                        Header: "Had Terima",
                                                                        accessor: "hadpenuh",
                                                                    },
                                                                    {
                                                                        Header: "Caj (RM)",
                                                                        accessor: "caj",
                                                                    },
                                                                    {
                                                                        Header: "No.Daftar",
                                                                        accessor: "nombordaftar",
                                                                    },
                                                                    {
                                                                        Header: () => {
                                                                            return (
                                                                                <div>
                                                                                    <span
                                                                                        style={{display: 'block'}}>Tindakan</span>

                                                                                </div>
                                                                            )
                                                                        },
                                                                        Cell: row => (


                                                                            <div
                                                                                className="widget-content-right widget-content-actions"
                                                                                style={{
                                                                                    textAlign: "center",
                                                                                    width: "100%"
                                                                                }}>
                                                                                <div>
                                                                                    {this.state.report.borang === false && <div>
                                                                                    <Button
                                                                                        className="border-0 btn-transition"
                                                                                        outline
                                                                                        color="info"
                                                                                        onClick={e => this.detailview(row.index)}
                                                                                    ><FontAwesomeIcon icon={faEye}/>
                                                                                    </Button>
                                                                                    {/*{this.state.newDetail === true ?*/}
                                                                                    {row.original.sijil === false &&
                                                                                    <Button
                                                                                        className="border-0 btn-transition"
                                                                                        outline
                                                                                        color="info"
                                                                                        onClick={() => this.printCert(row)}
                                                                                    ><FontAwesomeIcon
                                                                                        icon={faCertificate}/>
                                                                                    </Button>}
                                                                                    {row.original.sijil &&
                                                                                    <Button
                                                                                        className="border-0 btn-transition"
                                                                                        outline
                                                                                        color="success"
                                                                                        onClick={() => this.printCert(row)}
                                                                                    ><FontAwesomeIcon
                                                                                        icon={faCertificate}/>
                                                                                    </Button>}</div>}

                                                                                </div>
                                                                            </div>
                                                                        ),
                                                                        filterable: false,
                                                                        sortable: false,
                                                                        width: 200
                                                                    }

                                                                ]}
                                                                minRows={1}
                                                                defaultPageSize={10}
                                                                className="-striped -highlight"
                                                            />
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </FormGroup>
                                        </Form>
                                        <div className="mt-2" style={{float: 'right'}}>
                                            <Button style={{width: '140px'}} color="danger" className='mr-1 btn-icon btn-shadow btn-outline' outline
                                                onClick={() => {
                                                    this.props.history.push('/equipment/list');
                                                    setTimeout(function () {
                                                        equipmentMenu.changeActiveLinkTo('#/equipment/list');

                                                    }.bind(this),);
                                                    // myMenu.changeActiveLinkLabel('Register');
                                                }}><i
                                            className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                                        </div>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {this.state.printCert && this.state.alatanId ?
                            <PrintCertGui closeFunc={this.printView}
                                          alatanId={this.state.alatanId}/> : null}
                    </Container>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
