import React from 'react';
import {
    Button, Table, Container, Row, Col,
    Card,
    CardBody,
} from "reactstrap";
// import ReactTable from "react-table";
import styled, {keyframes} from "styled-components";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
// import {CSVLink, CSVDownload} from "react-csv";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFileCsv, faFilePdf, faFileExcel, faSortDown, faSortUp, faSort} from '@fortawesome/free-solid-svg-icons';
import {tada} from 'react-animations';
import {PDFExport} from '@progress/kendo-react-pdf';

// import ReactExport from "react-export-excel";
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import XLSX from 'xlsx'

export const tadaAnimation = keyframes`${tada}`;
export const AnimationDiv = styled.div`animation: infinite 1s ${tadaAnimation};`;

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const adjustment = (number) => {
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
};

export default class DailyResult extends React.Component {
    pdfExportComponent;

    constructor(props) {
        super(props);
        this.state = {
            jumlah1: 0, jumlah2: 0, jumlah3: 0, jumlah4: 0, jumlah5: 0, jumlah6: 0, jumlah7: 0, jumlah8: 0, jumlah9: 0,
            jumlah10: 0, jumlahAdj: 0, jumlahTunai: 0, jumlahCek: 0, jumlahOnline: 0, jumlahSerapan: 0,
            laporan: [],
            resit: [],
            kutipan: [],
            showCol: true,
            specialCol: 'No Daftar',
            sortObj: {id: '', desc: true},
            sortIcon: {'': faSort},
            payment: {},
            page: 0, sorted: [{id: 'date_created', desc: true}],
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
        };
        this.exportExcelFile = this.exportExcelFile.bind(this);
    }


    componentDidMount = async () => {
        let kutipan = []
        let resit = []
        let payment = this.props.searchResult.payment

        let adjArr = [];
        payment.map((key, index) => {
            let feePenentuanAlat = key["data"].findIndex(x => x.jenisPembayaran === "Fee Penentuan Alat");
            let bayaranHalfFee = key["data"].findIndex(x => x.jenisPembayaran === "Bayaran 1/2 Fi");
            let cajMenunggu = key["data"].findIndex(x => x.jenisPembayaran === "Caj Menunggu");
            let cajPenentuanPremisPelanggan = key["data"].findIndex(x => x.jenisPembayaran === "Caj Penentuan Di Premis Pemohon");
            let tuntutanPegawai = key["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Pegawai");
            let borangE = key["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Lori");
            let tuntutanLori = key["data"].findIndex(x => x.jenisPembayaran === "Jualan Borang E");
            let bayaranLaporanPenentuan = key["data"].findIndex(x => x.jenisPembayaran === "Bayaran Laporan");
            let sewaanAlatPenentuan = key["data"].findIndex(x => x.jenisPembayaran === "Sewaan Standard DMSB");
            let lainLain = key["data"].findIndex(x => x.jenisPembayaran === "Lain -Lain");
            let totalByResit = parseFloat(key["data"][feePenentuanAlat].jumlah) + parseFloat(key["data"][bayaranHalfFee].jumlah) +
                parseFloat(key["data"][cajMenunggu].jumlah) + parseFloat(key["data"][cajPenentuanPremisPelanggan].jumlah) +
                parseFloat(key["data"][tuntutanPegawai].jumlah) + parseFloat(key["data"][borangE].jumlah) +
                parseFloat(key["data"][tuntutanLori].jumlah) + parseFloat(key["data"][bayaranLaporanPenentuan].jumlah) +
                parseFloat(key["data"][sewaanAlatPenentuan].jumlah) + parseFloat(key["data"][lainLain].jumlah);

            let adj = adjustment(totalByResit.toFixed(2));
            adjArr.push(adj);
            if (key["data"]) {
                this.state.jumlah1 += parseFloat(key["data"][feePenentuanAlat].jumlah)
                this.state.jumlah2 += parseFloat(key["data"][bayaranHalfFee].jumlah)
                this.state.jumlah3 += parseFloat(key["data"][cajMenunggu].jumlah)
                this.state.jumlah4 += parseFloat(key["data"][cajPenentuanPremisPelanggan].jumlah)
                this.state.jumlah5 += parseFloat(key["data"][tuntutanPegawai].jumlah)
                this.state.jumlah6 += parseFloat(key["data"][borangE].jumlah)
                this.state.jumlah7 += parseFloat(key["data"][tuntutanLori].jumlah)
                this.state.jumlah8 += parseFloat(key["data"][bayaranLaporanPenentuan].jumlah)
                this.state.jumlah9 += parseFloat(key["data"][sewaanAlatPenentuan].jumlah)
                this.state.jumlah10 += parseFloat(key["data"][lainLain].jumlah);
                this.state.jumlahAdj += adj
            }
            let tableResit = {}
            tableResit['jenisResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"];
            tableResit['noRujukan'] = key["noRujukan"];
            tableResit['payer'] = key["pembayar"];
            tableResit['feePenentuanAlat'] = key["data"] ? key["data"][feePenentuanAlat].jumlah : 0;
            tableResit['bayaranHalfFee'] = key["data"] ? key["data"][bayaranHalfFee].jumlah : 0
            tableResit['cajMenunggu'] = key["data"] ? key["data"][cajMenunggu].jumlah : 0
            tableResit['cajPenentuanPremisPelanggan'] = key["data"] ? key["data"][cajPenentuanPremisPelanggan].jumlah : 0;
            tableResit['tuntutanPegawai'] = key["data"] ? key["data"][tuntutanPegawai].jumlah : 0
            tableResit['borangE'] = key["data"] ? key["data"][borangE].jumlah : 0
            tableResit['tuntutanLori'] = key["data"] ? key["data"][tuntutanLori].jumlah : 0
            tableResit['bayaranLaporanPenentuan'] = key["data"] ? key["data"][bayaranLaporanPenentuan].jumlah : 0
            tableResit['sewaanAlatPenentuan'] = key["data"] ? key["data"][sewaanAlatPenentuan].jumlah : 0
            tableResit['lainLain'] = key["data"] ? key["data"][lainLain].jumlah : 0
            tableResit['adj'] = adj
            tableResit['pgwai'] = key["pegawai"]
            resit.push(tableResit)

            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            let mydata = key["kutipanBayaran"];
            let tunai = 0;
            let online = 0;
            let cek = 0;
            let butiranCek = '-';
            let serapan = 0;
            if (Array.isArray(mydata)) {
                tunai = mydata.filter(({id}) => id === 'Tunai').reduce(function (a, b) {
                    if (b['kutipan'] === "") {
                        return 0
                    } else {
                        let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
                        val = val - adjArr[index];
                        return val
                    }
                }, 0);
                online = mydata.filter(({id}) => id === 'Online').reduce(function (a, b) {
                    if (b['kutipan'] === "") {
                        return 0
                    } else {
                        let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
                        val = val - adjArr[index];
                        return val
                    }
                }, 0);
                cek = mydata.filter(({id}) => id !== 'Tunai' && id !== 'Online').reduce(function (a, b) {
                    if (b['kutipan'] === "") {
                        return 0
                    } else {
                        let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
                        val = val - adjArr[index];
                        return val
                    }
                }, 0);
                butiranCek = mydata.filter(({id}) => id !== 'Tunai').reduce(function (a, b) {
                    return b['noCek'] + ', ' + b['namaBank'];
                }, '-');
                this.state.jumlahTunai += tunai;
                this.state.jumlahCek += cek;
                this.state.jumlahOnline += online;

            } else {
                if (key["kutipanBayaran"].tunai === "") {
                    tunai = 0
                } else {
                    tunai = parseFloat(key["kutipanBayaran"].tunai) - adjArr[index]
                }
                if (key["kutipanBayaran"].cek === "") {
                    cek = 0
                } else {
                    cek = parseFloat(key["kutipanBayaran"].cek) - adjArr[index]
                }
                if (key["kutipanBayaran"].online === "") {
                    online = 0
                } else {
                    online = parseFloat(key["kutipanBayaran"].online) - adjArr[index]
                }
                this.state.jumlahTunai += tunai;
                this.state.jumlahCek += cek;
                this.state.jumlahOnline += online;

            }
            serapan = adjArr[index];
            this.state.jumlahSerapan += serapan;

            let tableKutipan = {}
            tableKutipan['noResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"]
            tableKutipan['rujukanNo'] = key["noRujukan"]
            tableKutipan['pembayar'] = key["pembayar"]
            tableKutipan['tunai'] = tunai.toFixed(2)
            tableKutipan['online'] = online.toFixed(2)
            tableKutipan['cek'] = cek.toFixed(2)
            tableKutipan['butiranCek'] = butiranCek
            tableKutipan['serapan'] = '-'
            tableKutipan['peg'] = key["pegawai"]
            kutipan.push(tableKutipan)
        });

        this.setState({
            laporan: this.props.searchResult.laporan,
            payment: this.props.searchResult.payment,
            kutipan: kutipan,
            resit: resit,
            totalpagenum: 0,
            loading: false,
        });

    };

    exportExcel = () => {
        var workbook = XLSX.utils.book_new();
        var worksheet_data = document.getElementById("table-to-xls");
        var worksheet = XLSX.utils.table_to_sheet(worksheet_data, {raw: true});
        workbook.SheetNames.push("Table 1");
        workbook.Sheets["Table 1"] = worksheet;

        var worksheet_data2 = document.getElementById("table-to-xls2");
        var worksheet2 = XLSX.utils.table_to_sheet(worksheet_data2, {raw: true});
        workbook.SheetNames.push("Table 2");
        workbook.Sheets["Table 2"] = worksheet2;

        var worksheet_data3 = document.getElementById("table-to-xls3");
        var worksheet3 = XLSX.utils.table_to_sheet(worksheet_data3, {raw: true});
        workbook.SheetNames.push("Table 3");
        workbook.Sheets["Table 3"] = worksheet3;

        var worksheet_data4 = document.getElementById("table-to-xls4");
        var worksheet4 = XLSX.utils.table_to_sheet(worksheet_data4, {raw: true});
        workbook.SheetNames.push("Table 4");
        workbook.Sheets["Table 4"] = worksheet4;

        this.exportExcelFile(workbook);
    };
    exportExcelFile = (workbook) => {
        return XLSX.writeFile(workbook, this.props.searchQuery.branch.kawasan + '-' + this.props.searchQuery.tarikh + '.xlsx');
    };

    sorting = (sortParam, table) => {
        let tableData = [];
        if (table === 'laporan') {
            tableData = this.state.laporan
        } else if (table === 'kutipan') {
            tableData = this.state.kutipan
        } else {
            tableData = this.state.resit
        }

        this.setState({sortObj: sortParam}, () => {
            if (sortParam.id === 'fiAlat' || sortParam.id === 'feePenentuanAlat' || sortParam.id === 'bayaranHalfFee' || sortParam.id === 'cajMenunggu' || sortParam.id === 'cajPenentuanPremisPelanggan' || sortParam.id === 'tuntutanPegawai' || sortParam.id === 'tuntutanLori' || sortParam.id === 'borangE' || sortParam.id === 'bayaranLaporanPenentuan' || sortParam.id === 'sewaanAlatPenentuan' || sortParam.id === 'terimaPelbagai' || sortParam.id === 'sewaanAlatPembaik' || sortParam.id === 'lainLain') {
                sortParam.desc ? tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? -1 : 0) :
                    tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? -1 : 0);
            } else {
                tableData.sort((a, b) => {
                    if (sortParam.desc) {
                        if (a[this.state.sortObj.id] === null) {
                            return -1
                        } else if (b[this.state.sortObj.id] === null) {
                            return 1
                        }
                        return (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? -1 : 0
                    } else {
                        if (a[this.state.sortObj.id] === null) {
                            return 1
                        } else if (b[this.state.sortObj.id] === null) {
                            return -1
                        }
                        return (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? -1 : 0
                    }
                })
            }

            let sortVar = {};

            sortParam.desc ? sortVar[sortParam.id] = faSortDown : sortVar[sortParam.id] = faSortUp;

            this.setState({[table]: tableData, sortIcon: sortVar})
            // if (table === 'laporan'){
            //     this.setState({laporan: tableData, sortIcon: sortVar})
            // }else if(table === 'kutipan'){
            //     this.setState({kutipan: tableData, sortIcon: sortVar})
            // }else{
            //     this.setState({resit: tableData, sortIcon: sortVar})
            // }

        });
    };


    render() {
        const {laporan, payment, kutipan, resit} = this.state;

        let jumlahGagal = laporan.filter(({tentusahan}) => tentusahan === 'Gagal').reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100 //because .toFixed(2) sometimes rounding incorectly
        }, 0);
        let jumlahLulus = laporan.filter(({tentusahan}) => tentusahan !== 'Gagal').reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);
        let jumlahSemua = laporan.reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);
        let sudahDibayar = laporan.filter(({invois}) => invois !== null).reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);
        let belumDibayar = laporan.filter(({invois}) => invois === null).reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);

        let kutipanObj = {};
        kutipanObj['feePenentuanAlat'] = 0;
        kutipanObj['bayaranHalfFee'] = 0;
        kutipanObj['cajMenunggu'] = 0;
        kutipanObj['cajPenentuanPremisPelanggan'] = 0;
        kutipanObj['tuntutanPegawai'] = 0;
        kutipanObj['tuntutanLori'] = 0;
        kutipanObj['borangE'] = 0;
        kutipanObj['bayaranLaporanPenentuan'] = 0;
        kutipanObj['sewaanAlatPenentuan'] = 0;
        kutipanObj['terimaPelbagai'] = 0;
        kutipanObj['sewaanAlatPembaik'] = 0;
        kutipanObj['lainLain'] = 0;


        let pelarasan = 0;
        for (let i = 0; i < payment.length; i++) {
            let feePenentuanAlat = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Fee Penentuan Alat");
            let bayaranHalfFee = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Bayaran 1/2 Fi");
            let cajMenunggu = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Caj Menunggu");
            let cajPenentuanPremisPelanggan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Caj Penentuan Di Premis Pemohon");
            let tuntutanPegawai = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Pegawai");
            let tuntutanLori = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Lori");
            let borangE = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Jualan Borang E");
            let bayaranLaporanPenentuan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Bayaran Laporan");
            let sewaanAlatPenentuan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Sewaan Standard DMSB");
            let lainLain = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Lain -Lain");

            kutipanObj['feePenentuanAlat'] += parseFloat(payment[i]["data"][feePenentuanAlat].jumlah);
            kutipanObj['bayaranHalfFee'] += parseFloat(payment[i]["data"][bayaranHalfFee].jumlah);
            kutipanObj['cajMenunggu'] += parseFloat(payment[i]["data"][cajMenunggu].jumlah);
            kutipanObj['cajPenentuanPremisPelanggan'] += parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah);
            kutipanObj['tuntutanPegawai'] += parseFloat(payment[i]["data"][tuntutanPegawai].jumlah);
            kutipanObj['tuntutanLori'] += parseFloat(payment[i]["data"][tuntutanLori].jumlah);
            kutipanObj['borangE'] += parseFloat(payment[i]["data"][borangE].jumlah);
            kutipanObj['bayaranLaporanPenentuan'] += parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah);
            kutipanObj['sewaanAlatPenentuan'] += parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah);
            kutipanObj['lainLain'] += parseFloat(payment[i]["data"][lainLain].jumlah);

            let sumAll = parseFloat(payment[i]["data"][feePenentuanAlat].jumlah) +
                parseFloat(payment[i]["data"][bayaranHalfFee].jumlah) +
                parseFloat(payment[i]["data"][cajMenunggu].jumlah) +
                parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah) +
                parseFloat(payment[i]["data"][tuntutanPegawai].jumlah) +
                parseFloat(payment[i]["data"][tuntutanLori].jumlah) +
                parseFloat(payment[i]["data"][borangE].jumlah) +
                parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah) +
                parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah) +
                parseFloat(payment[i]["data"][lainLain].jumlah);

            pelarasan += adjustment(sumAll.toFixed(2));

        }

        let jumlahKutipan = Object.values(kutipanObj).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        jumlahKutipan = Math.round((jumlahKutipan + Number.EPSILON) * 100) / 100;

        let jumlahKeseluruhan = Math.round((jumlahKutipan + Number.EPSILON) * 100) / 100;
        jumlahKeseluruhan = Math.round((jumlahKeseluruhan + pelarasan + Number.EPSILON) * 100) / 100;


        let idx = 0;
        let idx2 = 0;


        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="TabsAnimation"
                transitionAppear={true}
                transitionAppearTimeout={0}
                transitionEnter={false}
                transitionLeave={false}>
                <Card className="main-card mb-3">
                    <CardBody>

                        <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                onClick={() => {
                                    this.exportExcel();
                                    // this.setState({showCol: false, specialCol: 'No Daftar 6 angka'}, () => {
                                    //     this.exportExcel();
                                    //     this.setState({showCol: true, specialCol: 'No Daftar'});
                                    // });
                                }}>
                            <AnimationDiv style={{display: 'inline-block'}}>
                                <FontAwesomeIcon className="mr-2" icon={faFileExcel}/> </AnimationDiv>
                            EXCEL
                        </Button>
                        <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                onClick={() => {
                                    this.pdfExportComponent.save();
                                    // this.setState({showCol: false, specialCol: 'No Daftar 6 angka'}, () => {
                                    //     this.pdfExportComponent.save();
                                    //     this.setState({showCol: true, specialCol: 'No Daftar'});
                                    // });
                                }}>
                            <AnimationDiv style={{display: 'inline-block'}}>
                                <FontAwesomeIcon className="mr-2" icon={faFilePdf}/> </AnimationDiv>
                            PDF
                        </Button>
                        <PDFExport
                            fileName={this.props.searchQuery.branch.kawasan + '-' + this.props.searchQuery.tarikh}
                            scale={0.5}
                            paperSize="A4"
                            landscape={true}
                            margin="1cm"
                            ref={(component) => this.pdfExportComponent = component}
                        >
                            <Row>
                                <Col md={12}><b>Jadual 1.0 Laporan Harian Penentusahan Dan Penentusahan Semula Peringkat
                                    Cawangan</b></Col>
                                <Col md={12}><b>Cawangan : {this.props.searchQuery.branch.kawasan}&nbsp;&nbsp;
                                    Tarikh: {this.props.searchQuery.tarikh} &nbsp;&nbsp;
                                    Jenis Kerja : {this.props.searchQuery.lokasi} </b></Col>
                                <Col>
                                    <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
                                        <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', width: '50px'}}>No</th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pembaik',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Pembaik <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'pembaik' ? this.state.sortIcon.pembaik : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pemilik',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Pemilik <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'pemilik' ? this.state.sortIcon.pemilik : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'alamatPemilik',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Alamat Pemilik <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'alamatPemilik' ? this.state.sortIcon.alamatPemilik : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenama',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Jenama <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'jenama' ? this.state.sortIcon.jenama : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenis',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Jenis <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'jenis' ? this.state.sortIcon.jenis : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative', width: '5%'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'had',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Had <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'had' ? this.state.sortIcon.had : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'siriAlat',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Siri Alat <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'siriAlat' ? this.state.sortIcon.siriAlat : faSort}/></span>
                                            </th>
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'rujukan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>{this.state.specialCol} <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'rujukan' ? this.state.sortIcon.rujukan : faSort}/></span>
                                            </th>
                                            {this.state.showCol ?
                                                <th
                                                    style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'stiker',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Stiker <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'stiker' ? this.state.sortIcon.stiker : faSort}/></span>
                                                </th> : null}
                                            <th
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenisStiker',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Jenis Stiker <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'jenisStiker' ? this.state.sortIcon.jenisStiker : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'sijil',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Sijil D <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'sijil' ? this.state.sortIcon.sijil : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tentusahan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Tentusahan <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'tentusahan' ? this.state.sortIcon.tentusahan : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pegawai',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}
                                            >Pegawai
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'pegawai' ? this.state.sortIcon.pegawai : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'invois',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Invois <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'invois' ? this.state.sortIcon.invois : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'fiAlat',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'laporan')
                                                }}>Fi Alat <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'fiAlat' ? this.state.sortIcon.fiAlat : faSort}/></span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {laporan.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                    <td>{value.pembaik}</td>
                                                    <td>{value.pemilik}</td>
                                                    <td>{value.alamatPemilik}</td>
                                                    <td>{value.jenama}</td>
                                                    <td>{value.jenis}</td>
                                                    <td>{value.had}</td>
                                                    <td>{value.siriAlat}</td>
                                                    <td>{value.rujukan}</td>
                                                    {this.state.showCol ? <td>{value.stiker}</td> : null}
                                                    <td>{value.jenisStiker}</td>
                                                    <td>{value.sijil}</td>
                                                    <td>{value.tentusahan}</td>
                                                    <td>{value.pegawai}</td>
                                                    <td>{value.invois}</td>
                                                    <td width={'10%'}>RM {value.fiAlat}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan={15}>Jumlah Fi Tentusah (RM) - Sebelum SST</td>
                                            <td>
                                                RM {jumlahLulus.toFixed(2)}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={15}>Jumlah Fi Gagal (RM) - Sebelum SST</td>
                                            <td>RM {jumlahGagal.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={15}>Jumlah Harian Keseluruhan (RM) - Sebelum SST</td>
                                            <td>RM {jumlahSemua.toFixed(2)}</td>
                                        </tr>

                                        {/*divider comment for dev*/}
                                        <tr>
                                            <td colSpan={7} style={{border: 'unset'}}/>
                                        </tr>
                                        <tr>
                                            <td colSpan={7} style={{border: 'unset'}}/>
                                        </tr>
                                        <tr>
                                            <td colSpan={7}><b>Berikut adalah jumlah kutipan yang diperoleh</b></td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>01. Jumlah Kutipan untuk Alat yang sudah dibayar berdasarkan
                                                sijil D
                                                :
                                                (tanpa
                                                SST)
                                            </td>
                                            <td>RM {sudahDibayar.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>02. Jumlah Kutipan untuk Alat yang belum dibayar berdasarkan
                                                sijil D
                                                :
                                                (tanpa
                                                SST)
                                            </td>
                                            <td>RM {belumDibayar.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6}>03. Jumlah Kutipan untuk Alat yang dikutip berdasarkan
                                                invois cukai
                                                : (tanpa
                                                SST)
                                            </td>
                                            <td>RM {(sudahDibayar + belumDibayar).toFixed(2)}</td>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}><b>Kutipan Sebenar Cawangan
                                    : {this.props.searchQuery.branch.kawasan}</b></Col>
                                <Col md={12}><b>Tarikh Bayaran : {this.props.searchQuery.tarikh}</b></Col>
                                <Col md={6}>
                                    <Table striped bordered hover id={'table-to-xls2'}>
                                        <thead>
                                        <tr>
                                            <th width={'90%'}>Bayaran Perkhidmatan De Metrology</th>
                                            <th>Kutipan(RM)</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        <tr>
                                            <td>01. Fee Penentuan Alat (+Sijil)
                                            </td>
                                            <td> {kutipanObj.feePenentuanAlat.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>02. Bayaran 1/2 Fee
                                            </td>
                                            <td> {kutipanObj.bayaranHalfFee.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>03. Caj Menunggu
                                            </td>
                                            <td> {kutipanObj.cajMenunggu.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>04. Caj Penentuan di Premis Pelanggan
                                            </td>
                                            <td> {kutipanObj.cajPenentuanPremisPelanggan.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>05. Tuntuan Pegawai
                                            </td>
                                            <td> {kutipanObj.tuntutanPegawai.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>06. Tuntutan Lori
                                            </td>
                                            <td> {kutipanObj.tuntutanLori.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>07. Borang E
                                            </td>
                                            <td> {kutipanObj.borangE.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>08. Bayaran Laporan Penentuan
                                            </td>
                                            <td> {kutipanObj.bayaranLaporanPenentuan.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>09. Sewaan Alat Penentuan
                                            </td>
                                            <td> {kutipanObj.sewaanAlatPenentuan.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>10. Terima Pelbagai
                                            </td>
                                            <td> {kutipanObj.terimaPelbagai.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>11. Sewaan Alat Pembaik
                                            </td>
                                            <td> {kutipanObj.sewaanAlatPembaik.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td>12. Lain-lain
                                            </td>
                                            <td> {kutipanObj.lainLain.toFixed(2)}</td>
                                        </tr>
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td style={{textAlign: 'right'}}>Jumlah (RM)</td>
                                            <td> {jumlahKutipan.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'right'}}>Pelarasan (RM)</td>
                                            <td> {pelarasan.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign: 'right'}}>Jumlah Keseluruhan (RM)</td>
                                            <td> {jumlahKeseluruhan.toFixed(2)}</td>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} style={{textAlign: 'center'}}><b>Senarai Resit Bayaran</b></Col>
                                <Col>
                                    <Table striped bordered hover id={'table-to-xls3'}>
                                        <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenisResit',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}>No Resit <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'jenisResit' ? this.state.sortIcon.jenisResit : faSort}/></span>
                                            </th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'noRujukan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}>No Rujukan <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'noRujukan' ? this.state.sortIcon.noRujukan : faSort}/></span>
                                            </th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'payer',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}>Pembayar <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'payer' ? this.state.sortIcon.payer : faSort}/></span>
                                            </th>
                                            {/*<th rowSpan={2}>Status</th>*/}
                                            <th colSpan={13}>Maklumat Pembayaran(RM) *Sila lihat pada jadual di atas
                                                untuk panduan bayaran
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'feePenentuanAlat',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'feePenentuanAlat' ? this.state.sortIcon.feePenentuanAlat : faSort}/></span>01
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'bayaranHalfFee',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'bayaranHalfFee' ? this.state.sortIcon.bayaranHalfFee : faSort}/></span>02
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'cajMenunggu',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'cajMenunggu' ? this.state.sortIcon.cajMenunggu : faSort}/></span>03
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'cajPenentuanPremisPelanggan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'cajPenentuanPremisPelanggan' ? this.state.sortIcon.cajPenentuanPremisPelanggan : faSort}/></span>04
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tuntutanPegawai',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanPegawai' ? this.state.sortIcon.tuntutanPegawai : faSort}/></span>05
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'borangE',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'borangE' ? this.state.sortIcon.borangE : faSort}/></span>06
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tuntutanLori',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanLori' ? this.state.sortIcon.tuntutanLori : faSort}/></span>07
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'bayaranLaporanPenentuan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'bayaranLaporanPenentuan' ? this.state.sortIcon.bayaranLaporanPenentuan : faSort}/></span>08
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'sewaanAlatPenentuan',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'sewaanAlatPenentuan' ? this.state.sortIcon.sewaanAlatPenentuan : faSort}/></span>09
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'lainLain',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'lainLain' ? this.state.sortIcon.lainLain : faSort}/></span>10
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'adj',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'adj' ? this.state.sortIcon.adj : faSort}/></span>Adj
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pgwai',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'resit')
                                                }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'pgwai' ? this.state.sortIcon.pgwai : faSort}/></span>Pegawai
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {resit.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                    <td>{value.jenisResit}</td>
                                                    <td>{value.noRujukan}</td>
                                                    <td>{value.payer}</td>
                                                    <td>{value.feePenentuanAlat}
                                                    </td>
                                                    <td>{value.bayaranHalfFee}
                                                    </td>
                                                    <td>{value.cajMenunggu}
                                                    </td>
                                                    <td>{value.cajPenentuanPremisPelanggan}
                                                    </td>
                                                    <td>{value.tuntutanPegawai}
                                                    </td>
                                                    <td>{value.borangE}
                                                    </td>
                                                    <td>{value.tuntutanLori}
                                                    </td>
                                                    <td>{value.bayaranLaporanPenentuan}
                                                    </td>
                                                    <td>{value.sewaanAlatPenentuan}
                                                    </td>
                                                    <td>{value.lainLain}
                                                    </td>
                                                    <td>{
                                                        value.adj}
                                                    </td>
                                                    <td>{value.pgwai}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        }
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td colSpan={4}>Jumlah</td>
                                            <td>{this.state.jumlah1.toFixed(2)}</td>
                                            <td>{this.state.jumlah2.toFixed(2)}</td>
                                            <td>{this.state.jumlah3.toFixed(2)}</td>
                                            <td>{this.state.jumlah4.toFixed(2)}</td>
                                            <td>{this.state.jumlah5.toFixed(2)}</td>
                                            <td>{this.state.jumlah6.toFixed(2)}</td>
                                            <td>{this.state.jumlah7.toFixed(2)}</td>
                                            <td>{this.state.jumlah8.toFixed(2)}</td>
                                            <td>{this.state.jumlah9.toFixed(2)}</td>
                                            <td>{this.state.jumlah10.toFixed(2)}</td>
                                            <td>{this.state.jumlahAdj.toFixed(2)}</td>
                                            <td/>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12} style={{textAlign: 'center'}}><b>Senarai Kutipan berdasarkan
                                    Resit</b></Col>
                                <Col>
                                    <Table striped bordered hover id={'table-to-xls4'}>
                                        <thead>
                                        <tr>
                                            <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'noResit',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>No Resit <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'noResit' ? this.state.sortIcon.noResit : faSort}/></span>
                                            </th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'rujukanNo',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>No Rujukan <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'rujukanNo' ? this.state.sortIcon.rujukanNo : faSort}/></span>
                                            </th>
                                            <th rowSpan={2}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pembayar',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Pembayar <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'pembayar' ? this.state.sortIcon.pembayar : faSort}/></span>
                                            </th>
                                            <th colSpan={6} style={{textAlign: 'center'}}>Kaedah Bayaran (RM)
                                            </th>
                                        </tr>
                                        <tr>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tunai',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Tunai <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'tunai' ? this.state.sortIcon.tunai : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'online',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Online <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'online' ? this.state.sortIcon.online : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'cek',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Cek <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'cek' ? this.state.sortIcon.cek : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'butiranCek',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Butiran Cek <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'butiranCek' ? this.state.sortIcon.butiranCek : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'peg',
                                                        desc: !this.state.sortObj.desc
                                                    }, 'kutipan')
                                                }}>Pegawai <span style={{
                                                position: 'absolute',
                                                right: '7px',
                                                color: '#858789'
                                            }}><FontAwesomeIcon
                                                icon={Object.keys(this.state.sortIcon)[0] === 'peg' ? this.state.sortIcon.peg : faSort}/></span>
                                            </th>
                                        </tr>
                                        </thead>
                                        {kutipan.map((value, index) => {
                                            return (
                                                <tbody>
                                                <tr key={index}>
                                                    <td style={{textAlign: 'center'}}>{idx2 = idx2 + 1}</td>
                                                    <td>{value.noResit}</td>
                                                    <td>{value.rujukanNo}</td>
                                                    <td>{value.pembayar}</td>
                                                    <td>{value.tunai}</td>
                                                    <td>{value.online}</td>
                                                    <td>{value.cek}</td>
                                                    <td>{value.butiranCek}</td>
                                                    <td>{value.peg}</td>
                                                </tr>
                                                </tbody>
                                            )
                                        })
                                        }
                                        <tfoot>
                                        <tr>
                                            <td colSpan={4}>Jumlah</td>
                                            <td>{this.state.jumlahTunai.toFixed(2)}</td>
                                            <td>{this.state.jumlahOnline.toFixed(2)}</td>
                                            <td>{this.state.jumlahCek.toFixed(2)}</td>
                                            <td>-</td>
                                            <td>{(this.state.jumlahTunai + this.state.jumlahCek + this.state.jumlahOnline + this.state.jumlahSerapan).toFixed(2)}</td>
                                        </tr>
                                        </tfoot>
                                    </Table>
                                </Col>
                            </Row>

                        </PDFExport>
                    </CardBody>
                </Card>
            </ReactCSSTransitionGroup>
        );
    }

}

// import React from 'react';
// import {
//     Button, Table, Container, Row, Col,
//     Card,
//     CardBody,
// } from "reactstrap";
// // import ReactTable from "react-table";
// import styled, {keyframes} from "styled-components";
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
// // import {CSVLink, CSVDownload} from "react-csv";
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import {faFileCsv, faFilePdf, faFileExcel, faSortDown, faSortUp, faSort} from '@fortawesome/free-solid-svg-icons';
// import {tada} from 'react-animations';
// import {PDFExport} from '@progress/kendo-react-pdf';
//
// // import ReactExport from "react-export-excel";
// // import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import XLSX from 'xlsx'
//
// export const tadaAnimation = keyframes`${tada}`;
// export const AnimationDiv = styled.div`animation: infinite 1s ${tadaAnimation};`;
//
// // const ExcelFile = ReactExport.ExcelFile;
// // const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// // const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
//
// export const adjustment = (number) => {
//     if (number.toString().endsWith('1')) {
//         return -0.01
//     } else if (number.toString().endsWith('2')) {
//         return -0.02
//     } else if (number.toString().endsWith('3')) {
//         return +0.02
//     } else if (number.toString().endsWith('4')) {
//         return +0.01
//     } else if (number.toString().endsWith('6')) {
//         return -0.01
//     } else if (number.toString().endsWith('7')) {
//         return -0.02
//     } else if (number.toString().endsWith('8')) {
//         return +0.02
//     } else if (number.toString().endsWith('9')) {
//         return +0.01
//     } else {
//         return 0
//     }
// };
//
// export default class DailyResult extends React.Component {
//     pdfExportComponent;
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             jumlah1: 0, jumlah2: 0, jumlah3: 0, jumlah4: 0, jumlah5: 0, jumlah6: 0, jumlah7: 0, jumlah8: 0, jumlah9: 0,
//             jumlah10: 0, jumlahCukai: 0, jumlahAdj: 0, jumlahTunai: 0, jumlahCek: 0, jumlahOnline: 0, jumlahSerapan: 0,
//             laporan: [],
//             resit: [],
//             kutipan: [],
//             showCol: true,
//             specialCol: 'No Daftar',
//             sortObj: {id: '', desc: true},
//             sortIcon: {'': faSort},
//             payment: {},
//             page: 0, sorted: [{id: 'date_created', desc: true}],
//             set: {
//                 sorted: [{id: 'date_created', desc: true}],
//                 page: 0,
//                 pageSize: 10,
//             },
//         };
//         this.exportExcelFile = this.exportExcelFile.bind(this);
//     }
//
//
//     componentDidMount = async () => {
//         let kutipan = []
//         let resit = []
//         let payment = this.props.searchResult.payment
//
//         let adjArr = [];
//         let cukaiArr = [];
//         payment.map((key, index) => {
//             let feePenentuanAlat = key["data"].findIndex(x => x.jenisPembayaran === "Fee Penentuan Alat");
//             let bayaranHalfFee = key["data"].findIndex(x => x.jenisPembayaran === "Bayaran 1/2 Fi");
//             let cajMenunggu = key["data"].findIndex(x => x.jenisPembayaran === "Caj Menunggu");
//             let cajPenentuanPremisPelanggan = key["data"].findIndex(x => x.jenisPembayaran === "Caj Penentuan Di Premis Pemohon");
//             let tuntutanPegawai = key["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Pegawai");
//             let borangE = key["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Lori");
//             let tuntutanLori = key["data"].findIndex(x => x.jenisPembayaran === "Jualan Borang E");
//             let bayaranLaporanPenentuan = key["data"].findIndex(x => x.jenisPembayaran === "Bayaran Laporan");
//             let sewaanAlatPenentuan = key["data"].findIndex(x => x.jenisPembayaran === "Sewaan Standard DMSB");
//             let lainLain = key["data"].findIndex(x => x.jenisPembayaran === "Lain -Lain");
//             let totalByResit = parseFloat(key["data"][feePenentuanAlat].jumlah) + parseFloat(key["data"][bayaranHalfFee].jumlah) +
//                 parseFloat(key["data"][cajMenunggu].jumlah) + parseFloat(key["data"][cajPenentuanPremisPelanggan].jumlah) +
//                 parseFloat(key["data"][tuntutanPegawai].jumlah) + parseFloat(key["data"][borangE].jumlah) +
//                 parseFloat(key["data"][tuntutanLori].jumlah) + parseFloat(key["data"][bayaranLaporanPenentuan].jumlah) +
//                 parseFloat(key["data"][sewaanAlatPenentuan].jumlah) + parseFloat(key["data"][lainLain].jumlah);
//
//             let adj = adjustment((totalByResit + Math.round(totalByResit * parseFloat(key["jenisBayaran"])) / 100).toFixed(2));
//             adjArr.push(adj)
//             let cukai = Math.round(totalByResit * parseFloat(key["jenisBayaran"])) / 100;
//             cukaiArr.push(cukai)
//             if (key["data"]) {
//                 console.log(key["data"][feePenentuanAlat].jumlah)
//                 this.state.jumlah1 += parseFloat(key["data"][feePenentuanAlat].jumlah)
//                 this.state.jumlah2 += parseFloat(key["data"][bayaranHalfFee].jumlah)
//                 this.state.jumlah3 += parseFloat(key["data"][cajMenunggu].jumlah)
//                 this.state.jumlah4 += parseFloat(key["data"][cajPenentuanPremisPelanggan].jumlah)
//                 this.state.jumlah5 += parseFloat(key["data"][tuntutanPegawai].jumlah)
//                 this.state.jumlah6 += parseFloat(key["data"][borangE].jumlah)
//                 this.state.jumlah7 += parseFloat(key["data"][tuntutanLori].jumlah)
//                 this.state.jumlah8 += parseFloat(key["data"][bayaranLaporanPenentuan].jumlah)
//                 this.state.jumlah9 += parseFloat(key["data"][sewaanAlatPenentuan].jumlah)
//                 this.state.jumlah10 += parseFloat(key["data"][lainLain].jumlah);
//                 this.state.jumlahCukai += Math.round(totalByResit * parseFloat(key["jenisBayaran"])) / 100;
//                 this.state.jumlahAdj += adj
//             }
//             let tableResit = {}
//             tableResit['jenisResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"];
//             tableResit['payer'] = key["pembayar"];
//             tableResit['feePenentuanAlat'] = key["data"] ? key["data"][feePenentuanAlat].jumlah : 0;
//             tableResit['bayaranHalfFee'] = key["data"] ? key["data"][bayaranHalfFee].jumlah : 0
//             tableResit['cajMenunggu'] = key["data"] ? key["data"][cajMenunggu].jumlah : 0
//             tableResit['cajPenentuanPremisPelanggan'] = key["data"] ? key["data"][cajPenentuanPremisPelanggan].jumlah : 0;
//             tableResit['tuntutanPegawai'] = key["data"] ? key["data"][tuntutanPegawai].jumlah : 0
//             tableResit['borangE'] = key["data"] ? key["data"][borangE].jumlah : 0
//             tableResit['tuntutanLori'] = key["data"] ? key["data"][tuntutanLori].jumlah : 0
//             tableResit['bayaranLaporanPenentuan'] = key["data"] ? key["data"][bayaranLaporanPenentuan].jumlah : 0
//             tableResit['sewaanAlatPenentuan'] = key["data"] ? key["data"][sewaanAlatPenentuan].jumlah : 0
//             tableResit['lainLain'] = key["data"] ? key["data"][lainLain].jumlah : 0
//             tableResit['cukai'] = cukai
//             tableResit['adj'] = adj
//             tableResit['pgwai'] = key["pegawai"]
//             resit.push(tableResit)
//
//             ////////////////////////////////////////////////////////////////////////////////////////////////////////
//             let mydata = key["kutipanBayaran"];
//             let tunai = 0;
//             let cek = 0;
//             let butiranCek = '-';
//             let serapan = 0;
//             if (Array.isArray(mydata)) {
//                 tunai = mydata.filter(({id}) => id === 'Tunai').reduce(function (a, b) {
//                     if (b['kutipan'] === "") {
//                         return 0
//                     } else {
//                         let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
//                         val = val - cukaiArr[index] - adjArr[index];
//                         console.log(val)
//                         return val
//                     }
//                 }, 0);
//                 cek = mydata.filter(({id}) => id !== 'Tunai').reduce(function (a, b) {
//                     if (b['kutipan'] === "") {
//                         return 0
//                     } else {
//                         let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
//                         val = val - cukaiArr[index] - adjArr[index];
//                         return val
//                     }
//                 }, 0);
//                 butiranCek = mydata.filter(({id}) => id !== 'Tunai').reduce(function (a, b) {
//                     return b['noCek'] + ', ' + b['namaBank'];
//                 }, '-');
//                 this.state.jumlahTunai += tunai;
//                 this.state.jumlahCek += cek;
//                 this.state.jumlahOnline += 0.00;
//
//             } else {
//                 if (key["kutipanBayaran"].tunai === "") {
//                     tunai = 0
//                 } else {
//                     tunai = parseFloat(key["kutipanBayaran"].tunai) - cukaiArr[index] - adjArr[index]
//                 }
//                 if (key["kutipanBayaran"].cek === "") {
//                     cek = 0
//                 } else {
//                     cek = parseFloat(key["kutipanBayaran"].cek) - cukaiArr[index] - adjArr[index]
//                 }
//                 this.state.jumlahTunai += tunai;
//                 this.state.jumlahCek += cek;
//                 this.state.jumlahOnline += 0.00;
//
//             }
//             serapan = cukaiArr[index] + adjArr[index];
//             this.state.jumlahSerapan += serapan;
//
//             let tableKutipan = {}
//             tableKutipan['noResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"]
//             tableKutipan['pembayar'] = key["pembayar"]
//             tableKutipan['tunai'] = tunai.toFixed(2)
//             tableKutipan['online'] = '-'
//             tableKutipan['cek'] = cek.toFixed(2)
//             tableKutipan['butiranCek'] = butiranCek
//             tableKutipan['serapan'] = '-'
//             tableKutipan['peg'] = key.pegawai
//             kutipan.push(tableKutipan)
//         });
//
//         this.setState({
//             laporan: this.props.searchResult.laporan,
//             payment: this.props.searchResult.payment,
//             kutipan: kutipan,
//             resit: resit,
//             totalpagenum: 0,
//             loading: false,
//         });
//
//     };
//
//     exportExcel = () => {
//         var workbook = XLSX.utils.book_new();
//         var worksheet_data = document.getElementById("table-to-xls");
//         var worksheet = XLSX.utils.table_to_sheet(worksheet_data,{raw:true});
//         workbook.SheetNames.push("Table 1");
//         workbook.Sheets["Table 1"] = worksheet;
//
//         var worksheet_data2 = document.getElementById("table-to-xls2");
//         var worksheet2 = XLSX.utils.table_to_sheet(worksheet_data2,{raw:true});
//         workbook.SheetNames.push("Table 2");
//         workbook.Sheets["Table 2"] = worksheet2;
//
//         var worksheet_data3 = document.getElementById("table-to-xls3");
//         var worksheet3 = XLSX.utils.table_to_sheet(worksheet_data3,{raw:true});
//         workbook.SheetNames.push("Table 3");
//         workbook.Sheets["Table 3"] = worksheet3;
//
//         var worksheet_data4 = document.getElementById("table-to-xls4");
//         var worksheet4 = XLSX.utils.table_to_sheet(worksheet_data4,{raw:true});
//         workbook.SheetNames.push("Table 4");
//         workbook.Sheets["Table 4"] = worksheet4;
//
//         this.exportExcelFile(workbook);
//     };
//     exportExcelFile = (workbook) => {
//         return XLSX.writeFile(workbook, this.props.searchQuery.branch.kawasan + '-' + this.props.searchQuery.tarikh + '.xlsx');
//     };
//
//     sorting = (sortParam, table) => {
//         let tableData = [];
//         if (table === 'laporan') {
//             tableData = this.state.laporan
//         } else if (table === 'kutipan') {
//             tableData = this.state.kutipan
//         } else {
//             tableData = this.state.resit
//         }
//
//         this.setState({sortObj: sortParam}, () => {
//             if (sortParam.id === 'fiAlat' || sortParam.id === 'feePenentuanAlat' || sortParam.id === 'bayaranHalfFee' || sortParam.id === 'cajMenunggu' || sortParam.id === 'cajPenentuanPremisPelanggan' || sortParam.id === 'tuntutanPegawai' || sortParam.id === 'tuntutanLori' || sortParam.id === 'borangE' || sortParam.id === 'bayaranLaporanPenentuan' || sortParam.id === 'sewaanAlatPenentuan' || sortParam.id === 'terimaPelbagai' || sortParam.id === 'sewaanAlatPembaik' || sortParam.id === 'lainLain') {
//                 sortParam.desc ? tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? -1 : 0) : tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? -1 : 0);
//             } else {
//                 sortParam.desc ? tableData.sort((a, b) => (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? -1 : 0) : tableData.sort((a, b) => (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? -1 : 0);
//             }
//
//             let sortVar = {};
//
//             sortParam.desc ? sortVar[sortParam.id] = faSortDown : sortVar[sortParam.id] = faSortUp;
//
//             this.setState({[table]: tableData, sortIcon: sortVar})
//             // if (table === 'laporan'){
//             //     this.setState({laporan: tableData, sortIcon: sortVar})
//             // }else if(table === 'kutipan'){
//             //     this.setState({kutipan: tableData, sortIcon: sortVar})
//             // }else{
//             //     this.setState({resit: tableData, sortIcon: sortVar})
//             // }
//
//         });
//     };
//
//
//     render() {
//         const {laporan, payment, kutipan, resit} = this.state;
//
//         let jumlahGagal = laporan.filter(({tentusahan}) => tentusahan === 'Gagal').reduce(function (a, b) {
//             return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100 //because .toFixed(2) sometimes rounding incorectly
//         }, 0);
//         let jumlahLulus = laporan.filter(({tentusahan}) => tentusahan !== 'Gagal').reduce(function (a, b) {
//             return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
//         }, 0);
//         let jumlahSemua = laporan.reduce(function (a, b) {
//             return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
//         }, 0);
//         let sudahDibayar = laporan.filter(({invois}) => invois !== null).reduce(function (a, b) {
//             return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
//         }, 0);
//         let belumDibayar = laporan.filter(({invois}) => invois === null).reduce(function (a, b) {
//             return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
//         }, 0);
//
//         let kutipanObj = {};
//         kutipanObj['feePenentuanAlat'] = 0;
//         kutipanObj['bayaranHalfFee'] = 0;
//         kutipanObj['cajMenunggu'] = 0;
//         kutipanObj['cajPenentuanPremisPelanggan'] = 0;
//         kutipanObj['tuntutanPegawai'] = 0;
//         kutipanObj['tuntutanLori'] = 0;
//         kutipanObj['borangE'] = 0;
//         kutipanObj['bayaranLaporanPenentuan'] = 0;
//         kutipanObj['sewaanAlatPenentuan'] = 0;
//         kutipanObj['terimaPelbagai'] = 0;
//         kutipanObj['sewaanAlatPembaik'] = 0;
//         kutipanObj['lainLain'] = 0;
//
//
//         let pelarasan = 0;
//         let gstKutipan = 0;
//         for (let i = 0; i < payment.length; i++) {
//             let feePenentuanAlat = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Fee Penentuan Alat");
//             let bayaranHalfFee = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Bayaran 1/2 Fi");
//             let cajMenunggu = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Caj Menunggu");
//             let cajPenentuanPremisPelanggan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Caj Penentuan Di Premis Pemohon");
//             let tuntutanPegawai = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Pegawai");
//             let tuntutanLori = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Tuntutan Lori");
//             let borangE = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Jualan Borang E");
//             let bayaranLaporanPenentuan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Bayaran Laporan");
//             let sewaanAlatPenentuan = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Sewaan Standard DMSB");
//             let lainLain = payment[i]["data"].findIndex(x => x.jenisPembayaran === "Lain -Lain");
//
//             kutipanObj['feePenentuanAlat'] += parseFloat(payment[i]["data"][feePenentuanAlat].jumlah);
//             kutipanObj['bayaranHalfFee'] += parseFloat(payment[i]["data"][bayaranHalfFee].jumlah);
//             kutipanObj['cajMenunggu'] += parseFloat(payment[i]["data"][cajMenunggu].jumlah);
//             kutipanObj['cajPenentuanPremisPelanggan'] += parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah);
//             kutipanObj['tuntutanPegawai'] += parseFloat(payment[i]["data"][tuntutanPegawai].jumlah);
//             kutipanObj['tuntutanLori'] += parseFloat(payment[i]["data"][tuntutanLori].jumlah);
//             kutipanObj['borangE'] += parseFloat(payment[i]["data"][borangE].jumlah);
//             kutipanObj['bayaranLaporanPenentuan'] += parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah);
//             kutipanObj['sewaanAlatPenentuan'] += parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah);
//             kutipanObj['lainLain'] += parseFloat(payment[i]["data"][lainLain].jumlah);
//
//             let sumAll = parseFloat(payment[i]["data"][feePenentuanAlat].jumlah) +
//                 parseFloat(payment[i]["data"][bayaranHalfFee].jumlah) +
//                 parseFloat(payment[i]["data"][cajMenunggu].jumlah) +
//                 parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah) +
//                 parseFloat(payment[i]["data"][tuntutanPegawai].jumlah) +
//                 parseFloat(payment[i]["data"][tuntutanLori].jumlah) +
//                 parseFloat(payment[i]["data"][borangE].jumlah) +
//                 parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah) +
//                 parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah) +
//                 parseFloat(payment[i]["data"][lainLain].jumlah);
//
//             gstKutipan += Math.round((sumAll * parseFloat(payment[i]["jenisBayaran"]) / 100 + Number.EPSILON) * 100) / 100;
//             pelarasan += adjustment((sumAll * parseFloat(payment[i]["jenisBayaran"]) / 100).toFixed(2));
//
//         }
//
//         let jumlahKutipan = Object.values(kutipanObj).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
//         jumlahKutipan = Math.round((jumlahKutipan + Number.EPSILON) * 100) / 100;
//
//         let jumlahKeseluruhan = Math.round((jumlahKutipan + gstKutipan + Number.EPSILON) * 100) / 100;
//         jumlahKeseluruhan = Math.round((jumlahKeseluruhan + pelarasan + Number.EPSILON) * 100) / 100;
//
//
//         let idx = 0;
//         let idx2 = 0;
//
//
//         return (
//             <ReactCSSTransitionGroup
//                 component="div"
//                 transitionName="TabsAnimation"
//                 transitionAppear={true}
//                 transitionAppearTimeout={0}
//                 transitionEnter={false}
//                 transitionLeave={false}>
//                 <Card className="main-card mb-3">
//                     <CardBody>
//
//                         <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
//                                 onClick={() => {
//                                     this.exportExcel();
//                                     // this.setState({showCol: false, specialCol: 'No Daftar 6 angka'}, () => {
//                                     //     this.exportExcel();
//                                     //     this.setState({showCol: true, specialCol: 'No Daftar'});
//                                     // });
//                                 }}>
//                             <AnimationDiv style={{display: 'inline-block'}}>
//                                 <FontAwesomeIcon className="mr-2" icon={faFileExcel}/> </AnimationDiv>
//                             EXCEL
//                         </Button>
//                         <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
//                                 onClick={() => {
//                                     this.pdfExportComponent.save();
//                                     // this.setState({showCol: false, specialCol: 'No Daftar 6 angka'}, () => {
//                                     //     this.pdfExportComponent.save();
//                                     //     this.setState({showCol: true, specialCol: 'No Daftar'});
//                                     // });
//                                 }}>
//                             <AnimationDiv style={{display: 'inline-block'}}>
//                                 <FontAwesomeIcon className="mr-2" icon={faFilePdf}/> </AnimationDiv>
//                             PDF
//                         </Button>
//                         <PDFExport
//                             fileName={this.props.searchQuery.branch.kawasan + '-' + this.props.searchQuery.tarikh}
//                             scale={0.5}
//                             paperSize="A4"
//                             landscape={true}
//                             margin="1cm"
//                             ref={(component) => this.pdfExportComponent = component}
//                         >
//                             <Row>
//                                 <Col md={12}><b>Jadual 1.0 Laporan Harian Penentusahan Dan Penentusahan Semula Peringkat
//                                     Cawangan</b></Col>
//                                 <Col md={12}><b>Cawangan : {this.props.searchQuery.branch.kawasan}&nbsp;&nbsp;
//                                     Tarikh: {this.props.searchQuery.tarikh} &nbsp;&nbsp;
//                                     Jenis Kerja : {this.props.searchQuery.lokasi} </b></Col>
//                                 <Col>
//                                     <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
//                                         <thead>
//                                         <tr>
//                                             <th style={{textAlign: 'center', width: '50px'}}>No</th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'pembaik',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Pembaik <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'pembaik' ? this.state.sortIcon.pembaik : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'pemilik',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Pemilik <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'pemilik' ? this.state.sortIcon.pemilik : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'alamatPemilik',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Alamat Pemilik <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'alamatPemilik' ? this.state.sortIcon.alamatPemilik : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'jenama',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Jenama <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'jenama' ? this.state.sortIcon.jenama : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'jenis',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Jenis <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'jenis' ? this.state.sortIcon.jenis : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative', width: '5%'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'had',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Had <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'had' ? this.state.sortIcon.had : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'siriAlat',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Siri Alat <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'siriAlat' ? this.state.sortIcon.siriAlat : faSort}/></span>
//                                             </th>
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'rujukan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>{this.state.specialCol} <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'rujukan' ? this.state.sortIcon.rujukan : faSort}/></span>
//                                             </th>
//                                             {this.state.showCol ?
//                                                 <th
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'stiker',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Stiker <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'stiker' ? this.state.sortIcon.stiker : faSort}/></span>
//                                                 </th> : null}
//                                             <th
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'jenisStiker',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Jenis Stiker <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'jenisStiker' ? this.state.sortIcon.jenisStiker : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'sijil',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Sijil D <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'sijil' ? this.state.sortIcon.sijil : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'tentusahan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Tentusahan <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'tentusahan' ? this.state.sortIcon.tentusahan : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'pegawai',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}
//                                             >Pegawai
//                                                 <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'pegawai' ? this.state.sortIcon.pegawai : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'invois',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Invois <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'invois' ? this.state.sortIcon.invois : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'fiAlat',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'laporan')
//                                                 }}>Fi Alat <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'fiAlat' ? this.state.sortIcon.fiAlat : faSort}/></span>
//                                             </th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//                                         {laporan.map((value, index) => {
//                                             return (
//                                                 <tr key={index}>
//                                                     <td style={{textAlign: 'center'}}>{index + 1}</td>
//                                                     <td>{value.pembaik}</td>
//                                                     <td>{value.pemilik}</td>
//                                                     <td>{value.alamatPemilik}</td>
//                                                     <td>{value.jenama}</td>
//                                                     <td>{value.jenis}</td>
//                                                     <td>{value.had}</td>
//                                                     <td>{value.siriAlat}</td>
//                                                     <td>{value.rujukan}</td>
//                                                     {this.state.showCol ? <td>{value.stiker}</td> : null}
//                                                     <td>{value.jenisStiker}</td>
//                                                     <td>{value.sijil}</td>
//                                                     <td>{value.tentusahan}</td>
//                                                     <td>{value.pegawai}</td>
//                                                     <td>{value.invois}</td>
//                                                     <td width={'10%'}>RM {value.fiAlat}</td>
//                                                 </tr>
//                                             );
//                                         })}
//                                         </tbody>
//                                         <tfoot>
//                                         <tr>
//                                             <td colSpan={15}>Jumlah Fi Tentusah (RM) - Sebelum SST</td>
//                                             <td>
//                                                 RM {jumlahLulus.toFixed(2)}
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={15}>Jumlah Fi Gagal (RM) - Sebelum SST</td>
//                                             <td>RM {jumlahGagal.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={15}>Jumlah Harian Keseluruhan (RM) - Sebelum SST</td>
//                                             <td>RM {jumlahSemua.toFixed(2)}</td>
//                                         </tr>
//
//                                         {/*divider comment for dev*/}
//                                         <tr>
//                                             <td colSpan={7} style={{border: 'unset'}}/>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={7} style={{border: 'unset'}}/>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={7}><b>Berikut adalah jumlah kutipan yang diperoleh</b></td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={6}>01. Jumlah Kutipan untuk Alat yang sudah dibayar berdasarkan
//                                                 sijil D
//                                                 :
//                                                 (tanpa
//                                                 SST)
//                                             </td>
//                                             <td>RM {sudahDibayar.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={6}>02. Jumlah Kutipan untuk Alat yang belum dibayar berdasarkan
//                                                 sijil D
//                                                 :
//                                                 (tanpa
//                                                 SST)
//                                             </td>
//                                             <td>RM {belumDibayar.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td colSpan={6}>03. Jumlah Kutipan untuk Alat yang dikutip berdasarkan
//                                                 invois cukai
//                                                 : (tanpa
//                                                 SST)
//                                             </td>
//                                             <td>RM {(sudahDibayar + belumDibayar).toFixed(2)}</td>
//                                         </tr>
//                                         </tfoot>
//                                     </Table>
//                                 </Col>
//                             </Row>
//
//                             <Row>
//                                 <Col md={12}><b>Kutipan Sebenar Cawangan
//                                     : {this.props.searchQuery.branch.kawasan}</b></Col>
//                                 <Col md={12}><b>Tarikh Bayaran : {this.props.searchQuery.tarikh}</b></Col>
//                                 <Col md={6}>
//                                     <Table striped bordered hover id={'table-to-xls2'}>
//                                         <thead>
//                                         <tr>
//                                             <th width={'90%'}>Bayaran Perkhidmatan De Metrology</th>
//                                             <th>Kutipan(RM)</th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//
//                                         <tr>
//                                             <td>01. Fee Penentuan Alat (+Sijil)
//                                             </td>
//                                             <td> {kutipanObj.feePenentuanAlat.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>02. Bayaran 1/2 Fee
//                                             </td>
//                                             <td> {kutipanObj.bayaranHalfFee.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>03. Caj Menunggu
//                                             </td>
//                                             <td> {kutipanObj.cajMenunggu.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>04. Caj Penentuan di Premis Pelanggan
//                                             </td>
//                                             <td> {kutipanObj.cajPenentuanPremisPelanggan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>05. Tuntuan Pegawai
//                                             </td>
//                                             <td> {kutipanObj.tuntutanPegawai.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>06. Tuntutan Lori
//                                             </td>
//                                             <td> {kutipanObj.tuntutanLori.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>07. Borang E
//                                             </td>
//                                             <td> {kutipanObj.borangE.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>08. Bayaran Laporan Penentuan
//                                             </td>
//                                             <td> {kutipanObj.bayaranLaporanPenentuan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>09. Sewaan Alat Penentuan
//                                             </td>
//                                             <td> {kutipanObj.sewaanAlatPenentuan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>10. Terima Pelbagai
//                                             </td>
//                                             <td> {kutipanObj.terimaPelbagai.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>11. Sewaan Alat Pembaik
//                                             </td>
//                                             <td> {kutipanObj.sewaanAlatPembaik.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td>12. Lain-lain
//                                             </td>
//                                             <td> {kutipanObj.lainLain.toFixed(2)}</td>
//                                         </tr>
//                                         </tbody>
//                                         <tfoot>
//                                         <tr>
//                                             <td style={{textAlign: 'right'}}>Jumlah (RM)</td>
//                                             <td> {jumlahKutipan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td style={{textAlign: 'right'}}>SST @ 6% (RM)</td>
//                                             <td> {gstKutipan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td style={{textAlign: 'right'}}>Pelarasan (RM)</td>
//                                             <td> {pelarasan.toFixed(2)}</td>
//                                         </tr>
//                                         <tr>
//                                             <td style={{textAlign: 'right'}}>Jumlah Keseluruhan (RM)</td>
//                                             <td> {jumlahKeseluruhan.toFixed(2)}</td>
//                                         </tr>
//                                         </tfoot>
//                                     </Table>
//                                 </Col>
//                             </Row>
//
//                             <Row>
//                                 <Col md={12} style={{textAlign: 'center'}}><b>Senarai Resit Bayaran</b></Col>
//                                 <Col>
//                                     <Table striped bordered hover id={'table-to-xls3'}>
//                                         <thead>
//                                         <tr>
//                                             <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
//                                             <th rowSpan={2}
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'jenisResit',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}>No Resit <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'jenisResit' ? this.state.sortIcon.jenisResit : faSort}/></span>
//                                             </th>
//                                             <th rowSpan={2}
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'payer',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}>Pembayar <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'payer' ? this.state.sortIcon.payer : faSort}/></span>
//                                             </th>
//                                             {/*<th rowSpan={2}>Status</th>*/}
//                                             <th colSpan={13}>Maklumat Pembayaran(RM) *Sila lihat pada jadual di atas
//                                                 untuk panduan bayaran
//                                             </th>
//                                         </tr>
//                                         <tr>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'feePenentuanAlat',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'feePenentuanAlat' ? this.state.sortIcon.feePenentuanAlat : faSort}/></span>01
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'bayaranHalfFee',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'bayaranHalfFee' ? this.state.sortIcon.bayaranHalfFee : faSort}/></span>02
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'cajMenunggu',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'cajMenunggu' ? this.state.sortIcon.cajMenunggu : faSort}/></span>03
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'cajPenentuanPremisPelanggan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'cajPenentuanPremisPelanggan' ? this.state.sortIcon.cajPenentuanPremisPelanggan : faSort}/></span>04
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'tuntutanPegawai',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanPegawai' ? this.state.sortIcon.tuntutanPegawai : faSort}/></span>05
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'borangE',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'borangE' ? this.state.sortIcon.borangE : faSort}/></span>06
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'tuntutanLori',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanLori' ? this.state.sortIcon.tuntutanLori : faSort}/></span>07
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'bayaranLaporanPenentuan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'bayaranLaporanPenentuan' ? this.state.sortIcon.bayaranLaporanPenentuan : faSort}/></span>08
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'sewaanAlatPenentuan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'sewaanAlatPenentuan' ? this.state.sortIcon.sewaanAlatPenentuan : faSort}/></span>09
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'lainLain',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'lainLain' ? this.state.sortIcon.lainLain : faSort}/></span>10
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'cukai',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'cukai' ? this.state.sortIcon.cukai : faSort}/></span>Cukai
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'adj',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'adj' ? this.state.sortIcon.adj : faSort}/></span>Adj
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'pgwai',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'resit')
//                                                 }}><span style={{position: 'absolute', right: '7px', color: '#858789'}}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'pgwai' ? this.state.sortIcon.pgwai : faSort}/></span>Pegawai
//                                             </th>
//                                         </tr>
//                                         </thead>
//                                         <tbody>
//                                         {resit.map((value, index) => {
//                                             return (
//                                                 <tr key={index}>
//                                                     <td style={{textAlign: 'center'}}>{index + 1}</td>
//                                                     <td>{value.jenisResit}</td>
//                                                     <td>{value.payer}</td>
//                                                     <td>{value.feePenentuanAlat}
//                                                     </td>
//                                                     <td>{value.bayaranHalfFee}
//                                                     </td>
//                                                     <td>{value.cajMenunggu}
//                                                     </td>
//                                                     <td>{value.cajPenentuanPremisPelanggan}
//                                                     </td>
//                                                     <td>{value.tuntutanPegawai}
//                                                     </td>
//                                                     <td>{value.borangE}
//                                                     </td>
//                                                     <td>{value.tuntutanLori}
//                                                     </td>
//                                                     <td>{value.bayaranLaporanPenentuan}
//                                                     </td>
//                                                     <td>{value.sewaanAlatPenentuan}
//                                                     </td>
//                                                     <td>{value.lainLain}
//                                                     </td>
//                                                     <td>{
//                                                         value.cukai}
//                                                     </td>
//                                                     <td>{
//                                                         value.adj}
//                                                     </td>
//                                                     <td>{value.pgwai}
//                                                     </td>
//                                                 </tr>
//                                             );
//                                         })
//                                         }
//                                         </tbody>
//                                         <tfoot>
//                                         <tr>
//                                             <td colSpan={3}>Jumlah</td>
//                                             <td>{this.state.jumlah1.toFixed(2)}</td>
//                                             <td>{this.state.jumlah2.toFixed(2)}</td>
//                                             <td>{this.state.jumlah3.toFixed(2)}</td>
//                                             <td>{this.state.jumlah4.toFixed(2)}</td>
//                                             <td>{this.state.jumlah5.toFixed(2)}</td>
//                                             <td>{this.state.jumlah6.toFixed(2)}</td>
//                                             <td>{this.state.jumlah7.toFixed(2)}</td>
//                                             <td>{this.state.jumlah8.toFixed(2)}</td>
//                                             <td>{this.state.jumlah9.toFixed(2)}</td>
//                                             <td>{this.state.jumlah10.toFixed(2)}</td>
//                                             <td>{this.state.jumlahCukai.toFixed(2)}</td>
//                                             <td>{this.state.jumlahAdj.toFixed(2)}</td>
//                                             <td/>
//                                         </tr>
//                                         </tfoot>
//                                     </Table>
//                                 </Col>
//                             </Row>
//
//                             <Row>
//                                 <Col md={12} style={{textAlign: 'center'}}><b>Senarai Kutipan berdasarkan
//                                     Resit</b></Col>
//                                 <Col>
//                                     <Table striped bordered hover id={'table-to-xls4'}>
//                                         <thead>
//                                         <tr>
//                                             <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
//                                             <th rowSpan={2}
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'noResit',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>No Resit <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'noResit' ? this.state.sortIcon.noResit : faSort}/></span>
//                                             </th>
//                                             <th rowSpan={2}
//                                                 style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'pembayar',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Pembayar <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'pembayar' ? this.state.sortIcon.pembayar : faSort}/></span>
//                                             </th>
//                                             <th colSpan={6} style={{textAlign: 'center'}}>Kaedah Bayaran (RM)
//                                             </th>
//                                         </tr>
//                                         <tr>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'tunai',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Tunai <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'tunai' ? this.state.sortIcon.tunai : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'online',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Online <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'online' ? this.state.sortIcon.online : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'cek',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Cek <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'cek' ? this.state.sortIcon.cek : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'butiranCek',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Butiran Cek <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'butiranCek' ? this.state.sortIcon.butiranCek : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'serapan',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Serapan <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'serapan' ? this.state.sortIcon.serapan : faSort}/></span>
//                                             </th>
//                                             <th style={{position: 'relative'}}
//                                                 onClick={() => {
//                                                     this.sorting({
//                                                         id: 'peg',
//                                                         desc: !this.state.sortObj.desc
//                                                     }, 'kutipan')
//                                                 }}>Pegawai <span style={{
//                                                 position: 'absolute',
//                                                 right: '7px',
//                                                 color: '#858789'
//                                             }}><FontAwesomeIcon
//                                                 icon={Object.keys(this.state.sortIcon)[0] === 'peg' ? this.state.sortIcon.peg : faSort}/></span>
//                                             </th>
//                                         </tr>
//                                         </thead>
//                                         {kutipan.map((value, index) => {
//                                             return (
//                                                 <tbody>
//                                                 <tr key={index}>
//                                                     <td style={{textAlign: 'center'}}>{idx2 = idx2 + 1}</td>
//                                                     <td>{value.noResit}</td>
//                                                     <td>{value.pembayar}</td>
//                                                     <td>{value.tunai}</td>
//                                                     <td>-</td>
//                                                     <td>{value.cek}</td>
//                                                     <td>{value.butiranCek}</td>
//                                                     <td>-</td>
//                                                     <td>{value.peg}</td>
//                                                 </tr>
//                                                 <tr key={index}>
//                                                     <td style={{textAlign: 'center'}}>{idx2 = idx2 + 1}</td>
//                                                     <td>{value.noResit}</td>
//                                                     <td>{value.pembayar}</td>
//                                                     <td>-</td>
//                                                     <td>-</td>
//                                                     <td>-</td>
//                                                     <td>-</td>
//                                                     <td>{value.serapan}</td>
//                                                     <td>{value.peg}</td>
//                                                 </tr>
//                                                 </tbody>
//                                             )
//                                         })
//                                         }
//                                         <tfoot>
//                                         <tr>
//                                             <td colSpan={3}>Jumlah</td>
//                                             <td>{this.state.jumlahTunai.toFixed(2)}</td>
//                                             <td>{this.state.jumlahOnline.toFixed(2)}</td>
//                                             <td>{this.state.jumlahCek.toFixed(2)}</td>
//                                             <td>-</td>
//                                             <td>{this.state.jumlahSerapan.toFixed(2)}</td>
//
//                                             <td>{(this.state.jumlahTunai + this.state.jumlahCek + this.state.jumlahOnline + this.state.jumlahSerapan).toFixed(2)}</td>
//                                         </tr>
//                                         </tfoot>
//                                     </Table>
//                                 </Col>
//                             </Row>
//
//                         </PDFExport>
//                     </CardBody>
//                 </Card>
//             </ReactCSSTransitionGroup>
//         );
//     }
//
// }
