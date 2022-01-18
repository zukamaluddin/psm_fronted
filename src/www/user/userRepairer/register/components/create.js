import React, {Fragment} from "react";
import {
    Col, CardHeader, CardFooter,
    Card,
    CardBody,
    Input,
    CardTitle,
    FormGroup,
    Label,
    Form,
    Button, ModalHeader, ModalBody, Row, FormFeedback, ModalFooter, Modal, Container
} from "reactstrap";

import ReactTable from "react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {faTrashAlt} from "@fortawesome/fontawesome-free-solid";
import {Bounce, toast} from "react-toastify";
import {DropdownList} from "react-widgets";
import { settingMenu} from "../../../../../Layout/AppNav/VerticalNavWrapper"; //loading effect

import _ from 'lodash';
import LaddaButton, {EXPAND_LEFT} from "react-ladda";
import DatePicker from "react-datepicker";
import API from "../../../../../utils/apiRepairer";
import APISetting from "../../../../../utils/apiSystemSetting";
import moment from "moment";

class CreateComp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validForm: {},branchCodeApi: null,
            dateStart: '',
            dateEnd: '',
            listUser: [],
            listPentadbiran: [],
            listGred: [],
            listLantikan: [],
            listGenerik: [],
        };

        this.submit = this.submit.bind(this);
        this.validateBranchApi = _.debounce(this.validateBranchApi, 1000);

    }
    validateBranchApi = async (code) => {

        // if (code) {
        //     this.setState({branchCodeApi:await API.checkBranch(code)});
        // }else{
        //     this.state.validForm.branchCodeApi = false
        // }
    };
    handleKeyDown = evt => {
        if (evt.which === 13) {
            this.submit()
        }
    };

    filterName(user, value) {
        let lastname = `${user.name.toLowerCase()} ${user.staffId}`
        let search = `${value.toLowerCase()}`;
        return lastname.indexOf(search) >= 0
    }
    filterPentadbiran(user, value) {
        let lastname = `${user.name.toLowerCase()} ${user.elaun}`
        let search = `${value.toLowerCase()}`;
        return lastname.indexOf(search) >= 0
    }
    filterGred(user, value) {
        let lastname = `${user.name.toLowerCase()} ${user.gred}`
        let search = `${value.toLowerCase()}`;
        return lastname.indexOf(search) >= 0
    }
    filterLantikan(user, value) {
        let lastname = `${user.name.toLowerCase()}`
        let search = `${value.toLowerCase()}`;
        return lastname.indexOf(search) >= 0
    }
    filterGenerik(user, value) {
        let lastname = `${user.name.toLowerCase()} ${user.kod}`
        let search = `${value.toLowerCase()}`;
        return lastname.indexOf(search) >= 0
    }

    getUser = async() => {
        let result = await API.getUser();
        // console.log(result)
        this.setState({listUser:result.data})
    }

    getPentadbiran = async() => {
        let result = await APISetting.listPentadbiran();
        console.log(result)
        result.data.map((i, idx) => {
            i.name = i.name+' (RM '+i.elaun+')'
        })
        this.setState({listPentadbiran:result.data})
    }
    getGred = async() => {
        let result = await APISetting.listGred();
        result.data.map((i, idx) => {
            i.name = i.name+' ('+i.gred+')'
        })
        this.setState({listGred:result.data})
    }
    getLantikan = async() => {
        let result = await APISetting.listLantikan();
        result.data.map((i, idx) => {
            i.name = i.name
        })
        this.setState({listLantikan:result.data})
    }
    getGenerik = async() => {
        let result = await APISetting.listGenerik();
        result.data.map((i, idx) => {
            i.name = i.name+' ('+i.kod+')'
        })
        this.setState({listGenerik:result.data})
    }

    componentDidMount() {
        this.getUser()
        this.getPentadbiran()
        this.getGred()
        this.getLantikan()
        this.getGenerik()
    }

    submit() {
        let copy = this.state.validForm;
        this.setState({validForm: copy}, function () {
            let data = {
                staffName: this.state.selectedUser.name,
                staffId: this.state.selectedUser.staffId,
                dateAssigned: moment(this.state.dateAssigned).format('D/M/YYYY'),
                dateStart: moment(this.state.dateStart).format('D/M/YYYY'),
                dateEnd: moment(this.state.dateEnd).format('D/M/YYYY'),
                jawatanPentadbiran: this.state.selectedPentadbiranId,
                jawatanGred: this.state.selectedGredId,
                jawatanLantikan: this.state.selectedLantikanId,
                jawatanGenerik: this.state.selectedGenerikId,
                description: this.state.description,
                referenceNo: this.state.referenceNo,
                dateLetterLantikan: moment(this.state.dateLetterLantikan).format('D/M/YYYY'),
            };
            const formData = new FormData();
            formData.append('data', JSON.stringify(data));

            return new Promise((resolve, reject) => {
                fetch(global.ipServer + 'lantikan/add_Lantikan', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'x-access-token': global.token
                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    setTimeout(
                        function () {
                            if (data['status'] === 'OK') {
                                toast.success("Data berjaya disimpan");
                                this.props.history.push(`/repairer/list`);
                                settingMenu.changeActiveLinkTo('#/repairer/list')
                                resolve('Ok');
                            } else {
                                toast.error("Ralat");
                                resolve('Failed');
                            }
                        }
                            .bind(this),
                        1000
                    );
                })
                .catch((error) => {
                    toast.error("Ralat");
                    resolve('Failed');
                });
            });
        });
    }

    render() {
        // alert(global.role)
        return (
            <Card className="main-card mb-3">
                <CardBody>
                    <Container>
                        <div className="form-wizard-content">
                            <Row onKeyDown={this.handleKeyDown}>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Nama Staf</Label>
                                        <DropdownList
                                            filter={this.filterName}
                                            // disabled={global.account_type !== 'ARM' && this.state.myprofile.personnel_no !== global.personnel_no}
                                            placeholder="Please choose.."
                                            data={this.state.listUser}
                                            onChange={e => {
                                                this.setState({selectedUserId: e.staffId, selectedUser: e})
                                            }}
                                            valueField="id"
                                            textField="name"
                                            // value={this.state.listUser}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>ID Staf</Label>
                                        <Input type="text"
                                               name={'staffId'}
                                               value={this.state.selectedUserId}
                                               readOnly
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Lantikan</Label>
                                        <DatePicker className="form-control"
                                                    selected={this.state.dateAssigned}
                                                    onChange={(e) => {
                                                        this.setState({dateAssigned: e})
                                                    }}
                                                    dateFormat="d/M/yyyy"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Mula</Label>
                                        <DatePicker className="form-control"
                                                    selected={this.state.dateStart}
                                                    onChange={(e) => {
                                                        this.setState({dateStart: e})
                                                    }}
                                                    dateFormat="d/M/yyyy"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Akhir</Label>
                                        <DatePicker className="form-control"
                                                    selected={this.state.dateEnd}
                                                    onChange={(e) => {
                                                        this.setState({dateEnd: e})
                                                    }}
                                                    dateFormat="d/M/yyyy"/>
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Jawatan Pentadbiran</Label>
                                        <DropdownList
                                            filter={this.filterPentadbiran}
                                            placeholder="Please choose.."
                                            data={this.state.listPentadbiran}
                                            onChange={e => {
                                                this.setState({selectedPentadbiranId: e.name})
                                                // this.setState({selectedPentadbiranId: e.name+'('+e.elaun+')'})
                                            }}
                                            valueField="id"
                                            textField="name"
                                            // value={this.state.listUser}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Jawatan Gred</Label>
                                        <DropdownList
                                            filter={this.filterGred}
                                            placeholder="Please choose.."
                                            data={this.state.listGred}
                                            onChange={e => {
                                                this.setState({selectedGredId: e.name})
                                                // this.setState({selectedGredId: e.name+'('+e.gred+')'})
                                            }}
                                            valueField="id"
                                            textField="name"
                                            // value={this.state.listUser}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Jawatan Lantikan</Label>
                                        <DropdownList
                                            filter={this.filterLantikan}
                                            placeholder="Please choose.."
                                            data={this.state.listLantikan}
                                            onChange={e => {
                                                this.setState({selectedLantikanId: e.name})
                                            }}
                                            valueField="id"
                                            textField="name"
                                            // value={this.state.listUser}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Jawatan Generik</Label>
                                        <DropdownList
                                            filter={this.filterGenerik}
                                            placeholder="Please choose.."
                                            data={this.state.listGenerik}
                                            onChange={e => {
                                                this.setState({selectedGenerikId: e.name})
                                                // this.setState({selectedGenerikId: e.name+'('+e.kod+')'})
                                            }}
                                            valueField="id"
                                            textField="name"
                                            // value={this.state.listUser}
                                            disabled={false}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={12}>
                                    <FormGroup>
                                        <Label>Catatan</Label>
                                        <Input type="textarea"
                                               name={'description'}
                                               onChange={(dataEl) => {
                                                   this.setState({description: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Nombor Rujukan Surat Lantikan</Label>
                                        <Input type="text"
                                               name={'referenceNo'}
                                               onChange={(dataEl) => {
                                                   this.setState({referenceNo: dataEl.target.value});
                                               }}
                                               placeholder="Taip di sini"/>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label>Tarikh Surat Lantikan</Label>
                                        <DatePicker className="form-control"
                                                    selected={this.state.dateLetterLantikan}
                                                    onChange={(e) => {
                                                        this.setState({dateLetterLantikan: e})
                                                    }}
                                                    dateFormat="d/M/yyyy"/>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </CardBody>
                <CardFooter>
                    <Col style={{width:'100%'}}>
                        <LaddaButton
                            className="mb-2 mr-2 btn btn-icon btn-shadow btn-outline-2x float-right btn-outline-primary"
                            // loading={this.state.expLeft}
                            onClick={this.submit}
                            data-style={EXPAND_LEFT}
                            style={{width: '140px'}}>
                            <i className="pe-7s-diskette btn-icon-wrapper"> </i>Simpan
                        </LaddaButton>
                    </Col>
                </CardFooter>
            </Card>
        );
    }
}

export default CreateComp;
