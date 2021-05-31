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
import {AvForm, AvInput, AvRadio, AvRadioGroup} from "availity-reactstrap-validation";
import {redirectLogout} from "../../../index";
import {equipmentMenu} from "../../../Layout/AppNav/VerticalNavWrapper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarAlt, faEye, faFileExcel, faFilePdf} from "@fortawesome/free-solid-svg-icons";
import {userOwnerAccess} from "../../../Layout/AppNav/acessLevel";
import {DropdownList} from "react-widgets";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import ApiBranch from "../../../utils/apiBranch";
import DatePicker from "react-datepicker";
import PDFExport from "@progress/kendo-react-pdf/dist/npm/PDFExport";
import ApiReport from "../../../utils/apiReport";
import XLSX from "xlsx";
import {AnimationDiv} from "../alatan/component/list";

const initialValid = {
    jenisValid: false,
    datestartValid: false,
    dateendValid: false,
    cawanganValid: false,
};

export default class List extends React.Component {
    constructor() {
        super();
        this.state = {
            hideTindakan: false,
            data: [],
            datestart: new Date(),
            dateend: new Date(),
            cawangan: '',
            jenis: '',
            modal: false,
            selected: {},
            branchData: [],
            jenisData: [],
        };

        fetch(global.ipServer + "alatan/get_jenis/ALL/" + global.global_id, {
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
                        jenisData: result.data,
                    })
                }

            });
    }

    componentDidMount = async () => {
        let branches = [];
        let branch = await ApiReport.getCawangan();
        if (branch.status !== "Failed") {
            this.setState({branchData: branch})
        }
        // await ApiBranch.getAllBranches().then(function (res) {
        //     branches = res.data
        // });
        // this.setState({branchData: branches})
    };

    validate = () => {
        this.setState(initialValid);

        let checkValid = true;

        if (this.state.datestart === '') {
            checkValid = this.toggle('datestart')
        }

        if (this.state.dateend === '') {
            checkValid = this.toggle('dateend')
        }

        if (this.state.cawangan === '') {
            checkValid = this.toggle('cawangan')
        }

        if (this.state.jenis === '') {
            checkValid = this.toggle('jenis')
        }

        return checkValid;
    };

    toggle = name => {
        this.setState({
            [`${name}Valid`]: true
        });
        return false;
    };


    onSubmit() {
        if (this.validate()) {

            const formData = new FormData();
            formData.append('jenis', this.state.jenis);
            formData.append("datestart", moment(this.state.datestart).format("YYYY-MM-DD"));
            formData.append("dateend", moment(this.state.dateend).format("YYYY-MM-DD"));
            formData.append("cawangan", this.state.cawangan);
            return fetch(global.ipServer + 'alatan/carianmaklumat', {
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
        return XLSX.writeFile(workbook, 'Senarai Maklumat Inventori' + '.xlsx');
    };

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
                    <div>
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>Carian Maklumat Tentusah</CardTitle>
                                <AvForm>
                                    <FormGroup row>
                                        <Label sm={2}>Kod Item</Label>
                                        <Col sm={8}>
                                            <AvInput type="select" name="jenis" required
                                                     onChange={(dataEl) => {
                                                         this.setState({jenis: dataEl.target.value});
                                                     }}
                                            >
                                                <option key={''} value={''} disabled>Sila pilih</option>

                                                {this.state.jenisData.map(option => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                ))}

                                            </AvInput>
                                            {(this.state.jenisValid) ?
                                                <div className="invalid-feedback"
                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Tarikh</Label>
                                        <Col sm={4}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <div className="input-group-text">
                                                        <FontAwesomeIcon icon={faCalendarAlt}/>
                                                    </div>
                                                </InputGroupAddon>
                                                <DatePicker className="form-control" dateFormat="dd/MM/yyyy"
                                                            selected={this.state.datestart}
                                                            onChange={date => this.setState({datestart: date})}
                                                />
                                            </InputGroup>
                                            {(this.state.datestartValid) ?
                                                <div className="invalid-feedback"
                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
                                        </Col><Col sm={4}>
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <div className="input-group-text">
                                                    <FontAwesomeIcon icon={faCalendarAlt}/>
                                                </div>
                                            </InputGroupAddon>
                                            <DatePicker className="form-control" dateFormat="dd/MM/yyyy"
                                                        selected={this.state.dateend}
                                                        onChange={date => this.setState({dateend: date})}
                                            />
                                        </InputGroup>
                                        {(this.state.dateendValid) ?
                                            <div className="invalid-feedback"
                                                 style={{display: 'block'}}>Dikehendaki.</div> : null}
                                    </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm={2}>Cawangan</Label>
                                        <Col sm={8}>
                                            <AvInput type="select" name="cawangan" required
                                                     onChange={(dataEl) => {
                                                         this.setState({cawangan: dataEl.target.value});
                                                     }}
                                            >
                                                <option key={''} value={''} disabled>Sila pilih</option>
                                                {this.state.branchData.map(option => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.code} - {option.kawasan}
                                                    </option>
                                                ))}

                                            </AvInput>
                                            {(this.state.cawanganValid) ?
                                                <div className="invalid-feedback"
                                                     style={{display: 'block'}}>Dikehendaki.</div> : null}
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
                                fileName={'Senarai Maklumat Inventori'}
                                scale={0.5}
                                paperSize="A4"
                                margin="1cm"
                                ref={(component) => this.pdfExportComponent = component}
                            >
                                <Table style={{textAlign: 'center'}} id={'tableCarian'}>
                                    <thead>
                                    <tr>
                                        <td><b>No.</b></td>
                                        <td><b>Jenis Alat Dan Kapasiti</b></td>
                                        <td><b>Pembaik</b></td>
                                        <td><b>Pemilik</b></td>
                                        <td><b>No Daftar</b></td>
                                        <td><b>Alamat Tentusah</b></td>
                                        <td><b>Tarikh</b></td>
                                        <td><b>Nombor Stiker</b></td>
                                        <td><b>Nombor Sijil/ Borang D</b></td>
                                        <td><b>Pegawai</b></td>
                                        {this.state.hideTindakan ? null : <td><b>Tindakan</b></td>}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.data.map((item, index) =>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.jenis_alatanlite} - {item.had}{item.jenishad}</td>
                                            <td>{item['alatan.repairer.name']}</td>
                                            <td>{item['owner.name']}</td>
                                            <td>{item.nombordaftar}</td>
                                            <td>{item['alatan.tempat']}</td>
                                            <td>{item.tarikh}</td>
                                            <td>{item.jenisstikerbaru} {item.stikerbaru}</td>
                                            <td>{item.nomborsijil}</td>
                                            <td>{item.pegawai_name}</td>
                                            {this.state.hideTindakan ? null : <td>
                                                <Button
                                                    className="border-0 btn-transition"
                                                    outline onClick={() => {
                                                    this.setState({selected: item});
                                                    this.toggleModal();
                                                }}
                                                    color="info"><FontAwesomeIcon icon={faEye}/>
                                                </Button>
                                            </td>
                                            }
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
                                    <td style={{textAlign: 'left'}}>{(this.state.selected['alatan.jenisresit'] == 'Auto') ? `MSB/${this.state.selected['code_kawasan']}/${this.state.selected['alatan.resit']}` : `${this.state.selected['alatan.resit']}`}</td>
                                </tr>
                                <tr>
                                    <td style={{textAlign: 'left'}}>Ditentusah Oleh</td>
                                    <td style={{textAlign: 'left'}}>{this.state.selected['pegawai_name']}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </PDFExport>
                        {/*<Row>*/}
                        {/*    <Col md={6}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <Label>Nama Syarikat </Label>*/}

                        {/*            <Input readOnly={!userOwnerAccess()[0].update} value={this.state.name} type="text"*/}
                        {/*                   name='name'*/}
                        {/*                   onChange={this.handleChange}*/}
                        {/*                   placeholder="Taip disini" invalid={this.state.nameValid}/>*/}
                        {/*            <FormFeedback>Dikehendaki.</FormFeedback>*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*    <Col md={6}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <Label>No. R.O.C/R.O.B</Label>*/}
                        {/*            <Input readOnly={!userOwnerAccess()[0].update}*/}
                        {/*                   value={this.state.noRocRob == null ? '' : this.state.noRocRob} type="text"*/}
                        {/*                   name='noRocRob'*/}
                        {/*                   onChange={this.handleChange}*/}
                        {/*                   placeholder="Taip disini" invalid={this.state.noRocRobValid}/>*/}
                        {/*            <FormFeedback>Dikehendaki.</FormFeedback>*/}
                        {/*            {(this.state.noRocRobExist) ?*/}
                        {/*                <div className="invalid-feedback"*/}
                        {/*                     style={{display: 'block'}}>No. R.O.C/R.O.B telah wujud</div> : null}*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*    <Col md={6}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <Label>*/}
                        {/*                Agensi</Label>*/}
                        {/*            <DropdownList*/}
                        {/*                readOnly={!userOwnerAccess()[0].update}*/}
                        {/*                data={['Kerajaan', 'Bukan Kerajaan']}*/}
                        {/*                allowCreate="onFilter"*/}
                        {/*                placeholder="Sila pilih"*/}
                        {/*                value={this.state.agencySelected}*/}
                        {/*                onChange={(el) => {*/}
                        {/*                    this.setState({agencySelected: el, agencySelectedValid: false});*/}
                        {/*                }}*/}
                        {/*                name="agencySelected"*/}
                        {/*                invalid={this.state.agencySelectedValid}*/}
                        {/*                required={true}*/}

                        {/*            />*/}
                        {/*            {(this.state.agencySelectedValid) ?*/}
                        {/*                <div className="invalid-feedback"*/}
                        {/*                     style={{display: 'block'}}>Dikehendaki.</div> : null}*/}
                        {/*        </FormGroup>*/}

                        {/*    </Col>*/}
                        {/*    <Col md={6}>*/}


                        {/*        <FormGroup>*/}
                        {/*            <Label>No. Tel.</Label>*/}

                        {/*            <InputGroup>*/}
                        {/*                <InputGroupAddon addonType="prepend">+60</InputGroupAddon>*/}
                        {/*                <Input*/}
                        {/*                    readOnly={!userOwnerAccess()[0].update}*/}
                        {/*                    type="tel" name="telNo"*/}
                        {/*                    placeholder="Tulis di sini"*/}
                        {/*                    onKeyPress={this.onKeyNo.bind(this)}*/}
                        {/*                    onChange={this.handleChange}*/}
                        {/*                    value={this.state.telNo}/>*/}

                        {/*            </InputGroup>*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<Row>*/}
                        {/*    <Col md={6}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <Label>Code</Label>*/}
                        {/*            <Input readOnly={true} type="text"*/}
                        {/*                   name='code'*/}
                        {/*                   value={this.state.code}*/}
                        {/*            />*/}
                        {/*            <FormFeedback>Dikehendaki.</FormFeedback>*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*<CardHeader id="headingOne"*/}
                        {/*            style={{height: '2.5rem', marginBottom: '10px', padding: 'unset'}}>*/}

                        {/*    <h5 style={{margin: 'unset'}}>Alamat</h5>*/}
                        {/*</CardHeader>*/}
                        {/*<Row>*/}
                        {/*    <Col md={12}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <TextareaAutosize className="form-control"*/}
                        {/*                              invalid={this.state.addressValid}*/}
                        {/*                              minRows={3}*/}
                        {/*                              maxRows={3}*/}
                        {/*                              name="address"*/}
                        {/*                              value={this.state.address}*/}
                        {/*                              onChange={this.handleChange}/>*/}
                        {/*            {(this.state.addressValid) ?*/}
                        {/*                <div className="invalid-feedback"*/}
                        {/*                     style={{display: 'block'}}>Dikehendaki.</div> : null}*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}

                        {/*</Row>*/}
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
