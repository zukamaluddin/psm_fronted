import React from "react";
import {Col, Form, FormGroup,} from "reactstrap";
import './print.scss'
import convertNumberToWords from "./converter";
import moment from 'moment';
import {redirectLogout} from "../../index";
import 'moment/locale/ms-my'
const fontFamily = 'italic'
const headerBold = {fontSize: "12pt", fontFamily: fontFamily, fontWeight: 'bold'}
const headerNormal = {fontSize: "12pt", fontFamily: fontFamily}
const headerSmall = {fontSize: "10pt", fontFamily: fontFamily}
let data = {
    noSiriAlat: '-',
    noPelekatKeselamatan: '',
    maklumatPemilik: {
        nama: '',
        alamat: '',

    },
    tempatPenentuan: '',
    itemList: [{
        jenama: '',
        noRocRob: '',
        harga: '',
    }, {
        jenama: '',
        noRocRob: '',
        harga: '',
    },

    ],
    jumlahBayaran: '',
    // jumlahBayaranPerkataan: 'Tujuh Puluh dan Sen Enam Puluh',
    jumlahBayaranPerkataan: convertNumberToWords(100.61),
    namaPegawai: ''

}



export default class CertComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data
        }


    };

    componentDidMount() {
        fetch(`${global.ipServer}alatan/get_sijil/${this.props.alatanId}/${global.global_id}`, {
            headers: {
                'x-access-token': global.token
            },
        }).then((response) => {

            if (response.status === 200) {
                return response.json();
            } else {
                redirectLogout(response.status, this.props);
                return [];

            }
            // return response.json()
        })
            .then((result) => {
                let maklumat = result.data
                let total = 0
                maklumat.itemList.map((i, idx) => {
                    total += (parseFloat(i.harga))
                })
                data = {
                    noSiriAlat: maklumat.noSiriAlat,
                    noPelekatKeselamatan: maklumat.noPelekatKeselamatan,
                    maklumatPemilik: maklumat.maklumatPemilik[0],
                    tempatPenentuan: maklumat.tempatPenentuan,
                    itemList: maklumat.itemList,
                    kegunaan: maklumat.kegunaan === '' ? '' : maklumat.kegunaan,
                    jumlahBayaran: total.toFixed(2),
                    jumlahBayaranPerkataan: convertNumberToWords(total.toFixed(2)),

                    namaPegawai: maklumat.namaPegawai,  /*TAK KELUAR DRI API*/
                    tarikh: maklumat.tarikh /*Provide tarikh*/

                }
                this.setState({data: data}, () => this.printCert())
                this.props.closeFunc()


            })
    }


    printCert = () => {
        let printContents = document.getElementById("layoutCert").innerHTML;
        // var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
        var winPrint = window.open('', '', '');
        // winPrint.document.write('<link rel="stylesheet" href="http://www.dynamicdrive.com/ddincludes/mainstyle.css" type="text/css" />');
        winPrint.document.write('<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">');

        winPrint.document.write('<style>body {\n' +
            '  width: 100%;\n' +
            '  height: 100%;\n' +
            '  margin: 0;\n' +
            '  padding: 0;\n' +
            '  background-color: #FAFAFA;\n' +
            // '  font: 12pt "Tahoma";\n' +
            '}\n' +
            '\n' +
            '* {\n' +
            '  box-sizing: border-box;\n' +
            '  -moz-box-sizing: border-box;\n' +
            '}\n' +
            '\n' +
            '.page {\n' +
            '  width: 210mm;\n' +
            '  min-height: 297mm;\n' +
            '  padding: 20mm;\n' +
            '  margin: 10mm auto;\n' +
            '  border: 1px #D3D3D3 solid;\n' +
            '  border-radius: 5px;\n' +
            '  background: white;\n' +
            '  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);\n' +
            '}\n' +
            '\n' +
            '.subpage {\n' +
            '  //padding: 1cm;\n' +
            '  //border: 1px white solid;\n' +
            '  height: 257mm;\n' +
            '  outline: 2cm white solid;\n' +
            '}\n' +
            '\n' +
            '@page {\n' +
            '  size: A4;\n' +
            '  margin: 0;\n' +
            '}\n' +
            '\n' +
            '@media print {\n' +
            '  html, body {\n' +
            '    width: 210mm;\n' +
            '    height: 297mm;\n' +
            '  }\n' +
            '  .page {\n' +
            '    margin: 0;\n' +
            '    border: initial;\n' +
            '    border-radius: initial;\n' +
            '    width: initial;\n' +
            '    min-height: initial;\n' +
            '    box-shadow: initial;\n' +
            '    background: initial;\n' +
            '    page-break-after: always;\n' +
            '  }\n' +
            '  .no-print, .no-print * {\n' +
            '    display: none !important;\n' +
            '  }\n' +
            '  [class*="col-sm-"] {\n' +
            '    float: left;\n' +
            '  }\n' +
            '}\n' +
            '\n' +
            '@media print {\n' +
            '  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n' +
            '    float: left;\n' +
            '  }\n' +
            '  .col-sm-12 {\n' +
            '    width: 100%;\n' +
            '  }\n' +
            '  .col-sm-11 {\n' +
            '    width: 91.66666667%;\n' +
            '  }\n' +
            '  .col-sm-10 {\n' +
            '    width: 83.33333333%;\n' +
            '  }\n' +
            '  .col-sm-9 {\n' +
            '    width: 75%;\n' +
            '  }\n' +
            '  .col-sm-8 {\n' +
            '    width: 66.66666667%;\n' +
            '  }\n' +
            '  .col-sm-7 {\n' +
            '    width: 58.33333333%;\n' +
            '  }\n' +
            '  .col-sm-6 {\n' +
            '    width: 50%;\n' +
            '  }\n' +
            '  .col-sm-5 {\n' +
            '    width: 41.66666667%;\n' +
            '  }\n' +
            '  .col-sm-4 {\n' +
            '    width: 33.33333333%;\n' +
            '  }\n' +
            '  .col-sm-3 {\n' +
            '    width: 25%;\n' +
            '  }\n' +
            '  .col-sm-2 {\n' +
            '    width: 16.66666667%;\n' +
            '  }\n' +
            '  .col-sm-1 {\n' +
            '    width: 8.33333333%;\n' +
            '  }\n' +
            '}\n</style>');
        winPrint.document.write(printContents);
        winPrint.document.close();
        winPrint.focus();
        setTimeout(function () {
            winPrint.print();

        }.bind(this), 500);
        // setTimeout(function () {
        //     winPrint.print();
        //
        // }.bind(this), 500);
        // // winPrint.onfocus = function () { setTimeout(function () { winPrint.close(); }, 500); }
    }


    render() {

        return (
            <div className="book" id="layoutCert">

                <div className="page">
                    <div className="subpage"><Form>

                        <FormGroup row>
                            <Col sm={4}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerBold}>NOMBOR SIRI</span><br/>
                                    <span style={headerBold}>ALAT</span><br/>
                                    <span style={headerBold}>{this.state.data.noSiriAlat}</span>
                                </div>


                            </Col>
                            <Col sm={4}>
                                <span style={{fontSize: "12pt", fontFamily: fontFamily}}>&nbsp;</span>
                            </Col>
                            <Col sm={4}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerBold}>NOMBOR PELEKAT</span><br/>
                                    <span style={headerBold}>KESELAMATAN</span><br/>
                                    <span style={headerBold}>{this.state.data.noPelekatKeselamatan}</span>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerBold}>Borang D</span><br/>
                                    <span style={headerBold}>(Timbang Dan Sukat)</span><br/>
                                    <span
                                        style={headerBold}>PERAKUAN PENENTUAN TIMBANG DAN SUKAT</span><br/>

                                    <span
                                        style={headerNormal}>AKTA TIMBANG DAN SUKAT 1972</span><br/>
                                    <span
                                        style={headerSmall}>PERATURAN-PERATURAN TIMBANG DAN SUKAT 1981</span><br/>
                                    <span style={headerSmall}>(Peraturan 16, 28A dan 45)</span>
                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                <div style={{textAlign: 'center'}}>

                                    <span
                                        style={headerNormal}>{this.state.data.kegunaan}</span><br/>

                                </div>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                <div style={{textAlign: 'left'}}>
                                                        <span
                                                            style={headerNormal}>Adalah dengan ini diperakui bahawa -</span><br/>
                                    <span
                                        style={headerNormal}>Nama : {this.state.data.maklumatPemilik.nama.toUpperCase()}</span><br/> {/*NAMA OWNER*/}
                                    <span
                                        style={headerNormal}>Alamat : {this.state.data.maklumatPemilik.alamat.toUpperCase()}</span><br/><br/> {/*ALAMAT OWNER*/}

                                    <span style={headerNormal}>telah pada hari ini mengemukakan timbang dan sukat yang dinyatakan dibawah untuk penentuan/penentuan semula di -</span><br/>
                                    <span
                                        style={headerNormal}>Alamat : {this.state.data.tempatPenentuan.toUpperCase()}</span><br/> {/*ALAMAT CHECK*/}
                                </div>
                            </Col>
                        </FormGroup>
                        <br/>
                        <FormGroup row>
                            <Col sm={6}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={{
                                        fontSize: "12pt",
                                        fontStyle: 'italic',
                                        fontWeight: 'bold'
                                    }}>Perihal</span><br/>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={{fontSize: "12pt", fontStyle: 'italic',  fontWeight: 'bold'}}>No. Penentuan Seperti Ditanda</span><br/>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={{fontSize: "12pt", fontStyle: 'italic', fontWeight: 'bold'}}>Bayaran RM Sen</span><br/>
                                </div>
                            </Col>
                        </FormGroup>

                        {this.state.data.itemList.map((i, idx) => {
                            return (
                                <FormGroup key={idx} row>
                                    <Col sm={6}>
                                        <div style={{textAlign: 'left'}}>
                                                            <span
                                                                style={headerNormal}>{idx + 1}. {i.jenama}</span><br/>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={headerNormal}>{i.siri}</span><br/>
                                        </div>
                                    </Col>
                                    <Col sm={2}>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={headerNormal}>{i.harga}</span><br/>
                                        </div>
                                    </Col>
                                </FormGroup>)
                        })}
                        <FormGroup row>
                            <Col sm={6}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={headerNormal}/><br/>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerNormal}>Jumlah</span><br/>
                                </div>
                            </Col>
                            <Col sm={2}>
                                <div style={{textAlign: 'center'}}>

                                    <span style={headerNormal}>{this.state.data.jumlahBayaran}</span><br/>
                                </div>
                                <hr style={{border: '1px  solid black'}}/>
                            </Col>
                        </FormGroup>

                        <FormGroup row>
                            <Col sm={12}>
                                <div style={{textAlign: 'left'}}>
                                    <span
                                        style={headerNormal}>[Bayaran : <b>Ringgit Malaysia </b>{this.state.data.jumlahBayaranPerkataan} Sahaja]</span><br/>
                                </div>
                            </Col>
                        </FormGroup>

                        <FormGroup row>

                            <div style={{marginTop:'80px'}}>
                                <Col sm={6}>
                                    <div style={{textAlign: 'left'}}>
                                                            <span
                                                                style={{fontSize: "12pt", }}>Tarikh :  <span
                                                                style={{fontSize: "12pt",   fontStyle: 'italic'}}>{moment(this.state.data.tarikh).locale("ms-my").format('dddd,MMM DD ,YYYY')}</span></span><br/>
                                        {/*style={headerNormal}>Tarikh : Monday, June 01,2020</span><br/>*/}
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <div style={{textAlign: 'right'}}>
                                                            <span
                                                                style={{
                                                                    fontSize: "12pt",

                                                                }}>{this.state.data.namaPegawai}</span><br/>
                                        <span
                                            style={{fontSize: "12pt", fontStyle: 'italic'}}>Tandatangan Pegawai Penentusahan</span><br/>
                                        <span
                                            style={{
                                                fontSize: "12pt",
                                                fontStyle: 'italic'
                                            }}>De Metrology Sdn. Bhd.</span><br/>
                                        <span style={{fontSize: "12pt", fontStyle: 'italic'}}>(1318204-U)</span><br/>
                                        <span
                                            style={{fontSize: "12pt", fontStyle: 'italic'}}>(Syarikat Berlesen)</span><br/>
                                    </div>
                                </Col>
                            </div>

                        </FormGroup>
                        <br/>

                        <FormGroup row>
                            <Col sm={12}>
                                <div style={{textAlign: 'center'}}>
                                                            <span
                                                                style={headerNormal}> *Cetakan Berkomputer* </span>
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                    </div>
                </div>
            </div>

        );
    }
}

// export default withRouter(CertComponent);