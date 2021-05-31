import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Button, Label,
    FormGroup, InputGroup, InputGroupAddon,
    Card, CardBody,
    CardTitle, Col, Input
} from 'reactstrap';
import {AvForm, AvRadioGroup, AvRadio, AvFeedback, AvGroup, AvInput} from 'availity-reactstrap-validation';

import {
    faCalendarAlt,

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-advanced';
import {Loader as LoaderAnim} from 'react-loaders'
import DatePicker from 'react-datepicker';
import DailyResult from "./list";
import ApiReport from "../../../../utils/apiReport";

export default class SearchForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            harianPicker: new Date(),
            search: null,
            branchData: [],
            branch: null,
            lokasi: 'all', loader: false

        };
    }

    componentDidMount = async () => {
        let branch = await ApiReport.getCawangan();
        if (branch.status !== "Failed") {
            this.setState({branchData: branch})
        }
        if (this.props.search !== null) {
            this.setState({
                harianPicker: new Date(this.props.search.tarikh),
                branch: this.props.search.branch,
                lokasi: this.props.search.lokasi,
            })
        }
        if (this.props.list !== null) {
            this.setState({
                search: <DailyResult searchResult={this.props.list} searchQuery={{
                    'branch': this.props.search.branch,
                    'lokasi': this.props.search.lokasi === 'all' ? 'Keseluruhan' : this.props.search.lokasi === 'dalam' ? 'Dalam' : this.props.search.lokasi === 'luar' ? 'Luar' : 'Stamping Station|Point',
                    'tarikh': this.props.search.tarikh
                }}/>
            })
        }
    };


    onSearch = (event, errors, values) => {

        if (errors.length < 1) {
            this.setState({loader: true, search: null});
            fetch(global.ipServer + `report/find_daily_report?` +
                `tarikh=${encodeURIComponent(this.state.harianPicker.toLocaleDateString())}` +
                `&cawangan=${encodeURIComponent(this.state.branch.id)}` +
                `&lokasi=${encodeURIComponent(this.state.lokasi)}`, {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            }).then((response) => response.json()).then((result) => {
                this.setState({
                    loader: false,
                    search: <DailyResult searchResult={result} searchQuery={{
                        'branch': this.state.branch,
                        'lokasi': this.state.lokasi === 'all' ? 'Keseluruhan' : this.state.lokasi === 'dalam' ? 'Dalam' : this.state.lokasi === 'luar' ? 'Luar' : 'Stamping Station|Point',
                        'tarikh': this.state.harianPicker.toLocaleDateString()
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
                        <CardTitle>Laporan Harian</CardTitle>
                        <AvForm onSubmit={this.onSearch} model={defaultValues} className={'mt-4'}>
                            <FormGroup row>
                                <Label for="tarikh" md={1} style={{textAlign: 'center'}}>Tarikh </Label>
                                <Col md={2}>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <div className="input-group-text">
                                                <FontAwesomeIcon icon={faCalendarAlt}/>
                                            </div>
                                        </InputGroupAddon>
                                        <DatePicker className="form-control" dateFormat="dd/MM/yyyy"
                                                    selected={this.state.harianPicker}
                                                    onChange={date => this.setState({harianPicker: date})}
                                        />
                                    </InputGroup>
                                </Col>
                                <Label for="cawangan" md={1} style={{textAlign: 'center'}}>Cawangan </Label>
                                <Col md={2}>
                                    <AvGroup>
                                        <AvInput type="select" name="cawangan" required
                                                 value={this.state.branch?JSON.stringify(this.state.branch):''}
                                                 onChange={(dataEl) => {
                                                     this.setState({branch: JSON.parse(dataEl.target.value)});
                                                 }}
                                        >
                                            <option key={''} value={''} disabled>Sila pilih</option>
                                            {this.state.branchData.map(option => (
                                                <option key={option.id} value={JSON.stringify(option)}>
                                                    {option.code} - {option.kawasan}
                                                </option>
                                            ))}

                                        </AvInput>
                                        <AvFeedback>Required!</AvFeedback>
                                    </AvGroup>
                                </Col>
                                <Label for="tarikh" md={1} style={{textAlign: 'center'}}>Lokasi</Label>
                                <Col md={5}>
                                    <AvRadioGroup inline name="lokasi" required style={{marginTop: '7px'}}
                                                  value={this.state.lokasi}>
                                        <AvRadio label="Keseluruhan" value="all"
                                                 onChange={(dataEl) => {
                                                     this.setState({lokasi: dataEl.target.value});
                                                 }}/>
                                        <AvRadio label="Dalam" value="dalam"
                                                 onChange={(dataEl) => {
                                                     this.setState({lokasi: dataEl.target.value});
                                                 }}/>
                                        <AvRadio label="Luar" value="luar" onChange={(dataEl) => {
                                            this.setState({lokasi: dataEl.target.value});
                                        }}/>
                                        <AvRadio label="Stamping Station|Point" value="stampingStation"
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
