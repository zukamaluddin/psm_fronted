import React from "react";
import {Col, Form, FormGroup,} from "reactstrap";
import './print.scss'
import convertNumberToWords from "./converter";

const fontFamily = 'Times New Roman'
const headerBold = {fontSize: "12pt", fontFamily: fontFamily, fontWeight: 'bold'}
const headerNormal = {fontSize: "12pt", fontFamily: fontFamily}
const headerSmall = {fontSize: "10pt", fontFamily: fontFamily}
const data = {
    userInfo: {
        invoiceNo: 'MCM/ATP2019-2373',
        pembayar: 'ZULKEFLI B MAN',
        alamat: 'KG. PADANG BATU 8,BENDANG SIAM JALAN TEROWONG,CHANGKAT JERING, 34850 TIPING PERAK',
        tarikh: 'Jul 18,2019'
    },
    itemList: [
        {
            jenisPembayaran: 'Fee Penentuan Alat',
            kuantiti: "",
            kadar: "",
            jumlah: "",
            senaraiBarang: [{
                namaBarang: 'Timbang - Elektrik(P/Harga)',
                kuantiti: "1",
                kadar: "",
                jumlah: "29.0",
            }]


        }, {
            jenisPembayaran: 'Bayaran 1/2 Fi',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",


        }, {
            jenisPembayaran: 'Caj Menunggu',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        }, {
            jenisPembayaran: 'Caj Penentuan Di Premis Permohon',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        }, {
            jenisPembayaran: 'Tuntutan Pegawai',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        }, {
            jenisPembayaran: 'Tutuan Lori',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        },
        {
            jenisPembayaran: 'Jualan Borang E',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        },
        {
            jenisPembayaran: 'Bayaran Laporan',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        },
        {
            jenisPembayaran: 'Sewaan standard DMSB',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        },
        {
            jenisPembayaran: 'Lain -Lain',
            kuantiti: "",
            kadar: "",
            jumlah: "0.00",
        },
    ],
    bayaran: {
        accNo: '-',
        cek: '-',
        tunai: '0.00',
        jumlah: '0.00',
        sst: '0.00',
        adj: '0.00',
        jumlahBayaran: '0.00',
        // jumlahBayaranTulisan: 'TIGA PULUH dan Sen Tujuh Puluh',
        jumlahBayaranTulisan: convertNumberToWords(3000.01),

    },
    repairerArea: {
        namaSyarikat: 'Metrology Taiping',
        alamat: 'No. 22 , Jalan Medan Tiping 4 , Medan Taiping',
        namaPegwai: 'Nor Aidah Bt. Mat Arshad',
    }
}

export default class InvoiceComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data,
            nilaiSST: '0 %',
            listCek: []
        }
    };

    componentDidMount() {
        let vv = data;

        vv['userInfo']['invoiceNo'] = this.props.resit;
        vv['userInfo']['pembayar'] = this.props.pembayaranName;
        vv['userInfo']['alamat'] = this.props.alamatPembayar;
        vv['userInfo']['tarikh'] = this.props.tarikhPembayaran.toString();

        vv['repairerArea']['namaSyarikat'] = this.props.jenistempat;
        vv['repairerArea']['namaPegwai'] = this.props.pegawai;
        vv['repairerArea']['alamat'] = this.props.alamatCawangan;


        vv['bayaran']['jumlahBayaranTulisan'] = convertNumberToWords(this.props.jumlahBayaran)


        vv['itemList'] = this.props.listItem;

        vv['bayaran']['tunai'] = this.props.jumlahBayaranTunai;
        vv['bayaran']['cekList'] = this.props.bayaranCek;
        vv['bayaran']['sst'] = (this.props.nilaiSST === '0 %') ? '0.00' :((parseFloat(this.props.jumlahSblmSST) * 6) / 100).toFixed(2);
        vv['bayaran']['jumlah'] = this.props.jumlahSblmSST;
        // vv['bayaran']['adj'] = this.props.jumlahBayaran;
        vv['bayaran']['adj'] = '0.00';
        let cekList = this.props.bayaranCek;
        let amountCek= '0';
        cekList.map(item => {
            amountCek = parseFloat(amountCek) + parseFloat(item.kutipan);
        });
        let jumlahTunai = 0;
        if(this.props.jumlahBayaranTunai === '' || this.props.jumlahBayaranTunai === null){
            jumlahTunai = 0.00
        }else{
            jumlahTunai = this.props.jumlahBayaranTunai
        }
        // vv['bayaran']['jumlahBayaran'] = (parseFloat(amountCek) +  parseFloat(jumlahTunai)).toFixed(2);
        vv['bayaran']['jumlahBayaran'] = parseFloat(this.props.jumlahBayaran).toFixed(2);

        vv['bayaran']['accNo'] = 'Amran Fans';

        this.setState({
            data: vv,
            nilaiSST: this.props.nilaiSST,
            listCek: this.props.bayaranCek
        }, () => {
            this.printInvoice();
        });


    }


    printInvoice = () => {

        let printContents = document.getElementById("layoutInvoice").innerHTML;

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
            '  font: 12pt "Tahoma";\n' +
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
            '  size: a4;\n' +
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
    }


    render() {
        function rounding(sst, jumlah) {
            let number = parseFloat(sst) + parseFloat(jumlah);
            if (number.toString().endsWith('1')) {
                return -0.01
            } else if (number.toString().endsWith('2')) {
                return -0.02
            } else if (number.toString().endsWith('3')) {
                return +0.02
            } else if (number.toString().endsWith('4')) {
                return +0.01
            } else if (number.toString().endsWith('6')) {
                return -0.01
            } else if (number.toString().endsWith('7')) {
                return -0.02
            } else if (number.toString().endsWith('8')) {
                return +0.02
            } else if (number.toString().endsWith('9')) {
                return +0.01
            } else {
                return 0
            }
        }
        return (
            <div className="book" id="layoutInvoice">

                <div className="page">
                    <div className="subpage"><Form>
                        <FormGroup row>
                            <Col sm={3}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={headerNormal}>Tax Invoice No : </span><br/>
                                    <span style={headerNormal}>Pembayar :</span><br/>
                                    <span style={headerNormal}>Alamat :</span><br/><br/>
                                    <span style={headerNormal}>Tarikh :</span>
                                </div>


                            </Col>
                            <Col sm={9}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={headerNormal}>{this.state.data.userInfo.invoiceNo}</span><br/>
                                    <span style={headerNormal}>{this.state.data.userInfo.pembayar.name}</span><br/>
                                    <span style={headerNormal}>{this.state.data.userInfo.alamat}</span><br/>
                                    <span style={headerNormal}>{this.state.data.userInfo.tarikh}</span>


                                </div>
                            </Col>

                            <Col sm={12}>
                                <br/>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerNormal}>TAX INVOICE</span><br/>

                                </div>
                            </Col>
                        </FormGroup>
                        <hr style={{border:'1px  solid black'}}/>
                        <FormGroup row>
                            <Col sm={1}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerBold}>No</span><br/>
                                </div>
                            </Col>
                            <Col sm={5}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={headerBold}>Perkara</span><br/>
                                </div>
                            </Col>

                            <Col sm={3}>
                                <div style={{textAlign: 'center'}}>
                                    <span style={headerBold}>Kuantiti</span><br/>
                                </div>
                            </Col>

                            {/*<Col sm={3}>*/}
                            {/*    <div style={{textAlign: 'center'}}>*/}
                            {/*        <span style={headerBold}>Kadar Seunit(RM)</span><br/>*/}
                            {/*    </div>*/}
                            {/*</Col>*/}

                            <Col sm={3}>
                                <div style={{textAlign: 'right'}}>
                                    <span style={headerBold}>Jumlah(RM)</span><br/>
                                </div>
                            </Col>
                        </FormGroup>
                        {this.state.data.itemList.map((i, idx) => {
                            return (
                                <FormGroup key={idx} row>
                                    <Col sm={1}>
                                        <div style={{textAlign: 'center'}}>
                                             <span
                                                 style={headerNormal}>{idx + 1}</span>

                                        </div>
                                    </Col>
                                    <Col sm={5}>
                                        <div style={{textAlign: 'left'}}>
                                             <span
                                                 style={headerNormal}>{i.jenisPembayaran}</span><br/>
                                            {i.senaraiBarang ? i.senaraiBarang.map((si, sidx) => {
                                                return (<div key={sidx}>  <span
                                                        style={headerNormal}>&nbsp;&nbsp;&nbsp;&nbsp;-{si.item}</span>

                                                    </div>
                                                )
                                            }) : null}

                                        </div>
                                    </Col>
                                    <Col sm={3}>
                                        <div style={{textAlign: 'center'}}>
                                           <span
                                               style={headerNormal}>{i.kuantiti}</span>
                                            <br/>
                                            {i.senaraiBarang ? i.senaraiBarang.map((si, sidx) => {
                                                return (<div key={sidx}>  <span
                                                        style={headerNormal}>{si.kadar}</span>
                                                    </div>

                                                )
                                            }) : <div >  <span
                                                style={headerNormal}></span>
                                            </div>}
                                        </div>
                                    </Col>
                                    {/*<Col sm={3}>*/}
                                    {/*    <div style={{textAlign: 'center'}}>*/}
                                    {/*       <span*/}
                                    {/*           style={headerNormal}>{i.kadar}</span><br/>*/}
                                    {/*        {i.senaraiBarang ? i.senaraiBarang.map((si, sidx) => {*/}
                                    {/*            return (<div key={sidx}>  <span*/}
                                    {/*                    style={headerNormal}>{si.kadar}</span> <br/>*/}
                                    {/*                </div>*/}

                                    {/*            )*/}
                                    {/*        }) : null}*/}
                                    {/*    </div>*/}
                                    {/*</Col>*/}
                                    <Col sm={3}>
                                        <div style={{textAlign: 'right'}}>
                                            <span style={headerNormal}>{i.jumlah}</span><br/>
                                            {i.senaraiBarang ? i.senaraiBarang.map((si, sidx) => {
                                                return (<div style={{textAlign: 'right'}} key={sidx}>  <span
                                                        style={headerNormal}>{si.jumlah}</span>
                                                    </div>

                                                )
                                            }) : null}
                                        </div>
                                    </Col>


                                </FormGroup>)
                        })}
                        <hr style={{border:'1px  solid black'}}/>

                        <FormGroup row>
                            <Col sm={6}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={{
                                        fontSize: "12pt",
                                        fontFamily: fontFamily,
                                        fontWeight: 'bold',
                                        textDecoration: 'underline'
                                    }}>Maklumat Bayaran</span><br/>
                                    {this.state.data.bayaran.tunai &&
                                        <div>
                                            <span style={headerNormal}>Tunai:&nbsp;{(this.state.data.bayaran.tunai === '' ) ? '-' : this.state.data.bayaran.tunai }</span><br/>
                                            <span style={headerNormal}>No Rujukan:&nbsp;{(this.props.noRujukanTunai === '' ) ? '-' : this.props.noRujukanTunai }</span><br/><br/>
                                        </div>
                                    }

                                    {(this.props.jumlahBayaranOnline != '-' && this.props.jumlahBayaranOnline != '') &&
                                        <div>
                                            <span style={headerNormal}>Nilai pembayaran online:&nbsp;{(this.props.jumlahBayaranOnline === '' ) ? '-' : this.props.jumlahBayaranOnline }</span><br/>
                                            <span style={headerNormal}>No Rujukan:&nbsp;{(this.props.noRujukanOnline === '' ) ? '-' : this.props.noRujukanOnline }</span><br/>
                                            <span style={headerNormal}>Kode ID:&nbsp;{(this.props.kodeID === '' ) ? '-' : this.props.kodeID  }</span><br/><br/>
                                        </div>
                                    }

                                    {this.state.listCek.map(item =>
                                        <div>
                                            <span style={headerNormal}>Cek No:&nbsp;{item.noCek}</span><br/>
                                            <span style={headerNormal}>Nilai Cek:&nbsp;{item.kutipan}</span><br/>
                                            <span style={headerNormal}>Bank:&nbsp;{item.namaBank}</span><br/><br/>
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col sm={3}>
                                <div style={{textAlign: 'left'}}>
                                    <span style={headerNormal}>Jumlah (RM) :&nbsp;</span><br/>
                                    <span style={headerNormal}>SST <span style={headerNormal}>&nbsp;@&nbsp;</span> {this.state.nilaiSST} :&nbsp;</span><br/>
                                    <span style={headerNormal}>Penggenapan :&nbsp;</span><br/>
                                    <span style={headerNormal}>Jumlah Bayaran :&nbsp;</span><br/>
                                </div>
                            </Col>

                            <Col sm={3}>
                                <div style={{textAlign: 'right'}}>
                                    <span style={headerNormal}>{this.state.data.bayaran.jumlah}</span><br/>
                                    <span style={headerNormal}>{this.state.data.bayaran.sst}</span><br/>
                                    <span style={headerNormal}>{rounding(this.state.data.bayaran.sst, this.state.data.bayaran.jumlah)}</span><br/>
                                    <span style={headerNormal}>{this.state.data.bayaran.jumlahBayaran}</span><br/>
                                </div>
                            </Col>

                        </FormGroup>

                        <FormGroup row>
                            <Col sm={6}>
                                {/*<span style={headerNormal}/><br/>*/}
                                <span><b>DE METROLOGY SDN BHD</b></span><br/>
                                <span style={{fontSize:'smaller'}}>(SST ID: W24-2009-32000014)</span><br/><br/>
                                <span
                                    style={headerNormal}><b>{this.state.data.repairerArea.namaSyarikat} : </b></span><br/>
                                <span style={headerNormal}>{this.state.data.repairerArea.alamat}</span><br/>
                            </Col>

                            <Col sm={6}>
                                <div style={{textAlign: 'left'}}>
                                    <span
                                        style={headerNormal}><b>RINGGIT MALAYSIA:&nbsp;</b>{this.state.data.bayaran.jumlahBayaranTulisan} Sahaja</span><br/>
                                    <span style={headerNormal}/><br/>
                                    <span
                                        style={headerNormal}>Nama Pegawai: &nbsp;{this.state.data.repairerArea.namaPegwai}</span><br/>
                                </div>
                            </Col>

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

