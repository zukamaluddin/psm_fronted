import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Col,
    Input,
    Table,
    Label,
    ModalHeader,
    ModalBody, CardHeader, Row, FormFeedback, InputGroup, InputGroupAddon, ModalFooter, Modal
} from "reactstrap";
import {AvForm, AvRadio, AvRadioGroup} from "availity-reactstrap-validation";
import {redirectLogout} from "../../../index";
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faFileExcel, faFilePdf} from "@fortawesome/free-solid-svg-icons";
import {userOwnerAccess} from "../../../Layout/AppNav/acessLevel";
import {DropdownList} from "react-widgets";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import {PDFExport} from "@progress/kendo-react-pdf";
import ReactTable from "react-table";
import {AnimationDiv} from "../alatan/component/list";
import XLSX from "xlsx";


export default class List extends React.Component {
    constructor() {
        super();
        this.state = {
            hideTindakan: false,displayTable:'none',
            data: [],
            nomborStiker: '',
            nomborDaftar: '',
            nomborSijil: '',
            nomborResit: '',
            jenisSticker: '',
            pegawaitentusah_id: '',
            pegawaitentusah: '',
            datapegawai:[],
            modal: false,
            selected: {},
        };

        fetch(global.ipServer + "alatan/get_pegawai_all/" + global.global_id, {
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
                        datapegawai: result.data,
                    })
                }

            });
    }

    onSubmit() {
        const formData = new FormData();
        formData.append('nomborStiker', this.state.nomborStiker);
        formData.append("nomborDaftar", this.state.nomborDaftar);
        formData.append("nomborSijil", this.state.nomborSijil);
        formData.append("nomborResit", this.state.nomborResit);
        formData.append("jenisSticker", this.state.jenisSticker);
        formData.append("pegawaitentusah_id", this.state.pegawaitentusah_id);
        return fetch(global.ipServer + 'payment/carian', {
            method: 'POST',
            body: formData,
            headers: {
                'x-access-token': global.token
            }
        }).then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                redirectLogout(response.status, this.props);
                return response.json();
            }
        }).then(response => {
            if (response['status'] == 'OK') {
                this.setState({
                    data: response['data']
                });
            } else {
                this.handleNotification('Rekod tidak berjaya dipaparkan.', 'error');
            }
        })
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        });
    };
    exportExcel = () => {
        var workbook = XLSX.utils.book_new();
        var worksheet_data = document.getElementById("tableCarian");
        var worksheet = XLSX.utils.table_to_sheet(worksheet_data);
        // console.log(workbook)
        worksheet.G1.v = ""; //hide column tindakan
        workbook.SheetNames.push("Table 1");
        workbook.Sheets["Table 1"] = worksheet;
        this.exportExcelFile(workbook);
    };
    exportExcelFile = (workbook) => {
        return XLSX.writeFile(workbook, 'Senarai Maklumat Tentusah' + '.xlsx');
    };
    render() {
        const {data} = this.state;

        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>Carian Maklumat Tentusah</CardTitle>
                                <AvForm>
                                    <FormGroup row>
                                        <Label sm={2}>Nombor Stiker</Label>
                                        <Col sm={2}>
                                            <Input type='select' value={this.state.jenisSticker} onChange={(el) => {
                                                this.setState({jenisSticker: el.target.value});
                                            }}>
                                                <option key={''} value={''} selected={true} disabled>Sila pilih</option>
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
                                            </Input>
                                        </Col>
                                        <Col sm={2}>
                                            <Input type='text' onChange={(el) => {
                                                this.setState({nomborStiker: el.target.value})
                                            }} placeholder={'Taip disini'}></Input>
                                        </Col>
                                        <Label sm={2} style={{textAlign: 'center'}}>Nombor Daftar</Label>
                                        <Col sm={4}>
                                            <Input type='text' onChange={(el) => {
                                                this.setState({nomborDaftar: el.target.value})
                                            }} placeholder={'Taip disini'}></Input>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Label sm={2}>Nombor Sijil/ Borang D</Label>
                                        <Col sm={4}>
                                            <Input type='text' onChange={(el) => {
                                                this.setState({nomborSijil: el.target.value})
                                            }} placeholder={'Taip disini'}></Input>
                                        </Col>
                                        <Label sm={2} style={{textAlign: 'center'}}>No Resit Bayaran</Label>
                                        <Col sm={4}>
                                            <Input type='text' onChange={(el) => {
                                                this.setState({nomborResit: el.target.value})
                                            }} placeholder={'Taip disini'}></Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Pegawai</Label>
                                        <Col sm={4}>
                                            <Input name="pegawaitentusah" type="select" id='pegawaitentusah'
                                                   value={this.state.pegawaitentusah_id}
                                                   onChange={(dataEl) => {
                                                       let index = dataEl.nativeEvent.target.selectedIndex;
                                                       let label = dataEl.nativeEvent.target[index].text;
                                                       this.setState({
                                                           pegawaitentusah: label,
                                                           pegawaitentusah_id: dataEl.target.value,
                                                       });
                                                   }}
                                            >
                                                <option key={''} value={''} disabled>Sila pilih
                                                </option>
                                                {this.state.datapegawai.map(option => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}

                                            </Input>
                                        </Col>
                                    </FormGroup>

                                    <Button style={{width: 140}}
                                            className='mr-1 btn-icon btn-shadow btn-outline float-right' outline
                                            color="primary" onClick={() => {
                                        this.onSubmit();
                                    }}>
                                        <i className="lnr-plus-circle btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Carian
                                    </Button>

                                </AvForm>
                            </CardBody>
                        </Card>
                    </div>
                    <div>
                        <Card style={{padding: '20px', border: '1px solid rgba(32,39,140,0.125)'}}>
                            <div>
                                <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                        onClick={this.exportExcel}>
                                    <AnimationDiv style={{display: 'inline-block'}}>
                                        <FontAwesomeIcon className="mr-2" icon={faFileExcel}/> </AnimationDiv>
                                    EXCEL
                                </Button>
                                <Button size="sm" className="mb-2 mr-2 btn-shine btn-wide btn-pill" color="primary"
                                        onClick={() => {
                                            this.setState({hideTindakan: true}, () => {
                                                this.pdfExportComponent.save();
                                                this.setState({hideTindakan: false});
                                            })

                                        }}>
                                    <AnimationDiv style={{display: 'inline-block'}}>
                                        <FontAwesomeIcon className="mr-2" icon={faFilePdf}/> </AnimationDiv>
                                    PDF
                                </Button>
                            </div>
                            <PDFExport
                                fileName={'Senarai Maklumat Tentusah'}
                                paperSize="A4"
                                ref={(component) => this.pdfExportComponent = component}
                            >
                                <Table style={{textAlign: 'center'}} id={'tableCarian'}>
                                    <thead>
                                    <tr>
                                        <td><b>No.</b></td>
                                        <td><b>Nombor Stiker</b></td>
                                        <td><b>Nombor Daftar</b></td>
                                        <td><b>Nombor Sijil/ Borang D</b></td>
                                        <td><b>No Resit Bayaran</b></td>
                                        <td><b>Cawangan</b></td>
                                        {this.state.hideTindakan ? null : <td><b>Tindakan</b></td>}
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.data.map((item , index) =>
                                    // <tr key={index}>
                                    //     <td>{index + 1}</td>
                                    //     <td>{item.jenisstikerbaru} {item.stikerbaru}</td>
                                    //     <td>{item.nombordaftar}</td>
                                    //     <td>{item.nomborsijil}</td>
                                    //     {/*<td style={{textAlign:'left'}}></td>*/}
                                    //     <td>{(item['alatan.jenisresit'] == 'Auto') ? `DMSB/${item['code_kawasan']}/${item['alatan.resit']}` : `${item['alatan.resit']}`}</td>
                                    //     <td>{item.cawangan}</td>
                                    //     <td>
                                    //         {/*<Button*/}
                                    //         {/*    className="border-0 btn-transition"*/}
                                    //         {/*    outline onClick={() => {*/}
                                    //     </td>
                                    // </tr>
                                    // </thead>
                                    // <tbody>
                                    // {this.state.data.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.jenisstikerbaru} {item.stikerbaru}</td>
                                            <td>{item.nombordaftar}</td>
                                            <td>{item.nomborsijil}</td>
                                            {/*<td style={{textAlign:'left'}}></td>*/}
                                            <td>{(item['alatan.jenisresit'] == 'Auto') ? `DMSB/${item['code_kawasan']}/${item['alatan.resit']}` : `${item['alatan.resit']}`}</td>
                                            <td>{item.cawangan}</td>
                                            {this.state.hideTindakan ? null : <td>
                                                <Button
                                                    className="border-0 btn-transition"
                                                    outline onClick={() => {
                                                    this.setState({selected: item});
                                                    this.toggleModal();
                                                }}
                                                    color="info"><FontAwesomeIcon icon={faEye}/>
                                                </Button>
                                                <Button color="primary" outline className="border-0 btn-transition"
                                                        onClick={() => {
                                                            this.setState({selected: item,displayTable:'block'},()=>{
                                                                this.pdfExportcc.save();
                                                                this.setState({displayTable:'none'})
                                                            })


                                                        }}>
                                                    <FontAwesomeIcon icon={faFilePdf}/>
                                                </Button>
                                                <PDFExport
                                                    scale={1}
                                                    paperSize="A4"
                                                    fileName="Maklumat Tentusah"
                                                    landscape={false}
                                                    margin="1cm"
                                                    ref={(component) => this.pdfExportcc = component}
                                                >
                                                <Table style={{display:this.state.displayTable}}>
                                                    <tbody>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Nombor Rujukan / Tentusah</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['code_kawasan']}-{(this.state.selected['jenis_alatan'] !== undefined) ? this.state.selected['jenis_alatan'].substring(0, 3) : ''}-{this.state.selected['nombordaftar']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Nombor Stiker</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['jenisstikerbaru']} {this.state.selected['stikerbaru']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Nama Pembaik</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['alatan.repairer.name']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Nama Pemilik</td>
                                                        <td style={{textAlign: 'left'}}>{(this.state.selected['owner.name'] === null) ? this.state.selected['alatan.repairer.name'] : this.state.selected['owner.name']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Alamat Pemilik</td>
                                                        <td style={{textAlign: 'left'}}>{(this.state.selected['owner.address'] === null) ? this.state.selected['alatan.repairer.address'] : this.state.selected['owner.address']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Tarikh Tentusah</td>
                                                        <td style={{textAlign: 'left'}}>{(this.state.selected['alatan.date_created'] !== undefined) ? moment(this.state.selected['alatan.date_created']).format('D/M/YYYY') : ''}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Tempat Tentusah</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['alatan.jenistempat']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Jenis Alat</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['jenis_alatan']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Had Alat</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['had']}{this.state.selected['jenishad']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Sijil @ Borang D</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['nomborsijil']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Jenis</td>
                                                        <td style={{textAlign: 'left'}}>Penentusahan {this.state.selected['tentusan']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Fi Tentusah</td>
                                                        <td style={{textAlign: 'left'}}>RM{this.state.selected['caj']}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Resit Bayaran</td>
                                                        <td style={{textAlign: 'left'}}>{(this.state.selected['alatan.jenisresit'] == 'Auto') ? `DMSB/${this.state.selected['code_kawasan']}/${this.state.selected['alatan.resit']}` : `${this.state.selected['alatan.resit']}`}</td>
                                                    </tr>
                                                    <tr>
                                                        <td style={{textAlign: 'left'}}>Ditentusah Oleh</td>
                                                        <td style={{textAlign: 'left'}}>{this.state.selected['pegawai_name']}</td>
                                                    </tr>
                                                    </tbody>
                                                </Table ></PDFExport>
                                            </td>}
                                        </tr>
                                    )}
                                    {(this.state.data.length === 0) &&
                                    <tr>
                                        <td colSpan={7}><b>Tiada Rekod</b></td>
                                    </tr>
                                    }
                                    </tbody>
                                </Table>
                            </PDFExport>
                        </Card>
                    </div>
                </ReactCSSTransitionGroup>


                <Modal size='lg' isOpen={this.state.modal} toggle={this.toggleModal}
                       className={this.props.className}>
                    <ModalHeader toggle={this.toggleModal}>Maklumat Alat
                    </ModalHeader>
                    <ModalBody>
                        <PDFExport
                            scale={1}
                            paperSize="A4"
                            fileName="Maklumat Tentusah"
                            landscape={false}
                            margin="1cm"
                            ref={(component) => this.pdfExportComponent = component}
                        >
                            <Table>
                                <tbody>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Nombor Rujukan / Tentusah</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['code_kawasan']}-{(this.state.selected['jenis_alatan'] !== undefined) ? this.state.selected['jenis_alatan'].substring(0, 3) : ''}-{this.state.selected['nombordaftar']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Nombor Stiker</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['jenisstikerbaru']} {this.state.selected['stikerbaru']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Nama Pembaik</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['alatan.repairer.name']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Nama Pemilik</td>
                                    <td style={{textAlign: 'left'}}>{(this.state.selected['owner.name'] === null) ? this.state.selected['alatan.repairer.name'] : this.state.selected['owner.name']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Alamat Pemilik</td>
                                    <td style={{textAlign: 'left'}}>{(this.state.selected['owner.address'] === null) ? this.state.selected['alatan.repairer.address'] : this.state.selected['owner.address']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Tarikh Tentusah</td>
                                    <td style={{textAlign: 'left'}}>{(this.state.selected['alatan.date_created'] !== undefined) ? moment(this.state.selected['alatan.date_created']).format('D/M/YYYY') : ''}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Tempat Tentusah</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['alatan.jenistempat']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Jenis Alat</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['jenis_alatan']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Had Alat</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['had']}{this.state.selected['jenishad']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Sijil @ Borang D</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['nomborsijil']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Jenis</td>
                                    <td style={{textAlign: 'left'}}>Penentusahan {this.state.selected['tentusan']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Fi Tentusah</td>
                                    <td style={{textAlign: 'left'}}>RM{this.state.selected['caj']}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Resit Bayaran</td>
                                    <td style={{textAlign: 'left'}}>{(this.state.selected['alatan.jenisresit'] == 'Auto') ? `DMSB/${this.state.selected['code_kawasan']}/${this.state.selected['alatan.resit']}` : `${this.state.selected['alatan.resit']}`}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Ditentusah Oleh</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['pegawai_name']}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </PDFExport>
                    </ModalBody>
                    <ModalFooter>
                        <Button style={{width: '140px'}} color="success"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline
                                onClick={() => {
                                    this.pdfExportComponent.save();
                                }}>
                            <FontAwesomeIcon className="mr-2" icon={faFilePdf}/>PDF</Button>
                        <Button style={{width: '140px'}} color="danger"
                                className='mb-2 mr-2 btn-icon btn-shadow btn-outline' outline
                                onClick={() => {

                                    this.toggleModal()
                                }}><i
                            className="lnr-cross btn-icon-wrapper"> </i>Tutup</Button>
                    </ModalFooter>
                </Modal>
            </Fragment>
        );
    }

}
