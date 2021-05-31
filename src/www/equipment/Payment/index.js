import React, {Fragment, Component, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { redirectLogout } from "../../../index";
import {faPencilAlt, faSave, faSearch, faTrash, faUpload, faWindowClose} from "@fortawesome/fontawesome-free-solid";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row,
    Col,
    Card,
    CardBody,
    Container, FormGroup,
    Button, Table, Input, Label, ModalHeader, ModalBody, ModalFooter, Modal
} from 'reactstrap';
import moment from 'moment'
import DatePicker from "react-datepicker";
import {Bounce, toast} from "react-toastify";

import PageTitle from "../../../Layout/AppMain/PageTitle";
import './default.css';
import Redirect from "react-router-dom/es/Redirect";
import InvoiceComponent from "../../certificate/layoutInvoice";
// import  { Redirect } from 'react-router-dom'
const otherItemOri = [
    {
        jenisPembayaran: 'Fee Penentuan Alat',
        kuantiti: "",
        kadar: "",
        jumlah: "",
        senaraiBarang: []
    },{
        jenisPembayaran: 'Bayaran 1/2 Fi',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
        senaraiBarang: []
    }, {
        jenisPembayaran: 'Caj Menunggu',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    }, {
        jenisPembayaran: 'Caj Penentuan Di Premis Pemohon',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    }, {
        jenisPembayaran: 'Tuntutan Pegawai',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    }, {
        jenisPembayaran: 'Tuntutan Lori',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    },
    {
        jenisPembayaran: 'Jualan Borang E',
        kuantiti: "",
        kadar: "5.00",
        jumlah: "0.00",
    },
    {
        jenisPembayaran: 'Bayaran Laporan',
        kuantiti: "",
        kadar: "28.50",
        jumlah: "0.00",
    },
    {
        jenisPembayaran: 'Sewaan Standard DMSB',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    },
    {
        jenisPembayaran: 'Lain -Lain',
        kuantiti: "",
        kadar: "",
        jumlah: "0.00",
    }]

export default class Payments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalConfirm:false,
            modalConfirmPadam: false,
            routerClose: false,
            listEquipment: [],
            txtAmount: null,
            txtItem: null,
            lblTotalAmount: 0,
            lblJumlahAmount: 0,
            isVisibleBtnPrint: true,
            loadInvoicePrint: false,
            tarikhPembayaran: '',
            otherItem: otherItemOri,
            pembayaran: '',
            kutipan: '',
            noCek: '',
            namaBank: '',
            jenistempat: '',
            pegawai: '',
            alamatCawangan: '',
            kutipanBayaran: {
                cek: '0.00',
                tunai: '0.00'

            },
            pembayarList : [],
            sstValue: '6 %',
            alamatPembayar: '',
            pembayarName: [],
            jenisresit: "Auto",
            senaraiCek: [],
            kutipanBayaranCek: '',
            cekTick: [],
            jumlahKutipanBayaranCek: '0.00',
            kutipanBayaranTunai: '',
            kutipanBayaranOnline: '',
            noRujukanOnline: '',
            kodeID: '',
            noRujukanTunai: '',
            resitValid: false,
            jenisPembayaran: 'Tunai',
            autoValue: '',
            penggenapan: '',
            tahun:'',
            noRujukan: '',

        };
    }

    componentDidMount() {
        let otherItem = [
            {
                jenisPembayaran: 'Fee Penentuan Alat',
                kuantiti: "",
                kadar: "",
                jumlah: "",
                senaraiBarang: []
            },{
                jenisPembayaran: 'Bayaran 1/2 Fi',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
                senaraiBarang: []
            }, {
                jenisPembayaran: 'Caj Menunggu',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            }, {
                jenisPembayaran: 'Caj Penentuan Di Premis Pemohon',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            }, {
                jenisPembayaran: 'Tuntutan Pegawai',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            }, {
                jenisPembayaran: 'Tuntutan Lori',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            },
            {
                jenisPembayaran: 'Jualan Borang E',
                kuantiti: "",
                kadar: "5.00",
                jumlah: "0.00",
            },
            {
                jenisPembayaran: 'Bayaran Laporan',
                kuantiti: "",
                kadar: "28.50",
                jumlah: "0.00",
            },
            {
                jenisPembayaran: 'Sewaan Standard DMSB',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            },
            {
                jenisPembayaran: 'Lain -Lain',
                kuantiti: "",
                kadar: "",
                jumlah: "0.00",
            }];

        fetch(`${global.ipServer}payment/get_alatan/${this.props.match.params.id}/${global.global_id}`,{
            headers: {'x-access-token' :global.token}
        }).then((response) => {
                if(response.status === 200){
                    return response.json();
                }else{
                    redirectLogout(response.status, this.props);
                    return response.json();
                }
            })
            .then((result) => {
                if(result['status'] === 'OK'){

                    this.setState({
                        tahun:result['data']['tahun']
                    });

                    let vListEnq = [],vListGagal = [],vTotalAmout= 0,vTotalAmoutGagal=0;
                    this.getDefaultResit(result);
                    this.getPemilikRepairer(result);
                    if(result['dataPay'].length > 0){       ///after update
                        let kutipanTunai,kutipanOnline='',indexTunai,indexOnline, pembayarName,noRujOnline, noRujTunai;
                        let kutipan = JSON.parse(result['others']['kutipanBayaran']);

                        if(Array.isArray(kutipan)){                                         //ni support phase 2
                            indexTunai = kutipan.findIndex(el => el.id === 'Tunai');
                            indexOnline = kutipan.findIndex(el => el.id === 'Online');


                            if (indexOnline >= 0){
                                kutipanOnline = (kutipan[indexOnline]['kutipan'] === "") ? "-" : kutipan[indexOnline]['kutipan'];
                                noRujOnline = (kutipan[indexOnline]['noCek'] === "") ? "-" : kutipan[indexOnline]['noCek'];
                                kutipan.splice(indexOnline, 1);
                            }

                            if (indexTunai >= 0) {
                                kutipanTunai = (kutipan[indexTunai]['kutipan'] === "") ? "-" : kutipan[indexTunai]['kutipan'];
                                noRujTunai = (kutipan[indexTunai]['noCek'] === "" || kutipan[indexTunai]['noCek'] === "Tunai") ? "-" : kutipan[indexTunai]['noCek'];
                                kutipan.splice(indexTunai, 1);
                            }

                            pembayarName = JSON.parse(result['others']['invoiceTo'])
                            this.getAlamat(JSON.parse(result['others']['invoiceTo'])['id']);
                        }else{                                                              // phase 1 format

                            kutipanTunai = kutipan['tunai'];
                            if(kutipan['cek'] != '0.00'){
                                kutipan = [{id: parseFloat(this.state.kutipanBayaranCek).toFixed(2), kutipan: kutipan['cek'], noCek: result['others']['noCek'], namaBank: result['others']['nameBank']}]
                            }else{
                                kutipan = [];
                            }

                            let tempPembayarName = result['others']['invoiceTo'];
                            let allPembayar = this.state.pembayarList;
                            let indexPembyr = allPembayar.findIndex(el => el.name === tempPembayarName);
                            pembayarName = {id: allPembayar[indexPembyr]['id'] , name: tempPembayarName};
                            this.getAlamat(allPembayar[indexPembyr]['id']);
                        }

                        this.setState({
                            isVisibleBtnPrint: false,
                            jenisresit:  result['data']['jenisResit'],
                            resit: (result['data']['jenisResit'] === 'Auto') ? `DMSB/${result['data']['codeCawangan']}/${result['data']['tahun']}/${result['data']['resit']}` : `${result['data']['resit']}` ,
                            sstValue:  (result['others']['jenisBayaran'] == '' || result['others']['jenisBayaran'] == 'None') ? '0 %' : result['others']['jenisBayaran'] ,
                            pembayarName: pembayarName,
                            kutipanBayaranTunai: kutipanTunai,
                            kutipanBayaranOnline: kutipanOnline,
                            noRujukanOnline: noRujOnline,
                            noRujukanTunai: noRujTunai,
                            senaraiCek: kutipan,
                            kutipan: "0.00",
                            noCek: "-",
                            kutipanBayaranCek: "-",
                            noRujukan : (result['others']['noRujukan'] === "") ? "-" : result['others']['noRujukan']
                        });

                        vListEnq = result['dataPay'];
                        result['dataPay'].map((item)=> {
                            vTotalAmout += parseFloat(item.jumlah)
                        });

                        this.setState({
                            otherItem:vListEnq,
                            lblJumlahAmount: vTotalAmout.toFixed(2),
                            lblTotalAmount: this.calculateTotalAmout(vTotalAmout, this.state.sstValue),
                        })

                    }
                    else{
                        ///before update
                        console.log(result['data']['resit'])
                        if (result['data']['resit'] == ''){
                            this.setResitAuto('Auto');
                        }
                        else{
                            this.setState({
                                resit_no: result['data']['resit'],
                                resit: 'DMSB/' + this.state.kawasanCode + '/' + this.state.tahun + '/' + result['data']['resit'],
                                autoValue: result.data
                            })
                        }

                        result['data']['detail'].map((item)=> {
                            if(item.tentusan === 'Gagal'){
                                let indexV = vListGagal.findIndex(el => el.item === item.jenis);
                                if(indexV < 0){
                                    vListGagal.push({
                                        no: vListGagal.length + 1,
                                        item: `${item.jenis}`,
                                        kadar: 1 ,
                                        amount: parseFloat(item.caj).toFixed(2),
                                        isDeleted: false
                                    });
                                }else{
                                    vListGagal[indexV]['kadar'] = vListGagal[indexV]['kadar'] + 1
                                }
                                vTotalAmoutGagal += parseFloat(item.caj)
                            }else{
                                let indexV = vListEnq.findIndex(el => el.item === item.jenis);
                                if(indexV < 0){
                                    vListEnq.push({
                                        no: vListEnq.length + 1,
                                        item: `${item.jenis}`,
                                        kadar: 1 ,
                                        amount: parseFloat(item.caj).toFixed(2),
                                        isDeleted: false
                                    });
                                }else{
                                    vListEnq[indexV]['kadar'] = vListEnq[indexV]['kadar'] + 1
                                }

                                vTotalAmout += parseFloat(item.caj)
                            }

                        });

                        otherItem[0]['senaraiBarang'] = vListEnq;
                        otherItem[0]['jumlah'] = vTotalAmout.toFixed(2);

                        otherItem[1]['senaraiBarang'] = vListGagal;
                        otherItem[1]['jumlah'] = vTotalAmoutGagal.toFixed(2);

                        let amountList = (parseFloat(vTotalAmout) + parseFloat(vTotalAmoutGagal)).toFixed(2);



                        this.setState({
                            otherItem:otherItem,
                            lblJumlahAmount: amountList,
                            lblTotalAmount: this.calculateTotalAmout(amountList, this.state.sstValue),
                            kutipan: this.calculateTotalAmout(amountList, this.state.sstValue),
                        })
                    }
                }
            })

    }

    toggleModalConfirm=()=> {
        if(this.state.resit === ''){
            this.setState({resitValid: true});
            return
        }
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    toggleModalConfirmPadam = () => {
        if(this.state.resit === ''){
            this.setState({resitValid: true});
            return
        }
        this.setState({modalConfirmPadam: !this.state.modalConfirmPadam})

    }

    calculateTotalAmout = (vTotalAmout, SST) => {   //vTotalAmout, this.state.sstValue
        let TotalAmount , totalafterSST;
        if(SST == '0 %'){
            TotalAmount = parseFloat(vTotalAmout) + this.adjustment(parseFloat(vTotalAmout).toFixed(2));
            this.setState({penggenapan : this.adjustment(parseFloat(vTotalAmout).toFixed(2))});
        }else{
            let totalafterSST = (parseFloat(vTotalAmout) + parseFloat((vTotalAmout * 6) / 100)).toFixed(2);
            TotalAmount = parseFloat(totalafterSST) + parseFloat(this.adjustment(totalafterSST));
            this.setState({penggenapan : this.adjustment(totalafterSST)});
        }
        return TotalAmount.toFixed(2);
    };

    getAlamat(id) {
        fetch(`${global.ipServer}payment/get_alamat/${id}`,{
            headers: {
                'x-access-token' :global.token
            }
        }).then((res) => {return res.json()})
            .then((response) => {
            if(response['status'] === 'OK'){
                this.setState({
                    alamatPembayar: response['alamat'],
                    codeID: response['codeID']
                });
            }else{
                this.setState({
                    alamatPembayar: 'None',
                    codeID: "-"
                });
            }
        });

    }

    getjenispembayaran(id) {
        fetch(`${global.ipServer}payment/get_jenispembayaran/${id}`,{
            headers: {
                'x-access-token' :global.token
            }
        }).then((res) => {return res.json()})
            .then((response) => {
            if(response['status'] === 'OK'){
                if (response['jenis'] === ''){
                    this.setState({jenisPembayaran:'Tunai'})
                }
                else if (response['jenis'] === 'Tunai'){
                    this.setState({jenisPembayaran:'Tunai'})
                }
                else if (response['jenis'] === 'Kredit 7 Hari'){
                    this.setState({jenisPembayaran:'Kredit 7 Hari'})
                }
                else if (response['jenis'] === 'Kredit 14 Hari'){
                    this.setState({jenisPembayaran:'Kredit 14 Hari'})
                }
                else if (response['jenis'] === 'Kredit 21 Hari'){
                    this.setState({jenisPembayaran:'Kredit 21 Hari'})
                }
                else if (response['jenis'] === 'Kredit 30 Hari'){
                    this.setState({jenisPembayaran:'Kredit 30 Hari'})
                }
            }
        });

    }

    getPemilikRepairer(result) {
        let temp = [];
        if(result['data']['pembaik'] != ''){
            temp.push({name: result['data']['pembaik'], id: result['data']['pembaik_id']});
        }

        result['data']['detail'].map((item)=> {
            let gg = temp.findIndex(el => el===item.pemilik);
            if(gg === -1){
                temp.push({name: item['pemilik'], id: item['pemilik_id']})
            }
        });
        this.getAlamat(temp[0]['id']);
        this.getjenispembayaran(temp[0]['id']);
        this.setState({
            pembayarList: temp,
            pembayarName: temp[0]
        });
    }

    getDefaultResit(result){
        this.setState({
            kawasanCode: result['data']['kawasan_code'],
            tarikhPembayaran: result['data']['date_created'],
            jenistempat: result['data']['jenistempat'],
            pegawai: result['data']['pegawai'],
            alamatCawangan: result['data']['tempat'],
        });
    }

    handelSave = () => {
        this.setState({modalConfirm: false});


        if(parseFloat(this.state.kutipan) === 0) {

            let vv = [];
            if(this.state.senaraiCek.length > 0){
                vv.push(this.state.senaraiCek[0]);
                vv.push({
                    id: 'Tunai',
                    kutipan: this.state.kutipanBayaranTunai,
                    noCek: this.state.noRujukanTunai,
                    namaBank: 'Tunai'
                })
                vv.push({
                    id: 'Online',
                    kutipan: this.state.kutipanBayaranOnline,
                    noCek: this.state.noRujukanOnline,
                    namaBank: 'Online'
                })
            }else{
                vv.push({
                    id: 'Tunai',
                    kutipan: this.state.kutipanBayaranTunai,
                    noCek: this.state.noRujukanTunai,
                    namaBank: 'Tunai'
                })
                vv.push({
                    id: 'Online',
                    kutipan: this.state.kutipanBayaranOnline,
                    noCek: this.state.noRujukanOnline,
                    namaBank: 'Online'
                })
            }
            // console.log(vv);

            const formData = new FormData();
            formData.append("alatandID", this.props.match.params.id);
            formData.append("data", JSON.stringify(this.state.otherItem));

            formData.append("pembayaran",JSON.stringify({codekaw: this.state.kawasanCode, jenisResit: this.state.jenisresit, no_resit: this.state.resit}));
            formData.append("jenisPembayaran",  this.state.sstValue);
            formData.append("kutipan", JSON.stringify(vv));
            formData.append("noCek", 'None');
            formData.append("namaBank", 'None');
            formData.append("invoiceTo", JSON.stringify(this.state.pembayarName));
            formData.append("noRujukan", this.state.noRujukan);

            return fetch(global.ipServer + 'payment/create/' + global.global_id, {
                method: 'POST',
                body: formData,
                headers: {
                    'x-access-token' : global.token
                }
            }).then((response) => {
                    if(response.status === 200){
                        return response.json();
                    }else{
                        redirectLogout(response.status, this.props);
                        return response.json();
                    }
                }).then(response => {
                    if(response['status'] === 'OK'){
                        this.setState({isVisibleBtnPrint: false});
                        this.handleNotification('Rekod berjaya disimpan.','success');

                    }else{
                        this.handleNotification('Rekod tidak berjaya disimpan.','error');
                    }
                })
        }else{
            this.handleNotification('Nilai baki kutipan perlu RM 0.00','error');
        }

    };

    handlePrint = () => {
        if(parseFloat(this.state.kutipan).toFixed(2) <= 0.00){
            this.setState({
                loadInvoicePrint: true
            },()=> {
                let v = this;
                setTimeout(function () {
                    v.setState({
                        loadInvoicePrint: false
                    })
                }, 1000);

            });
        }else{
            this.handleNotification('Baki kutipan perlu kurang daripada RM 0.00','error');
        }

    };

    handleVoid = () => {
        this.toggleModalConfirmPadam(true)
        fetch(`${global.ipServer}payment/void_payment/${this.props.match.params.id}/${global.global_id}`,{
            headers: {'x-access-token' :global.token}
        }).then((response) => {
            if(response.status === 200){
                return response.json();
            }else{
                redirectLogout(response.status, this.props);
                return response.json();
            }
        }).then((res) => {
            if(res.status === "OK"){
                this.handleNotification('Rekod berjaya dihapuskan.','success');
                this.setState({isVisibleBtnPrint: true});
            }else{
                this.handleNotification('Rekod tidak berjaya dihapuskan.','error');
            }

        })
    }

    handleNotification = (data,type) => this.toastId = toast(data, {
        transition: Bounce,
        closeButton: true,
        autoClose: 2500,
        position: 'top-right',
        type: type
    });

    handleChangeKuantiti = (index, el) => {
        let vOtherItem = this.state.otherItem;
        vOtherItem[index]['kuantiti'] = el;
        if(vOtherItem[index]['kadar'] != '' && el != ''){
            vOtherItem[index]['jumlah'] = ((parseFloat(el) * parseFloat(vOtherItem[index]['kadar']))).toFixed(2)
        }
        this.setState({
            otherItem: vOtherItem,

        }, () => {
            let total = 0.0;
            this.state.otherItem.map((item) => {
                total = parseFloat(total) + parseFloat(item.jumlah)
            });

            this.setState({
                lblTotalAmount: this.calculateTotalAmout(total, this.state.sstValue),
                lblJumlahAmount: (total).toFixed(2),
                kutipan: this.calculateTotalAmout(total, this.state.sstValue),
            })
        });
    };

    handleChangeKadar = (index, el) => {
        let vOtherItem = this.state.otherItem;
        vOtherItem[index]['kadar'] = el;
        if(vOtherItem[index]['kuantiti'] != '' && el != '') {
            vOtherItem[index]['jumlah'] = ((parseFloat(el) * parseFloat(vOtherItem[index]['kuantiti']))).toFixed(2)
        }
        this.setState({
            otherItem: vOtherItem,
        }, () => {
            let total = 0.0;
            this.state.otherItem.map((item) => {
                total = parseFloat(total) + parseFloat(item.jumlah)
            });

            this.setState({
                lblTotalAmount: this.calculateTotalAmout(total, this.state.sstValue),
                lblJumlahAmount: (total).toFixed(2),
                kutipan: this.calculateTotalAmout(total, this.state.sstValue),
            })
        });
    };

    onKeyPressKadar(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if(keyValue === "."){

        }else{
            if(keyValue === " ")
                event.preventDefault();
            else if(isNaN(keyValue))
                event.preventDefault();
            else if(/\.+|-/.test(keyValue))
                event.preventDefault();
        }

    }

    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);

        if(keyValue === " ")
            event.preventDefault();
        else if(isNaN(keyValue))
            event.preventDefault();
        else if(/\.+|-/.test(keyValue))
            event.preventDefault();


    }

    adjustment = (number) => {
        if (number.toString().endsWith('1')) {
            return -0.01
        } else if (number.toString().endsWith('2')) {
            return -0.02
        } else if (number.toString().endsWith('3')) {
            return +0.02
        } else if (number.toString().endsWith('4')) {
            return +0.01
        } else if (number.toString().endsWith('6')) {
            return -0.01
        } else if (number.toString().endsWith('7')) {
            return -0.02
        } else if (number.toString().endsWith('8')) {
            return +0.02
        } else if (number.toString().endsWith('9')) {
            return +0.01
        } else {
            return 0
        }
    }

    setResitAuto(xxx) {
        if (xxx === 'Auto') {
            console.log(this.props.match.params.id)
            fetch(global.ipServer + "alatan/get_resitauto_update/" + this.props.match.params.id + '/' + global.global_id, {
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
                    this.setState({
                        resit_no: result.data,
                        resit: 'DMSB/' + this.state.kawasanCode + '/' + this.state.tahun + '/' + result.data,
                        autoValue: result.data
                    })

                });
        } else {
            this.setState({
                resit: '',
                resit_no: ''
            })
        }

    }

    onSST() {
        return this.state.sstValue == '0 %' ? '0.00' : ((this.state.lblJumlahAmount * 6) / 100).toFixed(2)
    }

    render() {
        if (this.state.routerClose) {
            return <Redirect push to={`/equipment/list`} />;
        }

        return (
            <Fragment>
                <Modal size='md' isOpen={this.state.modalConfirm} toggle={this.toggleModalConfirm}
                       className={'modal-danger '}>
                    <ModalHeader toggle={this.toggleModalConfirm}>Amaran</ModalHeader>
                    <ModalBody>
                        Sila Pastikan Semua Butiran Betul Sebelum Membuat Bayaran.
                    </ModalBody>
                    <ModalFooter>

                        <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                onClick={this.handelSave}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"> </i>Ya</Button>

                        <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                outline onClick={() => this.toggleModalConfirm(false)}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i>Tidak</Button>


                    </ModalFooter>
                </Modal>

                <Modal size='md' isOpen={this.state.modalConfirmPadam} toggle={this.toggleModalConfirmPadam}
                       className={'modal-danger '}>
                    <ModalHeader toggle={this.toggleModalConfirmPadam}>Amaran</ModalHeader>
                    <ModalBody>
                        Sila pastikan maklumat untuk di padam.
                    </ModalBody>
                    <ModalFooter>

                        <Button color="success" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x' outline
                                onClick={this.handleVoid}><i
                            className="lnr-checkmark-circle btn-icon-wrapper"> </i>Ya</Button>

                        <Button color="danger" className='mb-2 mr-2 btn-icon btn-shadow btn-outline-2x'
                                outline onClick={() => this.toggleModalConfirmPadam(false)}> <i
                            className="lnr-cross-circle btn-icon-wrapper"> </i>Tidak</Button>


                    </ModalFooter>
                </Modal>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <Container fluid>
                        <PageTitle
                            heading="Pembayaran"
                            icon="lnr-map text-info"
                        />
                        <Row>
                            <Col md="12">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <FormGroup row>
                                            <Label sm={3}>Pembayar <br/>(Syarikat /Pelanggan /Jabatan)</Label>
                                            <Col sm={9}>
                                                <Input type={'select'} value={this.state.pembayarName['id']} disabled={!this.state.isVisibleBtnPrint} onChange={el => {
                                                    let index = el.nativeEvent.target.selectedIndex;
                                                    let label = el.nativeEvent.target[index].text;
                                                    let temp = {name: label, id: el.target.value}
                                                    this.getAlamat(el.target.value);
                                                    this.getjenispembayaran(el.target.value);
                                                    this.setState({pembayarName: temp});
                                                }}>
                                                    {this.state.pembayarList.map((item, index) =>
                                                        <option key={index} value={item['id']} >{item['name']}</option>
                                                    )}
                                                </Input>
                                                {/*<Input type="text" disabled={true} value={this.state.pembayarName}/>*/}
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>Alamat Pembayar</Label>
                                            <Col sm={9}>
                                                <Input type="text" disabled={true} value={this.state.alamatPembayar}/>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm={3}>No. Invoice</Label>
                                            <Col sm={4}>
                                                    <Input type="text" name="name" disabled={true}
                                                        value={this.state.resit}
                                                        onChange={event => {
                                                            this.setState({
                                                                resit: event.target.value,
                                                                resitValid: false
                                                            });
                                                        }} placeholder={'Taip disini'}
                                                        invalid={this.state.resitValid}
                                                    />

                                                {/*</div>*/}
                                                {(this.state.resitValid) ?
                                                    <div className="invalid-feedback"
                                                         style={{display: 'block'}}>Dikehendaki.</div> : null}
                                            </Col>
                                            <Label sm={2}>Nilai SST</Label>
                                            <Col sm={3}>
                                                <Input type="select" value={this.state.sstValue} disabled={!this.state.isVisibleBtnPrint}
                                                       onChange={(el)=> {
                                                           // let finalAmount = el.target.value == '0 %' ? this.state.lblJumlahAmount : (parseFloat(this.state.lblJumlahAmount) + parseFloat((this.state.lblJumlahAmount * 6) / 100)).toFixed(2);
                                                           this.setState({
                                                               sstValue: el.target.value,
                                                           },() => {
                                                               console.log(this.state.lblJumlahAmount, "*******************8888")
                                                               this.setState({

                                                                   kutipan: this.calculateTotalAmout(this.state.lblJumlahAmount, this.state.sstValue),
                                                                   lblTotalAmount: this.calculateTotalAmout(this.state.lblJumlahAmount, this.state.sstValue),
                                                                   penggenapan: '0.00'
                                                               });
                                                           })
                                                       }} >
                                                    <option key={''} value={''} selected disabled >Pilih SST</option>
                                                    <option key={'0 %'}>0 %</option>
                                                    <option key={'6 %'}>6 %</option>
                                                </Input>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                        <Label sm={3}>No. Rujukan</Label>
                                        <Col sm={4}>
                                                <Input type="text" name="name"
                                                       value={this.state.noRujukan}
                                                       disabled={!this.state.isVisibleBtnPrint}
                                                       onChange={event => {
                                                           this.setState({
                                                               noRujukan: event.target.value,
                                                           });
                                                       }} placeholder={'Taip disini'}
                                                />
                                        </Col>
                                        </FormGroup>
                                        <Table hover bordered className={'mb-0'}>
                                            <thead>
                                            <tr>
                                                <th style={{width: '10%'}}>No.</th>
                                                <th style={{width: '35%'}}>Butiran Alatan</th>
                                                <th style={{width: '20%'}}>Kuantiti</th>
                                                <th style={{width: '20%'}}>Kadar (RM)</th>
                                                <th style={{width: '15%'}}>Kutipan</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.otherItem.map((item,index) =>

                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td style={{textAlign: 'left'}}><Label>{item.jenisPembayaran}</Label><br/>
                                                        {('senaraiBarang' in item) &&
                                                            item['senaraiBarang'].map((item, index) =>
                                                                <p> 	&nbsp;	&nbsp;  - {item.item}</p>
                                                            )
                                                        }
                                                    </td>
                                                    {('senaraiBarang' in item) ?
                                                        <td>
                                                            {('senaraiBarang' in item) &&
                                                            item['senaraiBarang'].map((item, index) =>
                                                                <p> 	&nbsp;	&nbsp;  {item.kadar}</p>
                                                            )}

                                                        </td> :
                                                        <td>
                                                            <div style={{display:'grid',placeItems:'center'}}>
                                                                {/*<Input type="number" min={'1'} onKeyPress={this.onKeyPress.bind(this)} name="txtAmount" value={item.kuantiti}  style={{width:'200px'}}*/}
                                                                {/*       onChange={el =>{*/}
                                                                {/*           this.handleChangeKuantiti(index, el.target.value)*/}
                                                                {/*       }} placeholder={'Taip disini'}/>*/}


                                                               { item.jenisPembayaran === "Caj Menunggu" || item.jenisPembayaran === "Caj Penentuan Di Premis Pemohon" || item.jenisPembayaran === "Tuntutan Pegawai" || item.jenisPembayaran === "Tuntutan Lori"?

                                                                   <Input type="number" min={'1'} onKeyPress={this.onKeyPressKadar.bind(this)} name="txtAmount" value={item.kuantiti}  style={{width:'200px'}}
                                                                       onChange={el =>{
                                                                           this.handleChangeKuantiti(index, el.target.value)
                                                                       }} placeholder={'Taip disini'}/>

                                                                       :
                                                                   <Input type="number" min={'1'} onKeyPress={this.onKeyPress.bind(this)} name="txtAmount" value={item.kuantiti}  style={{width:'200px'}}
                                                                      onChange={el =>{
                                                                          this.handleChangeKuantiti(index, el.target.value)
                                                                      }} placeholder={'Taip disini'}/>
                                                               }
                                                            </div>

                                                        </td>

                                                    }
                                                    {('senaraiBarang' in item) ?
                                                        <td>-</td> :
                                                        <td>
                                                            <div style={{display:'grid',placeItems:'center'}}>
                                                                <Input type="number" min={'1'} onKeyPress={this.onKeyPressKadar.bind(this)} name="txtAmount" value={item.kadar} style={{width:'200px'}}
                                                                   onChange={el => {
                                                                       this.handleChangeKadar(index, el.target.value)
                                                                   }} placeholder={'Taip disini'}/>
                                                            </div>
                                                        </td>

                                                    }
                                                    <td>{item.jumlah}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan={4} className={"countCss"}>
                                                    <strong>Jumlah (RM)</strong>&nbsp;&nbsp;&nbsp;
                                                </td>
                                                <td >
                                                    <strong>{this.state.lblJumlahAmount}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className={"countCss"}>
                                                    <strong>SST @ { this.state.sstValue}</strong>&nbsp;&nbsp;&nbsp;
                                                </td>
                                                <td >
                                                    <strong>{this.onSST()}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className={"countCss"}>
                                                    <strong>Penggenapan</strong>&nbsp;&nbsp;&nbsp;
                                                </td>
                                                <td>
                                                    <strong>{this.state.penggenapan}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={4} className={"countCss"}>
                                                    <h5><strong>Jumlah Bayaran</strong>&nbsp;&nbsp;&nbsp;</h5>
                                                </td>
                                                <td >
                                                    <h5><strong>{this.state.lblTotalAmount}</strong></h5>
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </Table>
                                        <br/>

                                        <Table hover bordered className={'mb-0'}>
                                            <thead>
                                            <tr>
                                                <th colSpan={3}>PERIHAL : (Sila masukan butiran wang ataupun cek)</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td ><Label><strong>Online</strong></Label></td>
                                                <td><Label><strong>Cek</strong></Label></td>
                                                <td><Label ><strong>Tunai</strong></Label></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Label>Kadar Bayaran (RM)</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                        <Input type={'tel'} style={{width:'80%'}}
                                                               placeholder={"Kadar Bayaran di terima"}
                                                               disabled={!this.state.isVisibleBtnPrint}
                                                               onKeyPress={this.onKeyPressKadar.bind(this)}
                                                               value={this.state.kutipanBayaranOnline}
                                                               onChange={(el)=> {
                                                                   let tempkutipanBayaranTunai = this.state.kutipanBayaranTunai;
                                                                   if (tempkutipanBayaranTunai == ""){
                                                                       tempkutipanBayaranTunai = 0;
                                                                   }
                                                                   let baki;
                                                                   if(el.target.value != '') {
                                                                       baki = parseFloat(this.state.lblTotalAmount) - (parseFloat(el.target.value) + parseFloat(tempkutipanBayaranTunai) + parseFloat(this.state.jumlahKutipanBayaranCek));
                                                                   }else{
                                                                       baki = parseFloat(this.state.lblTotalAmount) - (parseFloat(0) + parseFloat(tempkutipanBayaranTunai) + parseFloat(this.state.jumlahKutipanBayaranCek));
                                                                   }
                                                                   this.setState({
                                                                       kutipan: baki.toFixed(2),
                                                                       kutipanBayaranOnline: el.target.value
                                                                   });
                                                               }}
                                                        ></Input>
                                                    </div>
                                                </td>
                                                <td>

                                                    <Label>Kutipan (RM)</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                    <Input type="tel" placeholder="Kutipan yang di terima"  style={{width:'60%'}}  value={this.state.kutipanBayaranCek} disabled={!this.state.isVisibleBtnPrint}
                                                           onKeyPress={this.onKeyPressKadar.bind(this)}
                                                           onChange={(el)=> {
                                                               this.setState({
                                                                   kutipanBayaranCek: el.target.value
                                                               });
                                                           }}
                                                    />
                                                    </div>
                                                </td>
                                                <td>
                                                    <Label>Kutipan (RM)</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                    <Input type="tel" placeholder="Kutipan yang di terima"   style={{width:'80%'}} value={this.state.kutipanBayaranTunai} disabled={!this.state.isVisibleBtnPrint}
                                                           onKeyPress={this.onKeyPressKadar.bind(this)}
                                                           onChange={(el)=> {
                                                               let tempkutipanBayaranOnline = this.state.kutipanBayaranOnline;
                                                               if (tempkutipanBayaranOnline == ""){
                                                                   tempkutipanBayaranOnline = 0;
                                                               }
                                                               let baki;
                                                               if(el.target.value != '') {
                                                                   baki = parseFloat(this.state.lblTotalAmount) - (parseFloat(el.target.value) + parseFloat(this.state.jumlahKutipanBayaranCek) + parseFloat(tempkutipanBayaranOnline));
                                                               }else{
                                                                   baki = parseFloat(this.state.lblTotalAmount) - (parseFloat(0) + parseFloat(this.state.jumlahKutipanBayaranCek) + parseFloat(tempkutipanBayaranOnline));
                                                               }
                                                               this.setState({
                                                                   kutipan: baki.toFixed(2),
                                                                   kutipanBayaranTunai: el.target.value
                                                               });
                                                           }}
                                                    />
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <Label>No. Rujukan</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                        <Input type={'tel'} style={{width:'80%'}}
                                                               placeholder={"No Rujukan jika ada"}
                                                               disabled={!this.state.isVisibleBtnPrint}
                                                               value={this.state.noRujukanOnline}
                                                               onChange={(el)=> {
                                                                   this.setState({noRujukanOnline: el.target.value});
                                                               }}
                                                        ></Input>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Label>No. Cek</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                    <Input type="text"  style={{width:'60%'}} placeholder="Masukan No Cek jika ada"   value={this.state.noCek} disabled={!this.state.isVisibleBtnPrint}
                                                           onChange={(el)=> {
                                                               this.setState({noCek: el.target.value});
                                                           }}
                                                    />
                                                    </div>
                                                </td>
                                                <td>
                                                    <Label>No. Rujukan</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                        <Input type={'tel'} style={{width:'80%'}}
                                                               placeholder={"No Rujukan jika ada"}
                                                               disabled={!this.state.isVisibleBtnPrint}
                                                               value={this.state.noRujukanTunai}
                                                               onChange={(el)=> {
                                                                   this.setState({noRujukanTunai: el.target.value});
                                                               }}
                                                        ></Input>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <Label >Kode ID</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                        <Input type={'tel'} style={{width:'80%'}}
                                                               placeholder={"Kode ID jika ada"}
                                                               disabled={true}
                                                               value={this.state.codeID}

                                                        ></Input>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Label >Nama Bank</Label>
                                                    <div style={{display:'grid',placeItems:'center'}}>
                                                            <Input type="select" value={this.state.namaBank} style={{width:'60%'}} disabled={!this.state.isVisibleBtnPrint}
                                                                   onChange={(el)=> {
                                                                       this.setState({
                                                                           namaBank: el.target.value
                                                                       })
                                                                   }} >
                                                                <option key={''} value={''} selected disabled >Pilih Nama bank</option>
                                                                {(this.state.jenisPembayaran == 'Kredit 7 Hari') &&
                                                                    <option key={'PENGHUTANG (Kredit 7 Hari)'}>Kredit 7 Hari</option>
                                                                }
                                                                {(this.state.jenisPembayaran == 'Kredit 14 Hari') &&
                                                                    <option key={'PENGHUTANG (Kredit 14 Hari)'}>Kredit 14 Hari</option>
                                                                }
                                                                {(this.state.jenisPembayaran == 'Kredit 21 Hari') &&
                                                                    <option key={'PENGHUTANG (Kredit 21 Hari)'}>Kredit 21 Hari</option>
                                                                }
                                                                {(this.state.jenisPembayaran == 'Kredit 30 Hari') &&
                                                                    <option key={'PENGHUTANG (Kredit 30 Hari)'}>Kredit 30 Hari</option>
                                                                }
                                                                <option key={'mbsb'}>mbsb</option>
                                                                <option key={'Bank of China'}>Bank of China</option>
                                                                <option key={'UOB'}>UOB</option>
                                                                <option key={'Bank Islam'}>Bank Islam</option>
                                                                <option key={'Hong Leong Bank'}>Hong Leong Bank</option>
                                                                <option key={'BSN'}>BSN</option>
                                                                <option key={'Agro Bank'}>Agro Bank</option>
                                                                <option key={'Bank Rakyat'}>Bank Rakyat</option>
                                                                <option key={'Alliance Bank'}>Alliance Bank</option>
                                                                <option key={'Bank Muamalat'}>Bank Muamalat</option>
                                                                <option key={'Kuwait Finance'}>Kuwait Finance</option>
                                                                <option key={'Public Bank'}>Public Bank</option>
                                                                <option key={'AFFIN BANK BERHAD'}>AFFIN BANK BERHAD</option>
                                                                <option key={'ALLIANCE BANK MALAYSIA BERHAD'}>ALLIANCE BANK MALAYSIA BERHAD</option>
                                                                <option key={'AMBANK (M) BERHAD'}>AMBANK (M) BERHAD</option>
                                                                <option key={'BNP PARIBAS MALAYSIA BERHAD'}>BNP PARIBAS MALAYSIA BERHAD</option>
                                                                <option key={'BANGKOK BANK BERHAD'}>BANGKOK BANK BERHAD</option>
                                                                <option key={'CIMB BANK BERHAD'}>CIMB BANK BERHAD</option>
                                                                <option key={'CITIBANK BERHAD'}>CITIBANK BERHAD</option>
                                                                <option key={'Malayan Banking Berhad'}>Malayan Banking Berhad</option>
                                                                <option key={'OCBC Bank (Malaysia) Berhad'}>OCBC Bank (Malaysia) Berhad</option>
                                                                <option key={'RHB Bank Berhad'}>RHB Bank Berhad</option>
                                                                <option key={'Standard Chartered Bank Malaysia Berhad'}>Standard Chartered Bank Malaysia Berhad</option>
                                                                <option key={'HSBC Amanah Malaysia Berhad'}>HSBC Amanah Malaysia Berhad</option>
                                                                <option key={'Deutsche Bank'}>Deutsche Bank</option>
                                                                <option key={'Al Rajhi Bank'}>Al Rajhi Bank</option>
                                                            </Input>
                                                    </div>
                                                </td>
                                                <td>
                                                  None
                                                </td>
                                            </tr>
                                            {(this.state.isVisibleBtnPrint) &&
                                            <tr>
                                                <td>None</td>
                                                <td >
                                                    <Label><strong>Aksi</strong></Label>
                                                    <div style={{display:'block',placeItems:'center'}}>
                                                    <Button style={{width: 140}}
                                                            className='mr-1 btn-icon btn-shadow btn-outline' outline
                                                            color="primary" onClick={() => {
                                                        if (this.state.kutipanBayaranCek != '' && this.state.noCek != '' && this.state.namaBank != '') {
                                                            let tempSenarai = this.state.senaraiCek;
                                                            let temp = {
                                                                "id": Math.random().toString(16).substr(2, 8),
                                                                "kutipan": parseFloat(this.state.kutipanBayaranCek).toFixed(2),
                                                                "noCek": this.state.noCek,
                                                                "namaBank": this.state.namaBank
                                                            };
                                                            tempSenarai.push(temp);

                                                            let jumlahKutipan = 0;
                                                            tempSenarai.map((item) => {
                                                                jumlahKutipan = parseFloat(jumlahKutipan) + parseFloat(item.kutipan)
                                                            });
                                                            let tempKutipanBayaranTunai;
                                                            if (this.state.kutipanBayaranTunai == '') {
                                                                tempKutipanBayaranTunai = '0';
                                                            } else {
                                                                tempKutipanBayaranTunai = this.state.kutipanBayaranTunai;
                                                            }

                                                            let tempKutipanBayaranOnline;
                                                            if (this.state.kutipanBayaranOnline == '') {
                                                                tempKutipanBayaranOnline = '0';
                                                            } else {
                                                                tempKutipanBayaranOnline = this.state.kutipanBayaranOnline;
                                                            }

                                                            let kutipanTemp = parseFloat(this.state.lblTotalAmount) - (parseFloat(tempKutipanBayaranTunai) + parseFloat(jumlahKutipan) + parseFloat(tempKutipanBayaranOnline));

                                                            this.setState({
                                                                senaraiCek: tempSenarai,
                                                                kutipanBayaranCek: '',
                                                                noCek: '',
                                                                namaBank: '',
                                                                jumlahKutipanBayaranCek: jumlahKutipan.toFixed(2),
                                                                kutipan: kutipanTemp.toFixed(2)
                                                            })
                                                        }

                                                    }}>
                                                        <i className="lnr-plus-circle btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Tambah
                                                    </Button>

                                                    <Button style={{width: 140}}
                                                            className='mr-1 btn-icon btn-shadow btn-outline' outline
                                                            color="danger" onClick={() => {
                                                        let tempSenarai = this.state.senaraiCek;
                                                        if (tempSenarai.length > 0) {
                                                            this.state.cekTick.map((item, index) => {
                                                                let indexTemp = tempSenarai.findIndex((el) => el.id === item);
                                                                tempSenarai.splice(indexTemp, 1);
                                                            });

                                                            let tempKutipanBayaranOnline;
                                                            if (this.state.kutipanBayaranOnline == '') {
                                                                tempKutipanBayaranOnline = '0';
                                                            } else {
                                                                tempKutipanBayaranOnline = this.state.kutipanBayaranOnline;
                                                            }

                                                            let jumlahKutipan = 0;
                                                            tempSenarai.map((item) => {
                                                                jumlahKutipan = parseFloat(jumlahKutipan) + parseFloat(item.kutipan)
                                                            });

                                                            this.setState({
                                                                senaraiCek: tempSenarai,
                                                                kutipanBayaranCek: '',
                                                                noCek: '',
                                                                namaBank: '',
                                                                jumlahKutipanBayaranCek: jumlahKutipan.toFixed(2),
                                                                kutipan: (parseFloat(this.state.lblTotalAmount) - (parseFloat(jumlahKutipan) + parseFloat(this.state.kutipanBayaranTunai) + parseFloat(tempKutipanBayaranOnline))).toFixed(2),
                                                            })
                                                        }
                                                    }}>
                                                        <i className="lnr-cross-circle btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Buang
                                                    </Button>
                                                    </div>
                                                </td>
                                                <td> None</td>
                                            </tr>
                                            }
                                            <tr>
                                                <td>None</td>
                                                <td style={{textAlign: 'center'}}>
                                                    <Label><strong>Senarai Cek</strong></Label>
                                                   <table style={{width: '100%'}}>
                                                       <tr>
                                                           <td></td>
                                                           <td>No Cek</td>
                                                           <td>Bank Name</td>
                                                           <td>Jumlah</td>
                                                       </tr>
                                                       {this.state.senaraiCek.map((item, index) =>
                                                           <tr>
                                                           <td><Input style={{margin: '-5px'}} type={'checkbox'} value={item.id} onChange={(el) => {
                                                               let tempCekTick = this.state.cekTick;
                                                               if(el.target.checked){
                                                                   tempCekTick.push(el.target.value)
                                                               }else{
                                                                   let index = tempCekTick.findIndex((vv) => vv == el.target.value);
                                                                   tempCekTick.splice(index,1);
                                                               }
                                                               this.setState({
                                                                   cekTick: tempCekTick
                                                               }, () => {
                                                                   console.log(this.state.cekTick);
                                                               })
                                                           }}/></td>
                                                           <td>{item.noCek}</td>
                                                           <td>{item.namaBank}</td>
                                                           <td>{item.kutipan}</td>
                                                           </tr>

                                                       )}

                                                       <tr>
                                                           <td colSpan={3}><strong>Jumlah</strong></td>
                                                           <td><strong>{this.state.jumlahKutipanBayaranCek}</strong></td>
                                                       </tr>
                                                   </table>

                                                </td>
                                                <td> None</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}><h5><strong>Baki kutipan (RM)</strong></h5></td>
                                                <td><h5><strong>{this.state.kutipan}</strong></h5> </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                        <Row style={{paddingTop:20}}>
                                            <Col md="12">
                                                <Button style={{width:140}} className='mr-1 btn-icon btn-shadow btn-outline float-right' outline
                                                        color="danger" onClick={()=>this.setState({routerClose: true})}>
                                                    <i className="lnr-cross-circle btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Tutup
                                                </Button>
                                                {(!this.state.isVisibleBtnPrint) ?
                                                    <div>
                                                        <Button style={{width: 140}}
                                                                className='mr-1 btn-icon btn-shadow btn-outline float-right'
                                                                outline
                                                                color="success" onClick={this.handlePrint}>
                                                            <i className="pe-7s-print btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Cetak
                                                        </Button>
                                                        <Button style={{width: 140}}
                                                                className='mr-1 btn-icon btn-shadow btn-outline float-right'
                                                                outline
                                                                color="warning" onClick={this.toggleModalConfirmPadam}>
                                                            Hapus Pembayaran
                                                        </Button>
                                                    </div>

                                                    :
                                                    <Button style={{width: 140}}
                                                            className='mr-1 btn-icon btn-shadow btn-outline float-right'
                                                            outline
                                                            color="info" onClick={this.toggleModalConfirm}>
                                                        <i className="pe-7s-diskette btn-icon-wrapper"> </i>&nbsp;&nbsp;&nbsp;Kemaskini
                                                    </Button>

                                                }


                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        {this.state.loadInvoicePrint &&
                            <InvoiceComponent
                                alatanID={this.props.match.params.id}
                                listItem={this.state.otherItem}
                                pembayaranName={this.state.pembayarName}
                                bayaranCek={this.state.senaraiCek}
                                jumlahBayaranTunai={this.state.kutipanBayaranTunai}
                                kutipan={'0.00'}
                                resit={this.state.resit}
                                tarikhPembayaran={this.state.tarikhPembayaran}
                                alamatPembayar={this.state.alamatPembayar}
                                jumlahBayaran={this.state.lblTotalAmount}
                                jumlahSblmSST={this.state.lblJumlahAmount}
                                nilaiSST={this.state.sstValue}
                                jenistempat={this.state.jenistempat}
                                pegawai={this.state.pegawai}
                                alamatCawangan={this.state.alamatCawangan}
                                noRujukanTunai={this.state.noRujukanTunai}
                                noRujukanOnline={this.state.noRujukanOnline}
                                jumlahBayaranOnline={this.state.kutipanBayaranOnline}
                                kodeID={this.state.kodeID}
                            ></InvoiceComponent>
                        }

                    </Container>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
