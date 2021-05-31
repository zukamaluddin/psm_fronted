import React, {Fragment} from 'react';
import {
    CardHeader,
    Col,
    Container,
    FormFeedback,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row
} from 'reactstrap';
import {DropdownList} from "react-widgets";
import API from "../../../../../utils/apiRepairer";
import TextareaAutosize from 'react-textarea-autosize';

const initialState = {
    name: '',
    noRocRob: '',
    streetAddressNo: '',
    placeArea: '',
    stateSelected: '',
    districtSelected: '',
    agencySelected: '',
    telNo: '',
    lesenNo: '',
    codeid:'',
    statusBayaran: 'Tunai',
    noRocRobExist: false,

}
const initialValid = {
    nameValid: false,
    noRocRobValid: false,
    addressValid: false,
    agencySelectedValid: false,
};
export default class WizardStep1 extends React.Component {
    constructor(props, ref) {
        super(props);

        this.state = initialState
        // this.cropImage = this.cropImage.bind(this);
        // this.dataURItoBlob = this.dataURItoBlob.bind(this);
    }

    handleChange = event => {
        if (event.target.name === 'noRocRob') {
            this.onValidRocAPI(event)
        }
        this.setState({
            [event.target.name]: event.target.value,
            [`${event.target.name}Valid`]: false,

        })


    };

    onValidRocAPI = async (event) => {

        await API.checkROC(event.target.value, this.props).then((status) => {
            this.setState({noRocRobExist: status})

        });
    }

    validate = () => {
        // console.log(this.state.stateSelected)
        this.setState(initialValid);

        let checkValid = true
        if (!this.state.name) {
            checkValid = this.toggle('name')
            // console.log(this.toggle('name'))
        }

        // if (!this.state.noRocRob) {
        //     checkValid = this.toggle('noRocRob')
        //     // return this.toggle('noRocRob');
        //
        // }

        if (!this.state.address) {
            checkValid = this.toggle('address');
        }

        if (!this.state.agencySelected) {
            checkValid = this.toggle('agencySelected');
        }
        return checkValid;
    };

    toggle = name => {
        this.setState({
            [`${name}Valid`]: true
        });
        return false;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // onKeyPress(event) {
    //
    //     const keyCode = event.keyCode || event.which;
    //     const keyValue = String.fromCharCode(keyCode);
    //     if (keyValue === " ")
    //         event.preventDefault();
    //     else if (isNaN(keyValue))
    //         event.preventDefault();
    //     else if (/\.+|-/.test(keyValue))
    //         event.preventDefault();
    // }

    onSubmit = () => new Promise((resolve, reject) => {
        if (this.validate()) {
            this.setState(initialValid, () => {
                this.props.viewData.registerOwner = this.state
                resolve(true)
            });
        } else {
            resolve(false)
        }
    });

    onKeyNo = (event) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (keyValue !== 'A') {
            if (keyValue === " ")
                event.preventDefault();
            else if (isNaN(keyValue))
                event.preventDefault();
            else if (/\.+|-/.test(keyValue))
                event.preventDefault();
        }

    }

    render() {
        const {src} = this.state;
        return (

            <Fragment>
                <Container>

                    <div className="form-wizard-content">
                        <CardHeader id="headingOne"
                                    style={{height: '2.5rem', marginBottom: '10px', padding: 'unset'}}>
                            <h5 style={{margin: 'unset'}}>Maklumat Pembaik</h5>
                        </CardHeader>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Nama Syarikat </Label>

                                    <Input value={this.state.name} type="text"
                                           name='name'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.nameValid}/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>No. R.O.C/R.O.B</Label>
                                    <Input value={this.state.noRocRob} type="text"
                                           name='noRocRob'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.noRocRobValid}/>
                                    <FormFeedback>Dikehendaki.</FormFeedback>
                                    {(this.state.noRocRobExist) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>No. R.O.C/R.O.B telah wujud</div> : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>
                                        Agensi</Label>
                                    <DropdownList
                                        data={['Kerajaan', 'Bukan Kerajaan']}
                                        allowCreate="onFilter"
                                        placeholder="Sila pilih"
                                        value={this.state.agencySelected}
                                        onChange={(el) => {
                                            this.setState({agencySelected: el, agencySelectedValid: false});
                                        }}
                                        name="agencySelected"
                                        invalid={this.state.agencySelectedValid}
                                        required={true}

                                    />
                                    {(this.state.agencySelectedValid) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>Dikehendaki.</div> : null}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>No. Tel.</Label>

                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">+60</InputGroupAddon>
                                        <Input
                                            type="text" name="telNo"
                                            placeholder="Tulis di sini"
                                            onKeyPress={this.onKeyNo}
                                            onChange={this.handleChange}
                                            value={this.state.telNo}/>

                                    </InputGroup>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Lesen No.</Label>
                                    <Input value={this.state.lesenNo} type="text"
                                           name='lesenNo'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini"/>
                                </FormGroup>
                            </Col>
                            {
                                global.position === 'HQ' ?
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Status Bayaran</Label>
                                            <select className="form-control"
                                                    value={this.state.statusBayaran}
                                                    onChange={event => {
                                                        this.setState({
                                                            statusBayaran: event.target.value,
                                                            statusBayaranValid: false
                                                        })
                                                    }}>
                                                <option key={''} value={''} disabled>Sila
                                                    pilih
                                                </option>
                                                <option>Tunai</option>
                                                <option>Kredit 7 Hari</option>
                                                <option>Kredit 14 Hari</option>
                                                <option>Kredit 21 Hari</option>
                                                <option>Kredit 30 Hari</option>
                                            </select>
                                        </FormGroup>
                                    </Col>:''
                            }
                            {
                                global.position === 'HQ' ?
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label>Code Id</Label>
                                            <Input value={this.state.codeid} type="text"
                                           name='codeid'
                                           onChange={this.handleChange}
                                           placeholder="Taip disini" invalid={this.state.codeidValid}/>
                                        </FormGroup>
                                    </Col>:''
                            }

                        </Row>

                        <CardHeader id="headingOne"
                                    style={{height: '2.5rem', marginBottom: '10px', padding: 'unset'}}>
                            <h5 style={{margin: 'unset'}}>Alamat</h5>
                        </CardHeader>
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <TextareaAutosize className="form-control"
                                                      invalid={this.state.addressValid}
                                                      minRows={3}
                                                      maxRows={3}
                                                      name="address"
                                                      onChange={this.handleChange}/>
                                    {(this.state.addressValid) ?
                                        <div className="invalid-feedback"
                                             style={{display: 'block'}}>Dikehendaki.</div> : null}
                                </FormGroup>
                            </Col>
                        </Row>

                    </div>

                </Container>

            </Fragment>
        );
    }
}
