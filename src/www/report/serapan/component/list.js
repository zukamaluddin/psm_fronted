import React from 'react';
import {
    Button,
    Card,
    CardBody, Col, Row, Table,
} from "reactstrap";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {AnimationDiv} from "../../daily/component/list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFileExcel, faFilePdf} from "@fortawesome/free-solid-svg-icons";
import {PDFExport} from "@progress/kendo-react-pdf";
import XLSX from 'xlsx'

export default class SerapanList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            laporan: [], jumlahKutipan: {}, payment: {},
            page: 0, sorted: [{id: 'date_created', desc: true}],
            showResult: 'yearly', myDate: null, dataMonthly: {}, dataAlatan: {},
            set: {
                sorted: [{id: 'date_created', desc: true}],
                page: 0,
                pageSize: 10,
            },
        };
        this.exportExcelFile = this.exportExcelFile.bind(this);
    }


    componentDidMount = async () => {
        this.setState({
            laporan: this.props.searchResult.laporan,
            jumlahKutipan: this.props.searchResult.jumlahKutipan,
            payment: this.props.searchResult.payment,
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
        return XLSX.writeFile(workbook, 'Laporan '+ this.props.searchQuery.tarikh + '.xlsx');
    };

    render() {
        const {laporan} = this.state;
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
                            fileName={'Laporan '+ this.props.searchQuery.tarikh}
                            scale={0.5}
                            paperSize="A4"
                            margin="1cm"
                            ref={(component) => this.pdfExportComponent = component}
                        >
                            <Row>
                                <Col md={12}><b>Laporan Jumlah Penentusahan Keseluruhan Cawangan</b></Col>
                                <Col>
                                    <Table striped bordered hover id={'table-to-xls'} style={{border: 'unset'}}>
                                        <thead>
                                        <tr>
                                            <th
                                                style={{textAlign: 'center', width: '50px'}}>No
                                            </th>
                                            <th>Kategori Alat</th>
                                            <th>Jumlah Alat</th>
                                            <th >Jumlah Fi Penentusahan</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {laporan.map((value, index) => {
                                            jumlahAlat +=value.jumlahAlat
                                            jumlahTentusah +=value.jumlahFiPenentusahan
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
    }

}
