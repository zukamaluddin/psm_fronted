import React from 'react';
import {
    Button, Table, Container, Row, Col,
    Card,
    CardBody,
} from "reactstrap";
import styled, {keyframes} from "styled-components";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSort, faSortUp, faSortDown, faFileExcel, faFilePdf} from '@fortawesome/free-solid-svg-icons';
import {tada} from 'react-animations';
import {PDFExport} from '@progress/kendo-react-pdf';
import XLSX from 'xlsx'
import moment from "moment";

export const tadaAnimation = keyframes`${tada}`;
export const AnimationDiv = styled.div`
  animation: infinite 1s ${tadaAnimation};
`;

export default class AlatanList extends React.Component {
    pdfExportComponent;

    constructor(props) {
        super(props);
        this.state = {
            laporan: [],
            page: 0, sortObj: {id: 'tarikh', desc: true},
            sortIcon: {tarikh: faSort},
            set: {
                page: 0,
                pageSize: 10,
            },
        };
        this.exportExcelFile = this.exportExcelFile.bind(this);
    }


    componentDidMount = async () => {
        this.setState({
            laporan: this.props.searchResult.laporan,
            totalpagenum: 0,
            loading: false,
        });

    };


    exportExcel = () => {
        var workbook = XLSX.utils.book_new();
        var worksheet_data = document.getElementById("table-to-xls");
        var worksheet = XLSX.utils.table_to_sheet(worksheet_data,{raw:true});
        workbook.SheetNames.push("Table 1");
        workbook.Sheets["Table 1"] = worksheet;

        this.exportExcelFile(workbook);
    };
    exportExcelFile = (workbook) => {
        return XLSX.writeFile(workbook, this.props.searchQuery.cawangan + '-' + this.props.searchQuery.tarikh + '.xlsx');
    };


    sorting = (sortParam) => {
        let Report = this.state.laporan;
        this.setState({sortObj: sortParam}, () => {
            sortParam.desc ? Report.sort((a, b) => (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? -1 : 0) : Report.sort((a, b) => (a[this.state.sortObj.id] > b[this.state.sortObj.id]) ? 1 : (a[this.state.sortObj.id] < b[this.state.sortObj.id]) ? -1 : 0);

            let sortVar = {};

            sortParam.desc ? sortVar[sortParam.id] = faSortDown : sortVar[sortParam.id] = faSortUp;

            this.setState({laporan: Report, sortIcon: sortVar})
        });


    };

    render() {
        const {laporan} = this.state;

        let jumlahGagal = laporan.filter(({tentusahan}) => tentusahan === 'Gagal').reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100 //because .toFixed(2) sometimes rounding incorectly
        }, 0);
        let jumlahLulus = laporan.filter(({tentusahan}) => tentusahan !== 'Gagal').reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);
        let jumlahSemua = laporan.reduce(function (a, b) {
            return Math.round((parseFloat(a) + parseFloat(b['fiAlat']) + Number.EPSILON) * 100) / 100
        }, 0);


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
                        {/*<CSVLink data={laporan} filename={this.props.searchQuery.cawangan+'-'+this.props.searchQuery.tarikh}>*/}
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
                            fileName={this.props.searchQuery.cawangan + '-' + this.props.searchQuery.tarikh}
                            scale={0.5}
                            paperSize="A4"
                            landscape={true}
                            margin="1cm"
                            ref={(component) => this.pdfExportComponent = component}
                        >
                            <Row>
                                <Col md={12}><b>Jadual 1.0 Laporan Harian Penentusahan Dan Penentusahan Semula Peringkat
                                    Cawangan</b></Col>
                                <Col md={12}><b>Cawangan : {this.props.searchQuery.cawangan} &nbsp;&nbsp; Jenis Kerja
                                    : {this.props.searchQuery.lokasi} </b></Col>
                                <Col>
                                    <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
                                        <thead>
                                        <tr>
                                            <th width={'3%'}>No.</th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tarikh',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Tarikh
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'tarikh' ? this.state.sortIcon.tarikh : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pembaik',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Pembaik
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'pembaik' ? this.state.sortIcon.pembaik : faSort}/></span></th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pemilik',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Pemilik
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'pemilik' ? this.state.sortIcon.pemilik : faSort}/></span></th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'alamatPemilik',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Alamat Pemilik
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'alamatPemilik' ? this.state.sortIcon.alamatPemilik : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'5%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenama',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Jenama
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'jenama' ? this.state.sortIcon.jenama : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'4%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'jenis',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Jenis
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'jenis' ? this.state.sortIcon.jenis : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'4%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'had',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Had
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'had' ? this.state.sortIcon.had : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'4%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'siriAlat',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Siri Alat
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'siriAlat' ? this.state.sortIcon.siriAlat : faSort}/></span></th>
                                            <th style={{position: 'relative'}} width={'6%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'rujukan',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Rujukan
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'rujukan' ? this.state.sortIcon.rujukan : faSort}/></span></th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'stiker',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Stiker
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'stiker' ? this.state.sortIcon.stiker : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'5%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'sijil',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Sijil D
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'sijil' ? this.state.sortIcon.sijil : faSort}/></span>
                                            </th>
                                            <th style={{position: 'relative'}} width={'7%'}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'tentusahan',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Tentusahan
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'tentusahan' ? this.state.sortIcon.tentusahan : faSort}/></span></th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'pegawai',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Pegawai
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon
                                                    icon={Object.keys(this.state.sortIcon)[0] === 'pegawai' ? this.state.sortIcon.pegawai : faSort}/></span></th>
                                            <th style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'invois',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Invois
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'invois' ? this.state.sortIcon.invois : faSort}/></span>
                                            </th>
                                            <th width={'10%'}
                                                style={{position: 'relative'}}
                                                onClick={() => {
                                                    this.sorting({
                                                        id: 'fiAlat',
                                                        desc: !this.state.sortObj.desc
                                                    })
                                                }}
                                            >Fi Alat
                                                <span style={{
                                                    position: 'absolute',
                                                    right: '7px',
                                                    color: '#858789'
                                                }}><FontAwesomeIcon icon={Object.keys(this.state.sortIcon)[0] === 'fiAlat' ? this.state.sortIcon.fiAlat : faSort}/></span>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {laporan.map((value, index) => {
                                            let myDate = new Date(value.tarikh);
                                            return (
                                                <tr key={index}>
                                                    <td style={{textAlign: 'center'}}>{index + 1}</td>
                                                    <td style={{textAlign: 'center'}}>{moment(myDate).format('DD/MM/YYYY')}</td>
                                                    <td>{value.pembaik}</td>
                                                    <td>{value.pemilik}</td>
                                                    <td>{value.alamatPemilik}</td>
                                                    <td>{value.jenama}</td>
                                                    <td>{value.jenis}</td>
                                                    <td>{value.had}</td>
                                                    <td>{value.siriAlat}</td>
                                                    <td>{value.rujukan}</td>
                                                    <td>{value.stiker}</td>
                                                    <td>{value.sijil}</td>
                                                    <td>{value.tentusahan}</td>
                                                    <td>{value.pegawai}</td>
                                                    <td>{value.invois}</td>
                                                    <td>RM {value.fiAlat}</td>
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
