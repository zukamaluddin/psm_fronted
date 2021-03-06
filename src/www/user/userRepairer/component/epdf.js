import {
    Button, Col, Container, Form, FormFeedback,
    FormGroup, Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader, Row
} from "reactstrap";
import React from "react";
import API from "../../../../utils/apiRepairer";
import {DropdownList} from "react-widgets";
import {Bounce, toast} from "react-toastify";
import moment from "moment";
import DatePicker from "react-datepicker/es";

const fontFamily = 'italic'
const headerBold = {fontSize: "12pt", fontFamily: fontFamily, fontWeight: 'bold'}
const headerNormal = {fontSize: "12pt", fontFamily: fontFamily}
const headerSmall = {fontSize: "10pt", fontFamily: fontFamily}
export default class PdfModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalData: {},
            selectedState: ''
        };
        this.showModalEdit = this.showModalEdit.bind(this);
        this.hideModalEdit = this.hideModalEdit.bind(this);
    }

    showModalEdit = async (data) => {
        let result = await API.viewLantikan(data.original.id);
        this.setState({modalData: result.data, activeModal: true})
    };

    hideModalEdit() {
        this.setState({activeModal: false})
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


    editBranch(id) {
        let data = {
            id: id,
            staffName: this.state.modalData.name,
            staffId: this.state.modalData.staffId,
            dateAssigned: moment(this.state.modalData.dateAssigned).format('D/M/YYYY'),
            dateStart: moment(this.state.modalData.dateStart).format('D/M/YYYY'),
            dateEnd: moment(this.state.modalData.dateEnd).format('D/M/YYYY'),
            jawatanPentadbiran: this.state.modalData.selectedPentadbiranId,
            jawatanGred: this.state.modalData.selectedGredId,
            jawatanLantikan: this.state.modalData.selectedLantikanId,
            jawatanGenerik: this.state.modalData.selectedGenerikId,
            description: this.state.modalData.description,
            referenceNo: this.state.modalData.referenceNo,
            dateLetterLantikan: moment(this.state.modalData.dateLetterLantikan).format('D/M/YYYY'),
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(data));

        return new Promise((resolve, reject) => {
            fetch(global.ipServer + 'lantikan/view/', {
                method: 'PUT',
                body: formData,
                headers: {
                    'x-access-token': global.token
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    this.hideModalEdit()
                    if (data['status'] === 'OK') {
                        this.props.getdata({
                            filtered: [],
                            page: 0,
                            pageSize: 10,
                            sorted: [{id: "date_created", desc: true}]
                        });

                        toast("Rekod berjaya dikemaskini", {
                            transition: Bounce,
                            closeButton: true,
                            autoClose: 2000,
                            position: 'top-right',
                            type: 'success'
                        });
                    } else {
                        toast("Gagal kemaskini data", {
                            transition: Bounce,
                            closeButton: true,
                            autoClose: 2000,
                            position: 'top-right',
                            type: 'error'
                        });
                    }
                })
                .catch((error) => {
                    toast("Ralat", {
                        transition: Bounce,
                        closeButton: true,
                        autoClose: 2000,
                        position: 'top-right',
                        type: 'error'
                    });
                });
        });
    };

    render() {

        return (
            <Modal isOpen={this.state.activeModal} size='lg'>
                <ModalHeader toggle={this.hideModalEdit}>Butiran Perlantikkan </ModalHeader>
                <ModalBody>
                    <div className="book" id="layoutCert">

                        <div className="page">
                            <div className="subpage"><Form>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <Col sm={12}>
                                            <div style={{textAlign: 'right'}}>
                                                <span style={headerBold}>Nombor Rujukan Surat Lantikan : {this.state.modalData.referenceNo}</span><br/>
                                                <span style={headerBold}>Tarikh Surat Lantikan : {this.state.modalData.dateLetterLantikan}</span><br/>
                                                <span style={headerBold}>Tarikh Lantikan : {this.state.modalData.dateAssigned}</span><br/>
                                                <br/><br/>
                                            </div>
                                        </Col>
                                        <div style={{textAlign: 'left'}}>
                                            <span
                                                style={headerBold}> <strong>{this.state.modalData.staffName ? this.state.modalData.staffName.toUpperCase(): this.state.modalData.staffName}</strong>
                                            </span>
                                            <br/>
                                            <span
                                                style={headerBold}> <strong>FAKULTI KEJURUTERAAN</strong>
                                            </span>
                                            <br/>
                                            <br/>
                                            <span
                                                style={headerBold}> <strong>LANTIKKAN SEBAGAI {this.state.modalData.jawatanPentadbiran}</strong>
                                            </span>
                                            {/*<span*/}
                                            {/*    style={headerBold}> <strong>LANTIKKAN SEBAGAI PANEL PENILAI TEKNIKAL PENILAIAN PROPOSAL UTMER 2021/1 NICHE AREA SMART DIGITAL COMMUNITY</strong>*/}
                                            {/*</span>*/}
                                            <br/>
                                            <br/>
                                            <span
                                                style={headerNormal}> Saya dengan segala hormatnya merujuk kepada perkara di atas
                                            </span>
                                            <br/>
                                            <br/>
                                            <span
                                                style={headerNormal}> 2&ensp; Setinggi-tinggi penghargaan dan tahniah diucapkan di atas lantikan sebagai {this.state.modalData.jawatanPentadbiran}, {this.state.modalData.jawatanGred}, &nbsp;
                                                {this.state.modalData.jawatanGenerik} di bawah {this.state.modalData.jawatanLantikan} pada tarikh {this.state.modalData.dateStart} sehingga {this.state.modalData.dateEnd} .&nbsp;
                                                {/*Diharapkan agar penilaian yang telah dibuat membantu meningkatkan kualiti proposal terutama dalam aspek teknologi yang berkaitan dan memastikan projek*/}
                                                {/*yang berkualiti sahaja yang terpilih.*/}
                                            </span>
                                            <br/>
                                            <br/>
                                            <span
                                                style={headerNormal}> 3&ensp; Kerjasama Ybhg. Prof/Prof. Madya/Dr.,didahului dengan ucapan ribuan terima kasih.
                                            </span>
                                            <br/>
                                            <br/>
                                            <br/>
                                            <span
                                                style={headerNormal}>Yang Benar
                                            </span>

                                        </div>
                                    </Col>
                                </FormGroup>
                                {/*<FormGroup row>*/}
                                {/*    <Col sm={12}>*/}
                                {/*        <div style={{textAlign: 'left'}}>*/}
                                {/*            <span*/}
                                {/*                style={headerNormal}>*/}
                                {/*                &ensp;&ensp;&ensp;&ensp;&ensp; Adalah dengan ini diperakui bahawa*/}
                                {/*                ID Staff : {this.state.modalData.staffId},*/}
                                {/*                Tarikh Lantikan : {this.state.modalData.dateAssigned} ,*/}
                                {/*                Tarikh Mula : {this.state.modalData.dateStart},*/}
                                {/*                Tarikh Akhir : {this.state.modalData.dateEnd},*/}
                                {/*                Jawatan Pentadbiran : {this.state.modalData.jawatanPentadbiran},*/}
                                {/*                Jawatan Gred : {this.state.modalData.jawatanGred},*/}
                                {/*                Jawatan Lantikan : {this.state.modalData.jawatanLantikan},*/}
                                {/*                Jawatan Generik : {this.state.modalData.jawatanGenerik},*/}
                                {/*                Catatan : {this.state.modalData.description},*/}
                                {/*                Nombor Rujukan Surat Lantikan : {this.state.modalData.referenceNo},*/}
                                {/*                Tarikh Surat Lantikan : {this.state.modalData.dateLetterLantikan} Telah Menerima Lantikan bla bla bla bla,*/}
                                {/*            </span>*/}
                                {/*            <br/>*/}
                                {/*            <br/> /!*ALAMAT CHECK*!/*/}
                                {/*        </div>*/}
                                {/*    </Col>*/}
                                {/*</FormGroup>*/}
                                <br/>
                                <FormGroup row>
                                    <Col sm={12}>
                                        <div style={{textAlign: 'center'}}>
                                            <span style={headerNormal}> *Cetakan Berkomputer* </span>
                                        </div>
                                    </Col>
                                </FormGroup>
                            </Form>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                            style={{width: '140px'}}
                            onClick={this.printCert}
                    ><i
                        className="lnr-checkmark-circle btn-icon-wrapper"> </i>Muat Turun</Button>
                    <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                            style={{width: '140px'}} outline onClick={this.hideModalEdit}> <i
                        className="lnr-cross-circle btn-icon-wrapper"> </i> Tutup</Button>
                </ModalFooter>
            </Modal>
        );
    }
}
