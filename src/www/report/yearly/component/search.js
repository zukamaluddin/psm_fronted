import React from 'react';

import {
    Button, Form,
    FormGroup, Label,
    Input, InputGroup, InputGroupAddon,
    Card, CardBody,
    CardTitle, Col,
} from 'reactstrap';
import {AvForm, AvRadioGroup, AvRadio, AvGroup, AvInput, AvFeedback} from 'availity-reactstrap-validation';

import {
    faCalendarAlt,

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-advanced';
import {Loader as LoaderAnim} from 'react-loaders'

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import ResultList from "./list";
import ApiReport from "../../../../utils/apiReport";

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearPicker: new Date(),
            search: null, branchData: [],
            branch: null,
            lokasi: 'all',
            loader: false
        };
    }

    componentDidMount = async () => {
        let branch = await ApiReport.getCawangan();
        if (branch.status !== "Failed") {
            this.setState({branchData: branch})
        }
    };

    onSearch = (event, errors, values) => {
        if (errors.length < 1) {
            this.setState({loader: true, search: null});
            fetch(global.ipServer + `report/find_yearly_report?` +
                `tarikh=${encodeURIComponent(this.state.yearPicker.toLocaleDateString())}` +
                `&cawangan=${encodeURIComponent(this.state.branch.id)}` +
                `&lokasi=${encodeURIComponent(this.state.lokasi)}`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            })
                .then((response) => response.json())
                .then((result) => {
                    this.setState({
                        loader: false,
                        search: <ResultList searchResult={result} searchQuery={{
                            'branch': this.state.branch,
                            'lokasi': this.state.lokasi === 'all' ? 'Keseluruhan' : this.state.lokasi === 'dalam' ? 'Dalam' : this.state.lokasi === 'luar' ? 'Luar' : 'Stamping Station|Point',
                            'tarikh': this.state.yearPicker.toLocaleDateString()
                        }}/>
                    })
                });
        }
    };

    render() {
        const defaultValues = {
            lokasi: this.state.lokasi,
        };
        const spinner = <LoaderAnim color="#ffffff" type="ball-pulse"/>;
        const contentBoxStyle = {
            height: '200px',
            backgroundColor: 'white',
            position: 'relative',
            padding: 20,
            border: '1px solid lightgrey',
            borderRadius: '5px'
        };
        return (
            <div>
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle>Laporan Tahunan</CardTitle>
                        <AvForm onSubmit={this.onSearch} model={defaultValues} className={'mt-4'}>
                            <FormGroup row>
                                <Label md={1} style={{textAlign: 'center'}}>Tahun </Label>
                                <Col md={2}>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <div className="input-group-text">
                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                            </div>
                                        </InputGroupAddon>
                                        <DatePicker className="form-control"
                                                    showYearPicker
                                                    dateFormat="yyyy"
                                                    selected={this.state.yearPicker}
                                                    onChange={date => this.setState({yearPicker: date})}
                                        />
                                    </InputGroup>
                                </Col>
                                <Label for="cawangan" md={1} style={{textAlign:'center'}}>Cawangan </Label>
                                <Col md={2}>
                                    <AvGroup>
                                        <AvInput type="select" name="cawangan" required
                                                 onChange={(dataEl) => {
                                                     this.setState({branch: JSON.parse(dataEl.target.value)});
                                                 }}
                                        >
                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {localStorage.getItem('position')==='HQ'&&<option key={'all'} value={JSON.stringify({"id":"all","code":"all","kawasan":"all"})}>SEMUA</option>}

                                            {this.state.branchData.map(option => (
                                                <option key={option.id} value={JSON.stringify(option)}>
                                                    {option.code} - {option.kawasan}
                                                </option>
                                            ))}

                                        </AvInput>
                                        <AvFeedback>Required!</AvFeedback>
                                    </AvGroup>
                                </Col>
                                <Label for="tarikh" md={1} style={{textAlign:'center'}}>Lokasi </Label>
                                <Col md={5}>
                                    <AvRadioGroup inline name="lokasi" required style={{marginTop: '7px'}}>
                                        <AvRadio customInput label="Keseluruhan" value="all" checked={true}
                                                 onChange={(dataEl) => {
                                                     this.setState({lokasi: dataEl.target.value});
                                                 }}/>
                                        <AvRadio customInput label="Dalam" value="dalam"
                                                 onChange={(dataEl) => {
                                                     this.setState({lokasi: dataEl.target.value});
                                                 }}/>
                                        <AvRadio customInput label="Luar" value="luar" onChange={(dataEl) => {
                                            this.setState({lokasi: dataEl.target.value});
                                        }}/>
                                        <AvRadio customInput label="Stamping Station|Point" value="stampingStation"
                                                 onChange={(dataEl) => {
                                                     this.setState({lokasi: dataEl.target.value});
                                                 }}/>
                                    </AvRadioGroup>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Button style={{width: 140}}
                                        className='mr-1 btn-icon btn-shadow btn-outline float-right' outline
                                        color="primary">
                                    <i className="lnr-plus-circle btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Carian
                                </Button>
                            </FormGroup>
                        </AvForm>
                    </CardBody>
                </Card>
                <Loader
                    message={spinner}
                    show={this.state.loader} priority={5}>
                    {this.state.loader ? <div style={contentBoxStyle}/> : this.state.search}
                </Loader>
            </div>
        );
    }
}
