import React  from 'react';
import {
    FormGroup, Label, Button,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Row, Col, Input,
} from 'reactstrap';
import API from "../../../../utils/apiRepairer";


const initialValid = {
    statusValid: false,
    progressValid: false,
};
export default class DialogEditView extends React.Component {

    constructor(props) {
        super(props);
        this.state ={
            process: [],
            processData: []
        };
    }

    async componentDidMount() {
        let result = await API.view(this.props.datas, this.props);
        console.log(result.data1)
        let vv = [];
        vv = result.data1;
        console.log(vv)
        this.setState({
            processData: vv,
            Batch: result.data['batchNo'],
            Mesin: result.data['batchNo'].substring(result.data['batchNo'].length - 5),
            Cawangan: result.data['cawangan'],
            Tahun: result.data['year'],
            Bulan: result.data['month'],
            Tarikh: result.data['date_created'],
            Kakitangan: result.data['created_by'],
            status: result.data['isFinish'],
        }, () =>{
            this.state.processData.map(((value, index) => {
                console.log(value['processName'])
            }))
        })
    }

    close(){
        this.props.onClose();
    }



    render() {

        return (
            <div>
                < Modal size="lg" isOpen={this.props.isOpen}  >
                    <ModalHeader >Paparan Laporan IBD</ModalHeader>
                    <ModalBody>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                    <Label >Batch No.</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Batch} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Mesin No.</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Mesin} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Cawangan</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Cawangan} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Tahun</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Tahun} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Bulan</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Bulan} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Tarikh/Masa Bermula</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Tarikh}  disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Kakitangan Bertugas</Label>
                            </Col>
                            <Col md={9}>
                                <Input type={'text'} value={this.state.Kakitangan} disabled={true} />

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={3}>
                                <Label>Status</Label>
                            </Col>
                            <Col md={9}>
                                { this.state.status === false ?<div className="badge badge-success ml-2">Sedang aktif</div>
                                :<div className="badge badge-primary ml-2">Proses Siap</div>

                                }

                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={12}>
                                <h4>Proses Terperinci</h4>
                            </Col>
                        </Row>
                        <Row form style={{paddingBottom:'10px'}}>
                            <Col md={12}>
                                {this.state.processData.map((value, index) =>
                                    <div>
                                        <Label>{index+1}.<div className="badge badge-primary ml-2">{value['processName']}</div></Label><br/>
                                        {value['processName'] === "Record Temperature" ?
                                            <div>
                                                <div className="badge badge-secondary ml-2">Suhu : {value['suhu']}</div><br/>
                                                <div className="badge badge-secondary ml-2">Wab Basah (%) Depan : {value['depan']}</div><br/>
                                                <div className="badge badge-secondary ml-2">Wab Basah (%) Tengah : {value['tengah']}</div><br/>
                                                <div className="badge badge-secondary ml-2">Wab Basah (%) Belakang : {value['belakang']}</div>
                                            </div> : null}
                                        <Label style={{paddingLeft:"10px"}}>Tarikh/Masa : {value['date_captured']}</Label><br/>
                                        <Label style={{paddingLeft:"10px"}}>Kakitangan Bertugas : {value['created_by']}</Label>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button id="butClose" color="secondary"  onClick={this.props.onClose.bind(this, false)}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div >
        );
    }
}
