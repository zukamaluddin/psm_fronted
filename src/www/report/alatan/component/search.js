import React, {Fragment} from 'react';

import {
    Button, Form,
    FormGroup, Label,
    Input, InputGroup, InputGroupAddon,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';
import {AvForm, AvRadioGroup, AvRadio, AvGroup, AvInput, AvFeedback} from 'availity-reactstrap-validation';

import {
    faCalendarAlt,

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import AlatanList from "./list";
import ApiReport from "../../../../utils/apiReport";
import Col from "reactstrap/es/Col";
import Row from "reactstrap/es/Row";
import {Loader as LoaderAnim} from "react-loaders";
import Loader from "react-loader-advanced";
import DailyResult from "../../daily/component/list";

export const bulan = [{'All': 'Semua'}, {1: 'Januari'}, {2: 'Februari'}, {3: 'Mac'}, {4: 'April'}, {5: 'Mei'}, {6: 'Jun'}, {7: 'Julai'}, {8: 'Ogos'}, {9: 'September'}, {10: 'October'}, {11: 'November'}, {12: 'Disember'}];

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearPicker: new Date(),
            month: 'All',
            jenisAlatan: [],
            kategoriAlatan: [],
            lainAlatan: [],
            search: null, branchData: [],
            branch: null,
            lokasi: 'all', loader: false,
            kategori: 'all', lain: 'all'

        };
    }

    componentDidMount = async () => {
        let jenis = await ApiReport.getAllJenis()
        if (jenis.status !== "Failed") {
            this.setState({jenisAlatan: jenis, jenis: jenis[0].id})
        }
        let categori = await ApiReport.getKategori()
        if (categori.status !== "Failed") {
            this.setState({kategoriAlatan: categori})
        }
        let lain = await ApiReport.getLain()
        if (lain.status !== "Failed") {
            this.setState({lainAlatan: lain})
        }
        let branch = await ApiReport.getCawangan();
        if (branch.status !== "Failed") {
            this.setState({branchData: branch})
        }

        if (this.props.search !== null) {
            this.setState({
                yearPicker: new Date(this.props.search.tarikh),
                month: this.props.search.month,
                branch: this.props.search.branch,
                lokasi: this.props.search.lokasi,
                jenis: this.props.search.jenisAlat
            })
        }
        if (this.props.list !== null) {
            this.setState({
                search: <AlatanList searchResult={this.props.list} searchQuery={{
                    'cawangan': this.props.search.branch.kawasan,
                    'lokasi': this.props.search.lokasi,
                    'tarikh': this.props.search.tarikh
                }}/>
            })
        }
    };

    onSearch = (event, errors, values) => {

        if (errors.length < 1) {
            this.setState({loader: true, search: null});
            fetch(global.ipServer + `report/find_alatan_report?` +
                `year=${encodeURIComponent(this.state.yearPicker.toLocaleDateString())}` +
                `&month=${encodeURIComponent(this.state.month)}` +
                `&kategori=${encodeURIComponent(this.state.kategori)}` +
                `&lain=${encodeURIComponent(this.state.lain)}` +
                `&cawangan=${encodeURIComponent(this.state.branch.id)}` +
                `&jenis=${encodeURIComponent(this.state.jenis)}` +
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
                        search: <AlatanList searchResult={result} searchQuery={{
                            'cawangan': this.state.branch.kawasan,
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
                        <CardTitle>Senarai Semakan Alat</CardTitle>
                        <AvForm onSubmit={this.onSearch} model={defaultValues} className={'mt-4'}>
                            <FormGroup row>
                                <Label for="jenisAlatan" md={2}>Jenis </Label>
                                <Col md={2}>
                                    <AvInput type="select" name="jenisAlatan"
                                             value={this.state.jenis}
                                             onChange={(dataEl) => {
                                                 this.setState({jenis: JSON.parse(dataEl.target.value)});
                                             }}
                                    >
                                        {this.state.jenisAlatan.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}

                                    </AvInput>
                                </Col>
                                <Label for="kategoriAlatan" md={2} style={{textAlign: 'center'}}>Kategori </Label>
                                <Col md={2}>
                                    <AvInput type="select" name="kategoriAlatan"
                                             onChange={(dataEl) => {
                                                 this.setState({kategori: JSON.parse(dataEl.target.value)});
                                             }}
                                    >
                                        <option key={''} value={''} disabled>Semua</option>
                                        {this.state.kategoriAlatan.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}

                                    </AvInput>
                                </Col>

                                <Label for="lainAlatan" md={2} style={{textAlign: 'center'}}>Lain </Label>
                                <Col md={2}>
                                    <AvInput type="select" name="lainAlatan" md={2}
                                             onChange={(dataEl) => {
                                                 this.setState({lain: JSON.parse(dataEl.target.value)});
                                             }}
                                    >
                                        <option key={''} value={''} disabled>Semua</option>
                                        {this.state.lainAlatan.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}

                                    </AvInput>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label for="cawangan" md={2}>Cawangan</Label>
                                <Col md={2}>
                                    <AvGroup>
                                        <AvInput type="select" name="cawangan" required
                                                 value={this.state.branch ? JSON.stringify(this.state.branch) : ''}
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

                                <Label md={2} style={{textAlign: 'center'}}>Bulan/Tahun</Label>
                                <Col md={2}>
                                    <InputGroup>
                                        <AvInput type="select" name="bulan"
                                                 value={this.state.month}
                                                 onChange={(dataEl) => {
                                                     this.setState({month: dataEl.target.value});
                                                 }}
                                        >
                                            {bulan.map(option => (
                                                <option key={Object.keys(option)[0]} value={Object.keys(option)[0]}>
                                                    {Object.values(option)[0]}
                                                </option>
                                            ))}

                                        </AvInput>
                                        <DatePicker className="form-control"
                                                    showYearPicker
                                                    dateFormat="yyyy"
                                                    selected={this.state.yearPicker}
                                                    onChange={date => this.setState({yearPicker: date})}
                                        />
                                    </InputGroup>
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
