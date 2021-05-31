import React from 'react';

import {
    Button,
    FormGroup, Label,
    InputGroup, InputGroupAddon,
    Card, CardBody,
    CardTitle, Col, CardFooter
} from 'reactstrap';
import {AvForm} from 'availity-reactstrap-validation';
import {DropdownList} from 'react-widgets'
import {
    faCalendarAlt,

} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Loader from 'react-loader-advanced';
import {Loader as LoaderAnim} from 'react-loaders'

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import SerapanList from "./list";
import ApiReport from "../../../../utils/apiReport";
import {bulan} from '../../alatan/component/search'

export default class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yearPicker: new Date(), month: 'All',
            search: null, branchData: [],
            // busy:true,
            branch: 'Semua',
            lokasi: 'all',
            loader: false,
            repairerData: [],
            repairer: 'Semua'
        };
    }

    componentDidMount = async () => {
        let data = await Promise.all([ApiReport.getCawangan(), ApiReport.getPembaik()]);
        if (Array.isArray(data[0]) && Array.isArray(data[1])) {
            data[0].unshift('Semua');
            data[1].unshift('Semua');
            this.setState({
                branchData: data[0],
                repairerData: data[1],
                // busy:false
            })
        }
    };

    onSearch = (event, errors, values) => {
        this.setState({loader: true, search: null});
        fetch(global.ipServer + `report/find_serapan?` +
            `tarikh=${encodeURIComponent(this.state.yearPicker.toLocaleDateString())}` +
            `&month=${encodeURIComponent(this.state.month)}` +
            `&branch=${this.state.branch}`+
            `&repairer=${this.state.repairer}`
            ,
            {
                method: 'GET',
                headers: {
                    'x-access-token': global.token
                },
            })
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    loader: false,
                    search: <SerapanList searchResult={result} searchQuery={{
                        'bulan': this.state.month,
                        'tahun': this.state.yearPicker.getFullYear(),
                        'cawangan': this.state.branch,
                        'pembaik': this.state.repairer,
                    }}/>
                })
            });
    };

    render() {
        const defaultValues = {
            lokasi: this.state.lokasi,
        };
        const spinner = <LoaderAnim color="#ffffff" type="ball-pulse" active/>;
        const contentBoxStyle = {
            height: '200px',
            backgroundColor: 'white',
            position: 'relative',
            padding: 20,
            border: '1px solid lightgrey',
            borderRadius: '5px'
        };
        const bulanArr = bulan.map((dt) => {
            return {id: Object.keys(dt), name: Object.values(dt)}
        });
        return (
            <div>
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle>Laporan Penentusahan Mengikut Pembaik</CardTitle>
                        <AvForm onSubmit={this.onSearch} model={defaultValues} className={'mt-4'}>
                            <FormGroup row>
                                <Label md={1} style={{textAlign: 'center'}}>Bulan</Label>
                                <Col md={2}>
                                    <DropdownList
                                        name="bulan"
                                        style={{width: '100%'}}
                                        data={bulanArr}
                                        valueField={'id'} textField={'name'}
                                        defaultValue={bulanArr[0]}
                                        onChange={(dataEl) => {
                                            this.setState({month: dataEl.id});
                                        }}
                                    />
                                </Col>

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

                                <Label md={1} style={{textAlign: 'center'}}>Cawangan</Label>
                                <Col md={2}>
                                    <DropdownList
                                        name="bulan"
                                        // busy = {this.state.busy}
                                        style={{width: '100%'}}
                                        data={this.state.branchData}
                                        valueField={'id'}
                                        textField={item =>
                                            item ? item === 'Semua' ? item
                                                : item.code + ' - ' + item.kawasan
                                                : ''}
                                        defaultValue={'Semua'}
                                        onChange={(dataEl) => {
                                            this.setState({branch: dataEl === 'Semua' ? dataEl : dataEl.id});
                                        }}
                                    />
                                </Col>

                                <Label md={1} style={{textAlign: 'center'}}>Pembaik</Label>
                                <Col md={2}>
                                    <DropdownList
                                        name="bulan"
                                        style={{width: '100%'}}
                                        filter={'contains'}
                                        data={this.state.repairerData}
                                        valueField={'id'} textField={'name'}
                                        defaultValue={'Semua'}
                                        onChange={(dataEl) => {
                                            this.setState({repairer: dataEl === 'Semua' ? dataEl : dataEl.id});
                                        }}
                                    />
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
