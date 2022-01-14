import React, {Fragment} from 'react';
import {
    Button,
    Card, Input, Form, FormGroup,
    CardBody, Col, Row, Table,
} from "reactstrap";

import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExcel, faFilePdf, faSort, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {adjustment, AnimationDiv} from "../../daily/component/list";
import {PDFExport} from "@progress/kendo-react-pdf";
import {Redirect} from "react-router-dom";
import {reportMenu} from "../../../../../src/Layout/AppNav/VerticalNavWrapper"
import XLSX from 'xlsx'

export default class MonthlyResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jumlah1: 0, jumlah2: 0, jumlah3: 0, jumlah4: 0, jumlah5: 0, jumlah6: 0, jumlah7: 0, jumlah8: 0, jumlah9: 0,
            jumlah10: 0, jumlahAdj: 0, jumlahTunai: 0, jumlahCek: 0, jumlahOnline: 0, jumlahpeg: 0,jumlahSerapan: 0,
            sortObj: {id: '', desc: true},
            sortIcon: {'': faSort},
            laporan: [],
            resit: [],
            kutipan: [],
            serapan: [],
            jumlahKutipan: {}, payment: {},
            page: 0, sorted: [{id: 'date_created', desc: true}],
            showResult: 'monthly', myDate: null, dataDaily: {}, dataAlatan: {},
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
        };
        this.exportExcelFile = this.exportExcelFile.bind(this);
    }


    componentDidMount = async () => {
        let kutipan = [];
        let resit = [];
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
            adjArr.push(adj)
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
                        val = val -  adjArr[index];
                        console.log(val)
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
                cek = mydata.filter(({id}) =>  id !== 'Tunai' && id !== 'Online').reduce(function (a, b) {
                    if (b['kutipan'] === "") {
                        return 0
                    } else {
                        let val = Math.round((parseFloat(a) + parseFloat(b['kutipan']) + Number.EPSILON) * 100) / 100;
                        val = val -adjArr[index];
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
                    cek = parseFloat(key["kutipanBayaran"].cek)  - adjArr[index]
                }
                if (key["kutipanBayaran"].online === "") {
                    online = 0
                } else {
                    online = parseFloat(key["kutipanBayaran"].online) -adjArr[index]
                }
                this.state.jumlahTunai += tunai;
                this.state.jumlahCek += cek;
                this.state.jumlahOnline += online;

            }
            serapan =  adjArr[index];
            this.state.jumlahSerapan += serapan;

            let tableKutipan = {}
            tableKutipan['noResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"];
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
            serapan: this.props.searchResult.serapan,
            payment: this.props.searchResult.payment,
            jumlahKutipan: this.props.searchResult.jumlahKutipan,
            kutipan: kutipan,
            resit: resit,
            totalpagenum: 0,
            loading: false,
        });
    };

    dayHtml = (year, month) => {
        let daysInMonth = new Date(year, month, 0).getDate();
        let html = [];
        for (let i = 1; i <= daysInMonth; i++) {
            html.push(
                <option key={i} value={i}>
                    {i}
                </option>)
        }
        return (
            html
        )
    };

    onDay = (year, month, day) => {

        let tarikh = new Date(year, month, day);
        this.setState({myDate: tarikh});
        fetch(global.ipServer + `report/find_daily_report?` +
            `tarikh=${encodeURIComponent(tarikh.toLocaleDateString())}` +
            `&cawangan=${encodeURIComponent(this.props.searchQuery.branch.id)}` +
            `&lokasi=${encodeURIComponent(this.props.searchQuery.lokasi)}`, {
            method: 'GET',
            headers: {
                'x-access-token': global.token
            },
        }).then((response) => response.json()).then((result) => {
            this.setState({showResult: 'daily', dataDaily: result});
            reportMenu.changeActiveLinkLabel('Harian');
        });
    };

    onAlatan = (year, month, jenis) => {
        let tarikh = new Date(year, month);
        this.setState({myDate: tarikh, idAlat: jenis});
        fetch(global.ipServer + `report/find_alatan_report?` +
            `year=${encodeURIComponent(tarikh.toLocaleDateString())}` +
            `&month=${encodeURIComponent(month)}` +
            `&cawangan=${encodeURIComponent(this.props.searchQuery.branch.id)}` +
            `&jenis=${encodeURIComponent(jenis)}` +
            `&lokasi=${encodeURIComponent(this.props.searchQuery.lokasi)}`, {
            method: 'GET',
            headers: {
                'x-access-token': global.token
            },
        }).then((response) => response.json()).then((result) => {
            this.setState({showResult: 'alatan', dataAlatan: result});
            reportMenu.changeActiveLinkLabel('Alatan');
        });
    };

    exportExcel = () => {
        var workbook = XLSX.utils.book_new();
        var worksheet_data = document.getElementById("table-to-xls");
        var worksheet = XLSX.utils.table_to_sheet(worksheet_data,{raw:true});
        workbook.SheetNames.push("Table 1");
        workbook.Sheets["Table 1"] = worksheet;

        var worksheet_data2 = document.getElementById("table-to-xls2");
        var worksheet2 = XLSX.utils.table_to_sheet(worksheet_data2,{raw:true});
        workbook.SheetNames.push("Table 2");
        workbook.Sheets["Table 2"] = worksheet2;

        var worksheet_data3 = document.getElementById("table-to-xls3");
        var worksheet3 = XLSX.utils.table_to_sheet(worksheet_data3,{raw:true});
        workbook.SheetNames.push("Table 3");
        workbook.Sheets["Table 3"] = worksheet3;

        var worksheet_data4 = document.getElementById("table-to-xls4");
        var worksheet4 = XLSX.utils.table_to_sheet(worksheet_data4,{raw:true});
        workbook.SheetNames.push("Table 4");
        workbook.Sheets["Table 4"] = worksheet4;

        var worksheet_data5 = document.getElementById("table-to-xls5");
        var worksheet5 = XLSX.utils.table_to_sheet(worksheet_data5);
        workbook.SheetNames.push("Table 5");
        workbook.Sheets["Table 5"] = worksheet5;

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
                sortParam.desc ? tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? -1 : 0) : tableData.sort((a, b) => (parseFloat(a[this.state.sortObj.id]) > parseFloat(b[this.state.sortObj.id])) ? 1 : (parseFloat(a[this.state.sortObj.id]) < parseFloat(b[this.state.sortObj.id])) ? -1 : 0);
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
        });
    };

    render() {
        const {laporan, jumlahKutipan, payment, kutipan, resit, serapan} = this.state;
        let dateParam = new Date(this.props.searchQuery.tarikh);
        let month = dateParam.toLocaleString('default', {month: 'long'});
        let year = dateParam.getFullYear();
        let getDate = month + ', ' + year;

        let bilanganAlatBerjaya = laporan.reduce(function (a, b) {
            return (parseFloat(a) + parseFloat(b['bilanganAlatBerjaya']));
        }, 0);
        let kutipanFiBerjaya = laporan.reduce(function (a, b) {
            return (parseFloat(a) + parseFloat(b['kutipanFiBerjaya'])).toFixed(2);
        }, 0);
        let bilanganAlatGagal = laporan.reduce(function (a, b) {
            return (parseFloat(a) + parseFloat(b['bilanganAlatGagal']));
        }, 0);
        let kutipanFiGagal = laporan.reduce(function (a, b) {
            return (parseFloat(a) + parseFloat(b['kutipanFiGagal'])).toFixed(2);
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

            kutipanObj['feePenentuanAlat'] += parseFloat(payment[i]["data"][feePenentuanAlat].jumlah)
            kutipanObj['bayaranHalfFee'] += parseFloat(payment[i]["data"][bayaranHalfFee].jumlah)
            kutipanObj['cajMenunggu'] += parseFloat(payment[i]["data"][cajMenunggu].jumlah)
            kutipanObj['cajPenentuanPremisPelanggan'] += parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah)
            kutipanObj['tuntutanPegawai'] += parseFloat(payment[i]["data"][tuntutanPegawai].jumlah)
            kutipanObj['tuntutanLori'] += parseFloat(payment[i]["data"][tuntutanLori].jumlah)
            kutipanObj['borangE'] += parseFloat(payment[i]["data"][borangE].jumlah)
            kutipanObj['bayaranLaporanPenentuan'] += parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah)
            kutipanObj['sewaanAlatPenentuan'] += parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah)
            kutipanObj['lainLain'] += parseFloat(payment[i]["data"][lainLain].jumlah)

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
        let jumlahKutipanx = Object.values(kutipanObj).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
        jumlahKutipanx = Math.round((jumlahKutipanx + Number.EPSILON) * 100) / 100;

        let jumlahKeseluruhan = Math.round((jumlahKutipanx + Number.EPSILON) * 100) / 100;
        jumlahKeseluruhan = Math.round((jumlahKeseluruhan + pelarasan + Number.EPSILON) * 100) / 100;

        let idx = 0;

        if (this.state.showResult === 'daily') {
            return (
                <Redirect to={{
                    pathname: '/report/daily',
                    state: {
                        searchResult: this.state.dataDaily,
                        searchQuery: {
                            'branch': this.props.searchQuery.branch,
                            'lokasi': this.props.searchQuery.lokasi === 'Keseluruhan' ? 'all' : this.props.searchQuery.lokasi === 'Dalam' ? 'dalam' : this.props.searchQuery.lokasi === 'Luar' ? 'luar' : 'stampingStation',
                            'tarikh': this.state.myDate.toLocaleDateString()
                        }
                    }
                }}/>
            )
        } else if (this.state.showResult === 'monthly') {
            let jumlahAlat = 0;
            let jumlahTentusah = 0;
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
                            {/*<CSVLink data={this.state.laporan} filename={this.props.searchQuery.cawangan+'-'+this.props.searchQuery.tarikh}>*/}
                            {/*    <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary">*/}
                            {/*        <AnimationDiv style={{display: 'inline-block'}}>*/}
                            {/*            <FontAwesomeIcon className="mr-2" icon={faFileCsv}/> </AnimationDiv>*/}
                            {/*        CSV*/}
                            {/*    </Button>*/}
                            {/*</CSVLink>*/}
                            <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                    onClick={this.exportExcel}>
                                <AnimationDiv style={{display: 'inline-block'}}>
                                    <FontAwesomeIcon className="mr-2" icon={faFileExcel}/> </AnimationDiv>
                                EXCEL
                            </Button>
                            <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                    onClick={() => {
                                        this.pdfExportComponent.save();
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
                                    <Col md={12}><b>Jadual 1.0 Laporan Bulanan Penentusahan Dan Penentusahan
                                        Semula
                                        Peringkat
                                        Cawangan</b></Col>
                                    <Col md={12}><b>Cawangan
                                        : {this.props.searchQuery.branch.kawasan} &nbsp;&nbsp; Jenis
                                        Kerja
                                        : {this.props.searchQuery.lokasi} </b></Col>
                                    <Col md={12}>

                                        <Form inline>
                                            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                                                <b className="mr-2">Pecahan mengikut hari:</b>

                                                <Input type="select" name="hari" required bsSize="sm"
                                                       onChange={(dataEl) => {
                                                           this.onDay(year, dateParam.getMonth(), parseInt(dataEl.target.value))
                                                       }}
                                                >
                                                    <option key={''} value={''} disabled selected>All</option>
                                                    {this.dayHtml(year, dateParam.getMonth() + 1)}
                                                </Input>
                                            </FormGroup>
                                        </Form>
                                    </Col>
                                    <Col>
                                        <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
                                            <thead>
                                            <tr>
                                                <th rowSpan={3}
                                                    style={{textAlign: 'center', width: '50px'}}>No
                                                </th>
                                                <th rowSpan={3}
                                                    style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'jenisAlat',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Nama Alat <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'jenisAlat' ? this.state.sortIcon.jenisAlat : faSort}/></span>
                                                </th>
                                                <th colSpan={4} style={{textAlign: 'center'}}>Tentusahan</th>
                                            </tr>
                                            <tr>
                                                <th colSpan={2}>Berjaya</th>
                                                <th colSpan={2}>Gagal</th>
                                            </tr>
                                            <tr>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'bilanganAlatBerjaya',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Bilangan Alat <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'bilanganAlatBerjaya' ? this.state.sortIcon.bilanganAlatBerjaya : faSort}/></span>
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'kutipanFiBerjaya',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Kutipan Fi <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'kutipanFiBerjaya' ? this.state.sortIcon.kutipanFiBerjaya : faSort}/></span>
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'bilanganAlatGagal',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Bilangan Alat <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'bilanganAlatGagal' ? this.state.sortIcon.bilanganAlatGagal : faSort}/></span>
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'kutipanFiGagal',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'laporan')
                                                    }}>Kutipan Fi <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'kutipanFiGagal' ? this.state.sortIcon.kutipanFiGagal : faSort}/></span>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {laporan.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                        <td>
                                                            <span style={{
                                                                color: 'blue',
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer'
                                                            }} onClick={(dataEl) => {
                                                                this.onAlatan(year, dateParam.getMonth() + 1, value.idAlat)
                                                            }}>
                                                                {value.jenisAlat}
                                                            </span>
                                                        </td>
                                                        <td>{value.bilanganAlatBerjaya}</td>
                                                        <td>RM {value.kutipanFiBerjaya.toFixed(2)}</td>
                                                        <td>{value.bilanganAlatGagal}</td>
                                                        <td>RM {value.kutipanFiGagal.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={2}>Jumlah Keseluruhan</td>
                                                <td>{bilanganAlatBerjaya}</td>
                                                <td>RM {kutipanFiBerjaya}</td>
                                                <td>{bilanganAlatGagal}</td>
                                                <td>RM {kutipanFiGagal}</td>
                                            </tr>
                                            {/*divider comment for dev*/}
                                            <tr>
                                                <td colSpan={3} style={{border: 'unset'}}/>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} style={{border: 'unset'}}/>
                                            </tr>
                                            <tr>
                                                <td colSpan={3}><b>Berikut adalah jumlah kutipan yang diperoleh</b></td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>01. Jumlah Kutipan untuk Alat yang sudah dibayar
                                                    berdasarkan
                                                    sijil D
                                                    :
                                                    (tanpa
                                                    SST)
                                                </td>
                                                <td>RM {jumlahKutipan.jumlahSudahDibayar}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>02. Jumlah Kutipan untuk Alat yang belum dibayar
                                                    berdasarkan
                                                    sijil D
                                                    :
                                                    (tanpa
                                                    SST)
                                                </td>
                                                <td>RM {jumlahKutipan.jumlahBelumDibayar}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>03. Jumlah Kutipan untuk Alat yang dikutip berdasarkan
                                                    invois cukai
                                                    : (tanpa
                                                    SST)
                                                </td>
                                                <td>RM {jumlahKutipan.jumlahSemua}</td>
                                            </tr>
                                            </tfoot>
                                        </Table>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}><b>Kutipan Sebenar Cawangan
                                        : {this.props.searchQuery.branch.kawasan}</b></Col>
                                    <Col md={12}><b>Bulan Bayaran : {getDate}</b></Col>
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
                                                <td> {jumlahKutipanx.toFixed(2)}</td>
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
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'feePenentuanAlat' ? this.state.sortIcon.feePenentuanAlat : faSort}/></span>01
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'bayaranHalfFee',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'bayaranHalfFee' ? this.state.sortIcon.bayaranHalfFee : faSort}/></span>02
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'cajMenunggu',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'cajMenunggu' ? this.state.sortIcon.cajMenunggu : faSort}/></span>03
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'cajPenentuanPremisPelanggan',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'cajPenentuanPremisPelanggan' ? this.state.sortIcon.cajPenentuanPremisPelanggan : faSort}/></span>04
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'tuntutanPegawai',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanPegawai' ? this.state.sortIcon.tuntutanPegawai : faSort}/></span>05
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'borangE',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'borangE' ? this.state.sortIcon.borangE : faSort}/></span>06
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'tuntutanLori',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanLori' ? this.state.sortIcon.tuntutanLori : faSort}/></span>07
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'bayaranLaporanPenentuan',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'bayaranLaporanPenentuan' ? this.state.sortIcon.bayaranLaporanPenentuan : faSort}/></span>08
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'sewaanAlatPenentuan',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'sewaanAlatPenentuan' ? this.state.sortIcon.sewaanAlatPenentuan : faSort}/></span>09
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'lainLain',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'lainLain' ? this.state.sortIcon.lainLain : faSort}/></span>10
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'adj',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'adj' ? this.state.sortIcon.adj : faSort}/></span>Adj
                                                </th>
                                                <th style={{position: 'relative'}}
                                                    onClick={() => {
                                                        this.sorting({
                                                            id: 'pgwai',
                                                            desc: !this.state.sortObj.desc
                                                        }, 'resit')
                                                    }}><span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
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
                                                        <td style={{textAlign: 'center'}}>{idx = idx + 1}</td>
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

                                <Row>
                                    <Col md={12} style={{textAlign: 'center'}}><b>Laporan Jumlah Penentusahan
                                        Keseluruhan Cawangan</b></Col>
                                    <Col>
                                        <Table striped bordered hover id={'table-to-xls5'} style={{border: 'unset'}}>
                                            <thead>
                                            <tr>
                                                <th
                                                    style={{textAlign: 'center', width: '50px'}}>No
                                                </th>
                                                <th>Kategori Alat</th>
                                                <th>Jumlah Alat</th>
                                                <th>Jumlah Fi Penentusahan</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {serapan.map((value, index) => {
                                                jumlahAlat += value.jumlahAlat
                                                jumlahTentusah += value.jumlahFiPenentusahan
                                                return (
                                                    <tr key={index}>
                                                        <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                        <td>{value.kategoriAlat}</td>
                                                        <td>{value.jumlahAlat}</td>
                                                        <td>RM {value.jumlahFiPenentusahan.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td/>
                                                <td>Jumlah</td>
                                                <td>{jumlahAlat}</td>
                                                <td>RM {jumlahTentusah.toFixed(2)}</td>
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
        } else {
            return (
                <Redirect to={{
                    pathname: '/report/alatan',
                    state: {
                        searchResult: this.state.dataAlatan,
                        searchQuery: {
                            'branch': this.props.searchQuery.branch,
                            'lokasi': this.props.searchQuery.lokasi === 'Keseluruhan' ? 'all' : this.props.searchQuery.lokasi === 'Dalam' ? 'dalam' : this.props.searchQuery.lokasi === 'Luar' ? 'luar' : 'stampingStation',
                            'tarikh': this.state.myDate,
                            'month': this.state.myDate.getMonth(),
                            'jenisAlat': this.state.idAlat
                        }
                    }
                }}/>
            )
        }
    }

}


// import React, {Fragment} from 'react';
// import {
//     Button,
//     Card, Input, Form, FormGroup,
//     CardBody, Col, Row, Table,
// } from "reactstrap";
//
// import ReactCSSTransitionGroup from "react-addons-css-transition-group";
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {faFileExcel, faFilePdf, faSort, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
// import {adjustment, AnimationDiv} from "../../daily/componentPentadbiran/list";
// import {PDFExport} from "@progress/kendo-react-pdf";
// import {Redirect} from "react-router-dom";
// import {reportMenu} from "../../../../../src/Layout/AppNav/VerticalNavWrapper"
// import XLSX from 'xlsx'
//
// export default class MonthlyResult extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             jumlah1: 0, jumlah2: 0, jumlah3: 0, jumlah4: 0, jumlah5: 0, jumlah6: 0, jumlah7: 0, jumlah8: 0, jumlah9: 0,
//             jumlah10: 0, jumlahCukai: 0, jumlahAdj: 0, jumlahTunai: 0, jumlahCek: 0, jumlahOnline: 0, jumlahSerapan: 0,
//             sortObj: {id: '', desc: true},
//             sortIcon: {'': faSort},
//             laporan: [],
//             resit: [],
//             kutipan: [],
//             serapan: [],
//             jumlahKutipan: {}, payment: {},
//             page: 0, sorted: [{id: 'date_created', desc: true}],
//             showResult: 'monthly', myDate: null, dataDaily: {}, dataAlatan: {},
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
//         let kutipan = [];
//         let resit = [];
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
//             tableKutipan['noResit'] = key["jenisResit"] === "Auto" ? "DMSB/" + key["branchCode"] + "/" + key["resit"] : key["resit"];
//             tableKutipan['pembayar'] = key["pembayar"]
//             tableKutipan['tunai'] = tunai.toFixed(2)
//             tableKutipan['online'] = '-'
//             tableKutipan['cek'] = cek.toFixed(2)
//             tableKutipan['butiranCek'] = butiranCek
//             tableKutipan['serapan'] = '-'
//             tableKutipan['peg'] = payment.pegawai
//             kutipan.push(tableKutipan)
//         });
//
//         this.setState({
//             laporan: this.props.searchResult.laporan,
//             serapan: this.props.searchResult.serapan,
//             payment: this.props.searchResult.payment,
//             jumlahKutipan: this.props.searchResult.jumlahKutipan,
//             kutipan: kutipan,
//             resit: resit,
//             totalpagenum: 0,
//             loading: false,
//         });
//     };
//
//     dayHtml = (year, month) => {
//         let daysInMonth = new Date(year, month, 0).getDate();
//         let html = [];
//         for (let i = 1; i <= daysInMonth; i++) {
//             html.push(
//                 <option key={i} value={i}>
//                     {i}
//                 </option>)
//         }
//         return (
//             html
//         )
//     };
//
//     onDay = (year, month, day) => {
//
//         let tarikh = new Date(year, month, day);
//         this.setState({myDate: tarikh});
//         fetch(global.ipServer + `report/find_daily_report?` +
//             `tarikh=${encodeURIComponent(tarikh.toLocaleDateString())}` +
//             `&cawangan=${encodeURIComponent(this.props.searchQuery.branch.id)}` +
//             `&lokasi=${encodeURIComponent(this.props.searchQuery.lokasi)}`, {
//             method: 'GET',
//             headers: {
//                 'x-access-token': global.token
//             },
//         }).then((response) => response.json()).then((result) => {
//             this.setState({showResult: 'daily', dataDaily: result});
//             reportMenu.changeActiveLinkLabel('Harian');
//         });
//     };
//
//     onAlatan = (year, month, jenis) => {
//         let tarikh = new Date(year, month);
//         this.setState({myDate: tarikh, idAlat: jenis});
//         fetch(global.ipServer + `report/find_alatan_report?` +
//             `year=${encodeURIComponent(tarikh.toLocaleDateString())}` +
//             `&month=${encodeURIComponent(month)}` +
//             `&cawangan=${encodeURIComponent(this.props.searchQuery.branch.id)}` +
//             `&jenis=${encodeURIComponent(jenis)}` +
//             `&lokasi=${encodeURIComponent(this.props.searchQuery.lokasi)}`, {
//             method: 'GET',
//             headers: {
//                 'x-access-token': global.token
//             },
//         }).then((response) => response.json()).then((result) => {
//             this.setState({showResult: 'alatan', dataAlatan: result});
//             reportMenu.changeActiveLinkLabel('Alatan');
//         });
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
//         var worksheet_data5 = document.getElementById("table-to-xls5");
//         var worksheet5 = XLSX.utils.table_to_sheet(worksheet_data5);
//         workbook.SheetNames.push("Table 5");
//         workbook.Sheets["Table 5"] = worksheet5;
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
//         });
//     };
//
//     render() {
//         const {laporan, jumlahKutipan, payment, kutipan, resit, serapan} = this.state;
//         let dateParam = new Date(this.props.searchQuery.tarikh);
//         let month = dateParam.toLocaleString('default', {month: 'long'});
//         let year = dateParam.getFullYear();
//         let getDate = month + ', ' + year;
//
//         let bilanganAlatBerjaya = laporan.reduce(function (a, b) {
//             return (parseFloat(a) + parseFloat(b['bilanganAlatBerjaya']));
//         }, 0);
//         let kutipanFiBerjaya = laporan.reduce(function (a, b) {
//             return (parseFloat(a) + parseFloat(b['kutipanFiBerjaya'])).toFixed(2);
//         }, 0);
//         let bilanganAlatGagal = laporan.reduce(function (a, b) {
//             return (parseFloat(a) + parseFloat(b['bilanganAlatGagal']));
//         }, 0);
//         let kutipanFiGagal = laporan.reduce(function (a, b) {
//             return (parseFloat(a) + parseFloat(b['kutipanFiGagal'])).toFixed(2);
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
//             kutipanObj['feePenentuanAlat'] += parseFloat(payment[i]["data"][feePenentuanAlat].jumlah)
//             kutipanObj['bayaranHalfFee'] += parseFloat(payment[i]["data"][bayaranHalfFee].jumlah)
//             kutipanObj['cajMenunggu'] += parseFloat(payment[i]["data"][cajMenunggu].jumlah)
//             kutipanObj['cajPenentuanPremisPelanggan'] += parseFloat(payment[i]["data"][cajPenentuanPremisPelanggan].jumlah)
//             kutipanObj['tuntutanPegawai'] += parseFloat(payment[i]["data"][tuntutanPegawai].jumlah)
//             kutipanObj['tuntutanLori'] += parseFloat(payment[i]["data"][tuntutanLori].jumlah)
//             kutipanObj['borangE'] += parseFloat(payment[i]["data"][borangE].jumlah)
//             kutipanObj['bayaranLaporanPenentuan'] += parseFloat(payment[i]["data"][bayaranLaporanPenentuan].jumlah)
//             kutipanObj['sewaanAlatPenentuan'] += parseFloat(payment[i]["data"][sewaanAlatPenentuan].jumlah)
//             kutipanObj['lainLain'] += parseFloat(payment[i]["data"][lainLain].jumlah)
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
//         let jumlahKutipanx = Object.values(kutipanObj).reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
//         jumlahKutipanx = Math.round((jumlahKutipanx + Number.EPSILON) * 100) / 100;
//
//         let jumlahKeseluruhan = Math.round((jumlahKutipanx + gstKutipan + Number.EPSILON) * 100) / 100;
//         jumlahKeseluruhan = Math.round((jumlahKeseluruhan + pelarasan + Number.EPSILON) * 100) / 100;
//
//         let idx = 0;
//
//         if (this.state.showResult === 'daily') {
//             return (
//                 <Redirect to={{
//                     pathname: '/report/daily',
//                     state: {
//                         searchResult: this.state.dataDaily,
//                         searchQuery: {
//                             'branch': this.props.searchQuery.branch,
//                             'lokasi': this.props.searchQuery.lokasi === 'Keseluruhan' ? 'all' : this.props.searchQuery.lokasi === 'Dalam' ? 'dalam' : this.props.searchQuery.lokasi === 'Luar' ? 'luar' : 'stampingStation',
//                             'tarikh': this.state.myDate.toLocaleDateString()
//                         }
//                     }
//                 }}/>
//             )
//         } else if (this.state.showResult === 'monthly') {
//             let jumlahAlat = 0;
//             let jumlahTentusah = 0;
//             return (
//                 <ReactCSSTransitionGroup
//                     componentPentadbiran="div"
//                     transitionName="TabsAnimation"
//                     transitionAppear={true}
//                     transitionAppearTimeout={0}
//                     transitionEnter={false}
//                     transitionLeave={false}>
//                     <Card className="main-card mb-3">
//                         <CardBody>
//                             {/*<CSVLink data={this.state.laporan} filename={this.props.searchQuery.cawangan+'-'+this.props.searchQuery.tarikh}>*/}
//                             {/*    <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary">*/}
//                             {/*        <AnimationDiv style={{display: 'inline-block'}}>*/}
//                             {/*            <FontAwesomeIcon className="mr-2" icon={faFileCsv}/> </AnimationDiv>*/}
//                             {/*        CSV*/}
//                             {/*    </Button>*/}
//                             {/*</CSVLink>*/}
//                             <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
//                                     onClick={this.exportExcel}>
//                                 <AnimationDiv style={{display: 'inline-block'}}>
//                                     <FontAwesomeIcon className="mr-2" icon={faFileExcel}/> </AnimationDiv>
//                                 EXCEL
//                             </Button>
//                             <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
//                                     onClick={() => {
//                                         this.pdfExportComponent.save();
//                                     }}>
//                                 <AnimationDiv style={{display: 'inline-block'}}>
//                                     <FontAwesomeIcon className="mr-2" icon={faFilePdf}/> </AnimationDiv>
//                                 PDF
//                             </Button>
//                             <PDFExport
//                                 fileName={this.props.searchQuery.branch.kawasan + '-' + this.props.searchQuery.tarikh}
//                                 scale={0.5}
//                                 paperSize="A4"
//                                 landscape={true}
//                                 margin="1cm"
//                                 ref={(componentPentadbiran) => this.pdfExportComponent = componentPentadbiran}
//                             >
//                                 <Row>
//                                     <Col md={12}><b>Jadual 1.0 Laporan Bulanan Penentusahan Dan Penentusahan
//                                         Semula
//                                         Peringkat
//                                         Cawangan</b></Col>
//                                     <Col md={12}><b>Cawangan
//                                         : {this.props.searchQuery.branch.kawasan} &nbsp;&nbsp; Jenis
//                                         Kerja
//                                         : {this.props.searchQuery.lokasi} </b></Col>
//                                     <Col md={12}>
//
//                                         <Form inline>
//                                             <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
//                                                 <b className="mr-2">Pecahan mengikut hari:</b>
//
//                                                 <Input type="select" name="hari" required bsSize="sm"
//                                                        onChange={(dataEl) => {
//                                                            this.onDay(year, dateParam.getMonth(), parseInt(dataEl.target.value))
//                                                        }}
//                                                 >
//                                                     <option key={''} value={''} disabled selected>All</option>
//                                                     {this.dayHtml(year, dateParam.getMonth() + 1)}
//                                                 </Input>
//                                             </FormGroup>
//                                         </Form>
//                                     </Col>
//                                     <Col>
//                                         <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
//                                             <thead>
//                                             <tr>
//                                                 <th rowSpan={3}
//                                                     style={{textAlign: 'center', width: '50px'}}>No
//                                                 </th>
//                                                 <th rowSpan={3}
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'jenisAlat',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Nama Alat <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'jenisAlat' ? this.state.sortIcon.jenisAlat : faSort}/></span>
//                                                 </th>
//                                                 <th colSpan={4} style={{textAlign: 'center'}}>Tentusahan</th>
//                                             </tr>
//                                             <tr>
//                                                 <th colSpan={2}>Berjaya</th>
//                                                 <th colSpan={2}>Gagal</th>
//                                             </tr>
//                                             <tr>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'bilanganAlatBerjaya',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Bilangan Alat <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'bilanganAlatBerjaya' ? this.state.sortIcon.bilanganAlatBerjaya : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'kutipanFiBerjaya',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Kutipan Fi <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'kutipanFiBerjaya' ? this.state.sortIcon.kutipanFiBerjaya : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'bilanganAlatGagal',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Bilangan Alat <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'bilanganAlatGagal' ? this.state.sortIcon.bilanganAlatGagal : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'kutipanFiGagal',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'laporan')
//                                                     }}>Kutipan Fi <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'kutipanFiGagal' ? this.state.sortIcon.kutipanFiGagal : faSort}/></span>
//                                                 </th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//                                             {laporan.map((value, index) => {
//                                                 return (
//                                                     <tr key={index}>
//                                                         <td style={{textAlign: 'center'}}>{index + 1}</td>
//                                                         <td>
//                                                             <span style={{
//                                                                 color: 'blue',
//                                                                 textDecoration: 'underline',
//                                                                 cursor: 'pointer'
//                                                             }} onClick={(dataEl) => {
//                                                                 this.onAlatan(year, dateParam.getMonth() + 1, value.idAlat)
//                                                             }}>
//                                                                 {value.jenisAlat}
//                                                             </span>
//                                                         </td>
//                                                         <td>{value.bilanganAlatBerjaya}</td>
//                                                         <td>RM {value.kutipanFiBerjaya.toFixed(2)}</td>
//                                                         <td>{value.bilanganAlatGagal}</td>
//                                                         <td>RM {value.kutipanFiGagal.toFixed(2)}</td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                             </tbody>
//                                             <tfoot>
//                                             <tr>
//                                                 <td colSpan={2}>Jumlah Keseluruhan</td>
//                                                 <td>{bilanganAlatBerjaya}</td>
//                                                 <td>RM {kutipanFiBerjaya}</td>
//                                                 <td>{bilanganAlatGagal}</td>
//                                                 <td>RM {kutipanFiGagal}</td>
//                                             </tr>
//                                             {/*divider comment for dev*/}
//                                             <tr>
//                                                 <td colSpan={3} style={{border: 'unset'}}/>
//                                             </tr>
//                                             <tr>
//                                                 <td colSpan={3} style={{border: 'unset'}}/>
//                                             </tr>
//                                             <tr>
//                                                 <td colSpan={3}><b>Berikut adalah jumlah kutipan yang diperoleh</b></td>
//                                             </tr>
//                                             <tr>
//                                                 <td colSpan={2}>01. Jumlah Kutipan untuk Alat yang sudah dibayar
//                                                     berdasarkan
//                                                     sijil D
//                                                     :
//                                                     (tanpa
//                                                     SST)
//                                                 </td>
//                                                 <td>RM {jumlahKutipan.jumlahSudahDibayar}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td colSpan={2}>02. Jumlah Kutipan untuk Alat yang belum dibayar
//                                                     berdasarkan
//                                                     sijil D
//                                                     :
//                                                     (tanpa
//                                                     SST)
//                                                 </td>
//                                                 <td>RM {jumlahKutipan.jumlahBelumDibayar}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td colSpan={2}>03. Jumlah Kutipan untuk Alat yang dikutip berdasarkan
//                                                     invois cukai
//                                                     : (tanpa
//                                                     SST)
//                                                 </td>
//                                                 <td>RM {jumlahKutipan.jumlahSemua}</td>
//                                             </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </Col>
//                                 </Row>
//
//                                 <Row>
//                                     <Col md={12}><b>Kutipan Sebenar Cawangan
//                                         : {this.props.searchQuery.branch.kawasan}</b></Col>
//                                     <Col md={12}><b>Bulan Bayaran : {getDate}</b></Col>
//                                     <Col md={6}>
//                                         <Table striped bordered hover id={'table-to-xls2'}>
//                                             <thead>
//                                             <tr>
//                                                 <th width={'90%'}>Bayaran Perkhidmatan De Metrology</th>
//                                                 <th>Kutipan(RM)</th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//
//                                             <tr>
//                                                 <td>01. Fee Penentuan Alat (+Sijil)
//                                                 </td>
//                                                 <td> {kutipanObj.feePenentuanAlat.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>02. Bayaran 1/2 Fee
//                                                 </td>
//                                                 <td> {kutipanObj.bayaranHalfFee.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>03. Caj Menunggu
//                                                 </td>
//                                                 <td> {kutipanObj.cajMenunggu.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>04. Caj Penentuan di Premis Pelanggan
//                                                 </td>
//                                                 <td> {kutipanObj.cajPenentuanPremisPelanggan.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>05. Tuntuan Pegawai
//                                                 </td>
//                                                 <td> {kutipanObj.tuntutanPegawai.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>06. Tuntutan Lori
//                                                 </td>
//                                                 <td> {kutipanObj.tuntutanLori.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>07. Borang E
//                                                 </td>
//                                                 <td> {kutipanObj.borangE.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>08. Bayaran Laporan Penentuan
//                                                 </td>
//                                                 <td> {kutipanObj.bayaranLaporanPenentuan.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>09. Sewaan Alat Penentuan
//                                                 </td>
//                                                 <td> {kutipanObj.sewaanAlatPenentuan.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>10. Terima Pelbagai
//                                                 </td>
//                                                 <td> {kutipanObj.terimaPelbagai.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>11. Sewaan Alat Pembaik
//                                                 </td>
//                                                 <td> {kutipanObj.sewaanAlatPembaik.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td>12. Lain-lain
//                                                 </td>
//                                                 <td> {kutipanObj.lainLain.toFixed(2)}</td>
//                                             </tr>
//                                             </tbody>
//                                             <tfoot>
//                                             <tr>
//                                                 <td style={{textAlign: 'right'}}>Jumlah (RM)</td>
//                                                 <td> {jumlahKutipanx.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td style={{textAlign: 'right'}}>SST @ 0.06% (RM)</td>
//                                                 <td> {gstKutipan.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td style={{textAlign: 'right'}}>Pelarasan (RM)</td>
//                                                 <td> {pelarasan.toFixed(2)}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td style={{textAlign: 'right'}}>Jumlah Keseluruhan (RM)</td>
//                                                 <td> {jumlahKeseluruhan.toFixed(2)}</td>
//                                             </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </Col>
//                                 </Row>
//
//                                 <Row>
//                                     <Col md={12} style={{textAlign: 'center'}}><b>Senarai Resit Bayaran</b></Col>
//                                     <Col>
//                                         <Table striped bordered hover id={'table-to-xls3'}>
//                                             <thead>
//                                             <tr>
//                                                 <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
//                                                 <th rowSpan={2}
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'jenisResit',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}>No Resit <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'jenisResit' ? this.state.sortIcon.jenisResit : faSort}/></span>
//                                                 </th>
//                                                 <th rowSpan={2}
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'payer',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}>Pembayar <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'payer' ? this.state.sortIcon.payer : faSort}/></span>
//                                                 </th>
//                                                 {/*<th rowSpan={2}>Status</th>*/}
//                                                 <th colSpan={13}>Maklumat Pembayaran(RM) *Sila lihat pada jadual di atas
//                                                     untuk panduan bayaran
//                                                 </th>
//                                             </tr>
//                                             <tr>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'feePenentuanAlat',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'feePenentuanAlat' ? this.state.sortIcon.feePenentuanAlat : faSort}/></span>01
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'bayaranHalfFee',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'bayaranHalfFee' ? this.state.sortIcon.bayaranHalfFee : faSort}/></span>02
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'cajMenunggu',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'cajMenunggu' ? this.state.sortIcon.cajMenunggu : faSort}/></span>03
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'cajPenentuanPremisPelanggan',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'cajPenentuanPremisPelanggan' ? this.state.sortIcon.cajPenentuanPremisPelanggan : faSort}/></span>04
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'tuntutanPegawai',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanPegawai' ? this.state.sortIcon.tuntutanPegawai : faSort}/></span>05
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'borangE',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'borangE' ? this.state.sortIcon.borangE : faSort}/></span>06
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'tuntutanLori',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'tuntutanLori' ? this.state.sortIcon.tuntutanLori : faSort}/></span>07
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'bayaranLaporanPenentuan',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'bayaranLaporanPenentuan' ? this.state.sortIcon.bayaranLaporanPenentuan : faSort}/></span>08
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'sewaanAlatPenentuan',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'sewaanAlatPenentuan' ? this.state.sortIcon.sewaanAlatPenentuan : faSort}/></span>09
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'lainLain',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'lainLain' ? this.state.sortIcon.lainLain : faSort}/></span>10
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'cukai',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'cukai' ? this.state.sortIcon.cukai : faSort}/></span>Cukai
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'adj',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'adj' ? this.state.sortIcon.adj : faSort}/></span>Adj
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'pgwai',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'resit')
//                                                     }}><span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'pgwai' ? this.state.sortIcon.pgwai : faSort}/></span>Pegawai
//                                                 </th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//                                             {resit.map((value, index) => {
//                                                 return (
//                                                     <tr key={index}>
//                                                         <td style={{textAlign: 'center'}}>{index + 1}</td>
//                                                         <td>{value.jenisResit}</td>
//                                                         <td>{value.payer}</td>
//                                                         <td>{value.feePenentuanAlat}
//                                                         </td>
//                                                         <td>{value.bayaranHalfFee}
//                                                         </td>
//                                                         <td>{value.cajMenunggu}
//                                                         </td>
//                                                         <td>{value.cajPenentuanPremisPelanggan}
//                                                         </td>
//                                                         <td>{value.tuntutanPegawai}
//                                                         </td>
//                                                         <td>{value.borangE}
//                                                         </td>
//                                                         <td>{value.tuntutanLori}
//                                                         </td>
//                                                         <td>{value.bayaranLaporanPenentuan}
//                                                         </td>
//                                                         <td>{value.sewaanAlatPenentuan}
//                                                         </td>
//                                                         <td>{value.lainLain}
//                                                         </td>
//                                                         <td>{
//                                                             value.cukai}
//                                                         </td>
//                                                         <td>{
//                                                             value.adj}
//                                                         </td>
//                                                         <td>{value.pgwai}
//                                                         </td>
//                                                     </tr>
//                                                 );
//                                             })
//                                             }
//                                             </tbody>
//                                             <tfoot>
//                                             <tr>
//                                                 <td colSpan={3}>Jumlah</td>
//                                                 <td>{this.state.jumlah1.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah2.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah3.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah4.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah5.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah6.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah7.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah8.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah9.toFixed(2)}</td>
//                                                 <td>{this.state.jumlah10.toFixed(2)}</td>
//                                                 <td>{this.state.jumlahCukai.toFixed(2)}</td>
//                                                 <td>{this.state.jumlahAdj.toFixed(2)}</td>
//                                                 <td/>
//                                             </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </Col>
//                                 </Row>
//
//                                 <Row>
//                                     <Col md={12} style={{textAlign: 'center'}}><b>Senarai Kutipan berdasarkan
//                                         Resit</b></Col>
//                                     <Col>
//                                         <Table striped bordered hover id={'table-to-xls4'}>
//                                             <thead>
//                                             <tr>
//                                                 <th style={{textAlign: 'center', width: '50px'}} rowSpan={2}>No</th>
//                                                 <th rowSpan={2}
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'noResit',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>No Resit <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'noResit' ? this.state.sortIcon.noResit : faSort}/></span>
//                                                 </th>
//                                                 <th rowSpan={2}
//                                                     style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'pembayar',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Pembayar <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'pembayar' ? this.state.sortIcon.pembayar : faSort}/></span>
//                                                 </th>
//                                                 <th colSpan={6} style={{textAlign: 'center'}}>Kaedah Bayaran (RM)
//                                                 </th>
//                                             </tr>
//                                             <tr>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'tunai',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Tunai <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'tunai' ? this.state.sortIcon.tunai : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'online',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Online <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'online' ? this.state.sortIcon.online : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'cek',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Cek <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'cek' ? this.state.sortIcon.cek : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'butiranCek',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Butiran Cek <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'butiranCek' ? this.state.sortIcon.butiranCek : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'serapan',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Serapan <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'serapan' ? this.state.sortIcon.serapan : faSort}/></span>
//                                                 </th>
//                                                 <th style={{position: 'relative'}}
//                                                     onClick={() => {
//                                                         this.sorting({
//                                                             id: 'peg',
//                                                             desc: !this.state.sortObj.desc
//                                                         }, 'kutipan')
//                                                     }}>Pegawai <span style={{
//                                                     position: 'absolute',
//                                                     right: '7px',
//                                                     color: '#858789'
//                                                 }}><FontAwesomeIcon
//                                                     icon={Object.keys(this.state.sortIcon)[0] === 'peg' ? this.state.sortIcon.peg : faSort}/></span>
//                                                 </th>
//                                             </tr>
//                                             </thead>
//                                             {kutipan.map((value, index) => {
//                                                 return (
//                                                     <tbody>
//                                                     <tr key={index}>
//                                                         <td style={{textAlign: 'center'}}>{idx = idx + 1}</td>
//                                                         <td>{value.noResit}</td>
//                                                         <td>{value.pembayar}</td>
//                                                         <td>{value.tunai}</td>
//                                                         <td>-</td>
//                                                         <td>{value.cek}</td>
//                                                         <td>{value.butiranCek}</td>
//                                                         <td>-</td>
//                                                         <td>{value.peg}</td>
//                                                     </tr>
//                                                     <tr key={index}>
//                                                         <td style={{textAlign: 'center'}}>{idx = idx + 1}</td>
//                                                         <td>{value.noResit}</td>
//                                                         <td>{value.pembayar}</td>
//                                                         <td>-</td>
//                                                         <td>-</td>
//                                                         <td>-</td>
//                                                         <td>-</td>
//                                                         <td>{value.serapan}</td>
//                                                         <td>{value.peg}</td>
//                                                     </tr>
//                                                     </tbody>
//                                                 )
//                                             })
//                                             }
//                                             <tfoot>
//                                             <tr>
//                                                 <td colSpan={3}>Jumlah</td>
//                                                 <td>{this.state.jumlahTunai.toFixed(2)}</td>
//                                                 <td>{this.state.jumlahOnline.toFixed(2)}</td>
//                                                 <td>{this.state.jumlahCek.toFixed(2)}</td>
//                                                 <td>-</td>
//                                                 <td>{this.state.jumlahSerapan.toFixed(2)}</td>
//
//                                                 <td>{(this.state.jumlahTunai + this.state.jumlahCek + this.state.jumlahOnline + this.state.jumlahSerapan).toFixed(2)}</td>
//                                             </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </Col>
//                                 </Row>
//
//                                 <Row>
//                                     <Col md={12} style={{textAlign: 'center'}}><b>Laporan Jumlah Penentusahan
//                                         Keseluruhan Cawangan</b></Col>
//                                     <Col>
//                                         <Table striped bordered hover id={'table-to-xls5'} style={{border: 'unset'}}>
//                                             <thead>
//                                             <tr>
//                                                 <th
//                                                     style={{textAlign: 'center', width: '50px'}}>No
//                                                 </th>
//                                                 <th>Kategori Alat</th>
//                                                 <th>Jumlah Alat</th>
//                                                 <th>Jumlah Fi Penentusahan</th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//                                             {serapan.map((value, index) => {
//                                                 jumlahAlat += value.jumlahAlat
//                                                 jumlahTentusah += value.jumlahFiPenentusahan
//                                                 return (
//                                                     <tr key={index}>
//                                                         <td style={{textAlign: 'center'}}>{index + 1}</td>
//                                                         <td>{value.kategoriAlat}</td>
//                                                         <td>{value.jumlahAlat}</td>
//                                                         <td>RM {value.jumlahFiPenentusahan.toFixed(2)}</td>
//                                                     </tr>
//                                                 );
//                                             })}
//                                             </tbody>
//                                             <tfoot>
//                                             <tr>
//                                                 <td/>
//                                                 <td>Jumlah</td>
//                                                 <td>{jumlahAlat}</td>
//                                                 <td>RM {jumlahTentusah.toFixed(2)}</td>
//                                             </tr>
//                                             </tfoot>
//                                         </Table>
//                                     </Col>
//                                 </Row>
//                             </PDFExport>
//                         </CardBody>
//                     </Card>
//                 </ReactCSSTransitionGroup>
//             );
//         } else {
//             return (
//                 <Redirect to={{
//                     pathname: '/report/alatan',
//                     state: {
//                         searchResult: this.state.dataAlatan,
//                         searchQuery: {
//                             'branch': this.props.searchQuery.branch,
//                             'lokasi': this.props.searchQuery.lokasi === 'Keseluruhan' ? 'all' : this.props.searchQuery.lokasi === 'Dalam' ? 'dalam' : this.props.searchQuery.lokasi === 'Luar' ? 'luar' : 'stampingStation',
//                             'tarikh': this.state.myDate,
//                             'month': this.state.myDate.getMonth(),
//                             'jenisAlat': this.state.idAlat
//                         }
//                     }
//                 }}/>
//             )
//         }
//     }
//
// }
